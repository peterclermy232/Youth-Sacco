from rest_framework import serializers
from .models import DocumentCategory, Document
from accounts.serializers import UserSerializer


class DocumentCategorySerializer(serializers.ModelSerializer):
    """Serializer for document categories"""
    
    class Meta:
        model = DocumentCategory
        fields = [
            'id', 'name', 'description', 'is_active', 
            'requires_verification', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for documents"""
    
    user_details = UserSerializer(source='user', read_only=True)
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)
    verified_by_name = serializers.CharField(
        source='verified_by.full_name', 
        read_only=True, 
        allow_null=True
    )
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'user', 'user_details', 'category', 'category_name',
            'title', 'description', 'file', 'file_url', 'file_size', 
            'file_type', 'status', 'verified_by', 'verified_by_name',
            'verified_at', 'rejection_reason', 'document_number',
            'issue_date', 'expiry_date', 'version', 'replaced_by',
            'uploaded_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'file_size', 'file_type', 'status',
            'verified_by', 'verified_at', 'uploaded_at', 'updated_at'
        ]
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def validate_file(self, value):
        """Validate file size (max 10MB)"""
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(
                'File size cannot exceed 10MB'
            )
        return value


class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading documents"""
    
    class Meta:
        model = Document
        fields = [
            'category', 'title', 'description', 'file',
            'document_number', 'issue_date', 'expiry_date'
        ]
    
    def create(self, validated_data):
        # Extract file info
        file = validated_data.get('file')
        validated_data['file_size'] = file.size
        validated_data['file_type'] = file.content_type
        
        return super().create(validated_data)


class DocumentVerificationSerializer(serializers.Serializer):
    """Serializer for document verification"""
    
    status = serializers.ChoiceField(choices=['VERIFIED', 'REJECTED'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['status'] == 'REJECTED' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError({
                "rejection_reason": "Rejection reason is required when rejecting a document"
            })
        return attrs