"""
Backend API tests for Product Catalog - Iteration 28
Tests: Divisions API, Products API, Search, Filtering, Brochure Download
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestDivisionsAPI:
    """Test /api/divisions endpoint"""
    
    def test_divisions_returns_13_divisions(self):
        """Verify 13 divisions are returned"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        assert "divisions" in data
        assert len(data["divisions"]) == 13, f"Expected 13 divisions, got {len(data['divisions'])}"
        print(f"PASS: 13 divisions returned")
    
    def test_divisions_total_product_count(self):
        """Verify total product count is 967"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        total = sum(d["product_count"] for d in data["divisions"])
        assert total == 967, f"Expected 967 total products, got {total}"
        print(f"PASS: Total product count is 967")
    
    def test_divisions_have_required_fields(self):
        """Verify each division has name, categories, product_count"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        for div in data["divisions"]:
            assert "name" in div, f"Division missing 'name' field"
            assert "categories" in div, f"Division {div.get('name')} missing 'categories'"
            assert "product_count" in div, f"Division {div.get('name')} missing 'product_count'"
        print(f"PASS: All divisions have required fields")
    
    def test_trauma_division_count(self):
        """Verify Trauma division has 218 products"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        trauma = next((d for d in data["divisions"] if d["name"] == "Trauma"), None)
        assert trauma is not None, "Trauma division not found"
        assert trauma["product_count"] == 218, f"Expected 218 Trauma products, got {trauma['product_count']}"
        print(f"PASS: Trauma division has 218 products")
    
    def test_joint_replacement_division_count(self):
        """Verify Joint Replacement division has 112 products"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        jr = next((d for d in data["divisions"] if d["name"] == "Joint Replacement"), None)
        assert jr is not None, "Joint Replacement division not found"
        assert jr["product_count"] == 112, f"Expected 112 Joint Replacement products, got {jr['product_count']}"
        print(f"PASS: Joint Replacement division has 112 products")
    
    def test_cardiovascular_division_count(self):
        """Verify Cardiovascular division has 60 products"""
        response = requests.get(f"{BASE_URL}/api/divisions")
        assert response.status_code == 200
        data = response.json()
        cv = next((d for d in data["divisions"] if d["name"] == "Cardiovascular"), None)
        assert cv is not None, "Cardiovascular division not found"
        assert cv["product_count"] == 60, f"Expected 60 Cardiovascular products, got {cv['product_count']}"
        print(f"PASS: Cardiovascular division has 60 products")


