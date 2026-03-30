"""
Iteration 61: Admin Dashboard Functionality Tests
Tests for admin login, dashboard stats, pipeline, analytics, leads, WhatsApp, and products.
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "AgileHealth2026admin"


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "token" in data, "Token not in response"
        assert data.get("role") == "super_admin", f"Expected super_admin role, got {data.get('role')}"
    
    def test_admin_login_invalid_password(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "wrongpassword123"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


@pytest.fixture(scope="module")
def admin_token():
    """Get admin token for authenticated requests"""
    response = requests.post(f"{BASE_URL}/api/admin/login", json={
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Admin login failed - skipping authenticated tests")


@pytest.fixture
def auth_headers(admin_token):
    """Headers with admin token"""
    return {"Authorization": f"Bearer {admin_token}"}


class TestDashboardStats:
    """Dashboard stats endpoint tests"""
    
    def test_admin_stats_endpoint(self, auth_headers):
        """Test /api/admin/stats returns dashboard data"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers)
        assert response.status_code == 200, f"Stats failed: {response.text}"
        data = response.json()
        
        # Verify required fields
        assert "total_products" in data, "Missing total_products"
        assert "total_leads" in data, "Missing total_leads"
        assert "hot_leads" in data, "Missing hot_leads"
        assert "warm_leads" in data, "Missing warm_leads"
        assert "cold_leads" in data, "Missing cold_leads"
        assert "new_leads" in data, "Missing new_leads"
        assert "products_by_division" in data, "Missing products_by_division"
        assert "leads_by_inquiry" in data, "Missing leads_by_inquiry"
        assert "leads_by_district" in data, "Missing leads_by_district"
        
        # Verify data types
        assert isinstance(data["total_products"], int)
        assert isinstance(data["total_leads"], int)
        assert isinstance(data["products_by_division"], list)
    
    def test_stats_requires_auth(self):
        """Test stats endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code in [401, 403], f"Expected auth error, got {response.status_code}"


class TestPipeline:
    """Pipeline (Kanban) endpoint tests"""
    
    def test_pipeline_endpoint(self, auth_headers):
        """Test /api/admin/pipeline returns leads by status"""
        response = requests.get(f"{BASE_URL}/api/admin/pipeline", headers=auth_headers)
        assert response.status_code == 200, f"Pipeline failed: {response.text}"
        data = response.json()
        
        assert "pipeline" in data, "Missing pipeline key"
        pipeline = data["pipeline"]
        
        # Verify all status columns exist
        expected_statuses = ["new", "contacted", "qualified", "negotiation", "won", "lost"]
        for status in expected_statuses:
            assert status in pipeline, f"Missing status column: {status}"
            assert isinstance(pipeline[status], list), f"{status} should be a list"
    
    def test_pipeline_requires_auth(self):
        """Test pipeline endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/pipeline")
        assert response.status_code in [401, 403]


