"""
Phase 5C: Split Shared-SKU Pools - Backend API Tests
=====================================================
Tests for:
- DOA drug test SKU split (Amphetamine, Cocaine, Multi Drug)
- MBOSS screw promotion to high confidence
- Compatible Components for AURIC plate and PFRN nail
- Non-enriched products return empty related buckets
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestDOASKUSplit:
    """Tests for DOA drug test SKU split - 7 products now have individual SKU sets"""
    
    def test_doa_amphetamine_sku_count(self):
        """DOA Amphetamine should have ~28 SKUs (not 80 shared)"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "amphetamine"})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1, "Should find at least 1 Amphetamine product"
        
        # Find the Amphetamine product
        amp_product = None
        for p in data["products"]:
            if "amphetamine" in p["product_name_display"].lower():
                amp_product = p
                break
        
        assert amp_product is not None, "Amphetamine product not found"
        assert amp_product["shadow_sku_count"] == 28, f"Expected 28 SKUs, got {amp_product['shadow_sku_count']}"
    
    def test_doa_cocaine_sku_count(self):
        """DOA Cocaine should have ~14 SKUs"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "cocaine"})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1, "Should find at least 1 Cocaine product"
        
        coc_product = None
        for p in data["products"]:
            if "cocaine" in p["product_name_display"].lower():
                coc_product = p
                break
        
        assert coc_product is not None, "Cocaine product not found"
        assert coc_product["shadow_sku_count"] == 14, f"Expected 14 SKUs, got {coc_product['shadow_sku_count']}"
    
    def test_doa_multi_drug_sku_count(self):
        """DOA Multi Drug Rapid Test should have 243 SKUs"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "multi drug"})
        assert response.status_code == 200
        data = response.json()
        
        multi_product = None
        for p in data["products"]:
            if "multi drug rapid test" in p["product_name_display"].lower():
                multi_product = p
                break
        
        assert multi_product is not None, "Multi Drug Rapid Test product not found"
        assert multi_product["shadow_sku_count"] == 243, f"Expected 243 SKUs, got {multi_product['shadow_sku_count']}"
    
    def test_doa_amphetamine_skus_are_drug_specific(self):
        """Amphetamine page should only show AMP-related SKUs"""
        slug = "meriscreen-drug-of-abuse-(doa)-rapid-test---amphetamine-1000ng-ml"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
        assert response.status_code == 200
        data = response.json()
        
        assert data["sku_count"] == 28, f"Expected 28 SKUs, got {data['sku_count']}"
        
        # Verify all SKUs are AMP-related
        for sku in data["skus"]:
            sku_code = sku.get("sku_code", "").upper()
            assert "AMP" in sku_code, f"SKU {sku_code} is not AMP-related"


