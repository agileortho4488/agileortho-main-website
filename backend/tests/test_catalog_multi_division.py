"""
Test suite for Catalog Multi-Division Expansion (Iteration 32)
Tests the expansion from Trauma-only to 4 divisions:
- Trauma (existing)
- Cardiovascular (new)
- Diagnostics (new)
- Joint Replacement (new)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestCatalogDivisionsEndpoint:
    """Test GET /api/catalog/divisions returns all 4 divisions"""
    
    def test_divisions_returns_all_four(self):
        """Verify all 4 divisions are returned with correct metadata"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "divisions" in data
        divisions = data["divisions"]
        
        # Should have exactly 4 divisions
        assert len(divisions) == 4, f"Expected 4 divisions, got {len(divisions)}"
        
        # Extract division names
        div_names = [d["name"] for d in divisions]
        assert "Trauma" in div_names
        assert "Cardiovascular" in div_names
        assert "Diagnostics" in div_names
        assert "Joint Replacement" in div_names
    
    def test_trauma_division_metadata(self):
        """Verify Trauma division has correct slug, icon, color"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        data = response.json()
        
        trauma = next((d for d in data["divisions"] if d["name"] == "Trauma"), None)
        assert trauma is not None
        assert trauma["slug"] == "trauma"
        assert trauma["icon"] == "bone"
        assert trauma["color"] == "amber"
        assert trauma["product_count"] >= 44, f"Expected >=44 Trauma products, got {trauma['product_count']}"
        assert isinstance(trauma["categories"], list)
        assert isinstance(trauma["brands"], list)
    
    def test_cardiovascular_division_metadata(self):
        """Verify Cardiovascular division has correct slug, icon, color"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        data = response.json()
        
        cardio = next((d for d in data["divisions"] if d["name"] == "Cardiovascular"), None)
        assert cardio is not None
        assert cardio["slug"] == "cardiovascular"
        assert cardio["icon"] == "heart-pulse"
        assert cardio["color"] == "rose"
        assert cardio["product_count"] == 8, f"Expected 8 Cardiovascular products, got {cardio['product_count']}"
    
    def test_diagnostics_division_metadata(self):
        """Verify Diagnostics division has correct slug, icon, color"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        data = response.json()
        
        diag = next((d for d in data["divisions"] if d["name"] == "Diagnostics"), None)
        assert diag is not None
        assert diag["slug"] == "diagnostics"
        assert diag["icon"] == "microscope"
        assert diag["color"] == "violet"
        assert diag["product_count"] == 63, f"Expected 63 Diagnostics products, got {diag['product_count']}"
    
    def test_joint_replacement_division_metadata(self):
        """Verify Joint Replacement division has correct slug, icon, color"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        data = response.json()
        
        jr = next((d for d in data["divisions"] if d["name"] == "Joint Replacement"), None)
        assert jr is not None
        assert jr["slug"] == "joint-replacement"
        assert jr["icon"] == "activity"
        assert jr["color"] == "teal"
        assert jr["product_count"] == 7, f"Expected 7 Joint Replacement products, got {jr['product_count']}"


