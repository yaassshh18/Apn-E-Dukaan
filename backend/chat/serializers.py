from rest_framework import serializers
from .models import ChatMessage
from users.serializers import UserSerializer
from products.serializers import ProductSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True)
    product_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = ChatMessage
        fields = '__all__'