class TestMBOSSPromotion:
    """Tests for MBOSS screw products promoted to high confidence"""
    
    def test_mboss_screws_in_auric_plate_compatible_components(self):
        """AURIC plate should show 5 MBOSS screws in Compatible Components"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}/related")
        assert response.status_code == 200
        data = response.json()
        
        compatible = data.get("compatible_components", [])
        assert len(compatible) >= 5, f"Expected at least 5 compatible components, got {len(compatible)}"
        
        # Check for specific MBOSS screws
        mboss_names = [c["product_name_display"] for c in compatible]
        expected_screws = [
            "2.4mm Locking Screw",
            "2.7mm Cortex Screw",
            "3.5mm Locking Screw",
            "4.0mm Cancellous Screw",
            "MBOSS Screw System"
        ]
        
        for expected in expected_screws:
            found = any(expected.lower() in name.lower() for name in mboss_names)
            assert found, f"Expected to find '{expected}' in compatible components"
        
        # Verify relationship labels
        for comp in compatible:
            assert comp.get("relationship_label") == "Compatible Screw", \
                f"Expected 'Compatible Screw' label, got {comp.get('relationship_label')}"
    
    def test_mboss_screws_in_pfrn_nail_compatible_components(self):
        """PFRN nail should also show MBOSS screws in Compatible Components"""
        slug = "clavo-pfrn-proximal-femoral-rotational-stability-nail"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}/related")
        assert response.status_code == 200
        data = response.json()
        
        compatible = data.get("compatible_components", [])
        assert len(compatible) >= 5, f"Expected at least 5 compatible components, got {len(compatible)}"
        
        # Check for MBOSS screws
        mboss_found = sum(1 for c in compatible if "mboss" in c["product_name_display"].lower() or "screw" in c["product_name_display"].lower())
        assert mboss_found >= 5, f"Expected at least 5 MBOSS screws, found {mboss_found}"


class TestNonEnrichedProducts:
    """Tests for non-enriched products returning empty related buckets"""
    
    def test_non_enriched_product_empty_buckets(self):
        """Non-enriched products should return empty related buckets"""
        slug = "biomime-aura-sirolimus-eluting-coronary-stent-system"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}/related")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data.get("compatible_components", [])) == 0, "Expected empty compatible_components"
        assert len(data.get("same_family_alternatives", [])) == 0, "Expected empty same_family_alternatives"
        assert len(data.get("related_system_products", [])) == 0, "Expected empty related_system_products"


class TestRelatedProductsBadges:
    """Tests for relationship labels in related products"""
    
    def test_compatible_components_have_correct_labels(self):
        """Compatible Components should have 'Compatible Screw' badges"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}/related")
        assert response.status_code == 200
        data = response.json()
        
        for comp in data.get("compatible_components", []):
            assert "relationship_label" in comp, "Missing relationship_label field"
            assert comp["relationship_label"] in ["Compatible Screw", "Compatible Component", "Used With Plate/Nail System"], \
                f"Unexpected label: {comp['relationship_label']}"
    
    def test_same_family_alternatives_have_correct_labels(self):
        """Same Family Alternatives should have amber badges"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}/related")
        assert response.status_code == 200
        data = response.json()
        
        for alt in data.get("same_family_alternatives", []):
            assert "relationship_label" in alt, "Missing relationship_label field"
            assert alt["relationship_label"] in ["Coated Variant", "Same Family Alternative", "Alternative System", "Same Category"], \
                f"Unexpected label: {alt['relationship_label']}"


class TestCatalogNavigation:
    """Tests for catalog navigation and division pages"""
    
    def test_portfolio_divisions_endpoint(self):
        """Portfolio nav link - divisions endpoint should work"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        data = response.json()
        
        assert "divisions" in data
        assert len(data["divisions"]) >= 4, "Expected at least 4 divisions"
        
        division_names = [d["name"] for d in data["divisions"]]
        assert "Trauma" in division_names
        assert "Diagnostics" in division_names
    
    def test_trauma_division_page(self):
        """Trauma division page should load with correct product list"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/trauma")
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "Trauma"
        assert data["product_count"] > 0, "Trauma division should have products"
    
    def test_diagnostics_division_has_doa_products(self):
        """Diagnostics division should include DOA products"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Diagnostics", "limit": 100})
        assert response.status_code == 200
        data = response.json()
        
        assert data["total"] > 0, "Diagnostics should have products"
        
        # Check for DOA products - search for "abuse" which is in "Drug of Abuse"
        doa_found = any("abuse" in p["product_name_display"].lower() or "doa" in p["product_name_display"].lower() 
                       for p in data["products"])
        assert doa_found, "DOA products should be in Diagnostics division"


class TestAdminAuth:
    """Tests for admin authentication"""
    
    def test_admin_login_with_correct_password(self):
        """Admin login with password 'kOpcELYcEvkVtyDAE5-2uw' should work"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "kOpcELYcEvkVtyDAE5-2uw"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "token" in data, "Should return token"
        assert data.get("role") in ["admin", "super_admin"], f"Should return admin/super_admin role, got {data.get('role')}"
    
    def test_admin_login_with_wrong_password(self):
        """Admin login with wrong password should fail"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "wrong-password"
        })
        assert response.status_code == 401


@pytest.fixture(scope="session", autouse=True)
def check_base_url():
    """Ensure BASE_URL is set"""
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL not set")
