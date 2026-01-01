from django.urls import path
from .views import (
    ApplicationListView,
    ApplicationCreateView,
    ApplicationDetailView,
    PendingApplicationsView,
    ApplicationReviewView
)

urlpatterns = [
    path('', ApplicationListView.as_view(), name='application-list'),
    path('create/', ApplicationCreateView.as_view(), name='application-create'),
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('pending/', PendingApplicationsView.as_view(), name='pending-applications'),
    path('<int:pk>/review/', ApplicationReviewView.as_view(), name='application-review'),
]