class TestProductsAPI:
    """Test /api/products endpoint"""
    
    def test_products_returns_967_total(self):
        """Verify total products is 967"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 967, f"Expected 967 total products, got {data['total']}"
        print(f"PASS: Total products is 967")
    
    def test_products_have_required_fields(self):
        """Verify products have division and category fields"""
        response = requests.get(f"{BASE_URL}/api/products?limit=10")
        assert response.status_code == 200
        data = response.json()
        for p in data["products"]:
            assert "division" in p, f"Product {p.get('product_name')} missing 'division'"
            assert "category" in p, f"Product {p.get('product_name')} missing 'category'"
            assert "id" in p, f"Product {p.get('product_name')} missing 'id'"
            assert "product_name" in p, f"Product missing 'product_name'"
        print(f"PASS: Products have required fields")
    
    def test_products_pagination(self):
        """Verify pagination works correctly"""
        response = requests.get(f"{BASE_URL}/api/products?page=1&limit=20")
        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 1
        assert len(data["products"]) == 20
        assert data["pages"] > 1
        print(f"PASS: Pagination works correctly")


class TestProductSearch:
    """Test product search functionality"""
    
    def test_search_variabilis_returns_78_products(self):
        """Verify searching 'variabilis' returns 78 products"""
        response = requests.get(f"{BASE_URL}/api/products?search=variabilis&limit=100")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 78, f"Expected 78 Variabilis products, got {data['total']}"
        print(f"PASS: Variabilis search returns 78 products")
    
    def test_variabilis_products_have_brochure(self):
        """Verify Variabilis products have brochure field"""
        response = requests.get(f"{BASE_URL}/api/products?search=variabilis&limit=10")
        assert response.status_code == 200
        data = response.json()
        for p in data["products"]:
            # Check for either brochure or brochure_url field
            has_brochure = p.get("brochure") or p.get("brochure_url")
            assert has_brochure, f"Product {p.get('product_name')} missing brochure"
        print(f"PASS: Variabilis products have brochure field")
    
    def test_search_by_sku(self):
        """Verify search works with SKU codes"""
        response = requests.get(f"{BASE_URL}/api/products?search=MT-ST0224010")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1, "SKU search should return at least 1 product"
        print(f"PASS: SKU search works")


class TestProductFiltering:
    """Test product filtering by division"""
    
    def test_filter_trauma_returns_218(self):
        """Verify filtering by Trauma returns 218 products"""
        response = requests.get(f"{BASE_URL}/api/products?division=Trauma")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 218, f"Expected 218 Trauma products, got {data['total']}"
        print(f"PASS: Trauma filter returns 218 products")
    
    def test_filter_joint_replacement_returns_112(self):
        """Verify filtering by Joint Replacement returns 112 products"""
        response = requests.get(f"{BASE_URL}/api/products?division=Joint+Replacement")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 112, f"Expected 112 Joint Replacement products, got {data['total']}"
        print(f"PASS: Joint Replacement filter returns 112 products")
    
    def test_filter_cardiovascular_returns_60(self):
        """Verify filtering by Cardiovascular returns 60 products"""
        response = requests.get(f"{BASE_URL}/api/products?division=Cardiovascular")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 60, f"Expected 60 Cardiovascular products, got {data['total']}"
        print(f"PASS: Cardiovascular filter returns 60 products")


class TestProductDetail:
    """Test product detail endpoint"""
    
    def test_get_variabilis_product_detail(self):
        """Verify product detail works for Variabilis product"""
        # First get a Variabilis product ID
        response = requests.get(f"{BASE_URL}/api/products?search=variabilis&limit=1")
        assert response.status_code == 200
        data = response.json()
        assert len(data["products"]) > 0, "No Variabilis products found"
        
        product_id = data["products"][0]["id"]
        
        # Get product detail
        detail_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert detail_response.status_code == 200
        product = detail_response.json()
        
        assert "product_name" in product
        assert "division" in product
        assert "category" in product
        assert "Variabilis" in product["product_name"]
        print(f"PASS: Product detail works for Variabilis product")
    
    def test_invalid_product_id_returns_400(self):
        """Verify invalid product ID returns 400"""
        response = requests.get(f"{BASE_URL}/api/products/invalid-id")
        assert response.status_code == 400
        print(f"PASS: Invalid product ID returns 400")
    
    def test_nonexistent_product_returns_404(self):
        """Verify nonexistent product returns 404"""
        response = requests.get(f"{BASE_URL}/api/products/000000000000000000000000")
        assert response.status_code == 404
        print(f"PASS: Nonexistent product returns 404")


class TestBrochureDownload:
    """Test brochure download endpoint"""
    
    def test_brochure_download_requires_name_and_phone(self):
        """Verify brochure download requires name and phone"""
        # Get a Variabilis product with brochure
        response = requests.get(f"{BASE_URL}/api/products?search=variabilis&limit=1")
        product_id = response.json()["products"][0]["id"]
        
        # Try without name
        res = requests.post(f"{BASE_URL}/api/brochure-download", json={
            "phone": "9876543210",
            "product_id": product_id
        })
        assert res.status_code == 400
        
        # Try without phone
        res = requests.post(f"{BASE_URL}/api/brochure-download", json={
            "name": "Test User",
            "product_id": product_id
        })
        assert res.status_code == 400
        print(f"PASS: Brochure download requires name and phone")
    
    def test_brochure_download_with_valid_data(self):
        """Verify brochure download works with valid data"""
        # Get a Variabilis product with brochure
        response = requests.get(f"{BASE_URL}/api/products?search=variabilis&limit=1")
        product_id = response.json()["products"][0]["id"]
        
        res = requests.post(f"{BASE_URL}/api/brochure-download", json={
            "name": "TEST_BrochureUser",
            "phone": "9876543210",
            "product_id": product_id
        })
        assert res.status_code == 200
        data = res.json()
        assert "download_url" in data
        assert "product_name" in data
        print(f"PASS: Brochure download works with valid data")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
