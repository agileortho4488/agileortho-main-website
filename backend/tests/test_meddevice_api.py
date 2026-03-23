"""
MedDevice Pro API Tests - Iteration 13
Tests for B2B medical device portfolio website + CRM
Covers: Health, Divisions, Products, Leads, Admin Auth, Admin Stats, Admin Leads CRUD
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test data prefix for cleanup
TEST_PREFIX = "TEST_ITER13_"


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_returns_ok(self):
        """GET /api/health returns ok status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "service" in data
        print(f"✓ Health check passed: {data}")


class TestDivisionsEndpoint:
    """Divisions endpoint tests - should return 8 divisions"""
    
    def test_get_divisions_returns_8_divisions(self):
        """GET /api/divisions returns 8 divisions with product counts"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        assert "divisions" in data
        divisions = data["divisions"]
        assert len(divisions) == 8, f"Expected 8 divisions, got {len(divisions)}"
        
        # Verify expected divisions
        expected_divisions = [
            "Orthopedics", "Trauma", "Cardiovascular", "Diagnostics",
            "ENT", "Endo-surgical", "Infection Prevention", "Peripheral Intervention"
        ]
        division_names = [d["name"] for d in divisions]
        for expected in expected_divisions:
            assert expected in division_names, f"Missing division: {expected}"
        
        # Verify each division has product_count
        for div in divisions:
            assert "product_count" in div
            assert div["product_count"] > 0, f"Division {div['name']} has no products"
            assert "categories" in div
        
        print(f"✓ Divisions: {[(d['name'], d['product_count']) for d in divisions]}")


class TestProductsEndpoint:
    """Products endpoint tests - pagination, filtering, search"""
    
    def test_get_products_paginated(self):
        """GET /api/products returns paginated products"""
        response = requests.get(f"{BASE_URL}/api/products", params={"limit": 10})
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        assert len(data["products"]) <= 10
        assert data["total"] >= 45, f"Expected at least 45 products, got {data['total']}"
        print(f"✓ Products paginated: {len(data['products'])} products, total: {data['total']}")
    
    def test_get_products_filter_by_division(self):
        """GET /api/products with division filter"""
        response = requests.get(f"{BASE_URL}/api/products", params={"division": "Orthopedics"})
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        for product in data["products"]:
            assert product["division"] == "Orthopedics"
        print(f"✓ Orthopedics filter: {len(data['products'])} products")
    
    def test_get_products_filter_by_category(self):
        """GET /api/products with category filter"""
        response = requests.get(f"{BASE_URL}/api/products", params={
            "division": "Orthopedics",
            "category": "Knee Arthroplasty"
        })
        assert response.status_code == 200
        data = response.json()
        for product in data["products"]:
            assert product["category"] == "Knee Arthroplasty"
        print(f"✓ Category filter: {len(data['products'])} products")
    
    def test_get_products_search(self):
        """GET /api/products with search query"""
        response = requests.get(f"{BASE_URL}/api/products", params={"search": "stent"})
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        # Should find stent-related products
        print(f"✓ Search 'stent': {len(data['products'])} products found")
    
    def test_get_single_product(self):
        """GET /api/products/:id returns single product with all fields"""
        # First get a product ID
        list_response = requests.get(f"{BASE_URL}/api/products", params={"limit": 1})
        assert list_response.status_code == 200
        products = list_response.json()["products"]
        assert len(products) > 0
        
        product_id = products[0]["id"]
        response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert response.status_code == 200
        product = response.json()
        
        # Verify all required fields
        required_fields = ["id", "product_name", "sku_code", "division", "description", "manufacturer"]
        for field in required_fields:
            assert field in product, f"Missing field: {field}"
        
        print(f"✓ Single product: {product['product_name']} ({product['sku_code']})")
    
    def test_get_product_invalid_id(self):
        """GET /api/products/:id with invalid ID returns 400"""
        response = requests.get(f"{BASE_URL}/api/products/invalid-id")
        assert response.status_code == 400
        print("✓ Invalid product ID returns 400")
    
    def test_get_product_not_found(self):
        """GET /api/products/:id with non-existent ID returns 404"""
        response = requests.get(f"{BASE_URL}/api/products/000000000000000000000000")
        assert response.status_code == 404
        print("✓ Non-existent product returns 404")


class TestLeadCreation:
    """Lead capture endpoint tests - auto-scoring"""
    
    def test_create_lead_hot_score(self):
        """POST /api/leads creates a Hot lead (Bulk Quote + Hospital + Email + District + Product)"""
        lead_data = {
            "name": f"{TEST_PREFIX}Dr. Hot Lead",
            "hospital_clinic": "City Hospital",
            "phone_whatsapp": "+919876543210",
            "email": "hot@hospital.in",
            "district": "Hyderabad",
            "inquiry_type": "Bulk Quote",
            "product_interest": "Destiknee TKR",
            "message": "Need 50 units"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert "lead" in data
        lead = data["lead"]
        
        # Verify scoring: Bulk Quote(40) + Hospital(15) + Email(10) + District(10) + Product(15) = 90 -> Hot
        assert lead["score"] == "Hot", f"Expected Hot, got {lead['score']}"
        assert lead["score_value"] >= 60
        assert lead["status"] == "new"
        assert "id" in lead
        
        print(f"✓ Hot lead created: score={lead['score']} ({lead['score_value']})")
        return lead["id"]
    
    def test_create_lead_warm_score(self):
        """POST /api/leads creates a Warm lead (Product Info + Hospital)"""
        lead_data = {
            "name": f"{TEST_PREFIX}Dr. Warm Lead",
            "hospital_clinic": "Small Clinic",
            "phone_whatsapp": "+919876543211",
            "inquiry_type": "Product Info"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        lead = response.json()["lead"]
        
        # Product Info(20) + Hospital(15) = 35 -> Warm
        assert lead["score"] == "Warm", f"Expected Warm, got {lead['score']}"
        assert 35 <= lead["score_value"] < 60
        
        print(f"✓ Warm lead created: score={lead['score']} ({lead['score_value']})")
    
    def test_create_lead_cold_score(self):
        """POST /api/leads creates a Cold lead (General inquiry only)"""
        lead_data = {
            "name": f"{TEST_PREFIX}Cold Lead",
            "phone_whatsapp": "+919876543212",
            "inquiry_type": "General"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        lead = response.json()["lead"]
        
        # General(10) = 10 -> Cold
        assert lead["score"] == "Cold", f"Expected Cold, got {lead['score']}"
        assert lead["score_value"] < 35
        
        print(f"✓ Cold lead created: score={lead['score']} ({lead['score_value']})")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """POST /api/admin/login with password 'admin' returns JWT token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert len(data["token"]) > 0
        assert data.get("role") == "super_admin"
        
        print(f"✓ Admin login successful, token length: {len(data['token'])}")
        return data["token"]
    
    def test_admin_login_invalid_password(self):
        """POST /api/admin/login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid password returns 401")
    
    def test_admin_stats_requires_auth(self):
        """GET /api/admin/stats without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401
        print("✓ Admin stats requires authentication")
    
    def test_admin_leads_requires_auth(self):
        """GET /api/admin/leads without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/leads")
        assert response.status_code == 401
        print("✓ Admin leads requires authentication")


class TestAdminDashboard:
    """Admin dashboard stats tests (requires auth)"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_admin_stats(self):
        """GET /api/admin/stats returns dashboard statistics"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify all stat fields
        required_fields = [
            "total_products", "total_leads", "hot_leads", "warm_leads", 
            "cold_leads", "new_leads", "products_by_division", 
            "leads_by_inquiry", "leads_by_district"
        ]
        for field in required_fields:
            assert field in data, f"Missing stat field: {field}"
        
        assert data["total_products"] >= 45, f"Expected at least 45 products, got {data['total_products']}"
        assert isinstance(data["products_by_division"], list)
        
        print(f"✓ Admin stats: {data['total_products']} products, {data['total_leads']} leads")
        print(f"  Hot: {data['hot_leads']}, Warm: {data['warm_leads']}, Cold: {data['cold_leads']}")


class TestAdminLeadsCRUD:
    """Admin leads CRUD operations (requires auth)"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_admin_leads_paginated(self):
        """GET /api/admin/leads returns paginated leads"""
        response = requests.get(f"{BASE_URL}/api/admin/leads", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "leads" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        print(f"✓ Admin leads: {data['total']} total, page {data['page']}/{data['pages']}")
    
    def test_get_admin_leads_filter_by_score(self):
        """GET /api/admin/leads with score filter"""
        response = requests.get(f"{BASE_URL}/api/admin/leads", 
                               headers=self.headers, 
                               params={"score": "Hot"})
        assert response.status_code == 200
        data = response.json()
        for lead in data["leads"]:
            assert lead["score"] == "Hot"
        print(f"✓ Hot leads filter: {len(data['leads'])} leads")
    
    def test_get_admin_leads_filter_by_status(self):
        """GET /api/admin/leads with status filter"""
        response = requests.get(f"{BASE_URL}/api/admin/leads", 
                               headers=self.headers, 
                               params={"status": "new"})
        assert response.status_code == 200
        data = response.json()
        for lead in data["leads"]:
            assert lead["status"] == "new"
        print(f"✓ New leads filter: {len(data['leads'])} leads")
    
    def test_update_lead_status(self):
        """PUT /api/admin/leads/:id updates lead status"""
        # First create a test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Update Status Test",
            "phone_whatsapp": "+919876543299",
            "inquiry_type": "General"
        })
        lead_id = create_response.json()["lead"]["id"]
        
        # Update status
        update_response = requests.put(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers,
            json={"status": "contacted"}
        )
        assert update_response.status_code == 200
        updated_lead = update_response.json()
        assert updated_lead["status"] == "contacted"
        
        # Verify with GET
        get_response = requests.get(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
        assert get_response.status_code == 200
        assert get_response.json()["status"] == "contacted"
        
        print(f"✓ Lead status updated to 'contacted'")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
    
    def test_update_lead_add_notes(self):
        """PUT /api/admin/leads/:id adds notes to lead"""
        # Create test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Notes Test",
            "phone_whatsapp": "+919876543298",
            "inquiry_type": "General"
        })
        lead_id = create_response.json()["lead"]["id"]
        
        # Add note
        update_response = requests.put(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers,
            json={"notes": "Called customer, interested in TKR"}
        )
        assert update_response.status_code == 200
        updated_lead = update_response.json()
        assert len(updated_lead["notes"]) > 0
        assert updated_lead["notes"][-1]["text"] == "Called customer, interested in TKR"
        
        print(f"✓ Note added to lead")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
    
    def test_delete_lead(self):
        """DELETE /api/admin/leads/:id deletes a lead"""
        # Create test lead
        create_response = requests.post(f"{BASE_URL}/api/leads", json={
            "name": f"{TEST_PREFIX}Delete Test",
            "phone_whatsapp": "+919876543297",
            "inquiry_type": "General"
        })
        lead_id = create_response.json()["lead"]["id"]
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/leads/{lead_id}",
            headers=self.headers
        )
        assert delete_response.status_code == 200
        
        # Verify deleted
        get_response = requests.get(f"{BASE_URL}/api/admin/leads/{lead_id}", headers=self.headers)
        assert get_response.status_code == 404
        
        print(f"✓ Lead deleted successfully")


