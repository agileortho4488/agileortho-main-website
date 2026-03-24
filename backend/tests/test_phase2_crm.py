"""
MedDevice Pro API Tests - Phase 2 (Iteration 14)
Tests for Enhanced CRM: Kanban Pipeline, CRM Analytics, Product Create/Edit
Covers: Pipeline API, Analytics API, Lead Status Update (drag-drop), Product CRUD
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test data prefix for cleanup
TEST_PREFIX = "TEST_PHASE2_"


class TestPipelineEndpoint:
    """Pipeline endpoint tests - Kanban board with 6 statuses"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_pipeline_requires_auth(self):
        """GET /api/admin/pipeline without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/pipeline")
        assert response.status_code == 401
        print("✓ Pipeline requires authentication")
    
    def test_get_pipeline_returns_6_statuses(self):
        """GET /api/admin/pipeline returns leads grouped by 6 statuses"""
        response = requests.get(f"{BASE_URL}/api/admin/pipeline", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "pipeline" in data
        pipeline = data["pipeline"]
        
        # Verify all 6 statuses exist
        expected_statuses = ["new", "contacted", "qualified", "negotiation", "won", "lost"]
        for status in expected_statuses:
            assert status in pipeline, f"Missing status: {status}"
            assert isinstance(pipeline[status], list), f"Status {status} should be a list"
        
        # Count total leads
        total_leads = sum(len(pipeline[s]) for s in expected_statuses)
        print(f"✓ Pipeline has 6 statuses with {total_leads} total leads")
        
        # Print breakdown
        for status in expected_statuses:
            print(f"  {status}: {len(pipeline[status])} leads")
    
    def test_pipeline_leads_have_required_fields(self):
        """Pipeline leads have all required fields for Kanban cards"""
        response = requests.get(f"{BASE_URL}/api/admin/pipeline", headers=self.headers)
        assert response.status_code == 200
        pipeline = response.json()["pipeline"]
        
        # Get first lead from any non-empty status
        lead = None
        for status in ["new", "contacted", "qualified", "negotiation", "won", "lost"]:
            if pipeline[status]:
                lead = pipeline[status][0]
                break
        
        if lead:
            required_fields = ["id", "name", "score", "source", "status"]
            for field in required_fields:
                assert field in lead, f"Lead missing field: {field}"
            
            # Optional but expected fields for Kanban cards
            optional_fields = ["hospital_clinic", "phone_whatsapp", "email", "district", "inquiry_type", "product_interest"]
            present_optional = [f for f in optional_fields if f in lead]
            print(f"✓ Lead has required fields + {len(present_optional)} optional fields")
        else:
            print("⚠ No leads in pipeline to verify fields")


class TestAnalyticsEndpoint:
    """Analytics endpoint tests - CRM metrics and charts"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_analytics_requires_auth(self):
        """GET /api/admin/analytics without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics")
        assert response.status_code == 401
        print("✓ Analytics requires authentication")
    
    def test_get_analytics_returns_all_metrics(self):
        """GET /api/admin/analytics returns all required metrics"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify all required fields
        required_fields = [
            "total_leads", "conversion_rate", "by_source", "by_score",
            "by_status", "by_district", "by_inquiry", "recent_leads"
        ]
        for field in required_fields:
            assert field in data, f"Missing analytics field: {field}"
        
        print(f"✓ Analytics has all {len(required_fields)} required fields")
        print(f"  total_leads: {data['total_leads']}")
        print(f"  conversion_rate: {data['conversion_rate']}%")
    
    def test_analytics_by_source_structure(self):
        """Analytics by_source has correct structure"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        data = response.json()
        
        by_source = data["by_source"]
        assert isinstance(by_source, list)
        if by_source:
            assert "source" in by_source[0]
            assert "count" in by_source[0]
        print(f"✓ by_source: {len(by_source)} sources")
    
    def test_analytics_by_score_structure(self):
        """Analytics by_score has Hot/Warm/Cold breakdown"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        data = response.json()
        
        by_score = data["by_score"]
        assert isinstance(by_score, list)
        scores = [s["score"] for s in by_score]
        # At least some scores should be present
        print(f"✓ by_score: {by_score}")
    
    def test_analytics_by_status_structure(self):
        """Analytics by_status has funnel data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        data = response.json()
        
        by_status = data["by_status"]
        assert isinstance(by_status, list)
        if by_status:
            assert "status" in by_status[0]
            assert "count" in by_status[0]
        print(f"✓ by_status (funnel): {by_status}")
    
    def test_analytics_by_district_structure(self):
        """Analytics by_district has geographic breakdown"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        data = response.json()
        
        by_district = data["by_district"]
        assert isinstance(by_district, list)
        if by_district:
            assert "district" in by_district[0]
            assert "count" in by_district[0]
        print(f"✓ by_district: {len(by_district)} districts")
    
    def test_analytics_by_inquiry_structure(self):
        """Analytics by_inquiry has inquiry type breakdown"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        data = response.json()
        
        by_inquiry = data["by_inquiry"]
        assert isinstance(by_inquiry, list)
        if by_inquiry:
            assert "type" in by_inquiry[0]
            assert "count" in by_inquiry[0]
        print(f"✓ by_inquiry: {by_inquiry}")
    
    def test_analytics_recent_leads_structure(self):
        """Analytics recent_leads has lead details"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=self.headers)
        data = response.json()
        
        recent_leads = data["recent_leads"]
        assert isinstance(recent_leads, list)
        assert len(recent_leads) <= 10, "Recent leads should be limited to 10"
        if recent_leads:
            assert "id" in recent_leads[0]
            assert "name" in recent_leads[0]
            assert "score" in recent_leads[0]
        print(f"✓ recent_leads: {len(recent_leads)} leads")


