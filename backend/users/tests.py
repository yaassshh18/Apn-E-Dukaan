from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        
    def test_user_can_register(self):
        payload = {
            'username': 'testbuyer',
            'email': 'buyer@test.com',
            'password': 'strongpassword123',
            'role': 'BUYER',
            'location': 'Test City'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testbuyer').exists())
        self.assertEqual(User.objects.get(username='testbuyer').location, 'Test City')

    def test_user_can_login(self):
        User.objects.create_user(username='testlogin', password='testpassword123')
        payload = {
            'username': 'testlogin',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
