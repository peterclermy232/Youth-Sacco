from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .models import NextOfKin, SpouseDetails, Child, Beneficiary
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    NextOfKinSerializer, UserProfileSerializer, SpouseDetailsSerializer,
    ChildSerializer, BeneficiarySerializer
)
from .permissions import IsAdmin, IsOwnerOrAdmin, IsMemberOwner

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint (public)"""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """User login endpoint (public)"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update complete user profile"""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """List all users (admin only)"""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


class UserDetailView(generics.RetrieveAPIView):
    """Get user details (admin only)"""
    
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdmin]


# Spouse Details Views
class SpouseDetailsView(generics.RetrieveUpdateAPIView):
    """Get and update spouse details"""
    
    serializer_class = SpouseDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        spouse, created = SpouseDetails.objects.get_or_create(user=self.request.user)
        return spouse


# Children Views
class ChildListCreateView(generics.ListCreateAPIView):
    """List and create children"""
    
    serializer_class = ChildSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Child.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChildDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a child"""
    
    serializer_class = ChildSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Child.objects.filter(user=self.request.user)


# Beneficiary Views
class BeneficiaryListCreateView(generics.ListCreateAPIView):
    """List and create beneficiaries"""
    
    serializer_class = BeneficiarySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Beneficiary.objects.all()
        return Beneficiary.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BeneficiaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a beneficiary"""
    
    serializer_class = BeneficiarySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Beneficiary.objects.all()
        return Beneficiary.objects.filter(user=self.request.user)


# Next of Kin Views (keeping for compatibility)
class NextOfKinCreateView(generics.CreateAPIView):
    """Create next of kin for current user"""
    
    serializer_class = NextOfKinSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NextOfKinDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete next of kin"""
    
    serializer_class = NextOfKinSerializer
    permission_classes = [permissions.IsAuthenticated, IsMemberOwner]
    
    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return NextOfKin.objects.all()
        return NextOfKin.objects.filter(user=self.request.user)