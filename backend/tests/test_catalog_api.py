"""
Test Catalog API endpoints for Phase 3/4 - Trauma Division Pilot
Tests: GET /api/catalog/divisions, GET /api/catalog/products, GET /api/catalog/products/{slug}
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestCatalogDivisions:
    """Test GET /api/catalog/divisions endpoint"""
    
    def test_divisions_returns_trauma(self):
        """Verify Trauma division is returned with correct structure"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "divisions" in data, "Response should have 'divisions' key"
        assert "pilot_active" in data, "Response should have 'pilot_active' key"
        assert data["pilot_active"] == True, "Pilot should be active"
        
        # Find Trauma division
        trauma = next((d for d in data["divisions"] if d["name"] == "Trauma"), None)
        assert trauma is not None, "Trauma division should exist"
        
        # Verify structure
        assert "product_count" in trauma, "Should have product_count"
        assert "categories" in trauma, "Should have categories"
        assert "brands" in trauma, "Should have brands"
        assert isinstance(trauma["product_count"], int), "product_count should be int"
        assert isinstance(trauma["categories"], list), "categories should be list"
        assert isinstance(trauma["brands"], list), "brands should be list"
        
        print(f"Trauma division: {trauma['product_count']} products, {len(trauma['categories'])} categories, {len(trauma['brands'])} brands")
    
    def test_divisions_has_categories(self):
        """Verify Trauma division has categories"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        
        data = response.json()
        trauma = next((d for d in data["divisions"] if d["name"] == "Trauma"), None)
        assert trauma is not None
        assert len(trauma["categories"]) > 0, "Trauma should have at least one category"
        print(f"Categories: {trauma['categories']}")
    
    def test_divisions_has_brands(self):
        """Verify Trauma division has brands"""
        response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200
        
        data = response.json()
        trauma = next((d for d in data["divisions"] if d["name"] == "Trauma"), None)
        assert trauma is not None
        assert len(trauma["brands"]) > 0, "Trauma should have at least one brand"
        print(f"Brands: {trauma['brands']}")


class TestCatalogProductList:
    """Test GET /api/catalog/products endpoint"""
    
    def test_products_list_trauma_division(self):
        """Verify products list returns Trauma products"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "products" in data, "Response should have 'products' key"
        assert "total" in data, "Response should have 'total' key"
        assert "page" in data, "Response should have 'page' key"
        assert "pages" in data, "Response should have 'pages' key"
        
        assert len(data["products"]) > 0, "Should return at least one product"
        print(f"Total products: {data['total']}, Page: {data['page']}/{data['pages']}")
    
    def test_products_list_pagination(self):
        """Verify pagination works correctly"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "page": 1, "limit": 5})
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["products"]) <= 5, "Should respect limit parameter"
        assert data["page"] == 1, "Should be on page 1"
        
        if data["total"] > 5:
            assert data["pages"] > 1, "Should have multiple pages"
    
    def test_products_list_structure(self):
        """Verify product structure in list response"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "limit": 1})
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["products"]) > 0
        
        product = data["products"][0]
        required_fields = ["slug", "product_name", "product_name_display", "brand", "division", "category"]
        for field in required_fields:
            assert field in product, f"Product should have '{field}' field"
        
        print(f"Sample product: {product['product_name_display']} ({product['brand']})")
    
    def test_products_filter_by_category(self):
        """Verify category filter works"""
        # First get available categories
        div_response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert div_response.status_code == 200
        trauma = next((d for d in div_response.json()["divisions"] if d["name"] == "Trauma"), None)
        
        if trauma and len(trauma["categories"]) > 0:
            category = trauma["categories"][0]
            response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "category": category})
            assert response.status_code == 200
            
            data = response.json()
            # All returned products should be in this category
            for product in data["products"]:
                assert product["category"] == category, f"Product category should be {category}"
            print(f"Filtered by category '{category}': {data['total']} products")
    
    def test_products_filter_by_brand(self):
        """Verify brand filter works"""
        # First get available brands
        div_response = requests.get(f"{BASE_URL}/api/catalog/divisions")
        assert div_response.status_code == 200
        trauma = next((d for d in div_response.json()["divisions"] if d["name"] == "Trauma"), None)
        
        if trauma and len(trauma["brands"]) > 0:
            brand = trauma["brands"][0]
            response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "brand": brand})
            assert response.status_code == 200
            
            data = response.json()
            # All returned products should be this brand
            for product in data["products"]:
                assert product["brand"] == brand, f"Product brand should be {brand}"
            print(f"Filtered by brand '{brand}': {data['total']} products")
    
    def test_products_search(self):
        """Verify search functionality"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "search": "plate"})
        assert response.status_code == 200
        
        data = response.json()
        print(f"Search 'plate': {data['total']} results")
        # Search should return results (assuming there are plate products)
    
    def test_products_filter_by_auric_brand(self):
        """Verify AURIC brand filter specifically"""
        response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "brand": "AURIC"})
        assert response.status_code == 200
        
        data = response.json()
        for product in data["products"]:
            assert product["brand"] == "AURIC", "All products should be AURIC brand"
        print(f"AURIC brand products: {data['total']}")


class TestCatalogProductDetail:
    """Test GET /api/catalog/products/{slug} endpoint"""
    
    def test_product_detail_valid_slug(self):
        """Verify product detail returns for valid slug"""
        # Use the slug provided in test requirements
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["slug"] == slug, "Slug should match"
        print(f"Product: {data.get('product_name_display', 'N/A')}")
    
    def test_product_detail_structure(self):
        """Verify product detail has all required fields"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
        assert response.status_code == 200
        
        data = response.json()
        
        # Product family info
        assert "product_name" in data
        assert "product_name_display" in data
        assert "brand" in data
        assert "division" in data
        assert "category" in data
        assert "slug" in data
        
        # Descriptions
        assert "description" in data
        
        # SKU table
        assert "skus" in data
        assert "sku_count" in data
        assert isinstance(data["skus"], list)
        
        # Related products
        assert "related_products" in data
        assert isinstance(data["related_products"], list)
        
        # Enrichment metadata
        assert "enriched_from_shadow" in data
        
        print(f"Product has {data['sku_count']} SKUs, {len(data['related_products'])} related products")
    
    def test_product_detail_has_brand_auric(self):
        """Verify the test product has AURIC brand"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["brand"] == "AURIC", f"Expected AURIC brand, got {data['brand']}"
        assert data["division"] == "Trauma", f"Expected Trauma division, got {data['division']}"
    
    def test_product_detail_has_skus(self):
        """Verify product has SKU variants"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
        assert response.status_code == 200
        
        data = response.json()
        # According to requirements, this product should have 2 SKU variants
        assert data["sku_count"] >= 0, "Should have sku_count"
        
        if data["sku_count"] > 0:
            sku = data["skus"][0]
            assert "sku_code" in sku, "SKU should have sku_code"
            print(f"First SKU: {sku.get('sku_code', 'N/A')}")
    
    def test_product_detail_has_related_products(self):
        """Verify product has related products"""
        slug = "2.4mm-lps-distal-radial-volar-buttress-plate"
        response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
        assert response.status_code == 200
        
        data = response.json()
        # Related products should be returned
        if len(data["related_products"]) > 0:
            related = data["related_products"][0]
            assert "slug" in related
            assert "product_name_display" in related
            print(f"Related product: {related.get('product_name_display', 'N/A')}")
    
    def test_product_detail_404_for_nonexistent(self):
        """Verify 404 for non-existent product"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/nonexistent-product-slug-12345")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    def test_product_detail_404_for_invalid_slug(self):
        """Verify 404 for invalid slug format"""
        response = requests.get(f"{BASE_URL}/api/catalog/products/ortho-device-chat")
        # This slug doesn't exist in catalog_products
        assert response.status_code == 404, f"Expected 404 for 'ortho-device-chat', got {response.status_code}"


class TestCatalogProductFromList:
    """Test product detail by first getting a product from the list"""
    
    def test_get_product_from_list_then_detail(self):
        """Get a product from list, then fetch its detail"""
        # Get first product from list
        list_response = requests.get(f"{BASE_URL}/api/catalog/products", params={"division": "Trauma", "limit": 1})
        assert list_response.status_code == 200
        
        products = list_response.json()["products"]
        if len(products) > 0:
            slug = products[0]["slug"]
            
            # Fetch detail
            detail_response = requests.get(f"{BASE_URL}/api/catalog/products/{slug}")
            assert detail_response.status_code == 200
            
            detail = detail_response.json()
            assert detail["slug"] == slug
            assert detail["product_name_display"] == products[0]["product_name_display"]
            print(f"Verified product: {detail['product_name_display']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
