
from rest_framework import serializers
from .models import ContributionType, Contribution, SACCOBalance, ContributionSummary
from accounts.serializers import UserSerializer


class ContributionTypeSerializer(serializers.ModelSerializer):
    """Serializer for Contribution Type"""
    
    class Meta:
        model = ContributionType
        fields = ['id', 'name', 'description', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContributionSerializer(serializers.ModelSerializer):
    """Serializer for Contribution"""
    
    member_details = UserSerializer(source='member', read_only=True)
    contribution_type_name = serializers.CharField(source='contribution_type.name', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = Contribution
        fields = [
            'id', 'member', 'member_details', 'contribution_type', 'contribution_type_name',
            'amount', 'mpesa_transaction_code', 'mpesa_phone_number', 'status',
            'verified_by', 'verified_by_name', 'verified_at', 'rejection_reason',
            'submitted_at', 'updated_at', 'notes'
        ]
        read_only_fields = ['id', 'member', 'status', 'verified_by', 'verified_at', 'submitted_at', 'updated_at']


class ContributionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating contributions (member submission)"""
    
    class Meta:
        model = Contribution
        fields = ['contribution_type', 'amount', 'mpesa_transaction_code', 'mpesa_phone_number', 'notes']
    
    def validate_mpesa_transaction_code(self, value):
        """Validate that M-Pesa transaction code is unique"""
        if Contribution.objects.filter(mpesa_transaction_code=value).exists():
            raise serializers.ValidationError("This M-Pesa transaction code has already been submitted")
        return value


class ContributionVerificationSerializer(serializers.Serializer):
    """Serializer for admin verification of contributions"""
    
    status = serializers.ChoiceField(choices=['VERIFIED', 'REJECTED'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['status'] == 'REJECTED' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError({"rejection_reason": "Rejection reason is required when rejecting a contribution"})
        return attrs


class SACCOBalanceSerializer(serializers.ModelSerializer):
    """Serializer for SACCO Balance"""
    
    member_details = UserSerializer(source='member', read_only=True)
    contribution_type_name = serializers.CharField(source='contribution_type.name', read_only=True)
    
    class Meta:
        model = SACCOBalance
        fields = ['id', 'member', 'member_details', 'contribution_type', 'contribution_type_name', 
                  'total_balance', 'last_contribution_date', 'updated_at']
        read_only_fields = ['id', 'total_balance', 'last_contribution_date', 'updated_at']


class ContributionSummarySerializer(serializers.ModelSerializer):
    """Serializer for Contribution Summary"""
    
    contribution_type_name = serializers.CharField(source='contribution_type.name', read_only=True)
    
    class Meta:
        model = ContributionSummary
        fields = ['id', 'contribution_type', 'contribution_type_name', 'total_amount', 
                  'total_contributions', 'active_members', 'last_updated']
        read_only_fields = ['id', 'total_amount', 'total_contributions', 'active_members', 'last_updated']


class MemberBalanceSerializer(serializers.Serializer):
    """Serializer for member's balance across all contribution types"""
    
    contribution_type = serializers.CharField()
    total_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    last_contribution_date = serializers.DateTimeField(allow_null=True)