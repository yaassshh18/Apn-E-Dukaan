from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
import threading

class EmailThread(threading.Thread):
    def __init__(self, email_msg):
        self.email_msg = email_msg
        threading.Thread.__init__(self)

    def run(self):
        try:
            self.email_msg.send()
        except Exception as e:
            # We can log this in a robust system
            print(f"Error sending email: {e}")

def send_html_email(subject, template_name, context, recipient_list):
    """
    Renders an HTML template with context and sends it via email asynchronously.
    """
    html_content = render_to_string(template_name, context)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.EMAIL_HOST_USER,
        to=recipient_list
    )
    email.attach_alternative(html_content, "text/html")
    
    # Send asynchronously using threading
    EmailThread(email).start()

def send_registration_otp(email, otp_code):
    subject = "Verify your Apn-E-Dukaan account"
    context = {
        'otp_code': otp_code,
        'action': 'registration'
    }
    send_html_email(subject, 'emails/registration_otp.html', context, [email])

def send_welcome_email(email, username):
    subject = "Welcome to Apn-E-Dukaan 🎉"
    context = {
        'username': username
    }
    send_html_email(subject, 'emails/welcome.html', context, [email])

def send_login_otp(email, otp_code):
    subject = "Your Login OTP - Apn-E-Dukaan"
    context = {
        'otp_code': otp_code,
        'action': 'login'
    }
    send_html_email(subject, 'emails/login_otp.html', context, [email])

def send_login_alert(email, username, ip_address, device, time):
    subject = "Successful Login Alert - Apn-E-Dukaan"
    context = {
        'username': username,
        'ip_address': ip_address,
        'device': device,
        'time': time
    }
    send_html_email(subject, 'emails/login_alert.html', context, [email])
