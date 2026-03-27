"""
Phase 5B: Relationship Graph API + Related Products Tests
Tests for:
- GET /api/catalog/products/{slug}/related endpoint
- 3 buckets: compatible_components, same_family_alternatives, related_system_products
- relationship_label field on each related item
- Admin password change verification
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestRelatedProductsAPI:
    """Tests for the /api/catalog/products/{slug}/related endpoint"""
    
    def test_auric_product_returns_mboss_screws_in_compatible_components(self):
        """AURIC plate should return MBOSS screws in compatible_components bucket"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.4mm-lps-distal-radial-volar-buttress-plate/related")
        assert response.status_code == 200
        
        data = response.json()
        # Verify 3 buckets exist
        assert "compatible_components" in data
        assert "same_family_alternatives" in data
        assert "related_system_products" in data
        
        # Verify MBOSS screws in compatible_components
        compatible = data["compatible_components"]
        assert len(compatible) > 0, "Should have compatible components"
        
        # Check for MBOSS products
        mboss_products = [p for p in compatible if "mboss" in p["slug"].lower()]
        assert len(mboss_products) > 0, "Should have MBOSS screw products"
        
        # Verify relationship_label field
        for item in compatible:
            assert "relationship_label" in item, "Each item should have relationship_label"
            assert item["relationship_label"] == "Compatible Screw"
    
    def test_auric_product_returns_armar_in_same_family_alternatives(self):
        """AURIC plate should return ARMAR plates in same_family_alternatives bucket"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.4mm-lps-distal-radial-volar-buttress-plate/related")
        assert response.status_code == 200
        
        data = response.json()
        alternatives = data["same_family_alternatives"]
        
        # Check for ARMAR products
        armar_products = [p for p in alternatives if "armar" in p["slug"].lower()]
        assert len(armar_products) > 0, "Should have ARMAR plate alternatives"
        
        # Verify relationship_label
        for item in alternatives:
            assert "relationship_label" in item
            assert item["relationship_label"] in ["Coated Variant", "Same Family Alternative", "Alternative System", "Same Category"]
    
    def test_pfrn_nail_returns_mboss_screws(self):
        """PFRN nail should return MBOSS screws in compatible_components"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/pfrn-proximal-femoral-rotational-stability-nail/related")
        assert response.status_code == 200
        
        data = response.json()
        compatible = data["compatible_components"]
        
        # Check for MBOSS products
        mboss_products = [p for p in compatible if "mboss" in p["slug"].lower()]
        assert len(mboss_products) > 0, "PFRN nail should have MBOSS screw products"
    
    def test_mboss_screw_returns_plates_as_used_with(self):
        """MBOSS screw should return AURIC/ARMAR plates as 'Used With'"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/mboss-screw-system/related")
        assert response.status_code == 200
        
        data = response.json()
        compatible = data["compatible_components"]
        
        # Should have plates that use this screw
        assert len(compatible) > 0, "MBOSS should show products it's used with"
        
        # Check for AURIC or ARMAR products
        plate_products = [p for p in compatible if "auric" in p["slug"].lower() or "armar" in p["slug"].lower()]
        assert len(plate_products) > 0, "Should have AURIC/ARMAR plate products"
        
        # Verify relationship_label is "Used With Plate/Nail System"
        used_with_labels = [p for p in compatible if p.get("relationship_label") == "Used With Plate/Nail System"]
        assert len(used_with_labels) > 0, "Should have 'Used With Plate/Nail System' labels"
    
    def test_non_enriched_product_returns_empty_buckets(self):
        """Non-enriched product should return empty buckets"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/biomime-aura-sirolimus-eluting-coronary-stent-system/related")
        assert response.status_code == 200
        
        data = response.json()
        assert data["compatible_components"] == [], "Should have empty compatible_components"
        assert data["same_family_alternatives"] == [], "Should have empty same_family_alternatives"
        assert data["related_system_products"] == [], "Should have empty related_system_products"
    
    def test_related_item_has_required_fields(self):
        """Each related item should have required fields"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.4mm-lps-distal-radial-volar-buttress-plate/related")
        assert response.status_code == 200
        
        data = response.json()
        
        # Check first item in compatible_components
        if data["compatible_components"]:
            item = data["compatible_components"][0]
            assert "slug" in item
            assert "product_name_display" in item
            assert "relationship_label" in item
            assert "brand" in item
            assert "division" in item
    
    def test_related_endpoint_returns_404_for_nonexistent_product(self):
        """Related endpoint should return 404 for non-existent product"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/nonexistent-product-slug-12345/related")
        assert response.status_code == 404


class TestAdminPasswordChange:
    """Tests for admin password change from 'admin' to new secure password"""
    
    def test_admin_login_with_new_password_succeeds(self):
        """Admin login with new password should succeed"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"username": "admin", "password": "kOpcELYcEvkVtyDAE5-2uw"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "token" in data
        assert data.get("role") == "super_admin"
    
    def test_admin_login_with_old_password_fails(self):
        """Admin login with old default password 'admin' should fail"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"username": "admin", "password": "admin"}
        )
        assert response.status_code == 401
        
        data = response.json()
        assert "detail" in data
        assert "Invalid" in data["detail"] or "invalid" in data["detail"].lower()


class TestExistingCatalogEndpoints:
    """Verify existing catalog endpoints still work correctly"""
    
    def test_divisions_endpoint_works(self):
        """GET /api/catalog/divisions should return divisions"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        
        data = response.json()
        assert "divisions" in data
        assert len(data["divisions"]) >= 4
    
    def test_products_list_endpoint_works(self):
        """GET /api/catalog/products should return products"""
        response = requests.get(f"{BASE_URL}/api/catalog/products?division=Trauma")
        assert response.status_code == 200
        
        data = response.json()
        assert "products" in data
        assert "total" in data
    
    def test_product_detail_endpoint_works(self):
        """GET /api/catalog/products/{slug} should return product detail"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.4mm-lps-distal-radial-volar-buttress-plate")
        assert response.status_code == 200
        
        data = response.json()
        assert "product_name_display" in data
        assert "skus" in data
        assert "clinical_subtitle" in data
    
    def test_division_detail_endpoint_works(self):
        """GET /api/catalog/divisions/{slug} should return division detail"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/trauma")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Trauma"
        assert "product_count" in data