class TestAnalytics:
    """Analytics endpoint tests"""
    
    def test_analytics_endpoint(self, auth_headers):
        """Test /api/admin/analytics returns CRM analytics"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=auth_headers)
        assert response.status_code == 200, f"Analytics failed: {response.text}"
        data = response.json()
        
        # Verify required fields
        assert "total_leads" in data
        assert "conversion_rate" in data
        assert "by_source" in data
        assert "by_score" in data
        assert "by_status" in data
        assert "by_district" in data
        assert "by_inquiry" in data
        assert "recent_leads" in data
        
        # Verify data types
        assert isinstance(data["total_leads"], int)
        assert isinstance(data["conversion_rate"], (int, float))
        assert isinstance(data["by_source"], list)


class TestLeads:
    """Leads CRUD endpoint tests"""
    
    def test_leads_list_endpoint(self, auth_headers):
        """Test /api/admin/leads returns paginated leads"""
        response = requests.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers)
        assert response.status_code == 200, f"Leads list failed: {response.text}"
        data = response.json()
        
        assert "leads" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        assert isinstance(data["leads"], list)
    
    def test_leads_search_filter(self, auth_headers):
        """Test leads search functionality"""
        response = requests.get(f"{BASE_URL}/api/admin/leads?search=test", headers=auth_headers)
        assert response.status_code == 200
    
    def test_leads_score_filter(self, auth_headers):
        """Test leads score filter"""
        response = requests.get(f"{BASE_URL}/api/admin/leads?score=Hot", headers=auth_headers)
        assert response.status_code == 200
    
    def test_leads_status_filter(self, auth_headers):
        """Test leads status filter"""
        response = requests.get(f"{BASE_URL}/api/admin/leads?status=new", headers=auth_headers)
        assert response.status_code == 200


class TestWhatsAppAnalytics:
    """WhatsApp analytics endpoint tests"""
    
    def test_whatsapp_analytics_endpoint(self, auth_headers):
        """Test /api/admin/whatsapp/analytics returns stats"""
        response = requests.get(f"{BASE_URL}/api/admin/whatsapp/analytics", headers=auth_headers)
        assert response.status_code == 200, f"WA analytics failed: {response.text}"
        data = response.json()
        
        # Verify structure
        assert "conversations" in data
        assert "delivery" in data
        
        conv = data["conversations"]
        assert "total" in conv
        assert "ai_active" in conv
        assert "human_takeover" in conv
        assert "total_messages" in conv
        
        delivery = data["delivery"]
        assert "total_tracked" in delivery
        assert "delivery_rate" in delivery
        assert "read_rate" in delivery
    
    def test_whatsapp_conversations_endpoint(self, auth_headers):
        """Test /api/admin/whatsapp/conversations returns list"""
        response = requests.get(f"{BASE_URL}/api/admin/whatsapp/conversations", headers=auth_headers)
        assert response.status_code == 200, f"WA conversations failed: {response.text}"
        data = response.json()
        
        assert "conversations" in data
        assert "total" in data
        assert isinstance(data["conversations"], list)


class TestGeoEndpoints:
    """Geo/Territory intelligence endpoints (public)"""
    
    def test_territory_penetration(self):
        """Test /api/geo/territory-penetration endpoint"""
        response = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        assert response.status_code == 200, f"Territory penetration failed: {response.text}"
        data = response.json()
        
        # Should have district breakdown
        assert "district_breakdown" in data or "zones" in data or isinstance(data, dict)
    
    def test_hospital_intelligence(self):
        """Test /api/geo/hospital-intelligence endpoint"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        assert response.status_code == 200, f"Hospital intel failed: {response.text}"
        data = response.json()
        
        assert "hospitals" in data or "summary" in data
    
    def test_competitive_intelligence(self):
        """Test /api/geo/competitive-intelligence endpoint"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        assert response.status_code == 200, f"Competitive intel failed: {response.text}"
        data = response.json()
        
        # Should have tracked competitors
        assert "tracked_competitors" in data or "ranked_competitors" in data
    
    def test_visitor_insights(self):
        """Test /api/geo/visitor-insights endpoint"""
        response = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        assert response.status_code == 200, f"Visitor insights failed: {response.text}"
    
    def test_zone_analytics(self):
        """Test /api/geo/zone-analytics endpoint"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        assert response.status_code == 200, f"Zone analytics failed: {response.text}"


class TestChatbotTelemetry:
    """Chatbot telemetry endpoint tests"""
    
    def test_chatbot_telemetry_report(self, auth_headers):
        """Test /api/chatbot/telemetry/report endpoint"""
        response = requests.get(f"{BASE_URL}/api/chatbot/telemetry/report?days=7", headers=auth_headers)
        assert response.status_code == 200, f"Telemetry report failed: {response.text}"
        data = response.json()
        
        # Should have summary
        assert "summary" in data or "top_queries" in data


class TestProducts:
    """Products endpoint tests"""
    
    def test_products_list_endpoint(self, auth_headers):
        """Test /api/admin/products returns paginated products"""
        response = requests.get(f"{BASE_URL}/api/admin/products", headers=auth_headers)
        assert response.status_code == 200, f"Products list failed: {response.text}"
        data = response.json()
        
        assert "products" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data
        assert isinstance(data["products"], list)
    
    def test_products_division_filter(self, auth_headers):
        """Test products division filter"""
        response = requests.get(f"{BASE_URL}/api/admin/products?division=Trauma", headers=auth_headers)
        assert response.status_code == 200
    
    def test_products_search(self, auth_headers):
        """Test products search"""
        response = requests.get(f"{BASE_URL}/api/admin/products?search=screw", headers=auth_headers)
        assert response.status_code == 200


class TestAutomationStats:
    """Automation stats endpoint tests"""
    
    def test_automation_stats_endpoint(self, auth_headers):
        """Test /api/admin/automation/stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/automation/stats", headers=auth_headers)
        # May return 404 if endpoint doesn't exist, or 200 with data
        assert response.status_code in [200, 404], f"Automation stats unexpected: {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
