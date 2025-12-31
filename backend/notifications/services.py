import africastalking
from django.conf import settings
from django.utils import timezone
from .models import SMSNotification


class SMSService:
    """Service for sending SMS notifications via Africa's Talking"""
    
    def __init__(self):
        # Initialize Africa's Talking
        africastalking.initialize(
            username=settings.AT_USERNAME,
            api_key=settings.AT_API_KEY
        )
        self.sms = africastalking.SMS
    
    def send_sms(self, recipient_user, message):
        """
        Send SMS to a user and log the notification
        
        Args:
            recipient_user: User object
            message: SMS message text
        
        Returns:
            SMSNotification object
        """
        # Create notification record
        notification = SMSNotification.objects.create(
            recipient=recipient_user,
            phone_number=recipient_user.phone_number,
            message=message,
            status='PENDING'
        )
        
        try:
            # Send SMS via Africa's Talking
            response = self.sms.send(
                message=message,
                recipients=[recipient_user.phone_number],
                sender_id=settings.AT_SENDER_ID
            )
            
            # Update notification status
            if response['SMSMessageData']['Recipients']:
                recipient_data = response['SMSMessageData']['Recipients'][0]
                
                if recipient_data['status'] == 'Success':
                    notification.status = 'SENT'
                    notification.sent_at = timezone.now()
                    notification.external_id = recipient_data.get('messageId', '')
                else:
                    notification.status = 'FAILED'
                    notification.error_message = recipient_data.get('status', 'Unknown error')
            else:
                notification.status = 'FAILED'
                notification.error_message = 'No recipients in response'
                
        except Exception as e:
            notification.status = 'FAILED'
            notification.error_message = str(e)
        
        notification.save()
        return notification
    
    def send_contribution_verified_sms(self, contribution):
        """Send SMS notification when contribution is verified"""
        message = (
            f"Dear {contribution.member.first_name}, "
            f"your contribution of KES {contribution.amount} "
            f"for {contribution.contribution_type.name} has been verified. "
            f"Transaction: {contribution.mpesa_transaction_code}. "
            f"Thank you!"
        )
        return self.send_sms(contribution.member, message)
    
    def send_contribution_rejected_sms(self, contribution):
        """Send SMS notification when contribution is rejected"""
        message = (
            f"Dear {contribution.member.first_name}, "
            f"your contribution of KES {contribution.amount} "
            f"for {contribution.contribution_type.name} has been rejected. "
            f"Reason: {contribution.rejection_reason}. "
            f"Please contact admin for more details."
        )
        return self.send_sms(contribution.member, message)
    
    def send_bulk_sms(self, recipients, message):
        """
        Send SMS to multiple users
        
        Args:
            recipients: List of User objects
            message: SMS message text
        
        Returns:
            List of SMSNotification objects
        """
        notifications = []
        for recipient in recipients:
            notification = self.send_sms(recipient, message)
            notifications.append(notification)
        return notifications