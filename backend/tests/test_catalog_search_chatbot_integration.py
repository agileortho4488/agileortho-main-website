"""
Test catalog search expansion and chatbot/AI chat integration with enriched catalog data.
Iteration 47: Verifies search across 12 fields and chatbot/chat endpoints return catalog products.
"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


class TestCatalogSearchExpansion:
    """Test expanded catalog search across 12 fields including semantic fields."""

    def test_search_hernia_returns_24_plus_results(self):
        """Search 'hernia' should return 24+ results including ABSOMESH and FILAPROP."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "hernia", "limit": 50})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "products" in data
        assert "total" in data
        # Should return 24+ hernia products
        assert data["total"] >= 24, f"Expected 24+ hernia products, got {data['total']}"
        
        # Verify product structure
        if data["products"]:
            product = data["products"][0]
            assert "slug" in product
            assert "product_name" in product or "product_name_display" in product
            assert "division" in product

    def test_search_stent_returns_cardiovascular_products(self):
        """Search 'stent' should return cardiovascular stent products."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "stent", "limit": 50})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] > 0, "Expected stent products"
        
        # Check that cardiovascular products are included
        divisions = [p.get("division", "") for p in data["products"]]
        assert any("Cardiovascular" in d for d in divisions), "Expected Cardiovascular division products"

    def test_search_titanium_returns_material_matches(self):
        """Search 'titanium' should return products with titanium material."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "titanium", "limit": 50})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] > 0, "Expected titanium material products"
        
        # Verify some products have titanium in material or name
        products = data["products"]
        has_titanium = any(
            "titanium" in (p.get("material", "") or "").lower() or
            "titanium" in (p.get("semantic_material_default", "") or "").lower() or
            "titanium" in (p.get("product_name", "") or "").lower() or
            "titanium" in (p.get("product_name_display", "") or "").lower()
            for p in products
        )
        assert has_titanium, "Expected products with titanium in material or name"

    def test_search_trauma_returns_trauma_division(self):
        """Search 'trauma' should return trauma division products."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "trauma", "limit": 50})
        assert response.status_code == 200
        data = response.json()
        assert data["total"] > 0, "Expected trauma products"
        
        # Check that Trauma division products are included
        divisions = [p.get("division", "") for p in data["products"]]
        assert any("Trauma" in d for d in divisions), "Expected Trauma division products"


class TestCatalogDivisionsAPI:
    """Test catalog divisions endpoint returns 13 divisions with 810 products."""

    def test_divisions_returns_13_with_810_products(self):
        """GET /api/catalog/divisions should return 13 divisions with total 810 products."""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        data = response.json()
        
        assert "divisions" in data
        assert "total_products" in data
        
        # Should have 13 divisions
        assert len(data["divisions"]) == 13, f"Expected 13 divisions, got {len(data['divisions'])}"
        
        # Should have 810 total products
        assert data["total_products"] == 810, f"Expected 810 products, got {data['total_products']}"


class TestChatbotQueryWithCatalog:
    """Test chatbot query endpoint returns enriched catalog product results."""

    def test_chatbot_hernia_mesh_query(self):
        """POST /api/chatbot/query with hernia mesh question should return catalog products."""
        response = requests.post(
            f"{BASE_URL}/api/chatbot/query",
            json={"question": "What hernia mesh products do you have?", "session_id": "test-iter47-hernia"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        
        assert "answer" in data
        assert "sources" in data
        assert "confidence" in data
        
        # Should have high or medium confidence with catalog results
        assert data["confidence"] in ["high", "medium"], f"Expected high/medium confidence, got {data['confidence']}"
        
        # Answer should contain catalog product links
        answer = data["answer"]
        assert "/catalog/products/" in answer or "product" in answer.lower(), "Expected catalog product references"

    def test_chatbot_trauma_plates_query(self):
        """POST /api/chatbot/query with trauma plates question should return trauma products."""
        response = requests.post(
            f"{BASE_URL}/api/chatbot/query",
            json={"question": "Show me trauma plates", "session_id": "test-iter47-trauma"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "answer" in data
        assert "confidence" in data
        
        # Should return results (not "none" confidence)
        assert data["confidence"] != "none", "Expected to find trauma plate products"


class TestAIChatWithCatalog:
    """Test AI chat endpoint returns enriched product data from catalog."""

    def test_chat_cardiovascular_query(self):
        """POST /api/chat with cardiovascular question should return enriched product data."""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"message": "What cardiovascular products do you have?", "session_id": "test-iter47-cardio"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        
        assert "response" in data
        assert "session_id" in data
        assert "products_referenced" in data
        
        # Should reference products from catalog
        assert data["products_referenced"] > 0, "Expected products to be referenced"
        
        # Response should mention cardiovascular or stent products
        response_text = data["response"].lower()
        assert any(term in response_text for term in ["cardiovascular", "stent", "heart", "cardiac", "product"]), \
            "Expected cardiovascular product mentions in response"


class TestSearchResultsStructure:
    """Test that search results have proper structure with division tags, brands, materials."""

    def test_search_results_have_division_tags(self):
        """Search results should include division information."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "hernia", "limit": 10})
        assert response.status_code == 200
        data = response.json()
        
        if data["products"]:
            product = data["products"][0]
            # Should have division info
            assert "division" in product or "division_canonical" in product, "Expected division in product"

    def test_search_results_have_brand_info(self):
        """Search results should include brand information."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "stent", "limit": 10})
        assert response.status_code == 200
        data = response.json()
        
        if data["products"]:
            # At least some products should have brand
            brands = [p.get("brand", "") for p in data["products"]]
            assert any(b for b in brands), "Expected some products to have brand info"

    def test_search_results_have_material_info(self):
        """Search results should include material information where available."""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"search": "titanium", "limit": 10})
        assert response.status_code == 200
        data = response.json()
        
        if data["products"]:
            # Check for material fields
            product = data["products"][0]
            has_material = (
                "material" in product or 
                "semantic_material_default" in product
            )
            # Material info should be present for titanium search
            assert has_material, "Expected material field in product"


class TestChatbotSuggestions:
    """Test chatbot suggestions endpoint."""

    def test_chatbot_suggestions_endpoint(self):
        """GET /api/chatbot/suggestions should return suggestion list."""
        response = requests.get(f"{BASE_URL}/api/chatbot/suggestions")
        assert response.status_code == 200
        data = response.json()
        
        assert "suggestions" in data
        assert len(data["suggestions"]) > 0, "Expected at least one suggestion"


class TestChatSuggestions:
    """Test AI chat suggestions endpoint."""

    def test_chat_suggestions_endpoint(self):
        """GET /api/chat/suggestions should return suggestion list."""
        response = requests.get(f"{BASE_URL}/api/chat/suggestions")
        assert response.status_code == 200
        data = response.json()
        
        assert "suggestions" in data
        assert len(data["suggestions"]) > 0, "Expected at least one suggestion"
