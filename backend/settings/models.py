from django.db import models
from django.conf import settings


class UserSettings(models.Model):
    """User preferences and settings"""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='settings'
    )
    
    # Notification Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    
    # Notification Categories
    notify_contributions = models.BooleanField(default=True)
    notify_approvals = models.BooleanField(default=True)
    notify_reports = models.BooleanField(default=True)
    notify_updates = models.BooleanField(default=True)
    
    # App Preferences
    language = models.CharField(max_length=10, default='en')
    theme = models.CharField(
        max_length=10,
        choices=[('LIGHT', 'Light'), ('DARK', 'Dark'), ('AUTO', 'Auto')],
        default='AUTO'
    )
    currency = models.CharField(max_length=3, default='KES')
    
    # Privacy Settings
    profile_visibility = models.CharField(
        max_length=10,
        choices=[('PUBLIC', 'Public'), ('MEMBERS', 'Members Only'), ('PRIVATE', 'Private')],
        default='MEMBERS'
    )
    
    # Security
    two_factor_enabled = models.BooleanField(default=False)
    biometric_enabled = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_settings'
        verbose_name = 'User Settings'
        verbose_name_plural = 'User Settings'
    
    def __str__(self):
        return f"Settings for {self.user.full_name}"


class IntegratedFirm(models.Model):
    """External organizations/firms integrated with the system"""
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Integration Details
    api_endpoint = models.URLField(blank=True, null=True)
    api_key = models.CharField(max_length=200, blank=True, null=True)
    
    # Display Information
    logo = models.ImageField(upload_to='firm_logos/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=17, blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    integration_type = models.CharField(
        max_length=50,
        choices=[
            ('BANK', 'Bank'),
            ('INVESTMENT', 'Investment Firm'),
            ('INSURANCE', 'Insurance'),
            ('OTHER', 'Other')
        ],
        default='OTHER'
    )
    
    # Data Sharing
    shares_financial_data = models.BooleanField(default=False)
    shares_member_data = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'integrated_firms'
        verbose_name = 'Integrated Firm'
        verbose_name_plural = 'Integrated Firms'
        ordering = ['name']
    
    def __str__(self):
        return self.name
