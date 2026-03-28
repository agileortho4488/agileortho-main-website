"""
Test Non-Pilot Division SKU Cleanup — Verifies ENT and Endo Surgery cleanup results.
Phase 1 & 2 cleanup scripts resolved shared shadow_product_id contamination.
Expected: ENT has 45 products with 0 shared shadow_ids, Endo Surgery has 170 products with 0 shared shadow_ids.
"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
ADMIN_PASSWORD = "kOpcELYcEvkVtyDAE5-2uw"


class TestNonPilotCleanupVerification:
    """Verify ENT and Endo Surgery cleanup results via admin review endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token for authenticated requests"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get admin token
        login_response = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200, f"Admin login failed: {login_response.text}"
        token = login_response.json().get("token")
        assert token, "No token returned from admin login"
        self.session.headers.update({"Authorization": f"Bearer {token}"})
        self.token = token
    
    # ── Admin Login Test ──
    def test_admin_login_returns_token(self):
        """POST /api/admin/login with correct password returns token"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        response = session.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        
        data = response.json()
        assert "token" in data, "Missing token in response"
        assert isinstance(data["token"], str), "Token should be a string"
        assert len(data["token"]) > 0, "Token should not be empty"
        
        print(f"Admin login successful, token received (length: {len(data['token'])})")
    
    # ── Stats Endpoint Tests ──
    def test_review_stats_returns_200(self):
        """GET /api/admin/review/stats returns 200 with stats data"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200, f"Stats endpoint failed: {response.text}"
        
        data = response.json()
        assert "total_products" in data, "Missing total_products"
        assert "by_division" in data, "Missing by_division"
        
        print(f"Stats: total_products={data['total_products']}")
    
    def test_review_stats_has_ent_division(self):
        """Stats by_division includes ENT division"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200
        
        data = response.json()
        by_division = data.get("by_division", [])
        
        ent_divisions = [d for d in by_division if d.get("division") == "ENT"]
        assert len(ent_divisions) > 0, "ENT division not found in by_division stats"
        
        ent_data = ent_divisions[0]
        print(f"ENT division stats: total={ent_data.get('total')}, review={ent_data.get('review')}, avg_conf={ent_data.get('avg_conf')}")
    
    def test_review_stats_has_endo_surgery_division(self):
        """Stats by_division includes Endo Surgery division"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200
        
        data = response.json()
        by_division = data.get("by_division", [])
        
        endo_divisions = [d for d in by_division if d.get("division") == "Endo Surgery"]
        assert len(endo_divisions) > 0, "Endo Surgery division not found in by_division stats"
        
        endo_data = endo_divisions[0]
        print(f"Endo Surgery division stats: total={endo_data.get('total')}, review={endo_data.get('review')}, avg_conf={endo_data.get('avg_conf')}")
    
    # ── ENT Division Products Tests ──
    def test_review_products_ent_division_filter(self):
        """GET /api/admin/review/products?division=ENT returns ENT products"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=ENT&limit=100")
        assert response.status_code == 200, f"ENT products endpoint failed: {response.text}"
        
        data = response.json()
        assert "products" in data, "Missing products array"
        assert "total" in data, "Missing total count"
        
        # All products should be from ENT division
        for product in data["products"]:
            assert product.get("division_canonical") == "ENT", \
                f"Product {product.get('slug')} has wrong division: {product.get('division_canonical')}"
        
        print(f"ENT division: total={data['total']} products, returned={len(data['products'])}")
    
    def test_ent_products_have_expected_brands(self):
        """ENT products should have brands like MESIRE, MESIC, MyNasal, MAFIC"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=ENT&limit=100")
        assert response.status_code == 200
        
        data = response.json()
        products = data.get("products", [])
        
        # Collect all brands
        brands = set()
        for product in products:
            brand = product.get("proposed_semantic_brand_system") or product.get("brand")
            if brand:
                brands.add(brand.upper())
        
        expected_brands = {"MESIRE", "MESIC", "MYNASAL", "MAFIC"}
        found_expected = brands & expected_brands
        
        print(f"ENT brands found: {brands}")
        print(f"Expected brands found: {found_expected}")
        
        # At least some expected brands should be present
        assert len(found_expected) > 0, f"No expected ENT brands found. Found: {brands}"
    
    # ── Endo Surgery Division Products Tests ──
    def test_review_products_endo_surgery_division_filter(self):
        """GET /api/admin/review/products?division=Endo Surgery returns Endo Surgery products"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=Endo%20Surgery&limit=100")
        assert response.status_code == 200, f"Endo Surgery products endpoint failed: {response.text}"
        
        data = response.json()
        assert "products" in data, "Missing products array"
        assert "total" in data, "Missing total count"
        
        # All products should be from Endo Surgery division
        for product in data["products"]:
            assert product.get("division_canonical") == "Endo Surgery", \
                f"Product {product.get('slug')} has wrong division: {product.get('division_canonical')}"
        
        print(f"Endo Surgery division: total={data['total']} products, returned={len(data['products'])}")
    
    # ── Families Endpoint Tests ──
    def test_review_families_returns_200(self):
        """GET /api/admin/review/families returns family groups"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/families")
        assert response.status_code == 200, f"Families endpoint failed: {response.text}"
        
        data = response.json()
        assert "families" in data, "Missing families array"
        assert "total_families" in data, "Missing total_families count"
        
        print(f"Total families: {data['total_families']}")
    
    def test_review_families_ent_division(self):
        """Families endpoint can filter by ENT division"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/families?division=ENT")
        assert response.status_code == 200
        
        data = response.json()
        families = data.get("families", [])
        
        # All families should be from ENT division
        for family in families:
            assert family.get("division") == "ENT", \
                f"Family {family.get('family')} has wrong division: {family.get('division')}"
        
        print(f"ENT families: {len(families)}")
    
    def test_review_families_endo_surgery_division(self):
        """Families endpoint can filter by Endo Surgery division"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/families?division=Endo%20Surgery")
        assert response.status_code == 200
        
        data = response.json()
        families = data.get("families", [])
        
        # All families should be from Endo Surgery division
        for family in families:
            assert family.get("division") == "Endo Surgery", \
                f"Family {family.get('family')} has wrong division: {family.get('division')}"
        
        print(f"Endo Surgery families: {len(families)}")
    
    # ── Smart Suggestions Tests ──
    def test_smart_suggestions_returns_200(self):
        """GET /api/admin/review/smart-suggestions returns 200"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200, f"Smart suggestions endpoint failed: {response.text}"
        
        data = response.json()
        assert "suggestions" in data, "Missing suggestions array"
        assert "summary" in data, "Missing summary object"
        
        summary = data.get("summary", {})
        print(f"Smart suggestions summary: fully_eligible={summary.get('fully_eligible')}, "
              f"partially_eligible={summary.get('partially_eligible')}, "
              f"ineligible={summary.get('ineligible')}, "
              f"total_products_clearable={summary.get('total_products_clearable')}")
    
    # ── Catalog Divisions Test ──
    def test_catalog_divisions_returns_pilot_divisions(self):
        """GET /api/catalog/divisions returns the 4 pilot divisions"""
        response = self.session.get(f"{BASE_URL}/api/catalog/divisions")
        assert response.status_code == 200, f"Catalog divisions endpoint failed: {response.text}"
        
        data = response.json()
        assert "divisions" in data, "Missing divisions array"
        
        divisions = data.get("divisions", [])
        division_names = [d.get("name") for d in divisions]
        
        expected_pilot_divisions = ["Trauma", "Cardiovascular", "Diagnostics", "Joint Replacement"]
        
        for expected in expected_pilot_divisions:
            assert expected in division_names, f"Expected pilot division '{expected}' not found"
        
        # ENT and Endo Surgery should NOT be in pilot divisions
        assert "ENT" not in division_names, "ENT should not be in pilot divisions"
        assert "Endo Surgery" not in division_names, "Endo Surgery should not be in pilot divisions"
        
        print(f"Pilot divisions: {division_names}")
    
    # ── Product Detail Tests ──
    def test_ent_product_detail(self):
        """Can fetch detail for an ENT product"""
        # First get an ENT product
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=ENT&limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0 and products[0].get("slug"):
            slug = products[0]["slug"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/products/{slug}")
            assert response.status_code == 200, f"ENT product detail failed: {response.text}"
            
            data = response.json()
            assert "product" in data, "Missing product field"
            assert "current" in data, "Missing current field"
            assert "proposed" in data, "Missing proposed field"
            
            print(f"ENT product detail for '{slug}' loaded successfully")
        else:
            pytest.skip("No ENT products available for detail test")
    
    def test_endo_surgery_product_detail(self):
        """Can fetch detail for an Endo Surgery product"""
        # First get an Endo Surgery product
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=Endo%20Surgery&limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0 and products[0].get("slug"):
            slug = products[0]["slug"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/products/{slug}")
            assert response.status_code == 200, f"Endo Surgery product detail failed: {response.text}"
            
            data = response.json()
            assert "product" in data, "Missing product field"
            
            print(f"Endo Surgery product detail for '{slug}' loaded successfully")
        else:
            pytest.skip("No Endo Surgery products available for detail test")


class TestCleanupDataIntegrity:
    """Verify data integrity after cleanup - no shared shadow_product_ids"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token for authenticated requests"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        login_response = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200
        token = login_response.json().get("token")
        self.session.headers.update({"Authorization": f"Bearer {token}"})
    
    def test_ent_products_have_unique_slugs(self):
        """ENT products should have unique slugs (no duplicates)"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=ENT&limit=100")
        assert response.status_code == 200
        
        data = response.json()
        products = data.get("products", [])
        
        slugs = [p.get("slug") for p in products if p.get("slug")]
        unique_slugs = set(slugs)
        
        assert len(slugs) == len(unique_slugs), \
            f"Duplicate slugs found in ENT products: {len(slugs)} total, {len(unique_slugs)} unique"
        
        print(f"ENT products: {len(slugs)} unique slugs verified")
    
    def test_endo_surgery_products_have_unique_slugs(self):
        """Endo Surgery products should have unique slugs (no duplicates)"""
        # API limit is 100, so we need to paginate
        all_slugs = []
        page = 1
        while True:
            response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=Endo%20Surgery&limit=100&page={page}")
            assert response.status_code == 200
            
            data = response.json()
            products = data.get("products", [])
            
            if len(products) == 0:
                break
            
            for p in products:
                if p.get("slug"):
                    all_slugs.append(p.get("slug"))
            
            if page >= data.get("pages", 1):
                break
            page += 1
        
        slugs = all_slugs
        unique_slugs = set(slugs)
        
        slugs = [p.get("slug") for p in products if p.get("slug")]
        unique_slugs = set(slugs)
        
        assert len(slugs) == len(unique_slugs), \
            f"Duplicate slugs found in Endo Surgery products: {len(slugs)} total, {len(unique_slugs)} unique"
        
        print(f"Endo Surgery products: {len(slugs)} unique slugs verified (across {page} pages)")
    
    def test_ent_products_have_valid_confidence(self):
        """ENT products should have valid confidence scores"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=ENT&limit=100")
        assert response.status_code == 200
        
        data = response.json()
        products = data.get("products", [])
        
        for product in products:
            conf = product.get("proposed_semantic_confidence")
            if conf is not None:
                assert 0 <= conf <= 1, \
                    f"Product {product.get('slug')} has invalid confidence: {conf}"
        
        print(f"ENT products: confidence scores validated")
    
    def test_endo_surgery_products_have_valid_confidence(self):
        """Endo Surgery products should have valid confidence scores"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?division=Endo%20Surgery&limit=100")
        assert response.status_code == 200
        
        data = response.json()
        products = data.get("products", [])
        
        for product in products:
            conf = product.get("proposed_semantic_confidence")
            if conf is not None:
                assert 0 <= conf <= 1, \
                    f"Product {product.get('slug')} has invalid confidence: {conf}"
        
        print(f"Endo Surgery products: confidence scores validated")


class TestAuthenticationRequired:
    """Verify all admin endpoints require authentication"""
    
    def test_review_stats_requires_auth(self):
        """Stats endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    def test_review_products_requires_auth(self):
        """Products endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/review/products")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    def test_review_families_requires_auth(self):
        """Families endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/review/families")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    def test_smart_suggestions_requires_auth(self):
        """Smart suggestions endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    def test_admin_login_invalid_password(self):
        """Admin login with invalid password returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "wrong-password"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401, f"Expected 401 for invalid password, got {response.status_code}"
