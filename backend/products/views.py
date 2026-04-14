from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, Product, Review, Wishlist
from .serializers import CategorySerializer, ProductSerializer, ReviewSerializer, WishlistSerializer
from .permissions import IsSellerOrAdminOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('seller', 'category').prefetch_related('reviews__user').order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
        
    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        location = self.request.query_params.get('location', None)
        sort = self.request.query_params.get('sort', None)
        seller_id = self.request.query_params.get('seller', None)
        
        if seller_id:
            queryset = queryset.filter(seller_id=seller_id)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if search:
            queryset = queryset.filter(title__icontains=search)
        if location:
            queryset = queryset.filter(seller__location__icontains=location)
            
        if sort == 'trending':
            return queryset.order_by('-views_count', '-purchases_count', '-created_at')
            
        return queryset.order_by('-created_at')

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        product = self.get_object()
        product.views_count += 1
        product.save()
        return Response({'status': 'view incremented'})

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # The product_id usually comes from the URL, assuming nested or passed in data
        serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product__seller', 'product__category')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
