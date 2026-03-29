"""
Iteration 55: Testing new B2B features
- Territory tab in Admin Analytics (zone-analytics, territory-penetration, visitor-insights)
- Automation stats endpoint (followups, leads)
- Email endpoints (send-brochure, lead-confirmation)
- Meta Pixel + tracking integration
"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_PASSWORD = "kOpcELYcEvkVtyDAE5-2uw"


@pytest.fixture(scope="module")
def admin_token():
    """Get admin auth token"""
    resp = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    if resp.status_code == 200:
        return resp.json().get("token")
    pytest.skip("Admin login failed - skipping authenticated tests")


@pytest.fixture
def auth_headers(admin_token):
    """Headers with admin token"""
    return {"Authorization": f"Bearer {admin_token}"}


class TestGeoZoneAnalytics:
    """Test GET /api/geo/zone-analytics endpoint"""

    def test_zone_analytics_returns_200(self):
        """Zone analytics endpoint should return 200"""
        resp = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

    def test_zone_analytics_has_zone_analytics_object(self):
        """Response should contain zone_analytics object"""
        resp = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        data = resp.json()
        assert "zone_analytics" in data, "Missing zone_analytics key"
        assert isinstance(data["zone_analytics"], dict), "zone_analytics should be a dict"

    def test_zone_analytics_zone_structure(self):
        """Each zone should have required fields"""
        resp = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        data = resp.json()
        zone_analytics = data.get("zone_analytics", {})
        
        # Check if any zones exist
        if zone_analytics:
            for zone_id, zone_data in zone_analytics.items():
                assert "zone_name" in zone_data, f"Zone {zone_id} missing zone_name"
                assert "total_leads" in zone_data, f"Zone {zone_id} missing total_leads"
                assert "hot_leads" in zone_data, f"Zone {zone_id} missing hot_leads"
                assert "warm_leads" in zone_data, f"Zone {zone_id} missing warm_leads"
                assert "cold_leads" in zone_data, f"Zone {zone_id} missing cold_leads"
                assert "avg_score" in zone_data, f"Zone {zone_id} missing avg_score"


class TestTerritoryPenetration:
    """Test GET /api/geo/territory-penetration endpoint"""

    def test_territory_penetration_returns_200(self):
        """Territory penetration endpoint should return 200"""
        resp = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

    def test_territory_penetration_has_district_breakdown(self):
        """Response should contain district_breakdown array"""
        resp = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        data = resp.json()
        assert "district_breakdown" in data, "Missing district_breakdown key"
        assert isinstance(data["district_breakdown"], list), "district_breakdown should be a list"

    def test_territory_penetration_has_zero_lead_districts(self):
        """Response should contain zero_lead_districts array"""
        resp = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        data = resp.json()
        assert "zero_lead_districts" in data, "Missing zero_lead_districts key"
        assert isinstance(data["zero_lead_districts"], list), "zero_lead_districts should be a list"

    def test_territory_penetration_has_division_gaps(self):
        """Response should contain division_gaps array (cross-sell opportunities)"""
        resp = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        data = resp.json()
        assert "division_gaps" in data, "Missing division_gaps key"
        assert isinstance(data["division_gaps"], list), "division_gaps should be a list"

    def test_district_breakdown_structure(self):
        """Each district should have required fields"""
        resp = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        data = resp.json()
        districts = data.get("district_breakdown", [])
        
        if districts:
            for d in districts[:5]:  # Check first 5
                assert "district" in d, "District missing 'district' field"
                assert "total_leads" in d, "District missing 'total_leads' field"
                assert "hot_leads" in d, "District missing 'hot_leads' field"
                assert "avg_score" in d, "District missing 'avg_score' field"


class TestVisitorInsights:
    """Test GET /api/geo/visitor-insights endpoint"""

    def test_visitor_insights_returns_200(self):
        """Visitor insights endpoint should return 200"""
        resp = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

    def test_visitor_insights_has_top_searches_by_zone(self):
        """Response should contain top_searches_by_zone array"""
        resp = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        data = resp.json()
        assert "top_searches_by_zone" in data, "Missing top_searches_by_zone key"
        assert isinstance(data["top_searches_by_zone"], list), "top_searches_by_zone should be a list"

    def test_visitor_insights_has_visits_by_zone(self):
        """Response should contain visits_by_zone array"""
        resp = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        data = resp.json()
        assert "visits_by_zone" in data, "Missing visits_by_zone key"
        assert isinstance(data["visits_by_zone"], list), "visits_by_zone should be a list"

    def test_visitor_insights_has_top_pages(self):
        """Response should contain top_pages array"""
        resp = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        data = resp.json()
        assert "top_pages" in data, "Missing top_pages key"
        assert isinstance(data["top_pages"], list), "top_pages should be a list"


class TestAutomationStats:
    """Test GET /api/admin/automation/stats endpoint (requires auth)"""

    def test_automation_stats_requires_auth(self):
        """Automation stats should require authentication"""
        resp = requests.get(f"{BASE_URL}/api/admin/automation/stats")
        assert resp.status_code in [401, 403], f"Expected 401/403 without auth, got {resp.status_code}"

    def test_automation_stats_returns_200_with_auth(self, auth_headers):
        """Automation stats should return 200 with valid auth"""
        resp = requests.get(f"{BASE_URL}/api/admin/automation/stats", headers=auth_headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

    def test_automation_stats_has_followups_object(self, auth_headers):
        """Response should contain followups object"""
        resp = requests.get(f"{BASE_URL}/api/admin/automation/stats", headers=auth_headers)
        data = resp.json()
        assert "followups" in data, "Missing followups key"
        followups = data["followups"]
        assert "total" in followups, "followups missing 'total'"
        assert "pending" in followups, "followups missing 'pending'"
        assert "sent" in followups, "followups missing 'sent'"
        assert "skipped" in followups, "followups missing 'skipped'"
        assert "failed" in followups, "followups missing 'failed'"

    def test_automation_stats_has_leads_object(self, auth_headers):
        """Response should contain leads object"""
        resp = requests.get(f"{BASE_URL}/api/admin/automation/stats", headers=auth_headers)
        data = resp.json()
        assert "leads" in data, "Missing leads key"
        leads = data["leads"]
        assert "total" in leads, "leads missing 'total'"
        assert "whatsapp_sourced" in leads, "leads missing 'whatsapp_sourced'"
        assert "by_score" in leads, "leads missing 'by_score'"


class TestEmailEndpoints:
    """Test email endpoints"""

    def test_send_brochure_requires_auth(self):
        """Send brochure endpoint should require authentication"""
        resp = requests.post(f"{BASE_URL}/api/admin/email/send-brochure", json={})
        assert resp.status_code in [401, 403], f"Expected 401/403 without auth, got {resp.status_code}"

    def test_send_brochure_endpoint_exists(self, auth_headers):
        """Send brochure endpoint should exist and respond (even with error for missing data)"""
        resp = requests.post(
            f"{BASE_URL}/api/admin/email/send-brochure",
            headers=auth_headers,
            json={}
        )
        # Should return 400 (no lead_id or email) or 404 (lead not found), not 404 for route
        assert resp.status_code in [400, 404, 500], f"Unexpected status {resp.status_code}: {resp.text}"
        # Verify it's not a "route not found" error
        if resp.status_code == 404:
            data = resp.json()
            assert "Lead not found" in str(data) or "lead" in str(data).lower(), "Should be lead not found, not route not found"

    def test_lead_confirmation_endpoint_exists(self):
        """Lead confirmation endpoint should exist (public)"""
        resp = requests.post(
            f"{BASE_URL}/api/email/lead-confirmation",
            json={"name": "Test", "email": ""}  # No email = should skip
        )
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        data = resp.json()
        # Should skip since no email provided
        assert "skipped" in data or "success" in data, "Response should indicate skipped or success"

    def test_lead_confirmation_skips_without_email(self):
        """Lead confirmation should skip when no email provided"""
        resp = requests.post(
            f"{BASE_URL}/api/email/lead-confirmation",
            json={"name": "Test Doctor", "department": "Orthopedics"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("skipped") == True, "Should skip when no email"
        assert "No email" in data.get("reason", ""), "Should indicate no email reason"


class TestAdminAnalyticsEndpoint:
    """Test admin analytics endpoint"""

    def test_admin_analytics_requires_auth(self):
        """Admin analytics should require authentication"""
        resp = requests.get(f"{BASE_URL}/api/admin/analytics")
        assert resp.status_code in [401, 403], f"Expected 401/403 without auth, got {resp.status_code}"

    def test_admin_analytics_returns_200_with_auth(self, auth_headers):
        """Admin analytics should return 200 with valid auth"""
        resp = requests.get(f"{BASE_URL}/api/admin/analytics", headers=auth_headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"


class TestWhatsAppAnalytics:
    """Test WhatsApp analytics endpoint"""

    def test_whatsapp_analytics_requires_auth(self):
        """WhatsApp analytics should require authentication"""
        resp = requests.get(f"{BASE_URL}/api/admin/whatsapp/analytics")
        assert resp.status_code in [401, 403], f"Expected 401/403 without auth, got {resp.status_code}"

    def test_whatsapp_analytics_returns_200_with_auth(self, auth_headers):
        """WhatsApp analytics should return 200 with valid auth"""
        resp = requests.get(f"{BASE_URL}/api/admin/whatsapp/analytics", headers=auth_headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"


class TestChatbotTelemetry:
    """Test chatbot telemetry endpoint"""

    def test_chatbot_telemetry_requires_auth(self):
        """Chatbot telemetry should require authentication"""
        resp = requests.get(f"{BASE_URL}/api/chatbot/telemetry/report?days=7")
        assert resp.status_code in [401, 403], f"Expected 401/403 without auth, got {resp.status_code}"

    def test_chatbot_telemetry_returns_200_with_auth(self, auth_headers):
        """Chatbot telemetry should return 200 with valid auth"""
        resp = requests.get(f"{BASE_URL}/api/chatbot/telemetry/report?days=7", headers=auth_headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
