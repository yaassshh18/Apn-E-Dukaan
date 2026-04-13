from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User

class OrderSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.buyer = User.objects.create_user(username='testbuyer', password='password', role='BUYER')
        self.admin = User.objects.create_user(username='testadmin', password='password', role='ADMIN')
        self.orders_url = '/api/orders/'

    def test_unauthenticated_cannot_access_orders(self):
        response = self.client.get(self.orders_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_authenticated_buyer_can_access_orders(self):
        # Obtain token
        login_res = self.client.post('/api/auth/login/', {'username': 'testbuyer', 'password': 'password'})
        token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.get(self.orders_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
