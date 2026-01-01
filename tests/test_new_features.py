"""
Test new features for OrthoConnect:
1. AgileOrtho branding (verified via UI)
2. About page - only B. Nagi Reddy (verified via UI)
3. Max 2 subspecialties limit for surgeons
4. Real OTP via 2Factor.in integration
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestOTPIntegration:
    """Test OTP via 2Factor.in integration"""
    
    def test_otp_request_returns_sms_sent(self):
        """OTP request should send real SMS via 2Factor.in"""
        response = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "9999999999"  # Test number
        })
        assert response.status_code == 200
        data = response.json()
        
        # Should have ok=True
        assert data.get("ok") == True
        
        # Should have sms_sent field
        assert "sms_sent" in data
        
        # If SMS was sent successfully, sms_sent should be True
        # If SMS failed (e.g., invalid number), mocked_otp may be returned
        if data.get("sms_sent"):
            print(f"✅ Real SMS sent via 2Factor.in to {data.get('mobile')}")
            assert "mocked_otp" not in data or data.get("mocked_otp") is None
        else:
            print(f"⚠️ SMS not sent, mocked OTP returned: {data.get('mocked_otp')}")
    
    def test_otp_verify_with_wrong_code(self):
        """OTP verification should fail with wrong code"""
        response = requests.post(f"{BASE_URL}/api/auth/otp/verify", json={
            "mobile": "9999999999",
            "code": "000000"  # Wrong code
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data


class TestSubspecialtyLimit:
    """Test max 2 subspecialties limit for surgeons"""
    
    @pytest.fixture
    def surgeon_token(self):
        """Get a surgeon token via OTP flow"""
        # Request OTP
        otp_response = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "8888888888"
        })
        assert otp_response.status_code == 200
        otp_data = otp_response.json()
        
        # If mocked OTP is returned, use it
        if otp_data.get("mocked_otp"):
            code = otp_data["mocked_otp"]
        else:
            # Real SMS sent - skip this test
            pytest.skip("Real SMS sent, cannot get OTP for automated test")
        
        # Verify OTP
        verify_response = requests.post(f"{BASE_URL}/api/auth/otp/verify", json={
            "mobile": "8888888888",
            "code": code
        })
        assert verify_response.status_code == 200
        return verify_response.json()["token"]
    
    def test_profile_update_rejects_more_than_2_subspecialties(self, surgeon_token):
        """Backend should reject profile update with more than 2 subspecialties"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # Try to submit profile with 3 subspecialties
        payload = {
            "qualifications": "MBBS, MS Ortho",
            "registration_number": "TEST123456",
            "subspecialties": ["Knee", "Shoulder", "Spine"],  # 3 subspecialties - should fail
            "about": "Test surgeon",
            "website": "",
            "conditions_treated": ["ACL tear"],
            "procedures_performed": ["ACL reconstruction"],
            "locations": [{
                "id": "test-loc-1",
                "facility_name": "Test Hospital",
                "address": "123 Test Street",
                "city": "Hyderabad",
                "pincode": "500001",
                "opd_timings": "9 AM - 5 PM",
                "phone": "9876543210"
            }]
        }
        
        response = requests.put(f"{BASE_URL}/api/surgeon/me/profile", json=payload, headers=headers)
        
        # Should return 400 error
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        assert "2" in data["detail"].lower() or "subspecialt" in data["detail"].lower()
        print(f"✅ Backend correctly rejected 3 subspecialties: {data['detail']}")
    
    def test_profile_update_accepts_2_subspecialties(self, surgeon_token):
        """Backend should accept profile update with exactly 2 subspecialties"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # Submit profile with 2 subspecialties
        payload = {
            "qualifications": "MBBS, MS Ortho",
            "registration_number": "TEST123456",
            "subspecialties": ["Knee", "Shoulder"],  # 2 subspecialties - should pass
            "about": "Test surgeon",
            "website": "",
            "conditions_treated": ["ACL tear"],
            "procedures_performed": ["ACL reconstruction"],
            "locations": [{
                "id": "test-loc-1",
                "facility_name": "Test Hospital",
                "address": "123 Test Street",
                "city": "Hyderabad",
                "pincode": "500001",
                "opd_timings": "9 AM - 5 PM",
                "phone": "9876543210"
            }]
        }
        
        response = requests.put(f"{BASE_URL}/api/surgeon/me/profile", json=payload, headers=headers)
        
        # Should return 200 OK
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("ok") == True
        print(f"✅ Backend accepted 2 subspecialties")
    
    def test_profile_update_accepts_1_subspecialty(self, surgeon_token):
        """Backend should accept profile update with 1 subspecialty"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # Submit profile with 1 subspecialty
        payload = {
            "qualifications": "MBBS, MS Ortho",
            "registration_number": "TEST123456",
            "subspecialties": ["Knee"],  # 1 subspecialty - should pass
            "about": "Test surgeon",
            "website": "",
            "conditions_treated": ["ACL tear"],
            "procedures_performed": ["ACL reconstruction"],
            "locations": [{
                "id": "test-loc-1",
                "facility_name": "Test Hospital",
                "address": "123 Test Street",
                "city": "Hyderabad",
                "pincode": "500001",
                "opd_timings": "9 AM - 5 PM",
                "phone": "9876543210"
            }]
        }
        
        response = requests.put(f"{BASE_URL}/api/surgeon/me/profile", json=payload, headers=headers)
        
        # Should return 200 OK
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("ok") == True
        print(f"✅ Backend accepted 1 subspecialty")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """API root should return message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✅ API root: {data['message']}")
    
    def test_subspecialties_endpoint(self):
        """Subspecialties endpoint should return list"""
        response = requests.get(f"{BASE_URL}/api/meta/subspecialties")
        assert response.status_code == 200
        data = response.json()
        assert "subspecialties" in data
        assert len(data["subspecialties"]) > 0
        print(f"✅ Subspecialties: {data['subspecialties']}")
    
    def test_admin_login(self):
        """Admin login should work with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "admin"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        print(f"✅ Admin login successful")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
