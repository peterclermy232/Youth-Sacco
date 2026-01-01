from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import DocumentCategory, Document
from .serializers import (
    DocumentCategorySerializer,
    DocumentSerializer,
    DocumentUploadSerializer,
    DocumentVerificationSerializer
)
from accounts.permissions import IsAdmin


class DocumentCategoryListView(generics.ListAPIView):
    """List all document categories"""
    
    queryset = DocumentCategory.objects.filter(is_active=True)
    serializer_class = DocumentCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class DocumentListCreateView(generics.ListCreateAPIView):
    """List and create documents"""
    
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DocumentUploadSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Document.objects.all()
        return Document.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete document"""
    
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Document.objects.all()
        return Document.objects.filter(user=user)


class DocumentVerifyView(APIView):
    """Verify or reject a document (admin only)"""
    
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            document = Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            return Response(
                {'error': 'Document not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DocumentVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        document.status = serializer.validated_data['status']
        document.verified_by = request.user
        document.verified_at = timezone.now()
        
        if document.status == 'REJECTED':
            document.rejection_reason = serializer.validated_data.get('rejection_reason', '')
        
        document.save()
        
        return Response(DocumentSerializer(document).data)


class UserDocumentsView(generics.ListAPIView):
    """Get current user's documents grouped by category"""
    
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Group by category
        grouped_docs = {}
        for doc in serializer.data:
            category = doc['category_name']
            if category not in grouped_docs:
                grouped_docs[category] = []
            grouped_docs[category].append(doc)
        
        return Response(grouped_docs)