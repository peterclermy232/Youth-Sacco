from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


class DocumentCategory(models.Model):
    """Document categories for organization"""
    
    CATEGORY_TYPES = [
        ('IDENTITY', 'Identity Documents'),
        ('BENEFICIARY', 'Beneficiary Documents'),
        ('BIRTH', 'Birth Certificates'),
        ('DEATH', 'Death Certificates'),
        ('ADDITIONAL', 'Additional Documents'),
        ('FINANCIAL', 'Financial Documents'),
        ('MEDICAL', 'Medical Documents'),
    ]
    
    name = models.CharField(max_length=50, choices=CATEGORY_TYPES, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    requires_verification = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_categories'
        verbose_name = 'Document Category'
        verbose_name_plural = 'Document Categories'
    
    def __str__(self):
        return self.get_name_display()


class Document(models.Model):
    """Central document management system"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    
    category = models.ForeignKey(
        DocumentCategory,
        on_delete=models.PROTECT,
        related_name='documents'
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    # File handling
    file = models.FileField(
        upload_to='documents/%Y/%m/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
            )
        ]
    )
    file_size = models.PositiveIntegerField(help_text='File size in bytes')
    file_type = models.CharField(max_length=50)
    
    # Verification
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_documents'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Metadata
    document_number = models.CharField(max_length=100, blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    
    # Version control
    version = models.PositiveIntegerField(default=1)
    replaced_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replaces'
    )
    
    # Timestamps
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'documents'
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['user', 'category']),
            models.Index(fields=['status', '-uploaded_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.full_name}"
    
    def get_file_url(self):
        """Get the file download URL"""
        if self.file:
            return self.file.url
        return None
