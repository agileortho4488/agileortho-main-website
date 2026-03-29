"""
Iteration 56 Backend Tests - Zone Analytics, Hospital Intelligence, Competitive Intelligence
Tests for:
1. Territory tab shows ALL 4 zones with accounts/hospitals/labs/penetration
2. Hospital Intelligence - multi-department engagement tracking
3. Competitive Intelligence - 24 tracked competitor brands
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestZoneAnalytics:
    """Zone Analytics endpoint tests - ALL 4 zones must be returned"""
    
    def test_zone_analytics_returns_all_4_zones(self):
        """Verify zone-analytics returns all 4 zones even with 0 leads"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        assert response.status_code == 200
        
        data = response.json()
        assert "zone_analytics" in data
        zones = data["zone_analytics"]
        
        # Must have exactly 4 zones
        assert len(zones) == 4, f"Expected 4 zones, got {len(zones)}"
        
        # Verify all 4 zone IDs present
        expected_zones = ["zone_01", "zone_02", "zone_03", "zone_04"]
        for zone_id in expected_zones:
            assert zone_id in zones, f"Missing zone: {zone_id}"
    
    def test_zone_analytics_has_required_fields(self):
        """Each zone must have accounts, hospitals, labs, penetration_pct, missing_divisions"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        assert response.status_code == 200
        
        zones = response.json()["zone_analytics"]
        required_fields = ["zone_name", "accounts", "hospitals", "labs", "penetration_pct", 
                          "missing_divisions", "total_leads", "hot_leads", "warm_leads", "cold_leads"]
        
        for zone_id, zone_data in zones.items():
            for field in required_fields:
                assert field in zone_data, f"Zone {zone_id} missing field: {field}"
    
    def test_zone_01_kukatpally_data(self):
        """Verify Zone 01 Kukatpally has correct static data"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        zone = response.json()["zone_analytics"]["zone_01"]
        
        assert zone["zone_name"] == "Zone 01 — Kukatpally"
        assert zone["accounts"] == 365
        assert zone["hospitals"] == 209
        assert zone["labs"] == 156
        assert isinstance(zone["penetration_pct"], (int, float))
        assert isinstance(zone["missing_divisions"], list)
    
    def test_zone_02_ameerpet_primary(self):
        """Verify Zone 02 is marked as primary"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        zone = response.json()["zone_analytics"]["zone_02"]
        
        assert zone["zone_name"] == "Zone 02 — Ameerpet/Hitech City"
        assert zone["accounts"] == 413
        assert zone["hospitals"] == 276
        assert zone["is_primary"] == True
    
    def test_zone_03_central_city_data(self):
        """Verify Zone 03 Central City data"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        zone = response.json()["zone_analytics"]["zone_03"]
        
        assert zone["zone_name"] == "Zone 03 — Central City/Old City"
        assert zone["accounts"] == 379
        assert zone["hospitals"] == 226
        assert zone["labs"] == 153
    
    def test_zone_04_dilsukhnagar_data(self):
        """Verify Zone 04 Dilsukhnagar/Secunderabad data"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        zone = response.json()["zone_analytics"]["zone_04"]
        
        assert zone["zone_name"] == "Zone 04 — Dilsukhnagar/Secunderabad"
        assert zone["accounts"] == 734
        assert zone["hospitals"] == 430
        assert zone["labs"] == 304
    
    def test_marketing_opportunity_field(self):
        """Verify marketing_opportunity field equals missing_divisions count"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        zones = response.json()["zone_analytics"]
        
        for zone_id, zone_data in zones.items():
            missing_count = len(zone_data.get("missing_divisions", []))
            marketing_opp = zone_data.get("marketing_opportunity", 0)
            assert marketing_opp == missing_count, f"Zone {zone_id}: marketing_opportunity ({marketing_opp}) != missing_divisions count ({missing_count})"


class TestHospitalIntelligence:
    """Hospital Intelligence endpoint tests - multi-department engagement tracking"""
    
    def test_hospital_intelligence_endpoint(self):
        """Verify hospital-intelligence endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        assert response.status_code == 200
    
    def test_hospital_intelligence_structure(self):
        """Verify response has hospitals array and summary"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        data = response.json()
        
        assert "hospitals" in data
        assert "summary" in data
        assert isinstance(data["hospitals"], list)
        assert isinstance(data["summary"], dict)
    
    def test_hospital_summary_fields(self):
        """Verify summary has required fields"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        summary = response.json()["summary"]
        
        required_fields = ["total_hospitals", "single_department", "multi_department", 
                          "deep_engaged", "avg_departments_per_hospital", "top_upsell_opportunities"]
        for field in required_fields:
            assert field in summary, f"Summary missing field: {field}"
    
    def test_hospital_has_engagement_depth(self):
        """Verify each hospital has engagement_depth field"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        hospitals = response.json()["hospitals"]
        
        if hospitals:  # Only test if there are hospitals
            for h in hospitals[:5]:  # Check first 5
                assert "engagement_depth" in h
                assert h["engagement_depth"] in ["single", "moderate", "deep"]
    
    def test_hospital_has_upsell_opportunity(self):
        """Verify each hospital has upsell_opportunity count"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        hospitals = response.json()["hospitals"]
        
        if hospitals:
            for h in hospitals[:5]:
                assert "upsell_opportunity" in h
                assert isinstance(h["upsell_opportunity"], int)
    
    def test_hospital_has_missing_divisions(self):
        """Verify each hospital has missing_divisions list"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        hospitals = response.json()["hospitals"]
        
        if hospitals:
            for h in hospitals[:5]:
                assert "missing_divisions" in h
                assert isinstance(h["missing_divisions"], list)
    
    def test_top_upsell_opportunities(self):
        """Verify top_upsell_opportunities is sorted by upsell count"""
        response = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        top_upsell = response.json()["summary"]["top_upsell_opportunities"]
        
        if len(top_upsell) >= 2:
            # Should be sorted descending by upsell_opportunity
            for i in range(len(top_upsell) - 1):
                assert top_upsell[i]["upsell_opportunity"] >= top_upsell[i+1]["upsell_opportunity"]


