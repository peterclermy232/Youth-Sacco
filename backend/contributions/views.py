from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Sum, Count
from decimal import Decimal

from .models import ContributionType, Contribution, SACCOBalance, ContributionSummary
from .serializers import (
    ContributionTypeSerializer, ContributionSerializer, ContributionCreateSerializer,
    ContributionVerificationSerializer, SACCOBalanceSerializer,
    ContributionSummarySerializer, MemberBalanceSerializer
)
from accounts.permissions import IsAdmin, IsOwnerOrAdmin


class ContributionTypeListView(generics.ListAPIView):
    """List all active contribution types"""
    
    queryset = ContributionType.objects.filter(is_active=True)
    serializer_class = ContributionTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class ContributionCreateView(generics.CreateAPIView):
    """Create a new contribution (member submits M-Pesa transaction)"""
    
    serializer_class = ContributionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(member=self.request.user)


class ContributionListView(generics.ListAPIView):
    """List contributions - members see only their own, admins see all"""
    
    serializer_class = ContributionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Contribution.objects.all()
        return Contribution.objects.filter(member=user)


class ContributionDetailView(generics.RetrieveAPIView):
    """Get contribution details"""
    
    serializer_class = ContributionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Contribution.objects.all()
        return Contribution.objects.filter(member=user)


class PendingContributionsView(generics.ListAPIView):
    """List pending contributions (admin only)"""
    
    serializer_class = ContributionSerializer
    permission_classes = [IsAdmin]
    queryset = Contribution.objects.filter(status='PENDING')


class ContributionVerifyView(APIView):
    """Verify or reject a contribution (admin only)"""
    
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            contribution = Contribution.objects.get(pk=pk)
        except Contribution.DoesNotExist:
            return Response({'error': 'Contribution not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if contribution.status != 'PENDING':
            return Response({'error': 'Contribution has already been processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ContributionVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        contribution.status = serializer.validated_data['status']
        contribution.verified_by = request.user
        contribution.verified_at = timezone.now()
        
        if contribution.status == 'REJECTED':
            contribution.rejection_reason = serializer.validated_data.get('rejection_reason', '')
        elif contribution.status == 'VERIFIED':
            # Update member's balance
            balance, created = SACCOBalance.objects.get_or_create(
                member=contribution.member,
                contribution_type=contribution.contribution_type,
                defaults={'total_balance': Decimal('0.00')}
            )
            balance.total_balance += contribution.amount
            balance.last_contribution_date = contribution.submitted_at
            balance.save()
            
            # Update contribution summary
            summary, created = ContributionSummary.objects.get_or_create(
                contribution_type=contribution.contribution_type,
                defaults={
                    'total_amount': Decimal('0.00'),
                    'total_contributions': 0,
                    'active_members': 0
                }
            )
            summary.total_amount += contribution.amount
            summary.total_contributions += 1
            summary.active_members = SACCOBalance.objects.filter(
                contribution_type=contribution.contribution_type,
                total_balance__gt=0
            ).count()
            summary.save()
        
        contribution.save()
        
        return Response(ContributionSerializer(contribution).data)


class MemberBalanceView(APIView):
    """Get member's balance across all contribution types"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        balances = SACCOBalance.objects.filter(member=user).select_related('contribution_type')
        
        balance_data = [
            {
                'contribution_type': balance.contribution_type.name,
                'total_balance': balance.total_balance,
                'last_contribution_date': balance.last_contribution_date
            }
            for balance in balances
        ]
        
        serializer = MemberBalanceSerializer(balance_data, many=True)
        return Response(serializer.data)


class AllBalancesView(generics.ListAPIView):
    """List all member balances (admin only)"""
    
    queryset = SACCOBalance.objects.all().select_related('member', 'contribution_type')
    serializer_class = SACCOBalanceSerializer
    permission_classes = [IsAdmin]


class ContributionSummaryView(generics.ListAPIView):
    """Get contribution summaries (admin only)"""
    
    queryset = ContributionSummary.objects.all().select_related('contribution_type')
    serializer_class = ContributionSummarySerializer
    permission_classes = [IsAdmin]


class DashboardStatsView(APIView):
    """Get dashboard statistics (admin only)"""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        total_members = User.objects.filter(role='MEMBER').count()
        pending_contributions = Contribution.objects.filter(status='PENDING').count()
        
        summaries = ContributionSummary.objects.all()
        summary_data = ContributionSummarySerializer(summaries, many=True).data
        
        return Response({
            'total_members': total_members,
            'pending_contributions': pending_contributions,
            'contribution_summaries': summary_data
        })


# Import User model
from django.contrib.auth import get_user_model
User = get_user_model()


