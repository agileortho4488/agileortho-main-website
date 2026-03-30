"""
Iteration 62: Interakt Contact Sync Feature Tests
Tests for:
- POST /api/admin/whatsapp/fetch-interakt-contacts - fetches contacts from Interakt
- POST /api/admin/whatsapp/sync-interakt-to-crm - syncs contacts to CRM as leads
- GET /api/admin/stats - verifies total leads count after sync
- GET /api/admin/leads - verifies leads with source=interakt_sync
"""

import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


class TestInteraktContactSync:
    """Tests for Interakt Contact Sync feature"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token for authenticated requests"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get admin token
        login_resp = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "AgileHealth2026admin"}
        )
        assert login_resp.status_code == 200, f"Admin login failed: {login_resp.text}"
        token = login_resp.json().get("token")
        self.session.headers.update({"Authorization": f"Bearer {token}"})

    def test_01_admin_login(self):
        """Test admin login works"""
        resp = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "AgileHealth2026admin"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "token" in data
        assert data.get("role") == "super_admin"
        print("✓ Admin login successful")

    def test_02_fetch_interakt_contacts(self):
        """Test fetching contacts from Interakt API"""
        resp = self.session.post(f"{BASE_URL}/api/admin/whatsapp/fetch-interakt-contacts")
        assert resp.status_code == 200, f"Fetch contacts failed: {resp.text}"
        
        data = resp.json()
        assert "contacts" in data, "Response should contain 'contacts' key"
        assert "total" in data, "Response should contain 'total' key"
        
        contacts = data["contacts"]
        total = data["total"]
        
        # Per context, should have 1000+ contacts
        print(f"✓ Fetched {total} contacts from Interakt")
        assert total > 0, "Should have at least some contacts"
        
        # Verify contact structure
        if contacts:
            sample = contacts[0]
            assert "phone" in sample, "Contact should have phone"
            print(f"  Sample contact: phone={sample.get('phone')}, name={sample.get('name')}")

    def test_03_sync_interakt_to_crm(self):
        """Test syncing Interakt contacts to CRM as leads"""
        resp = self.session.post(f"{BASE_URL}/api/admin/whatsapp/sync-interakt-to-crm")
        assert resp.status_code == 200, f"Sync to CRM failed: {resp.text}"
        
        data = resp.json()
        assert "total_fetched" in data, "Response should contain 'total_fetched'"
        assert "created" in data, "Response should contain 'created'"
        assert "updated" in data, "Response should contain 'updated'"
        assert "skipped" in data, "Response should contain 'skipped'"
        
        print(f"✓ Sync results: fetched={data['total_fetched']}, created={data['created']}, updated={data['updated']}, skipped={data['skipped']}")
        
        # Since sync already ran once, expect mostly updates
        total_processed = data["created"] + data["updated"] + data["skipped"]
        assert total_processed > 0, "Should have processed some contacts"

    def test_04_dashboard_stats_total_leads(self):
        """Test dashboard stats reflect total leads after sync"""
        resp = self.session.get(f"{BASE_URL}/api/admin/stats")
        assert resp.status_code == 200, f"Stats failed: {resp.text}"
        
        data = resp.json()
        total_leads = data.get("total_leads", 0)
        
        # Per context, should be around 1274 total leads after sync
        print(f"✓ Dashboard shows {total_leads} total leads")
        assert total_leads > 100, f"Expected many leads after sync, got {total_leads}"

    def test_05_leads_with_interakt_sync_source(self):
        """Test leads page shows contacts with source=interakt_sync"""
        resp = self.session.get(f"{BASE_URL}/api/admin/leads?limit=100")
        assert resp.status_code == 200, f"Leads fetch failed: {resp.text}"
        
        data = resp.json()
        leads = data.get("leads", [])
        
        # Count leads with interakt_sync source
        interakt_leads = [l for l in leads if l.get("source") == "interakt_sync"]
        print(f"✓ Found {len(interakt_leads)} leads with source=interakt_sync in first 100 results")
        
        # Verify at least some interakt_sync leads exist
        assert len(interakt_leads) > 0, "Should have leads with source=interakt_sync"
        
        # Verify lead structure
        if interakt_leads:
            sample = interakt_leads[0]
            assert sample.get("source") == "interakt_sync"
            assert "phone_whatsapp" in sample or "name" in sample
            print(f"  Sample lead: name={sample.get('name')}, phone={sample.get('phone_whatsapp')}")

    def test_06_whatsapp_analytics(self):
        """Test WhatsApp analytics endpoint still works"""
        resp = self.session.get(f"{BASE_URL}/api/admin/whatsapp/analytics")
        assert resp.status_code == 200, f"Analytics failed: {resp.text}"
        
        data = resp.json()
        assert "conversations" in data
        assert "delivery" in data
        print(f"✓ WhatsApp analytics: {data['conversations']['total']} conversations")

    def test_07_whatsapp_conversations(self):
        """Test WhatsApp conversations endpoint"""
        resp = self.session.get(f"{BASE_URL}/api/admin/whatsapp/conversations")
        assert resp.status_code == 200, f"Conversations failed: {resp.text}"
        
        data = resp.json()
        assert "conversations" in data
        print(f"✓ WhatsApp conversations: {data['total']} total")


class TestPushLeadsToInterakt:
    """Tests for pushing CRM leads to Interakt"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token for authenticated requests"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        login_resp = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "AgileHealth2026admin"}
        )
        assert login_resp.status_code == 200
        token = login_resp.json().get("token")
        self.session.headers.update({"Authorization": f"Bearer {token}"})

    def test_01_sync_all_leads_to_interakt(self):
        """Test bulk sync of CRM leads to Interakt"""
        resp = self.session.post(f"{BASE_URL}/api/admin/whatsapp/sync-all-leads")
        assert resp.status_code == 200, f"Sync all leads failed: {resp.text}"
        
        data = resp.json()
        assert "synced" in data, "Response should contain 'synced'"
        assert "failed" in data, "Response should contain 'failed'"
        assert "total" in data, "Response should contain 'total'"
        
        print(f"✓ Push to Interakt: synced={data['synced']}, failed={data['failed']}, total={data['total']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
