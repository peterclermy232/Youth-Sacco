# Updated ContributionVerifyView with SMS integration
# Replace the existing ContributionVerifyView in contributions/views.py with this implementation

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from decimal import Decimal

from .models import Contribution, SACCOBalance, ContributionSummary
from .serializers import ContributionSerializer, ContributionVerificationSerializer
from accounts.permissions import IsAdmin
from notifications.services import SMSService


class ContributionVerifyView(APIView):
    """Verify or reject a contribution (admin only) with SMS notification"""
    
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
        
        # Initialize SMS service
        sms_service = SMSService()
        
        if contribution.status == 'REJECTED':
            contribution.rejection_reason = serializer.validated_data.get('rejection_reason', '')
            contribution.save()
            
            # Send rejection SMS
            try:
                sms_service.send_contribution_rejected_sms(contribution)
            except Exception as e:
                print(f"Failed to send rejection SMS: {str(e)}")
                
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
            
            # Send verification SMS
            try:
                sms_service.send_contribution_verified_sms(contribution)
            except Exception as e:
                print(f"Failed to send verification SMS: {str(e)}")
        
        return Response(ContributionSerializer(contribution).data)