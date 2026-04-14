from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Notification, Report, LoginActivity
from .serializers import (
    RegisterSerializer, UserSerializer, NotificationSerializer, ReportSerializer,
    OTPRequestSerializer, OTPVerifySerializer
)
from .utils.otp import create_otp_for_email, verify_otp
from .utils.email import send_registration_otp, send_welcome_email, send_login_otp, send_login_alert


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.is_verified = False # ensure it requires OTP verification
        user.save()
        
        # generate OTP and send
        if user.email:
            otp_code = create_otp_for_email(user.email)
            send_registration_otp(user.email, otp_code)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class SellerProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'id'

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(reporter=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class VerifyRegistrationOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            
            is_valid, msg = verify_otp(email, otp_code)
            if not is_valid:
                return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                user = User.objects.get(email=email)
                if user.is_verified:
                    return Response({'message': 'User is already verified.'}, status=status.HTTP_200_OK)
                
                user.is_verified = True
                user.save()
                
                # Send welcome email asynchronously
                send_welcome_email(user.email, user.username)
                
                return Response({'message': 'Account verified successfully. You can now login.'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginWithOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                if not user.is_verified:
                    return Response({'error': 'Please verify your account first.'}, status=status.HTTP_403_FORBIDDEN)
                
                # Generate OTP and send email
                otp_code = create_otp_for_email(user.email)
                send_login_otp(user.email, otp_code)
                
                return Response({
                    'message': 'Credentials verified. OTP sent to email.',
                    'email': user.email
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


class RequestLoginOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                if not user.is_verified:
                    return Response({'error': 'Please verify your account first.'}, status=status.HTTP_403_FORBIDDEN)
                
                otp_code = create_otp_for_email(email)
                send_login_otp(email, otp_code)
                return Response({'message': 'Login OTP sent to your email.'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'No account found with this email.'}, status=status.HTTP_404_NOT_FOUND)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyLoginOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            
            is_valid, msg = verify_otp(email, otp_code)
            if not is_valid:
                # Log failed attempt if user exists
                try:
                    user = User.objects.get(email=email)
                    LoginActivity.objects.create(
                        user=user, 
                        ip_address=request.META.get('REMOTE_ADDR'), 
                        device=request.META.get('HTTP_USER_AGENT'),
                        status='FAILED_OTP'
                    )
                except User.DoesNotExist:
                    pass
                return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                user = User.objects.get(email=email)
                
                # Log successful attempt
                ip_address = request.META.get('REMOTE_ADDR')
                device = request.META.get('HTTP_USER_AGENT')
                from django.utils import timezone
                time_now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
                
                LoginActivity.objects.create(
                    user=user, 
                    ip_address=ip_address, 
                    device=device,
                    status='SUCCESS'
                )
                
                # Send Login Alert
                send_login_alert(user.email, user.username, ip_address, device, time_now)
                
                # Generate Tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            action = request.data.get('action', 'login') # 'registration' or 'login'
            
            try:
                user = User.objects.get(email=email)
                otp_code = create_otp_for_email(email)
                
                if action == 'registration':
                    send_registration_otp(email, otp_code)
                else:
                    send_login_otp(email, otp_code)
                    
                return Response({'message': f'New OTP sent for {action}.'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'No account found with this email.'}, status=status.HTTP_404_NOT_FOUND)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
