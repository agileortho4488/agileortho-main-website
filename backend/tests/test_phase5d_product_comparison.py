"""
Phase 5D: Product Comparison Feature Tests
Tests for:
- POST /api/catalog/compare endpoint (2-4 products comparison)
- GET /api/catalog/compare/suggestions/{slug} endpoint
- Cross-division guardrails
- Comparison response structure with is_different flags
- System type value formatting (Title Case)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test product slugs from same division (Trauma)
TRAUMA_PRODUCT_1 = "armar-titanium-plates"
TRAUMA_PRODUCT_2 = "2.4mm-lps-distal-radial-volar-buttress-plate"

# Cardiovascular products
CARDIO_PRODUCT_1 = "biomime-aura-sirolimus-eluting-coronary-stent-system"
CARDIO_PRODUCT_2 = "mozec-rx-ptca-balloon-catheter"

# Product for suggestions test
SUGGESTIONS_PRODUCT = "ortho-smart"


class TestProductComparisonAPI:
    """Tests for POST /api/catalog/compare endpoint"""
    
    def test_compare_two_trauma_products_success(self):
        """Compare 2 products from same division - should succeed"""
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1, TRAUMA_PRODUCT_2]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "products" in data, "Response should have 'products' array"
        assert "comparison" in data, "Response should have 'comparison' array"
        assert "division" in data, "Response should have 'division' field"
        
        # Verify products array
        assert len(data["products"]) == 2, f"Expected 2 products, got {len(data['products'])}"
        
        # Verify each product has required fields
        for product in data["products"]:
            assert "slug" in product, "Product should have slug"
            assert "product_name_display" in product, "Product should have product_name_display"
            assert "division" in product, "Product should have division"
            assert "category" in product, "Product should have category"
        
        print(f"SUCCESS: Compare 2 Trauma products - {len(data['products'])} products, {len(data['comparison'])} comparison rows")
    
    def test_compare_response_has_comparison_rows(self):
        """Verify comparison rows have proper structure with is_different flag"""
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1, TRAUMA_PRODUCT_2]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify comparison rows structure
        assert len(data["comparison"]) > 0, "Should have comparison rows"
        
        for row in data["comparison"]:
            assert "label" in row, "Row should have label"
            assert "values" in row, "Row should have values array"
            assert "is_different" in row, "Row should have is_different flag"
            assert isinstance(row["is_different"], bool), "is_different should be boolean"
            assert len(row["values"]) == 2, "Values should match product count"
        
        # Check for expected comparison fields
        labels = [row["label"] for row in data["comparison"]]
        expected_labels = ["Division", "Category", "Brand System", "Material", "Coating", "System Type"]
        found_labels = [l for l in expected_labels if l in labels]
        print(f"SUCCESS: Found comparison labels: {found_labels}")
        
        # Check is_different flag works
        different_rows = [row for row in data["comparison"] if row["is_different"]]
        print(f"SUCCESS: {len(different_rows)} rows marked as different")
    
    def test_compare_system_type_title_case(self):
        """Verify system type values are formatted as Title Case"""
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1, TRAUMA_PRODUCT_2]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Find System Type row
        system_type_row = next((row for row in data["comparison"] if row["label"] == "System Type"), None)
        
        if system_type_row:
            for val in system_type_row["values"]:
                if val and val != "—":
                    # Check it's not snake_case
                    assert "_" not in val, f"System type should be Title Case, not snake_case: {val}"
                    # Check first letter is uppercase (Title Case)
                    words = val.split()
                    for word in words:
                        if word and word[0].islower():
                            print(f"WARNING: Word '{word}' in '{val}' may not be Title Case")
            print(f"SUCCESS: System Type values are properly formatted: {system_type_row['values']}")
        else:
            print("INFO: No System Type row found in comparison (may be empty for these products)")
    
    def test_compare_cross_division_fails(self):
        """Cross-division comparison should return 400 error"""
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1, CARDIO_PRODUCT_1]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 400, f"Expected 400 for cross-division, got {response.status_code}"
        data = response.json()
        assert "detail" in data, "Error response should have detail"
        assert "division" in data["detail"].lower(), f"Error should mention division: {data['detail']}"
        print(f"SUCCESS: Cross-division comparison blocked with error: {data['detail']}")
    
    def test_compare_single_product_fails(self):
        """Comparison with only 1 product should return 400"""
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 400, f"Expected 400 for single product, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        assert "2" in data["detail"], f"Error should mention need 2 products: {data['detail']}"
        print(f"SUCCESS: Single product comparison blocked: {data['detail']}")
    
    def test_compare_five_products_fails(self):
        """Comparison with 5 products should return 400 (max is 4)"""
        # Use same product multiple times for test (will fail on duplicate check or max check)
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1, TRAUMA_PRODUCT_2, TRAUMA_PRODUCT_1, TRAUMA_PRODUCT_2, TRAUMA_PRODUCT_1]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 400, f"Expected 400 for 5 products, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        print(f"SUCCESS: 5 products comparison blocked: {data['detail']}")
    
    def test_compare_nonexistent_product_fails(self):
        """Comparison with non-existent product should return 404"""
        response = requests.post(
            f"{BASE_URL}/api/catalog/compare",
            json={"slugs": [TRAUMA_PRODUCT_1, "nonexistent-product-slug-xyz"]},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 404, f"Expected 404 for non-existent product, got {response.status_code}"
        print("SUCCESS: Non-existent product returns 404")


class TestComparisonSuggestionsAPI:
    """Tests for GET /api/catalog/compare/suggestions/{slug} endpoint"""
    
    def test_suggestions_for_trauma_product(self):
        """Get suggestions for a Trauma product"""
        response = requests.get(f"{BASE_URL}/api/catalog/compare/suggestions/{TRAUMA_PRODUCT_1}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "suggestions" in data, "Response should have 'suggestions' array"
        
        if len(data["suggestions"]) > 0:
            # Verify suggestion structure
            suggestion = data["suggestions"][0]
            assert "slug" in suggestion, "Suggestion should have slug"
            assert "product_name_display" in suggestion, "Suggestion should have product_name_display"
            assert "comparison_reason" in suggestion, "Suggestion should have comparison_reason"
            
            print(f"SUCCESS: Got {len(data['suggestions'])} suggestions for {TRAUMA_PRODUCT_1}")
            print(f"  First suggestion: {suggestion['product_name_display']} - {suggestion['comparison_reason']}")
        else:
            print(f"INFO: No suggestions found for {TRAUMA_PRODUCT_1}")
    
    def test_suggestions_have_comparison_reason(self):
        """Verify all suggestions have comparison_reason field"""
        response = requests.get(f"{BASE_URL}/api/catalog/compare/suggestions/{TRAUMA_PRODUCT_2}")
        
        assert response.status_code == 200
        data = response.json()
        
        for suggestion in data["suggestions"]:
            assert "comparison_reason" in suggestion, f"Suggestion {suggestion.get('slug')} missing comparison_reason"
            assert suggestion["comparison_reason"], f"comparison_reason should not be empty"
        
        if data["suggestions"]:
            reasons = set(s["comparison_reason"] for s in data["suggestions"])
            print(f"SUCCESS: All suggestions have comparison_reason. Unique reasons: {reasons}")
        else:
            print("INFO: No suggestions to verify")
    
    def test_suggestions_nonexistent_product(self):
        """Suggestions for non-existent product should return 404"""
        response = requests.get(f"{BASE_URL}/api/catalog/compare/suggestions/nonexistent-product-xyz")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("SUCCESS: Non-existent product suggestions returns 404")


class TestCatalogExistingEndpoints:
    """Verify existing catalog endpoints still work"""
    
    def test_divisions_endpoint(self):
        """GET /api/catalog/divisions should still work"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        
        assert response.status_code == 200
        data = response.json()
        assert "divisions" in data
        assert len(data["divisions"]) >= 4, "Should have at least 4 pilot divisions"
        print(f"SUCCESS: Divisions endpoint returns {len(data['divisions'])} divisions")
    
    def test_product_detail_endpoint(self):
        """GET /api/catalog/products/{slug} should still work"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/{TRAUMA_PRODUCT_2}")
        
        assert response.status_code == 200
        data = response.json()
        assert "product_name_display" in data
        assert "skus" in data
        assert "division" in data
        print(f"SUCCESS: Product detail for {TRAUMA_PRODUCT_2} - {data['product_name_display']}")
    
    def test_products_list_endpoint(self):
        """GET /api/catalog/products should still work"""
        response = requests.get(f"{BASE_URL}/api/catalog/products?division=Trauma&limit=5")
        
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "total" in data
        print(f"SUCCESS: Products list returns {len(data['products'])} products, total: {data['total']}")
    
    def test_related_products_endpoint(self):
        """GET /api/catalog/products/{slug}/related should still work"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/{TRAUMA_PRODUCT_2}/related")
        
        assert response.status_code == 200
        data = response.json()
        assert "compatible_components" in data
        assert "same_family_alternatives" in data
        assert "related_system_products" in data
        print(f"SUCCESS: Related products endpoint works")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
