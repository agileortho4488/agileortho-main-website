"""
Test suite for refactored Agile Ortho API routes
Tests all endpoints after server.py was split into modular route files:
- routes/public.py: Health, divisions, products, leads, file serving
- routes/admin.py: Admin login, dashboard, CRUD, image upload
- routes/chat.py: RAG chatbot
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"password": "admin"}
    )
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Admin authentication failed")

@pytest.fixture
def auth_headers(admin_token):
    """Headers with admin token"""
    return {"Authorization": f"Bearer {admin_token}"}


class TestPublicRoutes:
    """Tests for routes/public.py - Public endpoints"""
    
    def test_health_endpoint(self):
        """GET /api/health returns 200 with status ok"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "service" in data
        print(f"✓ Health check passed: {data}")
    
    def test_get_divisions(self):
        """GET /api/divisions returns divisions with categories"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        assert "divisions" in data
        assert len(data["divisions"]) > 0
        # Verify structure
        division = data["divisions"][0]
        assert "name" in division
        assert "categories" in division
        assert "product_count" in division
        print(f"✓ Divisions returned: {len(data['divisions'])} divisions")
    
    def test_get_products_list(self):
        """GET /api/products returns paginated products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        # Verify we have 306 products as expected
        assert data["total"] >= 300, f"Expected ~306 products, got {data['total']}"
        print(f"✓ Products list: {data['total']} total, page {data['page']} of {data['pages']}")
    
    def test_get_products_with_division_filter(self):
        """GET /api/products with division filter"""
        response = requests.get(f"{BASE_URL}/api/products", params={"division": "Orthopedics"})
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        # All products should be from Orthopedics division
        for product in data["products"]:
            assert product["division"] == "Orthopedics"
        print(f"✓ Filtered products: {data['total']} Orthopedics products")
    
    def test_get_products_with_search(self):
        """GET /api/products with search query"""
        response = requests.get(f"{BASE_URL}/api/products", params={"search": "screw"})
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        print(f"✓ Search results: {data['total']} products matching 'screw'")
    
    def test_get_single_product(self):
        """GET /api/products/{id} returns single product"""
        # First get a product ID
        list_response = requests.get(f"{BASE_URL}/api/products", params={"limit": 1})
        products = list_response.json()["products"]
        if not products:
            pytest.skip("No products available")
        
        product_id = products[0]["id"]
        response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == product_id
        assert "product_name" in data
        assert "division" in data
        print(f"✓ Single product: {data['product_name']}")
    
    def test_create_lead(self):
        """POST /api/leads creates a new lead"""
        lead_data = {
            "name": f"TEST_Lead_{uuid.uuid4().hex[:8]}",
            "hospital_clinic": "Test Hospital",
            "phone_whatsapp": "+919999999999",
            "email": "test@example.com",
            "district": "Hyderabad",
            "inquiry_type": "Product Info",
            "source": "website",
            "product_interest": "Orthopedic Screws",
            "message": "Test inquiry"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert "lead" in data
        assert data["lead"]["name"] == lead_data["name"]
        assert "score" in data["lead"]
        print(f"✓ Lead created: {data['lead']['name']} with score {data['lead']['score']}")


class TestAdminAuth:
    """Tests for admin authentication"""
    
    def test_admin_login_success(self):
        """POST /api/admin/login with correct password returns token"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "admin"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "role" in data
        assert data["role"] == "super_admin"
        print(f"✓ Admin login successful, role: {data['role']}")
    
    def test_admin_login_failure(self):
        """POST /api/admin/login with wrong password returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Admin login correctly rejected invalid password")


class TestAdminDashboard:
    """Tests for admin dashboard endpoints"""
    
    def test_admin_stats(self, auth_headers):
        """GET /api/admin/stats returns dashboard statistics"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        # Verify expected fields
        assert "total_products" in data
        assert "total_leads" in data
        assert "hot_leads" in data
        assert "warm_leads" in data
        assert "cold_leads" in data
        assert "new_leads" in data
        assert "products_by_division" in data
        assert "leads_by_inquiry" in data
        # Verify product count is ~306
        assert data["total_products"] >= 300, f"Expected ~306 products, got {data['total_products']}"
        print(f"✓ Admin stats: {data['total_products']} products, {data['total_leads']} leads")
    
    def test_admin_stats_requires_auth(self):
        """GET /api/admin/stats without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401
        print("✓ Admin stats correctly requires authentication")
    
    def test_admin_pipeline(self, auth_headers):
        """GET /api/admin/pipeline returns lead pipeline"""
        response = requests.get(f"{BASE_URL}/api/admin/pipeline", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "pipeline" in data
        # Verify pipeline has expected statuses
        expected_statuses = ["new", "contacted", "qualified", "negotiation", "won", "lost"]
        for status in expected_statuses:
            assert status in data["pipeline"]
        print(f"✓ Admin pipeline returned with {len(expected_statuses)} statuses")
    
    def test_admin_analytics(self, auth_headers):
        """GET /api/admin/analytics returns analytics data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_leads" in data
        assert "conversion_rate" in data
        assert "by_source" in data
        assert "by_score" in data
        assert "by_status" in data
        print(f"✓ Admin analytics: {data['total_leads']} leads, {data['conversion_rate']}% conversion")


class TestAdminLeads:
    """Tests for admin leads CRUD"""
    
    def test_admin_list_leads(self, auth_headers):
        """GET /api/admin/leads returns paginated leads"""
        response = requests.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "leads" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        print(f"✓ Admin leads: {data['total']} total leads")
    
    def test_admin_leads_with_filters(self, auth_headers):
        """GET /api/admin/leads with score filter"""
        response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers=auth_headers,
            params={"score": "Hot"}
        )
        assert response.status_code == 200
        data = response.json()
        # All leads should be Hot
        for lead in data["leads"]:
            assert lead["score"] == "Hot"
        print(f"✓ Filtered leads: {data['total']} Hot leads")


class TestAdminProducts:
    """Tests for admin products CRUD"""
    
    def test_admin_list_products(self, auth_headers):
        """GET /api/admin/products returns paginated products"""
        response = requests.get(f"{BASE_URL}/api/admin/products", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        # Verify ~306 products
        assert data["total"] >= 300
        print(f"✓ Admin products: {data['total']} total products")
    
    def test_admin_create_product(self, auth_headers):
        """POST /api/admin/products creates a new product"""
        product_data = {
            "product_name": f"TEST_Product_{uuid.uuid4().hex[:8]}",
            "sku_code": f"TEST-SKU-{uuid.uuid4().hex[:6]}",
            "division": "Orthopedics",
            "category": "Test Category",
            "description": "Test product description",
            "material": "Titanium",
            "pack_size": "1 unit",
            "manufacturer": "Test Manufacturer",
            "status": "draft"
        }
        response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=auth_headers,
            json=product_data
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["product_name"] == product_data["product_name"]
        assert data["division"] == "Orthopedics"
        assert "slug" in data
        print(f"✓ Product created: {data['product_name']} (ID: {data['id']})")
        return data["id"]
    
    def test_admin_update_product(self, auth_headers):
        """PUT /api/admin/products/{id} updates a product"""
        # First create a product
        create_response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=auth_headers,
            json={
                "product_name": f"TEST_Update_{uuid.uuid4().hex[:8]}",
                "division": "Trauma",
                "status": "draft"
            }
        )
        product_id = create_response.json()["id"]
        
        # Update the product
        update_data = {
            "product_name": "TEST_Updated_Product_Name",
            "description": "Updated description"
        }
        response = requests.put(
            f"{BASE_URL}/api/admin/products/{product_id}",
            headers=auth_headers,
            json=update_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["product_name"] == "TEST_Updated_Product_Name"
        assert data["description"] == "Updated description"
        print(f"✓ Product updated: {data['product_name']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}", headers=auth_headers)
    
    def test_admin_delete_product(self, auth_headers):
        """DELETE /api/admin/products/{id} deletes a product"""
        # First create a product
        create_response = requests.post(
            f"{BASE_URL}/api/admin/products",
            headers=auth_headers,
            json={
                "product_name": f"TEST_Delete_{uuid.uuid4().hex[:8]}",
                "division": "Diagnostics",
                "status": "draft"
            }
        )
        product_id = create_response.json()["id"]
        
        # Delete the product
        response = requests.delete(
            f"{BASE_URL}/api/admin/products/{product_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Product deleted"
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_response.status_code == 404
        print(f"✓ Product deleted and verified")


class TestProductImageUpload:
    """Tests for product image upload endpoints"""
    
    def test_image_upload_endpoint_exists(self, auth_headers):
        """POST /api/admin/products/{id}/images endpoint exists"""
        # Get a product ID
        list_response = requests.get(
            f"{BASE_URL}/api/admin/products",
            headers=auth_headers,
            params={"limit": 1}
        )
        products = list_response.json()["products"]
        if not products:
            pytest.skip("No products available")
        
        product_id = products[0]["id"]
        
        # Test endpoint without files (should return 422 - validation error for missing files)
        response = requests.post(
            f"{BASE_URL}/api/admin/products/{product_id}/images",
            headers=auth_headers
        )
        # 422 means endpoint exists but requires files
        assert response.status_code in [422, 400]
        print(f"✓ Image upload endpoint exists for product {product_id}")
    
    def test_image_upload_requires_auth(self):
        """POST /api/admin/products/{id}/images requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/admin/products/test123/images"
        )
        assert response.status_code == 401
        print("✓ Image upload correctly requires authentication")
    
    def test_image_delete_endpoint_exists(self, auth_headers):
        """DELETE /api/admin/products/{id}/images/{image_id} endpoint exists"""
        # Get a product ID
        list_response = requests.get(
            f"{BASE_URL}/api/admin/products",
            headers=auth_headers,
            params={"limit": 1}
        )
        products = list_response.json()["products"]
        if not products:
            pytest.skip("No products available")
        
        product_id = products[0]["id"]
        
        # Test with fake image ID
        response = requests.delete(
            f"{BASE_URL}/api/admin/products/{product_id}/images/fake-image-id",
            headers=auth_headers
        )
        # Should return 200 (image removed) even if image doesn't exist
        assert response.status_code == 200
        print(f"✓ Image delete endpoint exists")
    
    def test_bulk_image_upload_endpoint_exists(self, auth_headers):
        """POST /api/admin/products/bulk-images endpoint exists"""
        # Test endpoint without files (should return 422 - validation error)
        response = requests.post(
            f"{BASE_URL}/api/admin/products/bulk-images",
            headers=auth_headers
        )
        # 422 means endpoint exists but requires files
        assert response.status_code in [422, 400]
        print("✓ Bulk image upload endpoint exists")
    
    def test_bulk_image_upload_requires_auth(self):
        """POST /api/admin/products/bulk-images requires authentication"""
        response = requests.post(f"{BASE_URL}/api/admin/products/bulk-images")
        assert response.status_code == 401
        print("✓ Bulk image upload correctly requires authentication")


class TestChatEndpoint:
    """Tests for chat/chatbot endpoint"""
    
    def test_chat_endpoint(self):
        """POST /api/chat works with chatbot"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "message": "What orthopedic products do you have?",
                "session_id": f"test-{uuid.uuid4().hex[:8]}"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "session_id" in data
        assert "products_referenced" in data
        print(f"✓ Chat response received, {data['products_referenced']} products referenced")
    
    def test_chat_suggestions(self):
        """GET /api/chat/suggestions returns suggestions"""
        response = requests.get(f"{BASE_URL}/api/chat/suggestions")
        assert response.status_code == 200
        data = response.json()
        assert "suggestions" in data
        assert len(data["suggestions"]) > 0
        print(f"✓ Chat suggestions: {len(data['suggestions'])} suggestions")


class TestFileServing:
    """Tests for file serving endpoint"""
    
    def test_file_endpoint_exists(self):
        """GET /api/files/{path} endpoint exists"""
        # Test with non-existent file
        response = requests.get(f"{BASE_URL}/api/files/nonexistent/file.jpg")
        # Should return 404 for non-existent file
        assert response.status_code == 404
        print("✓ File serving endpoint exists (returns 404 for missing files)")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_products(self, auth_headers):
        """Delete TEST_ prefixed products"""
        response = requests.get(
            f"{BASE_URL}/api/admin/products",
            headers=auth_headers,
            params={"search": "TEST_", "limit": 100}
        )
        if response.status_code == 200:
            products = response.json().get("products", [])
            deleted = 0
            for p in products:
                if p["product_name"].startswith("TEST_"):
                    requests.delete(
                        f"{BASE_URL}/api/admin/products/{p['id']}",
                        headers=auth_headers
                    )
                    deleted += 1
            print(f"✓ Cleaned up {deleted} test products")
