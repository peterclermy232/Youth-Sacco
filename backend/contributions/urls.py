from django.urls import path
from .views import (
    ContributionTypeListView, ContributionCreateView, ContributionListView,
    ContributionDetailView, PendingContributionsView, ContributionVerifyView,
    MemberBalanceView, AllBalancesView, ContributionSummaryView, DashboardStatsView
)

urlpatterns = [
    # Contribution Types
    path('types/', ContributionTypeListView.as_view(), name='contribution-types'),
    
    # Contributions
    path('', ContributionListView.as_view(), name='contribution-list'),
    path('create/', ContributionCreateView.as_view(), name='contribution-create'),
    path('<int:pk>/', ContributionDetailView.as_view(), name='contribution-detail'),
    
    # Admin - Verification
    path('pending/', PendingContributionsView.as_view(), name='pending-contributions'),
    path('<int:pk>/verify/', ContributionVerifyView.as_view(), name='contribution-verify'),
    
    # Balances
    path('balance/', MemberBalanceView.as_view(), name='member-balance'),
    path('balances/', AllBalancesView.as_view(), name='all-balances'),
    
    # Summaries and Dashboard
    path('summary/', ContributionSummaryView.as_view(), name='contribution-summary'),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
]