"""
Test Product Families API - SKU-based product grouping
Tests the new product family endpoints that group products by SKU prefix
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestProductFamiliesAPI:
    """Test /api/product-families endpoint"""

    def test_list_product_families_returns_correct_total(self):
        """Should return ~646 product families"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"limit": 1})
        assert response.status_code == 200
        data = response.json()
        assert "families" in data
        assert "total" in data
        # Should be around 646 families (down from 967 individual products)
        assert data["total"] >= 600, f"Expected ~646 families, got {data['total']}"
        assert data["total"] <= 700, f"Expected ~646 families, got {data['total']}"

    def test_list_product_families_pagination(self):
        """Should paginate correctly"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"page": 1, "limit": 12})
        assert response.status_code == 200
        data = response.json()
        assert len(data["families"]) <= 12
        assert data["page"] == 1
        assert data["pages"] > 1

    def test_list_product_families_has_variant_count(self):
        """Each family should have variant_count field"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"limit": 20})
        assert response.status_code == 200
        data = response.json()
        for family in data["families"]:
            assert "variant_count" in family
            assert isinstance(family["variant_count"], int)
            assert family["variant_count"] >= 1


class TestProductFamiliesSearch:
    """Test search functionality for product families"""

    def test_search_variabilis_returns_6_families(self):
        """Search for 'variabilis' should return exactly 6 families"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"search": "variabilis"})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 6, f"Expected 6 Variabilis families, got {data['total']}"
        
        # Verify the expected family names
        family_names = [f["family_name"] for f in data["families"]]
        expected_families = [
            "Variabilis 2.4mm Cortex Screws",
            "Variabilis 2.4mm Distal Radial Plates",
            "Variabilis 2.4mm Locking Plate System Instrument Set",
            "Variabilis 2.4mm Locking Screws",
            "Variabilis 2.4mm Multi-Angle Locking Screws",
            "Variabilis 2.7mm Cortex Screws"
        ]
        for expected in expected_families:
            assert expected in family_names, f"Missing family: {expected}"


class TestProductFamiliesDivisionFilter:
    """Test division filtering for product families"""

    def test_trauma_division_returns_104_families(self):
        """Filtering by Trauma division should return 104 families"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"division": "Trauma", "limit": 200})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 104, f"Expected 104 Trauma families, got {data['total']}"

    def test_joint_replacement_division_filter(self):
        """Filtering by Joint Replacement division should work"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"division": "Joint Replacement"})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] > 0
        # All returned families should be from Joint Replacement
        for family in data["families"]:
            assert family["division"] == "Joint Replacement"


class TestProductFamilyDetail:
    """Test /api/product-families/:name endpoint"""

    def test_variabilis_distal_radial_plates_has_16_variants(self):
        """Variabilis 2.4mm Distal Radial Plates should have 16 variants"""
        family_name = "Variabilis 2.4mm Distal Radial Plates"
        response = requests.get(f"{BASE_URL}/api/product-families/{family_name}")
        assert response.status_code == 200
        data = response.json()
        
        assert "family" in data
        assert "variants" in data
        assert data["family"]["family_name"] == family_name
        assert data["family"]["variant_count"] == 16
        assert len(data["variants"]) == 16

    def test_variabilis_cortex_screws_has_13_variants(self):
        """Variabilis 2.4mm Cortex Screws should have 13 variants"""
        family_name = "Variabilis 2.4mm Cortex Screws"
        response = requests.get(f"{BASE_URL}/api/product-families/{family_name}")
        assert response.status_code == 200
        data = response.json()
        
        assert data["family"]["variant_count"] == 13
        assert len(data["variants"]) == 13

    def test_clavo_locking_bolts_has_28_variants(self):
        """CLAVO PFRN 4.9mm Locking Bolts should have 28 variants"""
        family_name = "CLAVO PFRN 4.9mm Locking Bolts"
        response = requests.get(f"{BASE_URL}/api/product-families/{family_name}")
        assert response.status_code == 200
        data = response.json()
        
        assert data["family"]["variant_count"] == 28
        assert len(data["variants"]) == 28

    def test_family_detail_has_technical_specifications(self):
        """Variants should have technical_specifications with side/specification"""
        family_name = "Variabilis 2.4mm Distal Radial Plates"
        response = requests.get(f"{BASE_URL}/api/product-families/{family_name}")
        assert response.status_code == 200
        data = response.json()
        
        # Check that variants have technical_specifications
        for variant in data["variants"]:
            assert "technical_specifications" in variant
            specs = variant["technical_specifications"]
            # Variabilis plates should have side and specification
            if specs:
                assert "side" in specs or "specification" in specs, f"Missing side/specification in {variant['sku_code']}"

    def test_family_detail_has_brochure_when_available(self):
        """Family should have brochure field when available"""
        family_name = "Variabilis 2.4mm Distal Radial Plates"
        response = requests.get(f"{BASE_URL}/api/product-families/{family_name}")
        assert response.status_code == 200
        data = response.json()
        
        # Variabilis products have brochures
        assert "brochure" in data["family"]
        assert data["family"]["brochure"], "Brochure should not be empty for Variabilis"

    def test_family_detail_variants_have_required_fields(self):
        """Each variant should have id, product_name, sku_code"""
        family_name = "Variabilis 2.4mm Cortex Screws"
        response = requests.get(f"{BASE_URL}/api/product-families/{family_name}")
        assert response.status_code == 200
        data = response.json()
        
        for variant in data["variants"]:
            assert "id" in variant
            assert "product_name" in variant
            assert "sku_code" in variant
            assert variant["id"], "Variant ID should not be empty"
            assert variant["sku_code"], "SKU code should not be empty"

    def test_nonexistent_family_returns_404(self):
        """Non-existent family should return 404"""
        response = requests.get(f"{BASE_URL}/api/product-families/NonExistentFamily12345")
        assert response.status_code == 404


class TestProductFamilyStructure:
    """Test the structure of product family responses"""

    def test_family_list_has_required_fields(self):
        """Each family in list should have required fields"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"limit": 10})
        assert response.status_code == 200
        data = response.json()
        
        required_fields = ["id", "family_name", "division", "category", "variant_count"]
        for family in data["families"]:
            for field in required_fields:
                assert field in family, f"Missing field: {field}"

    def test_multi_variant_families_exist(self):
        """Should have families with multiple variants"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"limit": 100})
        assert response.status_code == 200
        data = response.json()
        
        multi_variant_families = [f for f in data["families"] if f["variant_count"] > 1]
        assert len(multi_variant_families) > 0, "Should have families with multiple variants"

    def test_single_variant_families_exist(self):
        """Should have families with single variant (unique products)"""
        response = requests.get(f"{BASE_URL}/api/product-families", params={"limit": 100})
        assert response.status_code == 200
        data = response.json()
        
        single_variant_families = [f for f in data["families"] if f["variant_count"] == 1]
        assert len(single_variant_families) > 0, "Should have single-variant families"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