class TestCatalogDivisionDetailEndpoint:
    """Test GET /api/catalog/divisions/{slug} for each division"""
    
    def test_cardiovascular_division_detail(self):
        """GET /api/catalog/divisions/cardiovascular returns correct data"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/cardiovascular")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Cardiovascular"
        assert data["slug"] == "cardiovascular"
        assert data["icon"] == "heart-pulse"
        assert data["color"] == "rose"
        assert data["product_count"] == 8
        assert isinstance(data["categories"], list)
        assert isinstance(data["brands"], list)
    
    def test_diagnostics_division_detail(self):
        """GET /api/catalog/divisions/diagnostics returns correct data"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/diagnostics")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Diagnostics"
        assert data["slug"] == "diagnostics"
        assert data["icon"] == "microscope"
        assert data["color"] == "violet"
        assert data["product_count"] == 63
    
    def test_joint_replacement_division_detail(self):
        """GET /api/catalog/divisions/joint-replacement returns correct data"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/joint-replacement")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Joint Replacement"
        assert data["slug"] == "joint-replacement"
        assert data["icon"] == "activity"
        assert data["color"] == "teal"
        assert data["product_count"] == 7
    
    def test_trauma_division_detail_backward_compat(self):
        """GET /api/catalog/divisions/trauma still works (backward compatibility)"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/trauma")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Trauma"
        assert data["slug"] == "trauma"
        assert data["icon"] == "bone"
        assert data["color"] == "amber"
    
    def test_invalid_division_returns_404(self):
        """GET /api/catalog/divisions/invalid returns 404"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/invalid-division")
        assert response.status_code == 404


class TestCatalogProductsByDivision:
    """Test GET /api/catalog/products?division={Division} for each division"""
    
    def test_cardiovascular_products(self):
        """GET /api/catalog/products?division=Cardiovascular returns 8 products"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Cardiovascular"})
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 8, f"Expected 8 Cardiovascular products, got {data['total']}"
        
        # Verify all products have correct division_slug
        for product in data["products"]:
            assert product["division_slug"] == "cardiovascular", f"Product {product['slug']} has wrong division_slug: {product['division_slug']}"
            assert product["division"] == "Cardiovascular"
    
    def test_diagnostics_products(self):
        """GET /api/catalog/products?division=Diagnostics returns 63 products"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Diagnostics", "limit": 100})
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 63, f"Expected 63 Diagnostics products, got {data['total']}"
        
        # Verify first page products have correct division_slug
        for product in data["products"]:
            assert product["division_slug"] == "diagnostics"
            assert product["division"] == "Diagnostics"
    
    def test_joint_replacement_products(self):
        """GET /api/catalog/products?division=Joint Replacement returns 7 products"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Joint Replacement"})
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 7, f"Expected 7 Joint Replacement products, got {data['total']}"
        
        for product in data["products"]:
            assert product["division_slug"] == "joint-replacement"
            assert product["division"] == "Joint Replacement"
    
    def test_trauma_products_backward_compat(self):
        """GET /api/catalog/products?division=Trauma still works"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma"})
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] >= 44, f"Expected >=44 Trauma products, got {data['total']}"
        
        for product in data["products"]:
            assert product["division_slug"] == "trauma"


class TestCatalogProductDetailByDivision:
    """Test GET /api/catalog/products/{slug} for products from each division"""
    
    def test_cardiovascular_product_detail(self):
        """Cardiovascular product has correct division_slug, SKUs, P0/P1 fields"""
        # biomime-aura-sirolimus-eluting-coronary-stent-system has 87 SKUs
        response = requests.get(f"{BASE_URL}/api/catalog/products/biomime-aura-sirolimus-eluting-coronary-stent-system")
        assert response.status_code == 200
        
        data = response.json()
        assert data["division"] == "Cardiovascular"
        assert data["division_slug"] == "cardiovascular"
        assert "image_type" in data  # P0 field
        assert "parent_brand" in data  # P1 field
        assert "skus" in data
        assert len(data["skus"]) == 87, f"Expected 87 SKUs, got {len(data['skus'])}"
        
        # Verify normalized specs (P0)
        if data.get("technical_specifications"):
            for key in data["technical_specifications"].keys():
                assert key[0].isupper(), f"Spec key '{key}' should be title-cased"
    
    def test_diagnostics_product_detail(self):
        """Diagnostics product has correct division_slug"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/alat-(gpt)-reagent")
        assert response.status_code == 200
        
        data = response.json()
        assert data["division"] == "Diagnostics"
        assert data["division_slug"] == "diagnostics"
        assert "image_type" in data
        assert "parent_brand" in data
    
    def test_joint_replacement_product_detail(self):
        """Joint Replacement product has correct division_slug"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/destiknee-total-knee-replacement-system")
        assert response.status_code == 200
        
        data = response.json()
        assert data["division"] == "Joint Replacement"
        assert data["division_slug"] == "joint-replacement"
        assert "image_type" in data
        assert "parent_brand" in data
    
    def test_trauma_product_detail_backward_compat(self):
        """Trauma product detail still works"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.4mm-lps-volar-rim-distal-radial-plate")
        assert response.status_code == 200
        
        data = response.json()
        assert data["division"] == "Trauma"
        assert data["division_slug"] == "trauma"


class TestProductListP0P1Fields:
    """Verify P0/P1 fields are present in product list responses"""
    
    def test_product_list_has_image_type(self):
        """All products in list have image_type field"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"limit": 50})
        assert response.status_code == 200
        
        data = response.json()
        for product in data["products"]:
            assert "image_type" in product, f"Product {product['slug']} missing image_type"
            assert product["image_type"] in ["none", "brochure_cover", "product_photo"]
    
    def test_product_list_has_parent_brand(self):
        """All products in list have parent_brand field"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"limit": 50})
        assert response.status_code == 200
        
        data = response.json()
        for product in data["products"]:
            assert "parent_brand" in product, f"Product {product['slug']} missing parent_brand"
    
    def test_product_list_has_division_slug(self):
        """All products in list have division_slug field"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"limit": 50})
        assert response.status_code == 200
        
        data = response.json()
        for product in data["products"]:
            assert "division_slug" in product, f"Product {product['slug']} missing division_slug"
            assert product["division_slug"] in ["trauma", "cardiovascular", "diagnostics", "joint-replacement"]


class TestRelatedProductsDivisionSlug:
    """Verify related products have correct division_slug"""
    
    def test_cardiovascular_related_products(self):
        """Related products for Cardiovascular product have correct division_slug"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/biomime-aura-sirolimus-eluting-coronary-stent-system")
        assert response.status_code == 200
        
        data = response.json()
        related = data.get("related_products", [])
        for rp in related:
            assert "division_slug" in rp
            # Related products should be from same division
            assert rp["division_slug"] == "cardiovascular"
