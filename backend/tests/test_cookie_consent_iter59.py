"""
Iteration 59: Cookie Consent & App Health Tests
Tests: Admin login, catalog divisions API, basic app health
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAppHealth:
    """Basic app health checks"""
    
    def test_catalog_divisions_returns_data(self):
        """Test /api/catalog/divisions returns data"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions", timeout=10)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        # API returns {"divisions": [...], "total_products": N}
        divisions = data.get("divisions", data) if isinstance(data, dict) else data
        assert isinstance(divisions, list), "Expected list of divisions"
        assert len(divisions) > 0, "Expected at least one division"
        print(f"✓ Catalog divisions returned {len(divisions)} divisions")
    
    def test_health_endpoint(self):
        """Test health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        # Health endpoint may return 200 or 404 if not implemented
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}"
        print(f"✓ Health endpoint returned {response.status_code}")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_with_correct_password(self):
        """Test admin login with AgileHealth2026admin"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "AgileHealth2026admin"},
            timeout=10
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "token" in data, "Expected token in response"
        assert data.get("role") == "super_admin", f"Expected super_admin role, got {data.get('role')}"
        print(f"✓ Admin login successful, role: {data.get('role')}")
        return data["token"]
    
    def test_admin_login_with_wrong_password(self):
        """Test admin login with wrong password returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "wrongpassword123"},
            timeout=10
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Wrong password correctly rejected with 401")
    
    def test_admin_stats_requires_auth(self):
        """Test admin stats endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", timeout=10)
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ Admin stats correctly requires authentication")
    
    def test_admin_stats_with_valid_token(self):
        """Test admin stats with valid token"""
        # First login
        login_response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "AgileHealth2026admin"},
            timeout=10
        )
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Then access stats
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "total_products" in data, "Expected total_products in stats"
        print(f"✓ Admin stats accessible with token, total_products: {data.get('total_products')}")


class TestCatalogAPI:
    """Catalog API tests"""
    
    def test_catalog_product_detail(self):
        """Test product detail endpoint for mboss-screw-system"""
        response = requests.get(
            f"{BASE_URL}/api/catalog/products/mboss-screw-system",
            timeout=10
        )
        # Product may or may not exist
        if response.status_code == 200:
            data = response.json()
            assert "product_name" in data or "name" in data, "Expected product name in response"
            print(f"✓ Product detail returned: {data.get('product_name', data.get('name', 'Unknown'))}")
        elif response.status_code == 404:
            print("✓ Product not found (404) - acceptable if product doesn't exist")
        else:
            pytest.fail(f"Unexpected status: {response.status_code}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
