from rest_framework import serializers
from .models import User, Notification, Report

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'location', 'latitude', 'longitude', 'is_verified', 'profile_picture')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'role', 'location')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("user with this email address already exists.")
        return value

    def create(self, validated_data):
        email = validated_data.get('email')
        # Generate a username since the default AbstractUser still requires it in internal logic
        import uuid
        base_username = email.split('@')[0]
        unique_username = f"{base_username}_{uuid.uuid4().hex[:6]}"
        
        user = User.objects.create_user(
            username=unique_username,
            email=email,
            password=validated_data['password'],
            role=validated_data.get('role', 'BUYER'),
            location=validated_data.get('location', '')
        )
        return user

class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
