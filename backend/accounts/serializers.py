from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, NextOfKin, SpouseDetails, Child, Beneficiary


class UserSerializer(serializers.ModelSerializer):
    """Basic serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'first_name', 'last_name', 'email', 
            'role', 'is_active', 'date_joined', 'age', 'gender',
            'marital_status', 'number_of_kids', 'profession', 'salary_range'
        ]
        read_only_fields = ['id', 'date_joined']


class SpouseDetailsSerializer(serializers.ModelSerializer):
    """Serializer for Spouse Details"""
    
    class Meta:
        model = SpouseDetails
        fields = [
            'id', 'full_name', 'age', 'phone_number', 'email',
            'profession', 'id_number', 'identity_document',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChildSerializer(serializers.ModelSerializer):
    """Serializer for Child"""
    
    class Meta:
        model = Child
        fields = [
            'id', 'full_name', 'age', 'gender', 'birth_certificate',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BeneficiarySerializer(serializers.ModelSerializer):
    """Serializer for Beneficiary"""
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Beneficiary
        fields = [
            'id', 'full_name', 'age', 'relationship', 'phone_number',
            'email', 'profession', 'salary_range', 'identity_document',
            'birth_certificate', 'additional_document', 'status',
            'status_display', 'death_certificate', 'death_certificate_number',
            'date_of_death', 'percentage_share', 'is_primary',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_percentage_share(self, value):
        """Validate that total percentage doesn't exceed 100%"""
        user = self.context['request'].user
        existing_beneficiaries = Beneficiary.objects.filter(
            user=user, 
            status='ACTIVE'
        ).exclude(id=self.instance.id if self.instance else None)
        
        total = sum(b.percentage_share for b in existing_beneficiaries) + value
        
        if total > 100:
            raise serializers.ValidationError(
                f'Total beneficiary share cannot exceed 100%. Current total: {total}%'
            )
        
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """Complete user profile with all related data"""
    
    spouse_details = SpouseDetailsSerializer(read_only=True)
    children = ChildSerializer(many=True, read_only=True)
    beneficiaries = BeneficiarySerializer(many=True, read_only=True)
    next_of_kin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'first_name', 'last_name', 'email',
            'role', 'date_joined', 'age', 'gender', 'marital_status',
            'number_of_kids', 'profession', 'salary_range',
            'passport_photo', 'identity_document',
            'spouse_details', 'children', 'beneficiaries', 'next_of_kin'
        ]
        read_only_fields = ['id', 'phone_number', 'role', 'date_joined']
    
    def get_next_of_kin(self, obj):
        try:
            from .serializers import NextOfKinSerializer
            return NextOfKinSerializer(obj.next_of_kin).data
        except:
            return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(
        write_only=True, 
        min_length=8, 
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True, 
        min_length=8, 
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'phone_number', 'first_name', 'last_name', 'email',
            'password', 'password_confirm', 'age', 'gender',
            'marital_status', 'profession'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    phone_number = serializers.CharField()
    password = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')
        
        if phone_number and password:
            user = authenticate(
                request=self.context.get('request'),
                username=phone_number,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError('Invalid phone number or password')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
        else:
            raise serializers.ValidationError(
                'Must include "phone_number" and "password"'
            )
        
        attrs['user'] = user
        return attrs


class NextOfKinSerializer(serializers.ModelSerializer):
    """Serializer for Next of Kin model"""
    
    class Meta:
        model = NextOfKin
        fields = [
            'id', 'full_name', 'relationship', 'phone_number',
            'email', 'address', 'id_number', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
