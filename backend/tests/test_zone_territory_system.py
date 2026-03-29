"""
Test Zone/Territory System - Iteration 54
Tests for:
- Lead creation with equal department scoring (Cardiology = Ortho = ENT = 25pts)
- Zone auto-detection for Hyderabad districts
- All leads assigned to 'Agile Healthcare' (no Arka/Medisun/Pride)
- IP geolocation detection
- Visitor event tracking
- Zone analytics
- Territory penetration with 13 Meril divisions
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Basic health check"""
    
    def test_api_health(self):
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print("✓ API health check passed")


class TestLeadCreationWithEqualScoring:
    """Test lead creation with equal department scoring"""
    
    def test_cardiology_lead_scores_equally_to_orthopedics(self):
        """Cardiology department should score 25pts (same as Orthopedics)"""
        # Create Cardiology lead
        cardiology_lead = {
            "name": f"TEST_Cardio_{uuid.uuid4().hex[:6]}",
            "phone_whatsapp": f"+91987654{uuid.uuid4().hex[:4]}",
            "department": "Cardiology",
            "hospital_clinic": "Test Hospital",
            "email": "test@example.com",
            "district": "Hyderabad",
            "inquiry_type": "Sales Enquiry",
            "product_interest": "Cardiac Stents"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=cardiology_lead)
        assert response.status_code == 200, f"Failed to create Cardiology lead: {response.text}"
        data = response.json()
        cardio_score = data["lead"]["lead_score"]
        print(f"✓ Cardiology lead created with score: {cardio_score}")
        
        # Create Orthopedics lead with same attributes
        ortho_lead = {
            "name": f"TEST_Ortho_{uuid.uuid4().hex[:6]}",
            "phone_whatsapp": f"+91987654{uuid.uuid4().hex[:4]}",
            "department": "Orthopedics",
            "hospital_clinic": "Test Hospital",
            "email": "test@example.com",
            "district": "Hyderabad",
            "inquiry_type": "Sales Enquiry",
            "product_interest": "Trauma Implants"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=ortho_lead)
        assert response.status_code == 200, f"Failed to create Orthopedics lead: {response.text}"
        data = response.json()
        ortho_score = data["lead"]["lead_score"]
        print(f"✓ Orthopedics lead created with score: {ortho_score}")
        
        # Both should have same score (department contributes 25pts each)
        assert cardio_score == ortho_score, f"Cardiology ({cardio_score}) should equal Orthopedics ({ortho_score})"
        assert cardio_score >= 85, f"Score should be 85+ (got {cardio_score})"
        print(f"✓ Both departments score equally: {cardio_score}")
    
    def test_ent_lead_from_warangal_assigned_to_agile_healthcare(self):
        """ENT lead from Warangal should be assigned to 'Agile Healthcare'"""
        lead = {
            "name": f"TEST_ENT_{uuid.uuid4().hex[:6]}",
            "phone_whatsapp": f"+91987654{uuid.uuid4().hex[:4]}",
            "department": "ENT",
            "hospital_clinic": "Warangal ENT Hospital",
            "district": "Warangal",
            "inquiry_type": "Product Enquiry"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead)
        assert response.status_code == 200, f"Failed to create ENT lead: {response.text}"
        data = response.json()
        
        assert data["lead"]["assigned_to"] == "Agile Healthcare", f"Expected 'Agile Healthcare', got '{data['lead']['assigned_to']}'"
        assert data["lead"]["department"] == "ENT"
        assert data["lead"]["district"] == "Warangal"
        print(f"✓ ENT lead from Warangal assigned to: {data['lead']['assigned_to']}")
    
    def test_hyderabad_lead_auto_detects_zone_02(self):
        """Hyderabad district should auto-detect zone_02 (primary zone)"""
        lead = {
            "name": f"TEST_Zone_{uuid.uuid4().hex[:6]}",
            "phone_whatsapp": f"+91987654{uuid.uuid4().hex[:4]}",
            "department": "Orthopedics",
            "hospital_clinic": "Hyderabad Hospital",
            "district": "Hyderabad",
            "inquiry_type": "Sales Enquiry"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead)
        assert response.status_code == 200, f"Failed to create lead: {response.text}"
        data = response.json()
        
        assert data["lead"]["zone_id"] == "zone_02", f"Expected 'zone_02', got '{data['lead'].get('zone_id')}'"
        assert "Zone 02" in data["lead"]["zone_name"], f"Expected 'Zone 02' in zone_name, got '{data['lead'].get('zone_name')}'"
        print(f"✓ Hyderabad lead auto-detected zone: {data['lead']['zone_id']} - {data['lead']['zone_name']}")


