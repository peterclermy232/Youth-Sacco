from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, UserProfileView, UserListView, UserDetailView,
    NextOfKinCreateView, NextOfKinDetailView, SpouseDetailsView,
    ChildListCreateView, ChildDetailView, BeneficiaryListCreateView,
    BeneficiaryDetailView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    # User management (admin)
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    # Spouse Details
    path('spouse/', SpouseDetailsView.as_view(), name='spouse-details'),
    
    # Children
    path('children/', ChildListCreateView.as_view(), name='child-list-create'),
    path('children/<int:pk>/', ChildDetailView.as_view(), name='child-detail'),
    
    # Beneficiaries
    path('beneficiaries/', BeneficiaryListCreateView.as_view(), name='beneficiary-list-create'),
    path('beneficiaries/<int:pk>/', BeneficiaryDetailView.as_view(), name='beneficiary-detail'),
    
    # Next of Kin (keeping for compatibility)
    path('next-of-kin/', NextOfKinCreateView.as_view(), name='next-of-kin-create'),
    path('next-of-kin/<int:pk>/', NextOfKinDetailView.as_view(), name='next-of-kin-detail'),
]