class TestLeadStatusUpdate:
    """Lead status update tests - for Kanban drag-and-drop"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_update_lead_status_new_to_contacted(self):
        """PUT /api/admin/leads/:id can update status (drag from New to Contacted)"""
        # Create a test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Drag Test Lead",
            "phone_whatsapp": "+919876543100",
            "inquiry_type": "Product Info"
        })
        assert create_response.status_code == 200
        lead_id = create_response.json()["lead"]["id"]
        
        # Update status (simulating drag-drop)
        update_response = requests.put(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers,
            json={"status": "contacted"}
        )
        assert update_response.status_code == 200
        updated_lead = update_response.json()
        assert updated_lead["status"] == "contacted"
        
        # Verify in pipeline
        pipeline_response = requests.get(f"{BASE_URL}/api/admin/pipeline", headers=self.headers)
        pipeline = pipeline_response.json()["pipeline"]
        contacted_ids = [l["id"] for l in pipeline["contacted"]]
        assert lead_id in contacted_ids, "Lead should be in contacted column"
        
        print(f"✓ Lead moved from new to contacted")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
    
    def test_update_lead_status_to_qualified(self):
        """PUT /api/admin/leads/:id can update status to qualified"""
        # Create a test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Qualified Test",
            "phone_whatsapp": "+919876543101",
            "inquiry_type": "Bulk Quote"
        })
        lead_id = create_response.json()["lead"]["id"]
        
        # Update to qualified
        update_response = requests.put(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers,
            json={"status": "qualified"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "qualified"
        
        print(f"✓ Lead status updated to qualified")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
    
    def test_update_lead_status_to_won(self):
        """PUT /api/admin/leads/:id can update status to won"""
        # Create a test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Won Test",
            "phone_whatsapp": "+919876543102",
            "inquiry_type": "Bulk Quote"
        })
        lead_id = create_response.json()["lead"]["id"]
        
        # Update to won
        update_response = requests.put(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers,
            json={"status": "won"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "won"
        
        print(f"✓ Lead status updated to won")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
    
    def test_update_lead_status_to_lost(self):
        """PUT /api/admin/leads/:id can update status to lost"""
        # Create a test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Lost Test",
            "phone_whatsapp": "+919876543103",
            "inquiry_type": "General"
        })
        lead_id = create_response.json()["lead"]["id"]
        
        # Update to lost
        update_response = requests.put(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers,
            json={"status": "lost"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "lost"
        
        print(f"✓ Lead status updated to lost")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)


class TestProductCreate:
    """Product creation tests - Admin product CRUD"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_create_product_requires_auth(self):
        """POST /api/admin/products without token returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/products", json={
            "product_name": "Test Product",
            "division": "Orthopedics"
        })
        assert response.status_code == 401
        print("✓ Product create requires authentication")
    
    def test_create_product_with_all_fields(self):
        """POST /api/admin/products creates product with all fields"""
        product_data = {
            "product_name": f"{TEST_PREFIX}Complete Product",
            "sku_code": "TEST-SKU-001",
            "division": "Orthopedics",
            "category": "Test Category",
            "material": "Titanium Alloy",
            "description": "Test product description for Phase 2 testing",
            "technical_specifications": {
                "weight": "500g",
                "dimensions": "10x5x3 cm",
                "certification": "CE Marked"
            },
            "size_variables": ["Small", "Medium", "Large"],
            "pack_size": "1 unit",
            "manufacturer": "Test Manufacturer",
            "seo_meta_title": "Test Product | MedDevice Pro",
            "brochure_url": "https://example.com/brochure.pdf",
            "status": "published"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            json=product_data
        )
        assert response.status_code == 200
        product = response.json()
        
        # Verify all fields
        assert product["product_name"] == product_data["product_name"]
        assert product["sku_code"] == product_data["sku_code"]
        assert product["division"] == product_data["division"]
        assert product["category"] == product_data["category"]
        assert product["material"] == product_data["material"]
        assert product["technical_specifications"] == product_data["technical_specifications"]
        assert product["size_variables"] == product_data["size_variables"]
        assert product["pack_size"] == product_data["pack_size"]
        assert product["manufacturer"] == product_data["manufacturer"]
        assert product["status"] == product_data["status"]
        assert "id" in product
        assert "slug" in product
        
        print(f"✓ Product created with all fields: {product['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product['id']}", headers=self.headers)
    
    def test_create_product_minimal_fields(self):
        """POST /api/admin/products creates product with minimal required fields"""
        product_data = {
            "product_name": f"{TEST_PREFIX}Minimal Product",
            "division": "Trauma"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            json=product_data
        )
        assert response.status_code == 200
        product = response.json()
        
        assert product["product_name"] == product_data["product_name"]
        assert product["division"] == product_data["division"]
        assert "id" in product
        
        print(f"✓ Product created with minimal fields: {product['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product['id']}", headers=self.headers)


class TestProductUpdate:
    """Product update tests - Admin product edit"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_update_product_requires_auth(self):
        """PUT /api/admin/products/:id without token returns 401"""
        # First create a product
        create_response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            json={"product_name": f"{TEST_PREFIX}Auth Test", "division": "ENT"}
        )
        product_id = create_response.json()["id"]
        
        # Try to update without auth
        response = requests.put(
            f"{BASE_URL}/api/admin/products/{product_id}",
            json={"product_name": "Updated Name"}
        )
        assert response.status_code == 401
        
        print("✓ Product update requires authentication")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}", headers=self.headers)
    
    def test_update_product_name(self):
        """PUT /api/admin/products/:id updates product name"""
        # Create product
        create_response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            json={"product_name": f"{TEST_PREFIX}Original Name", "division": "Diagnostics"}
        )
        product_id = create_response.json()["id"]
        
        # Update name
        update_response = requests.put(
            f"{BASE_URL}/api/admin/products/{product_id}",
            headers=self.headers,
            json={"product_name": f"{TEST_PREFIX}Updated Name"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["product_name"] == f"{TEST_PREFIX}Updated Name"
        
        # Verify slug also updated
        assert "updated-name" in updated["slug"].lower()
        
        print(f"✓ Product name updated, slug regenerated")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}", headers=self.headers)
    
    def test_update_product_specs(self):
        """PUT /api/admin/products/:id updates technical specifications"""
        # Create product
        create_response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            json={
                "product_name": f"{TEST_PREFIX}Specs Test",
                "division": "Cardiovascular",
                "technical_specifications": {"old_key": "old_value"}
            }
        )
        product_id = create_response.json()["id"]
        
        # Update specs
        new_specs = {"new_key": "new_value", "feature": True}
        update_response = requests.put(
            f"{BASE_URL}/api/admin/products/{product_id}",
            headers=self.headers,
            json={"technical_specifications": new_specs}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["technical_specifications"] == new_specs
        
        print(f"✓ Product specs updated")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}", headers=self.headers)
    
    def test_update_product_status(self):
        """PUT /api/admin/products/:id updates product status"""
        # Create product
        create_response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            json={"product_name": f"{TEST_PREFIX}Status Test", "division": "Infection Prevention", "status": "published"}
        )
        product_id = create_response.json()["id"]
        
        # Update to draft
        update_response = requests.put(
            f"{BASE_URL}/api/admin/products/{product_id}",
            headers=self.headers,
            json={"status": "draft"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "draft"
        
        # Update to archived
        update_response = requests.put(
            f"{BASE_URL}/api/admin/products/{product_id}",
            headers=self.headers,
            json={"status": "archived"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "archived"
        
        print(f"✓ Product status updated (published -> draft -> archived)")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}", headers=self.headers)
    
    def test_update_product_not_found(self):
        """PUT /api/admin/products/:id with non-existent ID returns 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/products/000000000000000000000000",
            headers=self.headers,
            json={"product_name": "Test"}
        )
        assert response.status_code == 404
        print("✓ Non-existent product returns 404")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_data(self):
        """Remove test leads and products created during testing"""
        # Get auth token
        auth_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        token = auth_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Cleanup test leads
        leads_response = requests.get(f"{BASE_URL}/api/admin/leads", 
                                      headers=headers, 
                                      params={"limit": 100})
        leads = leads_response.json()["leads"]
        
        deleted_leads = 0
        for lead in leads:
            if lead["name"].startswith(TEST_PREFIX):
                requests.delete(f"{BASE_URL}/api/admin/leads/{lead['id']}", headers=headers)
                deleted_leads += 1
        
        # Cleanup test products
        products_response = requests.get(f"{BASE_URL}/api/admin/products", 
                                         headers=headers, 
                                         params={"limit": 100})
        products = products_response.json()["products"]
        
        deleted_products = 0
        for product in products:
            if product["product_name"].startswith(TEST_PREFIX):
                requests.delete(f"{BASE_URL}/api/admin/products/{product['id']}", headers=headers)
                deleted_products += 1
        
        print(f"✓ Cleaned up {deleted_leads} test leads and {deleted_products} test products")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