class TestZoneEndpoints:
    """Test zone-related endpoints"""
    
    def test_get_zones_returns_4_zones_all_agile_healthcare(self):
        """GET /api/geo/zones should return 4 zones, all with operator 'Agile Healthcare'"""
        response = requests.get(f"{BASE_URL}/api/geo/zones")
        assert response.status_code == 200, f"Failed to get zones: {response.text}"
        data = response.json()
        
        zones = data["zones"]
        assert len(zones) == 4, f"Expected 4 zones, got {len(zones)}"
        
        # Verify all zones have 'Agile Healthcare' as operator (no Arka/Medisun/Pride)
        for zone in zones:
            assert zone["operator"] == "Agile Healthcare", f"Zone {zone['zone_id']} has operator '{zone['operator']}' instead of 'Agile Healthcare'"
            assert "Arka" not in zone["operator"]
            assert "Medisun" not in zone["operator"]
            assert "Pride" not in zone["operator"]
        
        # Verify zone names
        zone_ids = [z["zone_id"] for z in zones]
        assert "zone_01" in zone_ids
        assert "zone_02" in zone_ids
        assert "zone_03" in zone_ids
        assert "zone_04" in zone_ids
        
        print(f"✓ All 4 zones have operator 'Agile Healthcare'")
        print(f"  - Zone 01: {zones[0]['accounts']} accounts")
        print(f"  - Zone 02: {zones[1]['accounts']} accounts (primary)")
        print(f"  - Zone 03: {zones[2]['accounts']} accounts")
        print(f"  - Zone 04: {zones[3]['accounts']} accounts")
        print(f"  - Total metro accounts: {data['total_metro_accounts']}")
    
    def test_geo_detect_returns_geo_data(self):
        """GET /api/geo/detect should return geo data (city, region, lat, lon)"""
        response = requests.get(f"{BASE_URL}/api/geo/detect")
        assert response.status_code == 200, f"Failed to detect geo: {response.text}"
        data = response.json()
        
        # Should have geo fields (may be empty in preview env due to IP detection)
        assert "city" in data
        assert "region" in data
        assert "lat" in data
        assert "lon" in data
        assert "zone_id" in data
        assert "zone_name" in data
        assert "district" in data
        
        print(f"✓ Geo detect returned: city={data.get('city')}, region={data.get('region')}, lat={data.get('lat')}, lon={data.get('lon')}")


class TestVisitorTracking:
    """Test visitor event tracking"""
    
    def test_track_visitor_event(self):
        """POST /api/geo/track should accept visitor events"""
        event = {
            "event_type": "page_view",
            "page": "/",
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}",
            "zone_id": "zone_02",
            "zone_name": "Zone 02 — Ameerpet/Hitech City",
            "district": "Hyderabad"
        }
        response = requests.post(f"{BASE_URL}/api/geo/track", json=event)
        assert response.status_code == 200, f"Failed to track event: {response.text}"
        data = response.json()
        assert data["ok"] == True
        print(f"✓ Visitor event tracked successfully")
    
    def test_track_search_event(self):
        """Track a search event"""
        event = {
            "event_type": "search",
            "search_query": "trauma implants",
            "page": "/catalog",
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}",
            "zone_id": "zone_02",
            "district": "Hyderabad"
        }
        response = requests.post(f"{BASE_URL}/api/geo/track", json=event)
        assert response.status_code == 200, f"Failed to track search event: {response.text}"
        print(f"✓ Search event tracked successfully")


