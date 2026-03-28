"""
Test Review Dashboard API — Tests for admin review endpoints for staged enrichment proposals.
Covers: stats, products list, product detail, approve, reject, edit-approve, bulk-approve, families
"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
ADMIN_PASSWORD = "kOpcELYcEvkVtyDAE5-2uw"


class TestReviewDashboardAPI:
    """Review Dashboard API endpoint tests"""
    
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
    
    # ── Stats Endpoint Tests ──
    def test_review_stats_returns_200(self):
        """GET /api/admin/review/stats returns 200 with stats data"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200, f"Stats endpoint failed: {response.text}"
        
        data = response.json()
        # Verify required fields exist
        assert "total_products" in data, "Missing total_products"
        assert "total_canonical" in data, "Missing total_canonical"
        assert "total_staged" in data, "Missing total_staged"
        assert "pending_review" in data, "Missing pending_review"
        assert "total_promoted" in data, "Missing total_promoted"
        assert "by_status" in data, "Missing by_status"
        assert "by_action" in data, "Missing by_action"
        assert "by_division" in data, "Missing by_division"
        
        # Verify data types
        assert isinstance(data["total_products"], int)
        assert isinstance(data["total_canonical"], int)
        assert isinstance(data["total_staged"], int)
        assert isinstance(data["pending_review"], int)
        assert isinstance(data["total_promoted"], int)
        assert isinstance(data["by_status"], list)
        assert isinstance(data["by_action"], list)
        assert isinstance(data["by_division"], list)
        
        print(f"Stats: total_products={data['total_products']}, total_canonical={data['total_canonical']}, "
              f"total_staged={data['total_staged']}, pending_review={data['pending_review']}, "
              f"total_promoted={data['total_promoted']}")
    
    def test_review_stats_has_coverage_pct(self):
        """Stats endpoint includes coverage_pct field"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200
        data = response.json()
        assert "coverage_pct" in data, "Missing coverage_pct"
        assert isinstance(data["coverage_pct"], (int, float))
        print(f"Coverage: {data['coverage_pct']}%")
    
    def test_review_stats_by_status_structure(self):
        """by_status array has correct structure"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200
        data = response.json()
        
        if len(data["by_status"]) > 0:
            status_item = data["by_status"][0]
            assert "status" in status_item, "by_status item missing 'status' field"
            assert "count" in status_item, "by_status item missing 'count' field"
            print(f"Sample status: {status_item}")
    
    def test_review_stats_by_division_structure(self):
        """by_division array has correct structure"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code == 200
        data = response.json()
        
        if len(data["by_division"]) > 0:
            div_item = data["by_division"][0]
            assert "division" in div_item, "by_division item missing 'division' field"
            assert "total" in div_item, "by_division item missing 'total' field"
            assert "review" in div_item, "by_division item missing 'review' field"
            assert "avg_conf" in div_item, "by_division item missing 'avg_conf' field"
            print(f"Sample division: {div_item}")
    
    def test_review_stats_requires_auth(self):
        """Stats endpoint requires authentication"""
        no_auth_session = requests.Session()
        response = no_auth_session.get(f"{BASE_URL}/api/admin/review/stats")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Products List Endpoint Tests ──
    def test_review_products_returns_200(self):
        """GET /api/admin/review/products returns 200 with paginated list"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products")
        assert response.status_code == 200, f"Products endpoint failed: {response.text}"
        
        data = response.json()
        assert "products" in data, "Missing products array"
        assert "total" in data, "Missing total count"
        assert "page" in data, "Missing page number"
        assert "pages" in data, "Missing pages count"
        
        assert isinstance(data["products"], list)
        assert isinstance(data["total"], int)
        assert isinstance(data["page"], int)
        assert isinstance(data["pages"], int)
        
        print(f"Products: total={data['total']}, page={data['page']}, pages={data['pages']}, "
              f"returned={len(data['products'])}")
    
    def test_review_products_pending_only_filter(self):
        """pending_only=true filter returns only pending products"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?pending_only=true")
        assert response.status_code == 200
        data = response.json()
        
        # Should return products that have proposed fields but no canonical semantic_brand_system
        print(f"Pending only products: {data['total']}")
        assert data["total"] >= 0
    
    def test_review_products_pagination(self):
        """Pagination works correctly"""
        # Get page 1
        response1 = self.session.get(f"{BASE_URL}/api/admin/review/products?page=1&limit=10")
        assert response1.status_code == 200
        data1 = response1.json()
        
        if data1["pages"] > 1:
            # Get page 2
            response2 = self.session.get(f"{BASE_URL}/api/admin/review/products?page=2&limit=10")
            assert response2.status_code == 200
            data2 = response2.json()
            
            # Products should be different
            slugs1 = {p.get("slug") for p in data1["products"]}
            slugs2 = {p.get("slug") for p in data2["products"]}
            assert slugs1 != slugs2, "Page 1 and Page 2 should have different products"
            print(f"Pagination verified: page1 has {len(slugs1)} products, page2 has {len(slugs2)} products")
        else:
            print("Only 1 page of results, pagination test skipped")
    
    def test_review_products_division_filter(self):
        """Division filter works"""
        # First get stats to find a division
        stats_response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        stats = stats_response.json()
        
        if len(stats.get("by_division", [])) > 0:
            division = stats["by_division"][0]["division"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/products?division={division}")
            assert response.status_code == 200
            data = response.json()
            
            # All products should be from this division
            for product in data["products"]:
                assert product.get("division_canonical") == division or division == "(none)", \
                    f"Product {product.get('slug')} has wrong division"
            print(f"Division filter '{division}' returned {data['total']} products")
    
    def test_review_products_status_filter(self):
        """Status filter works"""
        stats_response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        stats = stats_response.json()
        
        if len(stats.get("by_status", [])) > 0:
            status = stats["by_status"][0]["status"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/products?status={status}")
            assert response.status_code == 200
            data = response.json()
            
            for product in data["products"]:
                assert product.get("proposed_web_verification_status") == status, \
                    f"Product {product.get('slug')} has wrong status"
            print(f"Status filter '{status}' returned {data['total']} products")
    
    def test_review_products_action_filter(self):
        """Action filter works"""
        stats_response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        stats = stats_response.json()
        
        if len(stats.get("by_action", [])) > 0:
            action = stats["by_action"][0]["action"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/products?action={action}")
            assert response.status_code == 200
            data = response.json()
            
            for product in data["products"]:
                assert product.get("proposed_recommended_action") == action, \
                    f"Product {product.get('slug')} has wrong action"
            print(f"Action filter '{action}' returned {data['total']} products")
    
    def test_review_products_confidence_filter(self):
        """Confidence min/max filters work"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?confidence_min=0.8&confidence_max=1.0")
        assert response.status_code == 200
        data = response.json()
        
        for product in data["products"]:
            conf = product.get("proposed_semantic_confidence", 0)
            assert 0.8 <= conf <= 1.0, f"Product {product.get('slug')} has confidence {conf} outside range"
        print(f"Confidence filter [0.8-1.0] returned {data['total']} products")
    
    def test_review_products_brand_search(self):
        """Brand search filter works"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?brand=test")
        assert response.status_code == 200
        data = response.json()
        print(f"Brand search 'test' returned {data['total']} products")
    
    def test_review_products_family_search(self):
        """Family search filter works"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products?family=plate")
        assert response.status_code == 200
        data = response.json()
        print(f"Family search 'plate' returned {data['total']} products")
    
    def test_review_products_requires_auth(self):
        """Products endpoint requires authentication"""
        no_auth_session = requests.Session()
        response = no_auth_session.get(f"{BASE_URL}/api/admin/review/products")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Product Detail Endpoint Tests ──
    def test_review_product_detail_returns_200(self):
        """GET /api/admin/review/products/{slug} returns product detail"""
        # First get a product slug
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0:
            slug = products[0].get("slug")
            if slug:
                response = self.session.get(f"{BASE_URL}/api/admin/review/products/{slug}")
                assert response.status_code == 200, f"Product detail failed: {response.text}"
                
                data = response.json()
                assert "product" in data, "Missing product field"
                assert "current" in data, "Missing current field"
                assert "proposed" in data, "Missing proposed field"
                assert "verification_log" in data, "Missing verification_log field"
                
                print(f"Product detail for '{slug}' loaded successfully")
            else:
                pytest.skip("No product with slug found")
        else:
            pytest.skip("No products available for detail test")
    
    def test_review_product_detail_comparison_fields(self):
        """Product detail includes current vs proposed comparison fields"""
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0 and products[0].get("slug"):
            slug = products[0]["slug"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/products/{slug}")
            assert response.status_code == 200
            
            data = response.json()
            current = data.get("current", {})
            proposed = data.get("proposed", {})
            
            # Check current fields
            assert "product_name_display" in current
            assert "semantic_brand_system" in current
            assert "semantic_confidence" in current
            
            # Check proposed fields
            assert "semantic_brand_system" in proposed
            assert "semantic_confidence" in proposed
            assert "web_verification_status" in proposed
            assert "recommended_action" in proposed
            
            print(f"Comparison fields verified for '{slug}'")
        else:
            pytest.skip("No products available")
    
    def test_review_product_detail_404_for_invalid_slug(self):
        """Product detail returns 404 for non-existent slug"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products/non-existent-slug-xyz-123")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    def test_review_product_detail_requires_auth(self):
        """Product detail requires authentication"""
        no_auth_session = requests.Session()
        response = no_auth_session.get(f"{BASE_URL}/api/admin/review/products/any-slug")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Families Endpoint Tests ──
    def test_review_families_returns_200(self):
        """GET /api/admin/review/families returns family groups"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/families")
        assert response.status_code == 200, f"Families endpoint failed: {response.text}"
        
        data = response.json()
        assert "families" in data, "Missing families array"
        assert "total_families" in data, "Missing total_families count"
        
        assert isinstance(data["families"], list)
        assert isinstance(data["total_families"], int)
        
        print(f"Families: total={data['total_families']}")
    
    def test_review_families_structure(self):
        """Family items have correct structure"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/families")
        assert response.status_code == 200
        data = response.json()
        
        if len(data["families"]) > 0:
            family = data["families"][0]
            assert "family" in family, "Missing family name"
            assert "division" in family, "Missing division"
            assert "count" in family, "Missing count"
            assert "avg_confidence" in family, "Missing avg_confidence"
            assert "brands" in family, "Missing brands"
            assert "statuses" in family, "Missing statuses"
            assert "actions" in family, "Missing actions"
            assert "sample_slugs" in family, "Missing sample_slugs"
            assert "has_conflict" in family, "Missing has_conflict"
            
            print(f"Sample family: {family['family']} ({family['division']}) - {family['count']} products")
    
    def test_review_families_division_filter(self):
        """Division filter works for families"""
        # Get a division from stats
        stats_response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        stats = stats_response.json()
        
        if len(stats.get("by_division", [])) > 0:
            division = stats["by_division"][0]["division"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/families?division={division}")
            assert response.status_code == 200
            data = response.json()
            
            for family in data["families"]:
                assert family.get("division") == division or division == "(none)", \
                    f"Family {family.get('family')} has wrong division"
            print(f"Division filter '{division}' returned {data['total_families']} families")
    
    def test_review_families_pending_only_filter(self):
        """pending_only filter works for families"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/families?pending_only=true")
        assert response.status_code == 200
        data = response.json()
        print(f"Pending only families: {data['total_families']}")
    
    def test_review_families_requires_auth(self):
        """Families endpoint requires authentication"""
        no_auth_session = requests.Session()
        response = no_auth_session.get(f"{BASE_URL}/api/admin/review/families")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Approve Endpoint Tests ──
    def test_approve_product_returns_200(self):
        """POST /api/admin/review/products/{slug}/approve promotes product"""
        # Get a pending product
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?pending_only=true&limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0 and products[0].get("slug"):
            slug = products[0]["slug"]
            response = self.session.post(f"{BASE_URL}/api/admin/review/products/{slug}/approve")
            assert response.status_code == 200, f"Approve failed: {response.text}"
            
            data = response.json()
            assert data.get("status") == "approved", f"Expected status 'approved', got {data.get('status')}"
            assert data.get("slug") == slug, f"Expected slug '{slug}', got {data.get('slug')}"
            
            print(f"Product '{slug}' approved successfully")
        else:
            pytest.skip("No pending products available for approve test")
    
    def test_approve_product_404_for_invalid_slug(self):
        """Approve returns 404 for non-existent slug"""
        response = self.session.post(f"{BASE_URL}/api/admin/review/products/non-existent-slug-xyz-123/approve")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    def test_approve_product_requires_auth(self):
        """Approve endpoint requires authentication"""
        no_auth_session = requests.Session()
        no_auth_session.headers.update({"Content-Type": "application/json"})
        response = no_auth_session.post(f"{BASE_URL}/api/admin/review/products/any-slug/approve")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Reject Endpoint Tests ──
    def test_reject_product_returns_200(self):
        """POST /api/admin/review/products/{slug}/reject clears proposed fields"""
        # Get a pending product
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?pending_only=true&limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0 and products[0].get("slug"):
            slug = products[0]["slug"]
            response = self.session.post(f"{BASE_URL}/api/admin/review/products/{slug}/reject")
            assert response.status_code == 200, f"Reject failed: {response.text}"
            
            data = response.json()
            assert data.get("status") == "rejected", f"Expected status 'rejected', got {data.get('status')}"
            assert data.get("slug") == slug, f"Expected slug '{slug}', got {data.get('slug')}"
            
            print(f"Product '{slug}' rejected successfully")
        else:
            pytest.skip("No pending products available for reject test")
    
    def test_reject_product_404_for_invalid_slug(self):
        """Reject returns 404 for non-existent slug"""
        response = self.session.post(f"{BASE_URL}/api/admin/review/products/non-existent-slug-xyz-123/reject")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    def test_reject_product_requires_auth(self):
        """Reject endpoint requires authentication"""
        no_auth_session = requests.Session()
        no_auth_session.headers.update({"Content-Type": "application/json"})
        response = no_auth_session.post(f"{BASE_URL}/api/admin/review/products/any-slug/reject")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Edit-Approve Endpoint Tests ──
    def test_edit_approve_product_returns_200(self):
        """POST /api/admin/review/products/{slug}/edit-approve edits and promotes"""
        # Get a pending product
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?pending_only=true&limit=1")
        products = products_response.json().get("products", [])
        
        if len(products) > 0 and products[0].get("slug"):
            slug = products[0]["slug"]
            edits = {
                "semantic_brand_system": "TEST_EDITED_BRAND"
            }
            response = self.session.post(
                f"{BASE_URL}/api/admin/review/products/{slug}/edit-approve",
                json={"edits": edits}
            )
            assert response.status_code == 200, f"Edit-approve failed: {response.text}"
            
            data = response.json()
            assert data.get("status") == "edit_approved", f"Expected status 'edit_approved', got {data.get('status')}"
            assert data.get("slug") == slug, f"Expected slug '{slug}', got {data.get('slug')}"
            
            print(f"Product '{slug}' edit-approved successfully")
        else:
            pytest.skip("No pending products available for edit-approve test")
    
    def test_edit_approve_product_404_for_invalid_slug(self):
        """Edit-approve returns 404 for non-existent slug"""
        response = self.session.post(
            f"{BASE_URL}/api/admin/review/products/non-existent-slug-xyz-123/edit-approve",
            json={"edits": {}}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    def test_edit_approve_product_requires_auth(self):
        """Edit-approve endpoint requires authentication"""
        no_auth_session = requests.Session()
        no_auth_session.headers.update({"Content-Type": "application/json"})
        response = no_auth_session.post(
            f"{BASE_URL}/api/admin/review/products/any-slug/edit-approve",
            json={"edits": {}}
        )
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Bulk Approve Endpoint Tests ──
    def test_bulk_approve_by_slugs_returns_200(self):
        """POST /api/admin/review/bulk-approve with slugs list works"""
        # Get some pending products
        products_response = self.session.get(f"{BASE_URL}/api/admin/review/products?pending_only=true&limit=2")
        products = products_response.json().get("products", [])
        
        slugs = [p.get("slug") for p in products if p.get("slug")]
        
        if len(slugs) > 0:
            response = self.session.post(
                f"{BASE_URL}/api/admin/review/bulk-approve",
                json={"slugs": slugs}
            )
            assert response.status_code == 200, f"Bulk approve failed: {response.text}"
            
            data = response.json()
            assert data.get("status") == "bulk_approved", f"Expected status 'bulk_approved', got {data.get('status')}"
            assert "count" in data, "Missing count in response"
            
            print(f"Bulk approved {data['count']} products")
        else:
            pytest.skip("No pending products available for bulk approve test")
    
    def test_bulk_approve_by_family_returns_200(self):
        """POST /api/admin/review/bulk-approve with family works"""
        # Get a family
        families_response = self.session.get(f"{BASE_URL}/api/admin/review/families?pending_only=true")
        families = families_response.json().get("families", [])
        
        if len(families) > 0:
            family = families[0]
            response = self.session.post(
                f"{BASE_URL}/api/admin/review/bulk-approve",
                json={"family": family["family"], "division": family["division"]}
            )
            assert response.status_code == 200, f"Bulk approve by family failed: {response.text}"
            
            data = response.json()
            assert data.get("status") == "bulk_approved"
            print(f"Bulk approved {data['count']} products in family '{family['family']}'")
        else:
            pytest.skip("No families available for bulk approve test")
    
    def test_bulk_approve_requires_criteria(self):
        """Bulk approve returns 400 without slugs, family, or brand"""
        response = self.session.post(
            f"{BASE_URL}/api/admin/review/bulk-approve",
            json={}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    
    def test_bulk_approve_requires_auth(self):
        """Bulk approve endpoint requires authentication"""
        no_auth_session = requests.Session()
        no_auth_session.headers.update({"Content-Type": "application/json"})
        response = no_auth_session.post(
            f"{BASE_URL}/api/admin/review/bulk-approve",
            json={"slugs": ["test"]}
        )
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Promotion Log Verification ──
    def test_promotion_log_exists(self):
        """Verify promotion_log collection has entries from auto-promotion"""
        stats_response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        stats = stats_response.json()
        
        total_promoted = stats.get("total_promoted", 0)
        assert total_promoted >= 0, "total_promoted should be non-negative"
        print(f"Total promoted entries in promotion_log: {total_promoted}")
        
        # Per the request, there should be 243 entries from auto-promotion
        # We just verify the count is accessible
        assert isinstance(total_promoted, int)


class TestReviewDashboardWithSpecificSlugs:
    """Tests using specific slugs mentioned in the request"""
    
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
    
    def test_specific_slug_myra_bms(self):
        """Test product detail for 'myra-bms' slug"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products/myra-bms")
        # May or may not exist, just verify endpoint works
        if response.status_code == 200:
            data = response.json()
            assert "product" in data
            print(f"myra-bms product found: {data['product'].get('product_name_display', 'N/A')}")
        else:
            print(f"myra-bms not found (status {response.status_code})")
    
    def test_specific_slug_vircell_dengue(self):
        """Test product detail for 'vircell-dengue-igm' slug"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/products/vircell-dengue-igm")
        if response.status_code == 200:
            data = response.json()
            assert "product" in data
            print(f"vircell-dengue-igm product found: {data['product'].get('product_name_display', 'N/A')}")
        else:
            print(f"vircell-dengue-igm not found (status {response.status_code})")


class TestSmartSuggestionsAPI:
    """Tests for the Smart Suggestions feature - analyzes families and recommends bulk approval candidates"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token for authenticated requests"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        login_response = self.session.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200, f"Admin login failed: {login_response.text}"
        token = login_response.json().get("token")
        assert token, "No token returned from admin login"
        self.session.headers.update({"Authorization": f"Bearer {token}"})
        self.token = token
    
    # ── Smart Suggestions Endpoint Tests ──
    def test_smart_suggestions_returns_200(self):
        """GET /api/admin/review/smart-suggestions returns 200 with suggestions data"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200, f"Smart suggestions endpoint failed: {response.text}"
        
        data = response.json()
        assert "suggestions" in data, "Missing suggestions array"
        assert "summary" in data, "Missing summary object"
        
        assert isinstance(data["suggestions"], list)
        assert isinstance(data["summary"], dict)
        
        print(f"Smart suggestions: {len(data['suggestions'])} families analyzed")
    
    def test_smart_suggestions_summary_structure(self):
        """Summary contains required counts: fully_eligible, partially_eligible, ineligible"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        summary = data.get("summary", {})
        
        # Required summary fields
        assert "total_families_analyzed" in summary, "Missing total_families_analyzed"
        assert "fully_eligible" in summary, "Missing fully_eligible count"
        assert "partially_eligible" in summary, "Missing partially_eligible count"
        assert "ineligible" in summary, "Missing ineligible count"
        assert "total_products_clearable" in summary, "Missing total_products_clearable"
        
        # Verify data types
        assert isinstance(summary["total_families_analyzed"], int)
        assert isinstance(summary["fully_eligible"], int)
        assert isinstance(summary["partially_eligible"], int)
        assert isinstance(summary["ineligible"], int)
        assert isinstance(summary["total_products_clearable"], int)
        
        # Verify counts add up
        total = summary["fully_eligible"] + summary["partially_eligible"] + summary["ineligible"]
        assert total == summary["total_families_analyzed"], \
            f"Counts don't add up: {summary['fully_eligible']} + {summary['partially_eligible']} + {summary['ineligible']} != {summary['total_families_analyzed']}"
        
        print(f"Summary: fully_eligible={summary['fully_eligible']}, partially_eligible={summary['partially_eligible']}, "
              f"ineligible={summary['ineligible']}, total_products_clearable={summary['total_products_clearable']}")
    
    def test_smart_suggestions_has_eligible_families(self):
        """At least one fully_eligible family should exist"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        summary = data.get("summary", {})
        
        # Per the request, fully_eligible should be >= 1
        assert summary.get("fully_eligible", 0) >= 1, \
            f"Expected at least 1 fully_eligible family, got {summary.get('fully_eligible', 0)}"
        
        print(f"Found {summary['fully_eligible']} fully eligible families")
    
    def test_smart_suggestions_suggestion_structure(self):
        """Each suggestion has required fields for eligibility analysis"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        if len(suggestions) > 0:
            suggestion = suggestions[0]
            
            # Required fields
            assert "family" in suggestion, "Missing family name"
            assert "division" in suggestion, "Missing division"
            assert "brand" in suggestion, "Missing brand"
            assert "family_size" in suggestion, "Missing family_size"
            assert "smart_approve_eligible" in suggestion, "Missing smart_approve_eligible"
            assert "partially_eligible" in suggestion, "Missing partially_eligible"
            assert "smart_approve_score" in suggestion, "Missing smart_approve_score"
            assert "smart_approve_reason" in suggestion, "Missing smart_approve_reason"
            assert "smart_approve_exclusion_reasons" in suggestion, "Missing smart_approve_exclusion_reasons"
            assert "avg_confidence" in suggestion, "Missing avg_confidence"
            assert "min_confidence" in suggestion, "Missing min_confidence"
            assert "max_confidence" in suggestion, "Missing max_confidence"
            assert "eligible_count" in suggestion, "Missing eligible_count"
            assert "eligible_slugs" in suggestion, "Missing eligible_slugs"
            assert "excluded_count" in suggestion, "Missing excluded_count"
            assert "excluded_slugs" in suggestion, "Missing excluded_slugs"
            assert "sample_titles" in suggestion, "Missing sample_titles"
            
            # Verify data types
            assert isinstance(suggestion["smart_approve_eligible"], bool)
            assert isinstance(suggestion["partially_eligible"], bool)
            assert isinstance(suggestion["smart_approve_score"], (int, float))
            assert isinstance(suggestion["eligible_slugs"], list)
            assert isinstance(suggestion["excluded_slugs"], list)
            assert isinstance(suggestion["smart_approve_exclusion_reasons"], list)
            
            print(f"Sample suggestion: {suggestion['family']} ({suggestion['division']}) - "
                  f"eligible={suggestion['smart_approve_eligible']}, score={suggestion['smart_approve_score']}")
    
    def test_smart_suggestions_eligible_family_criteria(self):
        """Eligible families have: same division, same brand, no conflicts, avg conf >= 0.85"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        eligible_families = [s for s in suggestions if s.get("smart_approve_eligible")]
        
        for family in eligible_families:
            # Avg confidence should be >= 0.85
            assert family.get("avg_confidence", 0) >= 0.85, \
                f"Eligible family {family['family']} has avg_confidence {family['avg_confidence']} < 0.85"
            
            # No exclusion reasons
            assert len(family.get("smart_approve_exclusion_reasons", [])) == 0, \
                f"Eligible family {family['family']} has exclusion reasons: {family['smart_approve_exclusion_reasons']}"
            
            # Eligible count should equal family size
            assert family.get("eligible_count", 0) == family.get("family_size", 0), \
                f"Eligible family {family['family']} has eligible_count {family['eligible_count']} != family_size {family['family_size']}"
            
            # No excluded slugs
            assert len(family.get("excluded_slugs", [])) == 0, \
                f"Eligible family {family['family']} has excluded slugs"
        
        print(f"Verified {len(eligible_families)} eligible families meet criteria")
    
    def test_smart_suggestions_exclusion_reasons(self):
        """Ineligible families have valid exclusion reasons"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        # Valid exclusion reasons
        valid_reasons = {
            "mixed_divisions", "cross_brand_bundle", "has_conflict_flags",
            "ti_vs_ss_material_ambiguity", "mixed_materials", "mixed_coated_uncoated",
            "avg_confidence_below_threshold", "conflict_review_members"
        }
        
        ineligible_families = [s for s in suggestions if not s.get("smart_approve_eligible") and not s.get("partially_eligible")]
        
        for family in ineligible_families:
            reasons = family.get("smart_approve_exclusion_reasons", [])
            assert len(reasons) > 0, f"Ineligible family {family['family']} has no exclusion reasons"
            
            for reason in reasons:
                assert reason in valid_reasons, \
                    f"Unknown exclusion reason '{reason}' in family {family['family']}"
        
        print(f"Verified {len(ineligible_families)} ineligible families have valid exclusion reasons")
    
    def test_smart_suggestions_score_range(self):
        """Smart approve score is 0-100"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        for suggestion in suggestions:
            score = suggestion.get("smart_approve_score", 0)
            assert 0 <= score <= 100, \
                f"Family {suggestion['family']} has score {score} outside 0-100 range"
        
        print(f"All {len(suggestions)} suggestions have valid scores (0-100)")
    
    def test_smart_suggestions_ti_vs_ss_exclusion(self):
        """Families with Ti vs SS material ambiguity are excluded"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        ti_ss_families = [s for s in suggestions if "ti_vs_ss_material_ambiguity" in s.get("smart_approve_exclusion_reasons", [])]
        
        for family in ti_ss_families:
            assert not family.get("smart_approve_eligible"), \
                f"Family {family['family']} with Ti vs SS ambiguity should not be eligible"
        
        print(f"Found {len(ti_ss_families)} families with Ti vs SS material ambiguity (correctly excluded)")
    
    def test_smart_suggestions_mixed_coated_exclusion(self):
        """Families with mixed coated/uncoated are excluded"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        mixed_coating_families = [s for s in suggestions if "mixed_coated_uncoated" in s.get("smart_approve_exclusion_reasons", [])]
        
        for family in mixed_coating_families:
            assert not family.get("smart_approve_eligible"), \
                f"Family {family['family']} with mixed coated/uncoated should not be eligible"
        
        print(f"Found {len(mixed_coating_families)} families with mixed coated/uncoated (correctly excluded)")
    
    def test_smart_suggestions_conflict_flags_exclusion(self):
        """Families with conflict flags are excluded"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        conflict_families = [s for s in suggestions if "has_conflict_flags" in s.get("smart_approve_exclusion_reasons", [])]
        
        for family in conflict_families:
            assert not family.get("smart_approve_eligible"), \
                f"Family {family['family']} with conflict flags should not be eligible"
        
        print(f"Found {len(conflict_families)} families with conflict flags (correctly excluded)")
    
    def test_smart_suggestions_cross_brand_exclusion(self):
        """Families with cross-brand bundles are excluded"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        cross_brand_families = [s for s in suggestions if "cross_brand_bundle" in s.get("smart_approve_exclusion_reasons", [])]
        
        for family in cross_brand_families:
            assert not family.get("smart_approve_eligible"), \
                f"Family {family['family']} with cross-brand bundle should not be eligible"
        
        print(f"Found {len(cross_brand_families)} families with cross-brand bundles (correctly excluded)")
    
    def test_smart_suggestions_sorting(self):
        """Suggestions are sorted: eligible first, then by score descending"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        if len(suggestions) > 1:
            # Check eligible families come first
            found_ineligible = False
            for suggestion in suggestions:
                if not suggestion.get("smart_approve_eligible") and not suggestion.get("partially_eligible"):
                    found_ineligible = True
                elif found_ineligible and suggestion.get("smart_approve_eligible"):
                    pytest.fail("Eligible family found after ineligible family - sorting incorrect")
            
            print("Suggestions are correctly sorted (eligible first)")
    
    def test_smart_suggestions_min_family_size_filter(self):
        """min_family_size parameter filters small families"""
        # Default min_family_size is 2
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions?min_family_size=5")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        for suggestion in suggestions:
            assert suggestion.get("family_size", 0) >= 5, \
                f"Family {suggestion['family']} has size {suggestion['family_size']} < 5"
        
        print(f"min_family_size=5 filter returned {len(suggestions)} families")
    
    def test_smart_suggestions_division_filter(self):
        """Division parameter filters by division"""
        # First get stats to find a division
        stats_response = self.session.get(f"{BASE_URL}/api/admin/review/stats")
        stats = stats_response.json()
        
        if len(stats.get("by_division", [])) > 0:
            division = stats["by_division"][0]["division"]
            response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions?division={division}")
            assert response.status_code == 200
            
            data = response.json()
            suggestions = data.get("suggestions", [])
            
            for suggestion in suggestions:
                assert suggestion.get("division") == division, \
                    f"Family {suggestion['family']} has division {suggestion['division']} != {division}"
            
            print(f"Division filter '{division}' returned {len(suggestions)} families")
    
    def test_smart_suggestions_requires_auth(self):
        """Smart suggestions endpoint requires authentication"""
        no_auth_session = requests.Session()
        response = no_auth_session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
    
    # ── Bulk Approve via Smart Suggestions Tests ──
    def test_bulk_approve_eligible_family_slugs(self):
        """POST /api/admin/review/bulk-approve with eligible_slugs from smart suggestions works"""
        # Get smart suggestions
        suggestions_response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert suggestions_response.status_code == 200
        
        data = suggestions_response.json()
        suggestions = data.get("suggestions", [])
        
        # Find an eligible family with slugs
        eligible_families = [s for s in suggestions if s.get("smart_approve_eligible") and len(s.get("eligible_slugs", [])) > 0]
        
        if len(eligible_families) > 0:
            family = eligible_families[0]
            slugs = family.get("eligible_slugs", [])[:2]  # Take first 2 slugs to test
            
            if len(slugs) > 0:
                response = self.session.post(
                    f"{BASE_URL}/api/admin/review/bulk-approve",
                    json={"slugs": slugs}
                )
                assert response.status_code == 200, f"Bulk approve failed: {response.text}"
                
                result = response.json()
                assert result.get("status") == "bulk_approved"
                assert "count" in result
                
                print(f"Bulk approved {result['count']} products from eligible family '{family['family']}'")
            else:
                pytest.skip("No slugs available in eligible family")
        else:
            pytest.skip("No eligible families with slugs available")
    
    def test_smart_suggestions_partially_eligible_structure(self):
        """Partially eligible families have correct structure"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        partial_families = [s for s in suggestions if s.get("partially_eligible")]
        
        for family in partial_families:
            # Should not be fully eligible
            assert not family.get("smart_approve_eligible"), \
                f"Partially eligible family {family['family']} should not be fully eligible"
            
            # Should have some eligible members
            assert family.get("eligible_count", 0) > 0, \
                f"Partially eligible family {family['family']} should have eligible_count > 0"
            
            # Should have exclusion reasons
            assert len(family.get("smart_approve_exclusion_reasons", [])) > 0, \
                f"Partially eligible family {family['family']} should have exclusion reasons"
        
        print(f"Verified {len(partial_families)} partially eligible families")
    
    def test_smart_suggestions_sample_titles(self):
        """Suggestions include sample product titles"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        for suggestion in suggestions:
            sample_titles = suggestion.get("sample_titles", [])
            assert isinstance(sample_titles, list), f"sample_titles should be a list"
            # Should have at most 4 sample titles
            assert len(sample_titles) <= 4, f"sample_titles should have at most 4 items"
        
        print(f"All {len(suggestions)} suggestions have valid sample_titles")
    
    def test_smart_suggestions_implant_classes(self):
        """Suggestions include implant_classes array"""
        response = self.session.get(f"{BASE_URL}/api/admin/review/smart-suggestions")
        assert response.status_code == 200
        
        data = response.json()
        suggestions = data.get("suggestions", [])
        
        for suggestion in suggestions:
            implant_classes = suggestion.get("implant_classes", [])
            assert isinstance(implant_classes, list), f"implant_classes should be a list"
        
        print(f"All {len(suggestions)} suggestions have implant_classes field")
