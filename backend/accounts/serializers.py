from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, NextOfKin


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'email', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name', 'email', 'password', 'password_confirm']
    
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
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')
        
        if phone_number and password:
            user = authenticate(request=self.context.get('request'), username=phone_number, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid phone number or password')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
        else:
            raise serializers.ValidationError('Must include "phone_number" and "password"')
        
        attrs['user'] = user
        return attrs


class NextOfKinSerializer(serializers.ModelSerializer):
    """Serializer for Next of Kin model"""
    
    class Meta:
        model = NextOfKin
        fields = ['id', 'full_name', 'relationship', 'phone_number', 'email', 'address', 'id_number', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile with next of kin"""
    
    next_of_kin = NextOfKinSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'email', 'role', 'date_joined', 'next_of_kin']
        read_only_fields = ['id', 'phone_number', 'role', 'date_joined']