class TestCompetitiveIntelligence:
    """Competitive Intelligence endpoint tests - 24 tracked competitor brands"""
    
    def test_competitive_intelligence_endpoint(self):
        """Verify competitive-intelligence endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        assert response.status_code == 200
    
    def test_tracked_competitors_count(self):
        """Verify 24 competitor brands are tracked"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        data = response.json()
        
        tracked = data.get("tracked_competitors", [])
        assert len(tracked) == 24, f"Expected 24 tracked competitors, got {len(tracked)}"
    
    def test_tracked_competitors_includes_major_brands(self):
        """Verify major competitor brands are tracked"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        tracked = response.json()["tracked_competitors"]
        
        major_brands = ["Stryker", "Zimmer Biomet", "Medtronic", "Abbott", "Boston Scientific"]
        for brand in major_brands:
            assert brand in tracked, f"Missing major brand: {brand}"
    
    def test_competitive_intel_structure(self):
        """Verify response has required fields"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        data = response.json()
        
        required_fields = ["total_competitor_mentions", "unique_competitors_detected", 
                          "ranked_competitors", "division_threats", "tracked_competitors"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
    
    def test_competitor_mentions_is_integer(self):
        """Verify total_competitor_mentions is an integer"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        data = response.json()
        
        assert isinstance(data["total_competitor_mentions"], int)
        assert isinstance(data["unique_competitors_detected"], int)
    
    def test_ranked_competitors_structure(self):
        """Verify ranked_competitors has correct structure when present"""
        response = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        ranked = response.json()["ranked_competitors"]
        
        assert isinstance(ranked, list)
        # If there are ranked competitors, verify structure
        if ranked:
            for comp in ranked:
                assert "competitor" in comp
                assert "mention_count" in comp
                assert "threatened_divisions" in comp
                assert "meril_counter_products" in comp


class TestTerritoryPenetration:
    """Territory Penetration endpoint tests"""
    
    def test_territory_penetration_endpoint(self):
        """Verify territory-penetration endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        assert response.status_code == 200
    
    def test_territory_penetration_structure(self):
        """Verify response has required fields"""
        response = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        data = response.json()
        
        required_fields = ["district_breakdown", "zero_lead_districts", "division_gaps", "all_divisions"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
    
    def test_all_divisions_count(self):
        """Verify all 13 Meril divisions are listed"""
        response = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        divisions = response.json()["all_divisions"]
        
        assert len(divisions) == 13, f"Expected 13 divisions, got {len(divisions)}"


class TestVisitorInsights:
    """Visitor Insights endpoint tests"""
    
    def test_visitor_insights_endpoint(self):
        """Verify visitor-insights endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        assert response.status_code == 200
    
    def test_visitor_insights_structure(self):
        """Verify response has required fields"""
        response = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        data = response.json()
        
        required_fields = ["top_searches_by_zone", "visits_by_zone", "top_pages"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"


class TestAdminAnalyticsAuth:
    """Admin Analytics endpoint tests with authentication"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "kOpcELYcEvkVtyDAE5-2uw"
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Admin authentication failed")
    
    def test_admin_analytics_requires_auth(self):
        """Verify admin analytics requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics")
        assert response.status_code in [401, 403]
    
    def test_admin_analytics_with_auth(self, auth_token):
        """Verify admin analytics works with auth"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=headers)
        assert response.status_code == 200
    
    def test_chatbot_telemetry_with_auth(self, auth_token):
        """Verify chatbot telemetry works with auth"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/chatbot/telemetry/report?days=7", headers=headers)
        assert response.status_code == 200
    
    def test_whatsapp_analytics_with_auth(self, auth_token):
        """Verify whatsapp analytics works with auth"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/whatsapp/analytics", headers=headers)
        assert response.status_code == 200
    
    def test_automation_stats_with_auth(self, auth_token):
        """Verify automation stats works with auth"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/automation/stats", headers=headers)
        assert response.status_code == 200
