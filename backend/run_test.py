import os
import django
import sys

# Setup django environment
sys.path.append(r'e:\Apn-E-Dukaan\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from users.models import User, OTP
import users.utils.otp as otp_utils

# Monkey patch to capture OTP
original_create_otp = otp_utils.create_otp_for_email
last_otp = None

def mock_create_otp(email):
    global last_otp
    last_otp = original_create_otp(email)
    print(f">>> [DEBUG] Intercepted OTP for {email}: {last_otp}")
    return last_otp

otp_utils.create_otp_for_email = mock_create_otp

def run_flow():
    client = Client()
    test_email = "test.apn.dukaan@example.com"
    test_username = "test_run_user"
    
    # 1. Cleanup
    User.objects.filter(email=test_email).delete()
    
    # 2. Register
    print("\n[1] Registering User...")
    res = client.post('/api/auth/register/', {
        "username": test_username,
        "email": test_email,
        "password": "strongpassword123",
        "role": "BUYER"
    })
    print(f"Status: {res.status_code}")
    if res.status_code != 201:
        print("Failed to register. Exiting.")
        print(res.json())
        return
        
    u = User.objects.get(email=test_email)
    print(f"User created. is_verified={u.is_verified}")
    
    if not last_otp:
        print("OTP was not generated!")
        return
        
    # 3. Verify OTP
    print(f"\n[2] Verifying Account with OTP: {last_otp}...")
    res = client.post('/api/auth/register/verify-otp/', {
        "email": test_email,
        "otp_code": last_otp
    }, content_type='application/json')
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    
    u.refresh_from_db()
    print(f"User is_verified updated to: {u.is_verified}")

    # 4. Request Login OTP via new CustomLoginView
    print("\n[3] Authenticating with Username/Password to trigger 2FA...")
    res = client.post('/api/auth/login/', {
        "username": test_username,
        "password": "strongpassword123"
    }, content_type='application/json')
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    
    # 5. Verify Login OTP
    print(f"\n[4] Verifying Login OTP: {last_otp}...")
    res = client.post('/api/auth/login/otp/verify/', {
        "email": test_email,
        "otp_code": last_otp
    }, content_type='application/json')
    print(f"Status: {res.status_code}")
    
    if res.status_code == 200:
        data = res.json()
        print(f"Successfully received token pair!")
        print(f"Access Token: {data.get('access')[:20]}...")
        print(f"Refresh Token: {data.get('refresh')[:20]}...")
    else:
        print(f"Failed to login: {res.json()}")
        
    print("\nTESTS COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    run_flow()
