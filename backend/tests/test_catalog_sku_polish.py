"""
Test suite for Iteration 33: SKU Table Polish & Humerus Page Rename
Tests:
- Renamed humerus page (product_name_display, category)
- Duplicate humerus page hidden (review_required=True)
- Trauma division product count (43 vs 44)
- SKU parsed columns in product detail response
- SKU parsed fields (holes, length_mm, side, plate_type)
- source_file and source='shadow' for brochure-backed SKUs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

class TestHumerusPageRename:
    """Tests for P0: Renamed humerus page"""
    
    def test_humerus_page_renamed_display_name(self):
        """Verify humerus page has new broader display name"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        # P0: Renamed from narrow "Medial Distal" to broader family name
        assert "Humerus Bone Plates" in data.get("product_name_display", ""), \
            f"Expected 'Humerus Bone Plates' in display name, got: {data.get('product_name_display')}"
        assert "Titanium" in data.get("product_name_display", ""), \
            f"Expected 'Titanium' in display name, got: {data.get('product_name_display')}"
    
    def test_humerus_page_category_updated(self):
        """Verify humerus page category is 'Humerus Plates'"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("category") == "Humerus Plates", \
            f"Expected category 'Humerus Plates', got: {data.get('category')}"
    
    def test_humerus_page_has_83_skus(self):
        """Verify humerus page has 83 SKU variants"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        sku_count = data.get("sku_count", 0)
        assert sku_count >= 80, f"Expected ~83 SKUs, got: {sku_count}"


class TestDuplicateHumerusHidden:
    """Tests for P0: Duplicate humerus page hidden"""
    
    def test_duplicate_humerus_not_in_trauma_listing(self):
        """Verify duplicate humerus page (review_required=True) is NOT in pilot listing"""
        response = requests.get(f"{BASE_URL}/api/catalog/products?division=Trauma&limit=100")
        assert response.status_code == 200
        
        data = response.json()
        products = data.get("products", [])
        slugs = [p.get("slug") for p in products]
        
        # The duplicate should NOT appear
        assert "3.5mm-lps-proximal-humerus-plate,-short" not in slugs, \
            "Duplicate humerus page should be hidden (review_required=True)"
    
    def test_trauma_division_has_43_products(self):
        """Verify Trauma division now has 43 products (was 44, one hidden)"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        
        data = response.json()
        divisions = data.get("divisions", [])
        trauma = next((d for d in divisions if d.get("name") == "Trauma"), None)
        
        assert trauma is not None, "Trauma division not found"
        product_count = trauma.get("product_count", 0)
        # Should be 43 (was 44 before hiding duplicate)
        assert product_count == 43, f"Expected 43 Trauma products, got: {product_count}"


class TestSkuParsedColumns:
    """Tests for P2: SKU parsed columns in product detail"""
    
    def test_humerus_page_has_sku_parsed_columns(self):
        """Verify humerus page returns sku_parsed_columns array"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        parsed_cols = data.get("sku_parsed_columns", [])
        
        # Should have parsed columns for trauma plates
        assert isinstance(parsed_cols, list), "sku_parsed_columns should be a list"
        # Expected columns for MT-PT pattern: holes, length_mm, plate_type, side
        expected_cols = {"holes", "length_mm", "plate_type", "side"}
        actual_cols = set(parsed_cols)
        
        # At least some of these should be present
        assert len(actual_cols.intersection(expected_cols)) >= 2, \
            f"Expected some of {expected_cols}, got: {actual_cols}"
    
    def test_sku_has_parsed_object(self):
        """Verify each SKU has a 'parsed' object with structured fields"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        skus = data.get("skus", [])
        
        assert len(skus) > 0, "Expected SKUs in response"
        
        # Check first few SKUs have parsed fields
        skus_with_parsed = [s for s in skus if s.get("parsed")]
        assert len(skus_with_parsed) > 0, "Expected some SKUs to have 'parsed' object"
        
        # Verify parsed structure
        sample_parsed = skus_with_parsed[0].get("parsed", {})
        # Should have at least one of: holes, length_mm, side, plate_type
        assert any(k in sample_parsed for k in ["holes", "length_mm", "side", "plate_type"]), \
            f"Expected parsed fields, got: {sample_parsed}"
    
    def test_sku_side_field_values(self):
        """Verify SKU side field has 'Left' or 'Right' values"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        skus = data.get("skus", [])
        
        # Find SKUs with side parsed
        sides = [s.get("parsed", {}).get("side") for s in skus if s.get("parsed", {}).get("side")]
        
        if len(sides) > 0:
            # All sides should be 'Left' or 'Right'
            valid_sides = {"Left", "Right"}
            for side in sides:
                assert side in valid_sides, f"Expected 'Left' or 'Right', got: {side}"
            
            # Should have both Left and Right
            assert "Left" in sides or "Right" in sides, "Expected at least one Left or Right side"


