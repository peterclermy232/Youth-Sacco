# backend/accounts/models.py - EXTENDED VERSION
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from decimal import Decimal


class UserManager(BaseUserManager):
    """Custom user manager for phone number authentication"""
    
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('Phone number is required')
        
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(phone_number, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Extended custom user model with profile fields"""
    
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    ]
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('SINGLE', 'Single'),
        ('MARRIED', 'Married'),
        ('DIVORCED', 'Divorced'),
        ('WIDOWED', 'Widowed'),
    ]
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be in format: '+254712345678'"
    )
    
    # Basic Authentication Fields
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        unique=True
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    date_joined = models.DateTimeField(auto_now_add=True)
    
    # Extended Profile Fields
    age = models.PositiveIntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(18), MaxValueValidator(100)]
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    marital_status = models.CharField(
        max_length=10, 
        choices=MARITAL_STATUS_CHOICES, 
        blank=True, 
        null=True
    )
    number_of_kids = models.PositiveIntegerField(default=0)
    
    profession = models.CharField(max_length=200, blank=True, null=True)
    salary_range = models.CharField(max_length=50, blank=True, null=True)
    
    # Document Fields
    passport_photo = models.ImageField(
        upload_to='profile_photos/', 
        blank=True, 
        null=True
    )
    identity_document = models.FileField(
        upload_to='identity_documents/', 
        blank=True, 
        null=True
    )
    
    objects = UserManager()
    
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone_number})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class SpouseDetails(models.Model):
    """Spouse details for married users"""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='spouse_details'
    )
    
    full_name = models.CharField(max_length=200)
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(18), MaxValueValidator(100)]
    )
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True, null=True)
    profession = models.CharField(max_length=200, blank=True, null=True)
    id_number = models.CharField(max_length=20)
    
    # Documents
    identity_document = models.FileField(
        upload_to='spouse_documents/',
        blank=True,
        null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'spouse_details'
        verbose_name = 'Spouse Details'
        verbose_name_plural = 'Spouse Details'
    
    def __str__(self):
        return f"{self.full_name} - Spouse of {self.user.full_name}"


class Child(models.Model):
    """Children details for users"""
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='children'
    )
    
    full_name = models.CharField(max_length=200)
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(30)]
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Mandatory document
    birth_certificate = models.FileField(
        upload_to='birth_certificates/',
        help_text='Birth certificate is mandatory'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'children'
        verbose_name = 'Child'
        verbose_name_plural = 'Children'
        ordering = ['-age']
    
    def __str__(self):
        return f"{self.full_name} - Child of {self.user.full_name}"


class Beneficiary(models.Model):
    """Beneficiary management with enhanced fields"""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('DECEASED', 'Deceased'),
        ('REPLACED', 'Replaced'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='beneficiaries'
    )
    
    full_name = models.CharField(max_length=200)
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(120)]
    )
    relationship = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True, null=True)
    profession = models.CharField(max_length=200, blank=True, null=True)
    salary_range = models.CharField(max_length=50, blank=True, null=True)
    
    # Documents
    identity_document = models.FileField(
        upload_to='beneficiary_documents/',
        help_text='ID or Passport'
    )
    birth_certificate = models.FileField(
        upload_to='beneficiary_birth_certificates/',
        help_text='Birth certificate mandatory'
    )
    additional_document = models.FileField(
        upload_to='beneficiary_additional/',
        blank=True,
        null=True,
        help_text='Any supporting document'
    )
    
    # Deceased Information
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )
    death_certificate = models.FileField(
        upload_to='death_certificates/',
        blank=True,
        null=True
    )
    death_certificate_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    date_of_death = models.DateField(blank=True, null=True)
    
    # Metadata
    percentage_share = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('100.00'),
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    is_primary = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'beneficiaries'
        verbose_name = 'Beneficiary'
        verbose_name_plural = 'Beneficiaries'
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"{self.full_name} - Beneficiary of {self.user.full_name}"


class NextOfKin(models.Model):
    """Next of Kin details for members (keeping existing for compatibility)"""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='next_of_kin'
    )
    
    full_name = models.CharField(max_length=200)
    relationship = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    id_number = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'next_of_kin'
        verbose_name = 'Next of Kin'
        verbose_name_plural = 'Next of Kin'
    
    def __str__(self):
        return f"{self.full_name} - {self.user.full_name}'s Next of Kin"