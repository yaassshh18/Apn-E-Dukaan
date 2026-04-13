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
        
        qs = ChatMessage.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('created_at')
        if other_user_id:
             qs = qs.filter(Q(sender_id=other_user_id) | Q(receiver_id=other_user_id))
        return qs

    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver_id')
        product_id = self.request.data.get('product_id')
        serializer.save(sender=self.request.user, receiver_id=receiver_id, product_id=product_id)
