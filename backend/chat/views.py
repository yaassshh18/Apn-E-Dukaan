from rest_framework import viewsets, permissions
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from django.db.models import Q

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.request.query_params.get('user_id', None)
        
        qs = ChatMessage.objects.filter(Q(sender=user) | Q(receiver=user)).select_related('sender', 'receiver', 'product').order_by('created_at')
        if other_user_id:
             qs = qs.filter(Q(sender_id=other_user_id) | Q(receiver_id=other_user_id))
        return qs

    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver_id')
        product_id = self.request.data.get('product_id')
        is_offer = self.request.data.get('is_offer', False)
        offer_amount = self.request.data.get('offer_amount')
        
        if is_offer and offer_amount is not None:
            if float(offer_amount) <= 0:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Offer amount must be greater than zero.")
                
        serializer.save(sender=self.request.user, receiver_id=receiver_id, product_id=product_id)

    def perform_update(self, serializer):
        instance = self.get_object()
        if 'offer_status' in self.request.data:
            if self.request.user != instance.receiver:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Only the receiver can update the offer status.")
        serializer.save()
