from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


class Application(models.Model):
    """Entry/Exit application management"""
    
    APPLICATION_TYPE_CHOICES = [
        ('ENTRY', 'Entry Application'),
        ('EXIT', 'Exit Application'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('STAGE_1', 'Stage 1 - Initial Review'),
        ('STAGE_2', 'Stage 2 - Verification'),
        ('STAGE_3', 'Stage 3 - Final Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    # User Information (Prefilled)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    
    application_type = models.CharField(
        max_length=10,
        choices=APPLICATION_TYPE_CHOICES
    )
    
    # Prefilled Information
    full_name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True, null=True)
    member_number = models.CharField(max_length=50, blank=True, null=True)
    
    # Application Details
    reason = models.TextField(
        help_text='Reason for entry/exit'
    )
    additional_notes = models.TextField(blank=True, null=True)
    
    # Supporting Documents
    supporting_document_1 = models.FileField(
        upload_to='applications/%Y/%m/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
            )
        ]
    )
    supporting_document_2 = models.FileField(
        upload_to='applications/%Y/%m/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
            )
        ]
    )
    
    # Workflow Status
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    current_stage = models.PositiveIntegerField(default=0)
    
    # Approval Workflow
    stage_1_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stage_1_applications'
    )
    stage_1_reviewed_at = models.DateTimeField(null=True, blank=True)
    stage_1_comments = models.TextField(blank=True, null=True)
    stage_1_status = models.CharField(max_length=10, blank=True, null=True)
    
    stage_2_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stage_2_applications'
    )
    stage_2_reviewed_at = models.DateTimeField(null=True, blank=True)
    stage_2_comments = models.TextField(blank=True, null=True)
    stage_2_status = models.CharField(max_length=10, blank=True, null=True)
    
    stage_3_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stage_3_applications'
    )
    stage_3_reviewed_at = models.DateTimeField(null=True, blank=True)
    stage_3_comments = models.TextField(blank=True, null=True)
    stage_3_status = models.CharField(max_length=10, blank=True, null=True)
    
    # Final Decision
    final_decision = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        choices=[('APPROVED', 'Approved'), ('REJECTED', 'Rejected')]
    )
    final_comments = models.TextField(blank=True, null=True)
    decided_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'applications'
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['user', '-submitted_at']),
            models.Index(fields=['status', '-submitted_at']),
        ]
    
    def __str__(self):
        return f"{self.get_application_type_display()} - {self.user.full_name} ({self.status})"