class TestZoneAnalytics:
    """Test zone analytics endpoints"""
    
    def test_zone_analytics(self):
        """GET /api/geo/zone-analytics should return zone-level lead analytics"""
        response = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        assert response.status_code == 200, f"Failed to get zone analytics: {response.text}"
        data = response.json()
        
        assert "zone_analytics" in data
        print(f"✓ Zone analytics returned: {len(data['zone_analytics'])} zones with data")
    
    def test_visitor_insights(self):
        """GET /api/geo/visitor-insights should return search/visit data"""
        response = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        assert response.status_code == 200, f"Failed to get visitor insights: {response.text}"
        data = response.json()
        
        assert "top_searches_by_zone" in data
        assert "visits_by_zone" in data
        assert "top_pages" in data
        print(f"✓ Visitor insights returned: {len(data['top_searches_by_zone'])} top searches, {len(data['visits_by_zone'])} zone visits")


class TestTerritoryPenetration:
    """Test territory penetration analytics"""
    
    def test_territory_penetration_returns_district_breakdown(self):
        """GET /api/geo/territory-penetration should return district breakdown"""
        response = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        assert response.status_code == 200, f"Failed to get territory penetration: {response.text}"
        data = response.json()
        
        assert "district_breakdown" in data
        assert "zero_lead_districts" in data
        assert "division_gaps" in data
        assert "all_divisions" in data
        
        print(f"✓ Territory penetration returned:")
        print(f"  - Districts with leads: {len(data['district_breakdown'])}")
        print(f"  - Zero-lead districts: {len(data['zero_lead_districts'])}")
        print(f"  - Division gaps: {len(data['division_gaps'])}")
    
    def test_all_divisions_contains_13_meril_divisions(self):
        """all_divisions should contain all 13 Meril divisions"""
        response = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        assert response.status_code == 200
        data = response.json()
        
        all_divisions = data["all_divisions"]
        assert len(all_divisions) == 13, f"Expected 13 divisions, got {len(all_divisions)}"
        
        expected_divisions = [
            "Trauma", "Joints / Arthroplasty", "Spine", "Cardiology",
            "Endosurgery", "Endo", "ENT", "Diagnostics", "Vascular",
            "Consumables", "Sports Medicine", "Dental", "Orthobiologics"
        ]
        
        for div in expected_divisions:
            assert div in all_divisions, f"Missing division: {div}"
        
        print(f"✓ All 13 Meril divisions present: {all_divisions}")


class TestDepartmentScoring:
    """Test that all departments score equally (25pts each)"""
    
    def test_all_departments_score_25_points(self):
        """All departments should contribute 25 points to lead score"""
        departments_to_test = [
            "Orthopedics", "Cardiology", "ENT", "Diagnostics / Pathology",
            "Vascular Surgery", "Endosurgery", "Dental", "Sports Medicine"
        ]
        
        scores = {}
        for dept in departments_to_test:
            lead = {
                "name": f"TEST_Score_{uuid.uuid4().hex[:6]}",
                "phone_whatsapp": f"+91987654{uuid.uuid4().hex[:4]}",
                "department": dept,
                "inquiry_type": "General"  # 5 pts
            }
            response = requests.post(f"{BASE_URL}/api/leads", json=lead)
            assert response.status_code == 200
            data = response.json()
            scores[dept] = data["lead"]["lead_score"]
        
        # All should have same base score (department 25 + inquiry 5 = 30)
        base_score = 30
        for dept, score in scores.items():
            assert score == base_score, f"{dept} scored {score}, expected {base_score}"
        
        print(f"✓ All departments score equally: {base_score} points")
        for dept, score in scores.items():
            print(f"  - {dept}: {score}")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_leads(self):
        """Note: Test leads prefixed with TEST_ should be cleaned up"""
        print("✓ Test leads created with TEST_ prefix for easy identification")
        print("  Note: Manual cleanup may be needed for TEST_ prefixed leads")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
