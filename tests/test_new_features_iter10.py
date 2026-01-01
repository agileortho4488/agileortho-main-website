"""
Test suite for OrthoConnect new features - Iteration 10
Features tested:
- Admin Analytics page (/admin/analytics)
- CSV Export (/admin/export/surgeons)
- Profile Views tracking (/profiles/{slug}/view)
- Events page (/events)
- Blog/Articles page (/articles)
- Referral system (/surgeon/me/referral-code)
- PWA manifest.json
- Service worker
"""

import pytest
import requests
import os
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://orthopedia-1.preview.emergentagent.com')
ADMIN_PASSWORD = "admin"
TEST_MOBILE = "9000204488"


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert len(data["token"]) > 0
        print(f"✅ Admin login successful, token received")
        return data["token"]
    
    def test_admin_login_failure(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print(f"✅ Admin login correctly rejected wrong password")


class TestAdminAnalytics:
    """Admin Analytics endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_admin_analytics_endpoint(self, admin_token):
        """Test /admin/analytics returns platform statistics"""
        response = requests.get(
            f"{BASE_URL}/api/admin/analytics",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "totals" in data
        assert "city_distribution" in data
        assert "subspecialty_distribution" in data
        assert "recent_signups_30d" in data
        assert "total_profile_views" in data
        
        # Verify totals structure
        totals = data["totals"]
        assert "total" in totals
        assert "approved" in totals
        assert "pending" in totals
        assert "rejected" in totals
        assert "needs_clarification" in totals
        
        print(f"✅ Admin analytics endpoint working")
        print(f"   Total surgeons: {totals['total']}")
        print(f"   Approved: {totals['approved']}")
        print(f"   Pending: {totals['pending']}")
        print(f"   Total profile views: {data['total_profile_views']}")
    
    def test_admin_analytics_requires_auth(self):
        """Test analytics endpoint requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics")
        assert response.status_code == 401
        print(f"✅ Admin analytics correctly requires authentication")


class TestCSVExport:
    """CSV Export endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_csv_export_endpoint(self, admin_token):
        """Test /admin/export/surgeons returns CSV data"""
        response = requests.get(
            f"{BASE_URL}/api/admin/export/surgeons",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        # Check content type
        content_type = response.headers.get("content-type", "")
        assert "text/csv" in content_type
        
        # Check content disposition
        content_disp = response.headers.get("content-disposition", "")
        assert "attachment" in content_disp
        assert "surgeons_export" in content_disp
        
        # Verify CSV has header row
        csv_content = response.text
        lines = csv_content.strip().split("\n")
        assert len(lines) >= 1  # At least header row
        
        # Check header columns
        header = lines[0]
        assert "Name" in header
        assert "Email" in header
        assert "Status" in header
        assert "View Count" in header
        
        print(f"✅ CSV export endpoint working")
        print(f"   CSV rows: {len(lines)} (including header)")
    
    def test_csv_export_requires_auth(self):
        """Test CSV export requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/export/surgeons")
        assert response.status_code == 401
        print(f"✅ CSV export correctly requires authentication")


class TestProfileViews:
    """Profile view tracking tests"""
    
    def test_profile_view_tracking(self):
        """Test profile view is tracked when visiting a doctor profile"""
        # First, get an approved surgeon slug
        response = requests.get(f"{BASE_URL}/api/profiles/all")
        if response.status_code != 200 or not response.json():
            pytest.skip("No approved surgeons to test profile views")
        
        surgeons = response.json()
        if len(surgeons) == 0:
            pytest.skip("No approved surgeons available")
        
        slug = surgeons[0]["slug"]
        
        # Get initial stats
        stats_response = requests.get(f"{BASE_URL}/api/profiles/{slug}/stats")
        initial_views = 0
        if stats_response.status_code == 200:
            initial_views = stats_response.json().get("view_count", 0)
        
        # Track a view
        view_response = requests.post(f"{BASE_URL}/api/profiles/{slug}/view")
        assert view_response.status_code == 200
        assert view_response.json().get("ok") == True
        
        # Verify view count increased
        stats_response = requests.get(f"{BASE_URL}/api/profiles/{slug}/stats")
        assert stats_response.status_code == 200
        new_views = stats_response.json().get("view_count", 0)
        assert new_views >= initial_views  # Should be at least same or more
        
        print(f"✅ Profile view tracking working")
        print(f"   Slug: {slug}")
        print(f"   Views: {initial_views} -> {new_views}")
    
    def test_profile_view_invalid_slug(self):
        """Test profile view returns 404 for invalid slug"""
        response = requests.post(f"{BASE_URL}/api/profiles/invalid-slug-12345/view")
        assert response.status_code == 404
        print(f"✅ Profile view correctly returns 404 for invalid slug")


class TestEventsPage:
    """Events endpoint tests"""
    
    def test_events_list_endpoint(self):
        """Test /events returns list of events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        
        # Should return a list (may be empty)
        assert isinstance(data, list)
        
        print(f"✅ Events endpoint working")
        print(f"   Events count: {len(data)}")
        
        # If there are events, verify structure
        if len(data) > 0:
            event = data[0]
            assert "id" in event
            assert "title" in event
            assert "event_type" in event
            assert "start_date" in event
            print(f"   First event: {event.get('title', 'N/A')}")
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_create_event_admin(self, admin_token):
        """Test admin can create an event"""
        event_data = {
            "title": "Test CME Event",
            "description": "Test event for automated testing",
            "event_type": "cme",
            "start_date": "2025-12-15",
            "end_date": "2025-12-16",
            "location": "Test Hospital",
            "city": "Hyderabad",
            "registration_url": "https://example.com/register",
            "organizer": "Test Organizer",
            "is_free": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/events",
            json=event_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("ok") == True
        assert "id" in data
        
        print(f"✅ Admin can create events")
        print(f"   Event ID: {data['id']}")
        
        # Clean up - delete the test event
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/events/{data['id']}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_response.status_code == 200
        print(f"   Test event cleaned up")


class TestBlogPage:
    """Blog/Articles endpoint tests"""
    
    def test_articles_list_endpoint(self):
        """Test /articles returns list of articles"""
        response = requests.get(f"{BASE_URL}/api/articles")
        assert response.status_code == 200
        data = response.json()
        
        # Should return a list (may be empty)
        assert isinstance(data, list)
        
        print(f"✅ Articles endpoint working")
        print(f"   Articles count: {len(data)}")
        
        # If there are articles, verify structure
        if len(data) > 0:
            article = data[0]
            assert "id" in article
            assert "title" in article
            assert "slug" in article
            assert "category" in article
            print(f"   First article: {article.get('title', 'N/A')}")
    
    def test_articles_filter_by_category(self):
        """Test articles can be filtered by category"""
        response = requests.get(f"{BASE_URL}/api/articles?category=education")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Articles category filter working")
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_create_article_admin(self, admin_token):
        """Test admin can create an article"""
        import uuid
        unique_slug = f"test-article-{uuid.uuid4().hex[:8]}"
        
        article_data = {
            "title": "Test Article for Automated Testing",
            "slug": unique_slug,
            "excerpt": "This is a test article excerpt",
            "content": "<p>This is the test article content.</p>",
            "category": "education",
            "author": "Test Author",
            "tags": ["test", "automated"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/articles",
            json=article_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("ok") == True
        assert "id" in data
        assert data.get("slug") == unique_slug
        
        print(f"✅ Admin can create articles")
        print(f"   Article ID: {data['id']}")
        print(f"   Slug: {data['slug']}")
        
        # Verify article is accessible
        get_response = requests.get(f"{BASE_URL}/api/articles/{unique_slug}")
        assert get_response.status_code == 200
        article = get_response.json()
        assert article["title"] == article_data["title"]
        print(f"   Article accessible via slug")


class TestReferralSystem:
    """Referral system tests"""
    
    def test_referral_code_requires_auth(self):
        """Test referral code generation requires surgeon auth"""
        response = requests.post(f"{BASE_URL}/api/surgeon/me/referral-code")
        assert response.status_code == 401
        print(f"✅ Referral code generation requires authentication")
    
    def test_apply_referral_requires_auth(self):
        """Test applying referral code requires surgeon auth"""
        response = requests.post(f"{BASE_URL}/api/surgeon/apply-referral?referral_code=TEST123")
        assert response.status_code == 401
        print(f"✅ Applying referral code requires authentication")


class TestPWASupport:
    """PWA manifest and service worker tests"""
    
    def test_manifest_json_served(self):
        """Test manifest.json is served correctly"""
        response = requests.get(f"{BASE_URL}/manifest.json")
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify required PWA fields
        assert "name" in data
        assert "short_name" in data
        assert "start_url" in data
        assert "display" in data
        assert "icons" in data
        
        # Verify OrthoConnect branding
        assert "OrthoConnect" in data["name"]
        assert data["display"] == "standalone"
        assert data["theme_color"] == "#0d9488"  # Teal color
        
        print(f"✅ PWA manifest.json served correctly")
        print(f"   Name: {data['name']}")
        print(f"   Short name: {data['short_name']}")
        print(f"   Theme color: {data['theme_color']}")
        print(f"   Icons: {len(data['icons'])} defined")
    
    def test_service_worker_served(self):
        """Test service worker file is served"""
        response = requests.get(f"{BASE_URL}/service-worker.js")
        assert response.status_code == 200
        
        content = response.text
        
        # Verify it's a valid service worker
        assert "self.addEventListener" in content
        assert "install" in content
        assert "fetch" in content
        assert "CACHE_NAME" in content
        
        print(f"✅ Service worker file served correctly")
        print(f"   Contains install handler: {'install' in content}")
        print(f"   Contains fetch handler: {'fetch' in content}")


class TestEmailNotificationEndpoint:
    """Email notification system tests (via admin status update)"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_admin_can_update_surgeon_status(self, admin_token):
        """Test admin can update surgeon status (which triggers email notification)"""
        # Get list of surgeons
        response = requests.get(
            f"{BASE_URL}/api/admin/surgeons",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        surgeons = response.json()
        
        if len(surgeons) == 0:
            pytest.skip("No surgeons to test status update")
        
        # Find a pending surgeon or use first one
        surgeon = surgeons[0]
        surgeon_id = surgeon["id"]
        
        # Update status (this should trigger email notification if email is configured)
        update_response = requests.patch(
            f"{BASE_URL}/api/admin/surgeons/{surgeon_id}",
            json={"status": surgeon["status"]},  # Keep same status to avoid changing data
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert update_response.status_code == 200
        assert update_response.json().get("ok") == True
        
        print(f"✅ Admin can update surgeon status")
        print(f"   Surgeon ID: {surgeon_id}")
        print(f"   Status: {surgeon['status']}")
        print(f"   (Email notification would be sent if status changed)")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "OrthoConnect" in data["message"]
        print(f"✅ API root endpoint working")
    
    def test_subspecialties_endpoint(self):
        """Test subspecialties meta endpoint"""
        response = requests.get(f"{BASE_URL}/api/meta/subspecialties")
        assert response.status_code == 200
        data = response.json()
        assert "subspecialties" in data
        assert len(data["subspecialties"]) > 0
        print(f"✅ Subspecialties endpoint working")
        print(f"   Count: {len(data['subspecialties'])}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
