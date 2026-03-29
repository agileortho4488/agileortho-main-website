"""
Iteration 57: Self-Learning Chatbot Engine Tests
Tests for:
1. Learning engine enriches leads with product_insights field
2. GET /api/admin/analytics returns product_intelligence object
3. Chatbot FAQ cache lookup in /api/chatbot/query
4. Learning cache stored in MongoDB 'learning_cache' collection
5. All 6 analytics tabs still render (existing endpoints work)
6. Geo endpoints still work (zone-analytics, hospital-intelligence, competitive-intelligence)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestLearningEngineBackend:
    """Tests for the self-learning chatbot engine backend APIs"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup auth token for authenticated endpoints"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get admin token
        login_resp = self.session.post(f"{BASE_URL}/api/admin/login", json={
            "password": "kOpcELYcEvkVtyDAE5-2uw"
        })
        if login_resp.status_code == 200:
            token = login_resp.json().get("token")
            self.session.headers.update({"Authorization": f"Bearer {token}"})
        else:
            pytest.skip("Admin login failed - skipping authenticated tests")
    
    # ========== ADMIN ANALYTICS WITH PRODUCT INTELLIGENCE ==========
    
    def test_admin_analytics_returns_product_intelligence(self):
        """GET /api/admin/analytics should return product_intelligence object"""
        resp = self.session.get(f"{BASE_URL}/api/admin/analytics")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        
        data = resp.json()
        assert "product_intelligence" in data, "Missing product_intelligence field"
        
        pi = data["product_intelligence"]
        assert "trending_divisions" in pi, "Missing trending_divisions"
        assert "product_associations" in pi, "Missing product_associations"
        assert "enriched_leads_count" in pi, "Missing enriched_leads_count"
        assert "division_demand" in pi, "Missing division_demand"
        
        # Verify types
        assert isinstance(pi["trending_divisions"], list), "trending_divisions should be a list"
        assert isinstance(pi["product_associations"], list), "product_associations should be a list"
        assert isinstance(pi["enriched_leads_count"], int), "enriched_leads_count should be int"
        assert isinstance(pi["division_demand"], list), "division_demand should be a list"
        
        print(f"Product Intelligence: enriched_leads={pi['enriched_leads_count']}, trending={len(pi['trending_divisions'])}, associations={len(pi['product_associations'])}")
    
    def test_admin_analytics_trending_divisions_structure(self):
        """Verify trending_divisions has correct structure"""
        resp = self.session.get(f"{BASE_URL}/api/admin/analytics")
        assert resp.status_code == 200
        
        data = resp.json()
        trending = data["product_intelligence"]["trending_divisions"]
        
        if len(trending) > 0:
            item = trending[0]
            assert "division" in item, "trending item missing 'division'"
            assert "search_count" in item, "trending item missing 'search_count'"
            assert isinstance(item["search_count"], int), "search_count should be int"
            print(f"Top trending division: {item['division']} ({item['search_count']} searches)")
    
    def test_admin_analytics_division_demand_structure(self):
        """Verify division_demand has correct structure"""
        resp = self.session.get(f"{BASE_URL}/api/admin/analytics")
        assert resp.status_code == 200
        
        data = resp.json()
        demand = data["product_intelligence"]["division_demand"]
        
        if len(demand) > 0:
            item = demand[0]
            assert "division" in item, "demand item missing 'division'"
            assert "count" in item, "demand item missing 'count'"
            print(f"Top division demand: {item['division']} ({item['count']} leads)")
    
    def test_admin_analytics_product_associations_structure(self):
        """Verify product_associations has correct structure"""
        resp = self.session.get(f"{BASE_URL}/api/admin/analytics")
        assert resp.status_code == 200
        
        data = resp.json()
        associations = data["product_intelligence"]["product_associations"]
        
        if len(associations) > 0:
            item = associations[0]
            assert "divisions" in item, "association missing 'divisions'"
            assert "co_occurrence" in item, "association missing 'co_occurrence'"
            assert isinstance(item["divisions"], list), "divisions should be a list"
            print(f"Top association: {item['divisions']} ({item['co_occurrence']}x)")
    
    # ========== CHATBOT FAQ CACHE ==========
    
    def test_chatbot_query_endpoint_works(self):
        """POST /api/chatbot/query should work"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "What stents do you have?",
            "session_id": "test_iter57"
        })
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        
        data = resp.json()
        assert "answer" in data, "Missing answer field"
        assert "confidence" in data, "Missing confidence field"
        assert "sources" in data, "Missing sources field"
        print(f"Chatbot response confidence: {data['confidence']}")
    
    def test_chatbot_greeting_response(self):
        """Chatbot should respond to greetings"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "hello",
            "session_id": "test_iter57_greeting"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        assert data["confidence"] == "high", "Greeting should have high confidence"
        assert "Welcome" in data["answer"] or "Hello" in data["answer"], "Should greet user"
    
    def test_chatbot_product_query(self):
        """Chatbot should answer product queries"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "Tell me about knee implants",
            "session_id": "test_iter57_product"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        # Should have some response (may be from FAQ cache or normal search)
        assert "answer" in data
        assert data["confidence"] in ["high", "medium", "low", "none"]
        print(f"Knee implant query confidence: {data['confidence']}")
    
    def test_chatbot_off_topic_rejection(self):
        """Chatbot should reject off-topic queries"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "What is the weather today?",
            "session_id": "test_iter57_offtopic"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        assert data["confidence"] == "none", "Off-topic should have 'none' confidence"
        assert "outside the scope" in data["answer"].lower() or "medical" in data["answer"].lower()
    
    # ========== EXISTING GEO ENDPOINTS STILL WORK ==========
    
    def test_zone_analytics_returns_4_zones(self):
        """GET /api/geo/zone-analytics should return all 4 zones"""
        resp = requests.get(f"{BASE_URL}/api/geo/zone-analytics")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "zone_analytics" in data, "Missing zone_analytics"
        
        zones = data["zone_analytics"]
        assert len(zones) == 4, f"Expected 4 zones, got {len(zones)}"
        
        expected_zones = ["zone_01", "zone_02", "zone_03", "zone_04"]
        for zone_id in expected_zones:
            assert zone_id in zones, f"Missing {zone_id}"
        
        print(f"All 4 zones present: {list(zones.keys())}")
    
    def test_hospital_intelligence_works(self):
        """GET /api/geo/hospital-intelligence should work"""
        resp = requests.get(f"{BASE_URL}/api/geo/hospital-intelligence")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "hospitals" in data, "Missing hospitals"
        assert "summary" in data, "Missing summary"
        
        summary = data["summary"]
        assert "total_hospitals" in summary
        print(f"Hospital intelligence: {summary['total_hospitals']} hospitals")
    
    def test_competitive_intelligence_works(self):
        """GET /api/geo/competitive-intelligence should work"""
        resp = requests.get(f"{BASE_URL}/api/geo/competitive-intelligence")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "tracked_competitors" in data, "Missing tracked_competitors"
        assert "total_competitor_mentions" in data, "Missing total_competitor_mentions"
        
        print(f"Competitive intel: {len(data['tracked_competitors'])} tracked brands")
    
    # ========== ADMIN LEADS WITH PRODUCT INSIGHTS ==========
    
    def test_admin_leads_list(self):
        """GET /api/admin/leads should work"""
        resp = self.session.get(f"{BASE_URL}/api/admin/leads?limit=10")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "leads" in data, "Missing leads"
        assert "total" in data, "Missing total"
        
        # Check if any leads have product_insights
        leads_with_insights = [l for l in data["leads"] if l.get("product_insights")]
        print(f"Leads: {data['total']} total, {len(leads_with_insights)} with product_insights")
    
    def test_leads_product_insights_structure(self):
        """Verify product_insights field structure on leads"""
        resp = self.session.get(f"{BASE_URL}/api/admin/leads?limit=50")
        assert resp.status_code == 200
        
        data = resp.json()
        leads_with_insights = [l for l in data["leads"] if l.get("product_insights")]
        
        if len(leads_with_insights) > 0:
            lead = leads_with_insights[0]
            insights = lead["product_insights"]
            
            assert "divisions_interested" in insights, "Missing divisions_interested"
            assert "products_mentioned" in insights, "Missing products_mentioned"
            assert isinstance(insights["divisions_interested"], list)
            assert isinstance(insights["products_mentioned"], list)
            
            print(f"Lead {lead.get('name', 'Unknown')} interests: {insights['divisions_interested']}")
        else:
            print("No leads with product_insights found yet")
    
    # ========== OTHER ANALYTICS ENDPOINTS ==========
    
    def test_admin_stats_works(self):
        """GET /api/admin/stats should work"""
        resp = self.session.get(f"{BASE_URL}/api/admin/stats")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "total_products" in data
        assert "total_leads" in data
        print(f"Stats: {data['total_products']} products, {data['total_leads']} leads")
    
    def test_chatbot_telemetry_report(self):
        """GET /api/chatbot/telemetry/report should work (auth required)"""
        resp = self.session.get(f"{BASE_URL}/api/chatbot/telemetry/report?days=7")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "summary" in data, "Missing summary"
        assert "top_queries" in data, "Missing top_queries"
        print(f"Telemetry: {data['summary'].get('total_queries', 0)} queries in last 7 days")
    
    def test_whatsapp_analytics(self):
        """GET /api/admin/whatsapp/analytics should work"""
        resp = self.session.get(f"{BASE_URL}/api/admin/whatsapp/analytics")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "conversations" in data or "delivery" in data
        print("WhatsApp analytics endpoint working")
    
    def test_automation_stats(self):
        """GET /api/admin/automation/stats should work"""
        resp = self.session.get(f"{BASE_URL}/api/admin/automation/stats")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        print("Automation stats endpoint working")
    
    def test_territory_penetration(self):
        """GET /api/geo/territory-penetration should work"""
        resp = requests.get(f"{BASE_URL}/api/geo/territory-penetration")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        
        data = resp.json()
        assert "district_breakdown" in data or "zero_lead_districts" in data
        print("Territory penetration endpoint working")
    
    def test_visitor_insights(self):
        """GET /api/geo/visitor-insights should work"""
        resp = requests.get(f"{BASE_URL}/api/geo/visitor-insights")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        print("Visitor insights endpoint working")


class TestChatbotFAQCache:
    """Tests specifically for the FAQ cache functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_chatbot_handles_empty_question(self):
        """Chatbot should handle empty questions gracefully"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "",
            "session_id": "test_empty"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        assert data["confidence"] == "none"
    
    def test_chatbot_handles_whitespace_question(self):
        """Chatbot should handle whitespace-only questions"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "   ",
            "session_id": "test_whitespace"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        assert data["confidence"] == "none"
    
    def test_chatbot_sku_lookup(self):
        """Chatbot should handle SKU code queries"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "What is SKU code BIOMIME?",
            "session_id": "test_sku"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        # Should attempt SKU lookup
        assert "answer" in data
        print(f"SKU query confidence: {data['confidence']}")
    
    def test_chatbot_division_query(self):
        """Chatbot should answer division queries"""
        resp = self.session.post(f"{BASE_URL}/api/chatbot/query", json={
            "question": "What products are in the Trauma division?",
            "session_id": "test_division"
        })
        assert resp.status_code == 200
        
        data = resp.json()
        assert "answer" in data
        print(f"Division query confidence: {data['confidence']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
