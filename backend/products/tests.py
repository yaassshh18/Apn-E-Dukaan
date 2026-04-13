from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product, Category
from users.models import User

class ProductApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.seller = User.objects.create_user(username='testseller', password='password', role='SELLER', location='Mumbai')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.product = Product.objects.create(
            seller=self.seller,
            category=self.category,
            title='Test Item',
            description='Test Description',
            price=100.00
        )
        self.product_url = '/api/products/'

    def test_get_all_products(self):
        response = self.client.get(self.product_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Note: DRF pagination dictates results are in 'results' key
        self.assertGreaterEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Item')

    def test_search_filter(self):
        response = self.client.get(f'{self.product_url}?search=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        response_empty = self.client.get(f'{self.product_url}?search=RandomTextToFail')
        self.assertEqual(response_empty.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_empty.data['results']), 0)
        
    def test_location_filter(self):
        response = self.client.get(f'{self.product_url}?location=Mumbai')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