class TestAdminProductsCRUD:
    """Admin products CRUD operations (requires auth)"""
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_admin_products(self):
        """GET /api/admin/products returns products list"""
        response = requests.get(f"{BASE_URL}/api/admin/products", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "total" in data
        assert data["total"] >= 45
        print(f"✓ Admin products: {data['total']} total")
    
    def test_get_admin_products_filter_by_division(self):
        """GET /api/admin/products with division filter"""
        response = requests.get(
            f"{BASE_URL}/api/admin/products",
            headers=self.headers,
            params={"division": "Cardiovascular"}
        )
        assert response.status_code == 200
        data = response.json()
        for product in data["products"]:
            assert product["division"] == "Cardiovascular"
        print(f"✓ Cardiovascular products: {len(data['products'])}")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_leads(self):
        """Remove test leads created during testing"""
        # Get auth token
        auth_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        token = auth_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get all leads and delete test ones
        leads_response = requests.get(f"{BASE_URL}/api/admin/leads", 
                                      headers=headers, 
                                      params={"limit": 100})
        leads = leads_response.json()["leads"]
        
        deleted_count = 0
        for lead in leads:
            if lead["name"].startswith(TEST_PREFIX):
                requests.delete(f"{BASE_URL}/api/admin/leads/{lead['id']}", headers=headers)
                deleted_count += 1
        
        print(f"✓ Cleaned up {deleted_count} test leads")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
