from rest_framework import serializers
from .models import Application
from accounts.serializers import UserSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for applications"""
    
    user_details = UserSerializer(source='user', read_only=True)
    application_type_display = serializers.CharField(
        source='get_application_type_display', 
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', 
        read_only=True
    )
    
    stage_1_reviewer_name = serializers.CharField(
        source='stage_1_reviewer.full_name',
        read_only=True,
        allow_null=True
    )
    stage_2_reviewer_name = serializers.CharField(
        source='stage_2_reviewer.full_name',
        read_only=True,
        allow_null=True
    )
    stage_3_reviewer_name = serializers.CharField(
        source='stage_3_reviewer.full_name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Application
        fields = [
            'id', 'user', 'user_details', 'application_type',
            'application_type_display', 'full_name', 'phone_number',
            'email', 'member_number', 'reason', 'additional_notes',
            'supporting_document_1', 'supporting_document_2',
            'status', 'status_display', 'current_stage',
            'stage_1_reviewer', 'stage_1_reviewer_name', 'stage_1_reviewed_at',
            'stage_1_comments', 'stage_1_status',
            'stage_2_reviewer', 'stage_2_reviewer_name', 'stage_2_reviewed_at',
            'stage_2_comments', 'stage_2_status',
            'stage_3_reviewer', 'stage_3_reviewer_name', 'stage_3_reviewed_at',
            'stage_3_comments', 'stage_3_status',
            'final_decision', 'final_comments', 'decided_at',
            'submitted_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'current_stage',
            'stage_1_reviewer', 'stage_1_reviewed_at', 'stage_1_comments', 'stage_1_status',
            'stage_2_reviewer', 'stage_2_reviewed_at', 'stage_2_comments', 'stage_2_status',
            'stage_3_reviewer', 'stage_3_reviewed_at', 'stage_3_comments', 'stage_3_status',
            'final_decision', 'final_comments', 'decided_at',
            'submitted_at', 'updated_at'
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating applications"""
    
    class Meta:
        model = Application
        fields = [
            'application_type', 'reason', 'additional_notes',
            'supporting_document_1', 'supporting_document_2'
        ]
    
    def create(self, validated_data):
        # Prefill user information
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['full_name'] = user.full_name
        validated_data['phone_number'] = user.phone_number
        validated_data['email'] = user.email
        
        return super().create(validated_data)


class ApplicationReviewSerializer(serializers.Serializer):
    """Serializer for reviewing applications"""
    
    decision = serializers.ChoiceField(choices=['APPROVE', 'REJECT'])
    comments = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['decision'] == 'REJECT' and not attrs.get('comments'):
            raise serializers.ValidationError({
                "comments": "Comments are required when rejecting an application"
            })
        return attrs
