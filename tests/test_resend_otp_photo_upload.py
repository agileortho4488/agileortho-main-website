"""
Test new features for OrthoConnect:
1. Resend OTP functionality (30s countdown)
2. Change number link (resets OTP flow)
3. Profile photo upload endpoint
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestOTPResendFlow:
    """Test OTP request/resend functionality"""
    
    def test_otp_request_returns_ok(self):
        """OTP request should return ok=True"""
        response = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "1234567890"  # Invalid number - will return mocked OTP
        })
        assert response.status_code == 200
        data = response.json()
        assert data.get("ok") == True
        assert "sms_sent" in data
        print(f"✅ OTP request successful: sms_sent={data.get('sms_sent')}")
    
    def test_otp_resend_works_same_as_request(self):
        """Resend OTP uses same endpoint as initial request"""
        # First request
        response1 = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "1234567891"
        })
        assert response1.status_code == 200
        data1 = response1.json()
        
        # Second request (resend) - same endpoint
        response2 = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "1234567891"
        })
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Both should return ok=True
        assert data1.get("ok") == True
        assert data2.get("ok") == True
        print(f"✅ Resend OTP works correctly (same endpoint)")
    
    def test_otp_request_with_valid_indian_number(self):
        """OTP request with valid 10-digit Indian number should send real SMS"""
        response = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "9876543210"  # Valid format
        })
        assert response.status_code == 200
        data = response.json()
        assert data.get("ok") == True
        
        # Check if real SMS was sent
        if data.get("sms_sent"):
            print(f"✅ Real SMS sent via 2Factor.in")
            assert data.get("mocked_otp") is None
        else:
            print(f"⚠️ SMS not sent, mocked OTP: {data.get('mocked_otp')}")


class TestProfilePhotoUpload:
    """Test profile photo upload endpoint"""
    
    @pytest.fixture
    def surgeon_token(self):
        """Get a surgeon token via OTP flow"""
        # Request OTP with invalid number to get mocked OTP
        otp_response = requests.post(f"{BASE_URL}/api/auth/otp/request", json={
            "mobile": "1234567892"
        })
        assert otp_response.status_code == 200
        otp_data = otp_response.json()
        
        # Get mocked OTP
        if otp_data.get("mocked_otp"):
            code = otp_data["mocked_otp"]
        else:
            pytest.skip("Real SMS sent, cannot get OTP for automated test")
        
        # Verify OTP
        verify_response = requests.post(f"{BASE_URL}/api/auth/otp/verify", json={
            "mobile": "1234567892",
            "code": code
        })
        assert verify_response.status_code == 200
        return verify_response.json()["token"]
    
    def test_photo_upload_requires_profile_first(self, surgeon_token):
        """Photo upload should return 404 if profile doesn't exist"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # Create a simple test image
        image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {
            'file': ('test_photo.png', io.BytesIO(image_content), 'image/png')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/surgeon/me/profile/photo",
            headers=headers,
            files=files
        )
        
        # Should return 404 because profile doesn't exist yet
        assert response.status_code == 404, f"Expected 404, got {response.status_code}: {response.text}"
        data = response.json()
        assert "profile" in data.get("detail", "").lower() or "not found" in data.get("detail", "").lower()
        print(f"✅ Photo upload correctly requires profile first: {data.get('detail')}")
    
    def test_photo_upload_after_profile_creation(self, surgeon_token):
        """Photo upload should work after profile is created"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # First create a profile
        profile_payload = {
            "qualifications": "MBBS, MS Ortho",
            "registration_number": "PHOTO_TEST_123",
            "subspecialties": ["Knee"],
            "about": "Test surgeon for photo upload",
            "website": "",
            "conditions_treated": ["ACL tear"],
            "procedures_performed": ["ACL reconstruction"],
            "locations": [{
                "id": "photo-test-loc-1",
                "facility_name": "Photo Test Hospital",
                "address": "123 Photo Street",
                "city": "Mumbai",
                "pincode": "400001",
                "opd_timings": "9 AM - 5 PM",
                "phone": "9876543210"
            }]
        }
        
        profile_response = requests.put(
            f"{BASE_URL}/api/surgeon/me/profile",
            json=profile_payload,
            headers=headers
        )
        assert profile_response.status_code == 200, f"Profile creation failed: {profile_response.text}"
        print(f"✅ Profile created successfully")
        
        # Now upload photo
        image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {
            'file': ('test_photo.png', io.BytesIO(image_content), 'image/png')
        }
        
        photo_response = requests.post(
            f"{BASE_URL}/api/surgeon/me/profile/photo",
            headers=headers,
            files=files
        )
        
        assert photo_response.status_code == 200, f"Photo upload failed: {photo_response.text}"
        data = photo_response.json()
        assert data.get("ok") == True
        assert data.get("photo_visibility") == "admin_only"
        print(f"✅ Photo uploaded successfully with visibility: {data.get('photo_visibility')}")
    
    def test_photo_upload_accepts_jpg(self, surgeon_token):
        """Photo upload should accept JPG format"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # First ensure profile exists
        profile_payload = {
            "qualifications": "MBBS, MS Ortho",
            "registration_number": "JPG_TEST_123",
            "subspecialties": ["Shoulder"],
            "about": "Test surgeon for JPG upload",
            "website": "",
            "conditions_treated": ["Rotator cuff tear"],
            "procedures_performed": ["Shoulder arthroscopy"],
            "locations": [{
                "id": "jpg-test-loc-1",
                "facility_name": "JPG Test Hospital",
                "address": "456 JPG Street",
                "city": "Delhi",
                "pincode": "110001",
                "opd_timings": "10 AM - 6 PM",
                "phone": "9876543211"
            }]
        }
        
        requests.put(f"{BASE_URL}/api/surgeon/me/profile", json=profile_payload, headers=headers)
        
        # Create a minimal JPEG
        jpeg_content = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9teletext\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xfb\xd5\xff\xd9'
        
        files = {
            'file': ('test_photo.jpg', io.BytesIO(jpeg_content), 'image/jpeg')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/surgeon/me/profile/photo",
            headers=headers,
            files=files
        )
        
        assert response.status_code == 200, f"JPG upload failed: {response.text}"
        print(f"✅ JPG photo upload accepted")
    
    def test_photo_upload_rejects_invalid_format(self, surgeon_token):
        """Photo upload should reject non-image formats"""
        headers = {"Authorization": f"Bearer {surgeon_token}"}
        
        # First ensure profile exists
        profile_payload = {
            "qualifications": "MBBS, MS Ortho",
            "registration_number": "INVALID_FORMAT_TEST",
            "subspecialties": ["Spine"],
            "about": "Test surgeon for invalid format",
            "website": "",
            "conditions_treated": ["Back pain"],
            "procedures_performed": ["Spine surgery"],
            "locations": [{
                "id": "invalid-test-loc-1",
                "facility_name": "Invalid Test Hospital",
                "address": "789 Invalid Street",
                "city": "Chennai",
                "pincode": "600001",
                "opd_timings": "8 AM - 4 PM",
                "phone": "9876543212"
            }]
        }
        
        requests.put(f"{BASE_URL}/api/surgeon/me/profile", json=profile_payload, headers=headers)
        
        # Try to upload a text file
        files = {
            'file': ('test.txt', io.BytesIO(b'This is not an image'), 'text/plain')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/surgeon/me/profile/photo",
            headers=headers,
            files=files
        )
        
        # Should return 400 error
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        print(f"✅ Invalid format correctly rejected")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """API root should return message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✅ API root: {data['message']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
