from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('BUYER', 'Buyer'),
        ('SELLER', 'Seller'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='BUYER')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} - {self.role}"

class Notification(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=50, blank=True, null=True) # e.g. "ORDER", "MESSAGE"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"To {self.user.username}: {self.message}"

class Report(models.Model):
    reporter = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='filed_reports')
    reported_user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='received_reports', null=True, blank=True)
    reported_product = models.ForeignKey('products.Product', on_delete=models.CASCADE, null=True, blank=True)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=[('PENDING', 'Pending'), ('REVIEWED', 'Reviewed')], default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.reporter.username}"

class OTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=128) # Hashed OTP code
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_time = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP for {self.email}"

class LoginActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_activities')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='SUCCESS') # e.g. SUCCESS, FAILED_OTP

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.status} at {self.timestamp}"