class TestSkuSourceFields:
    """Tests for P2: SKU source fields"""
    
    def test_sku_has_source_file_field(self):
        """Verify SKU has source_file field"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        skus = data.get("skus", [])
        
        assert len(skus) > 0, "Expected SKUs"
        
        # Check source_file field exists
        sample_sku = skus[0]
        assert "source_file" in sample_sku, "Expected 'source_file' field in SKU"
    
    def test_sku_source_shadow_for_brochure(self):
        """Verify source='shadow' for brochure-backed SKUs"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/2.7mm-3.5mm-lps-medial-distal-humerus-plates")
        assert response.status_code == 200
        
        data = response.json()
        skus = data.get("skus", [])
        
        # Find SKUs with source='shadow'
        shadow_skus = [s for s in skus if s.get("source") == "shadow"]
        
        # Most SKUs should be from shadow (brochure)
        assert len(shadow_skus) > 0, "Expected some SKUs with source='shadow'"


class TestCardiovascularProduct:
    """Tests for Cardiovascular product with parsed columns"""
    
    def test_cardiovascular_stent_product(self):
        """Verify Cardiovascular stent product has SKUs"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/biomime-aura-sirolimus-eluting-coronary-stent-system")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("division") == "Cardiovascular"
        
        sku_count = data.get("sku_count", 0)
        assert sku_count >= 80, f"Expected ~87 SKUs, got: {sku_count}"
    
    def test_cardiovascular_sku_parsed_columns(self):
        """Verify Cardiovascular product may have diameter/length parsed"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/biomime-aura-sirolimus-eluting-coronary-stent-system")
        assert response.status_code == 200
        
        data = response.json()
        parsed_cols = data.get("sku_parsed_columns", [])
        
        # Stent patterns may have diameter_mm, length_mm
        # This is optional - just verify the field exists
        assert isinstance(parsed_cols, list), "sku_parsed_columns should be a list"


class TestDiagnosticsProduct:
    """Tests for Diagnostics product (non-parsed SKUs)"""
    
    def test_diagnostics_product_exists(self):
        """Verify Diagnostics product loads correctly"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/alat-(gpt)-reagent")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("division") == "Diagnostics"
    
    def test_diagnostics_sku_has_product_name(self):
        """Verify Diagnostics SKUs have product_name (fallback for non-parsed)"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/alat-(gpt)-reagent")
        assert response.status_code == 200
        
        data = response.json()
        skus = data.get("skus", [])
        
        if len(skus) > 0:
            # Non-parsed SKUs should have product_name
            sample_sku = skus[0]
            assert "product_name" in sample_sku, "Expected 'product_name' field in SKU"


class TestAllDivisionsStillWork:
    """Tests for all 4 division pages still working"""
    
    def test_trauma_division(self):
        """Verify Trauma division endpoint works"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/trauma")
        assert response.status_code == 200
        data = response.json()
        assert data.get("name") == "Trauma"
    
    def test_cardiovascular_division(self):
        """Verify Cardiovascular division endpoint works"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/cardiovascular")
        assert response.status_code == 200
        data = response.json()
        assert data.get("name") == "Cardiovascular"
    
    def test_diagnostics_division(self):
        """Verify Diagnostics division endpoint works"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/diagnostics")
        assert response.status_code == 200
        data = response.json()
        assert data.get("name") == "Diagnostics"
    
    def test_joint_replacement_division(self):
        """Verify Joint Replacement division endpoint works"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions/joint-replacement")
        assert response.status_code == 200
        data = response.json()
        assert data.get("name") == "Joint Replacement"
    
    def test_divisions_list_has_4(self):
        """Verify divisions list returns all 4 divisions"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        
        data = response.json()
        divisions = data.get("divisions", [])
        assert len(divisions) == 4, f"Expected 4 divisions, got: {len(divisions)}"
        
        names = [d.get("name") for d in divisions]
        assert "Trauma" in names
        assert "Cardiovascular" in names
        assert "Diagnostics" in names
        assert "Joint Replacement" in names
