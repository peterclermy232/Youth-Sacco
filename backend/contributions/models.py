
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class ContributionType(models.Model):
    """Types of contributions (SACCO, MMF, etc.)"""
    
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'contribution_types'
        verbose_name = 'Contribution Type'
        verbose_name_plural = 'Contribution Types'
    
    def __str__(self):
        return self.name


class Contribution(models.Model):
    """Member contributions with M-Pesa transaction details"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]
    
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contributions'
    )
    contribution_type = models.ForeignKey(
        ContributionType,
        on_delete=models.PROTECT,
        related_name='contributions'
    )
    
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    mpesa_transaction_code = models.CharField(max_length=20, unique=True)
    mpesa_phone_number = models.CharField(max_length=15)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    
    # Verification details
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_contributions'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional metadata
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'contributions'
        verbose_name = 'Contribution'
        verbose_name_plural = 'Contributions'
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['member', '-submitted_at']),
            models.Index(fields=['status', '-submitted_at']),
            models.Index(fields=['mpesa_transaction_code']),
        ]
    
    def __str__(self):
        return f"{self.member.full_name} - {self.contribution_type.name} - KES {self.amount}"


class SACCOBalance(models.Model):
    """Track SACCO and MMF balances for each member"""
    
    member = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sacco_balance'
    )
    contribution_type = models.ForeignKey(
        ContributionType,
        on_delete=models.PROTECT
    )
    
    total_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    last_contribution_date = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'sacco_balances'
        verbose_name = 'SACCO Balance'
        verbose_name_plural = 'SACCO Balances'
        unique_together = ['member', 'contribution_type']
    
    def __str__(self):
        return f"{self.member.full_name} - {self.contribution_type.name}: KES {self.total_balance}"


class ContributionSummary(models.Model):
    """Overall SACCO summary statistics"""
    
    contribution_type = models.ForeignKey(
        ContributionType,
        on_delete=models.PROTECT,
        related_name='summaries'
    )
    
    total_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00')
    )
    total_contributions = models.IntegerField(default=0)
    active_members = models.IntegerField(default=0)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contribution_summaries'
        verbose_name = 'Contribution Summary'
        verbose_name_plural = 'Contribution Summaries'
    
    def __str__(self):
        return f"{self.contribution_type.name} Summary - Total: KES {self.total_amount}"