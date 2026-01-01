from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Application
from .serializers import (
    ApplicationSerializer, 
    ApplicationCreateSerializer,
    ApplicationReviewSerializer
)
from accounts.permissions import IsAdmin


class ApplicationListView(generics.ListAPIView):
    """List applications - members see only their own, admins see all"""
    
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Application.objects.all()
        return Application.objects.filter(user=user)


class ApplicationCreateView(generics.CreateAPIView):
    """Create a new application"""
    
    serializer_class = ApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class ApplicationDetailView(generics.RetrieveAPIView):
    """Get application details"""
    
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Application.objects.all()
        return Application.objects.filter(user=user)


class PendingApplicationsView(generics.ListAPIView):
    """List pending applications (admin only)"""
    
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdmin]
    queryset = Application.objects.filter(status__in=['PENDING', 'STAGE_1', 'STAGE_2', 'STAGE_3'])


class ApplicationReviewView(APIView):
    """Review application at different stages (admin only)"""
    
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response(
                {'error': 'Application not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ApplicationReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        decision = serializer.validated_data['decision']
        comments = serializer.validated_data.get('comments', '')
        
        # Determine current stage and update accordingly
        current_stage = application.current_stage
        
        if current_stage == 0 or application.status == 'PENDING':
            # Stage 1
            application.stage_1_reviewer = request.user
            application.stage_1_reviewed_at = timezone.now()
            application.stage_1_comments = comments
            application.stage_1_status = decision
            
            if decision == 'APPROVE':
                application.status = 'STAGE_2'
                application.current_stage = 1
            else:
                application.status = 'REJECTED'
                application.final_decision = 'REJECTED'
                application.final_comments = comments
                application.decided_at = timezone.now()
        
        elif application.status == 'STAGE_2' or current_stage == 1:
            # Stage 2
            application.stage_2_reviewer = request.user
            application.stage_2_reviewed_at = timezone.now()
            application.stage_2_comments = comments
            application.stage_2_status = decision
            
            if decision == 'APPROVE':
                application.status = 'STAGE_3'
                application.current_stage = 2
            else:
                application.status = 'REJECTED'
                application.final_decision = 'REJECTED'
                application.final_comments = comments
                application.decided_at = timezone.now()
        
        elif application.status == 'STAGE_3' or current_stage == 2:
            # Stage 3 (Final)
            application.stage_3_reviewer = request.user
            application.stage_3_reviewed_at = timezone.now()
            application.stage_3_comments = comments
            application.stage_3_status = decision
            
            if decision == 'APPROVE':
                application.status = 'APPROVED'
                application.final_decision = 'APPROVED'
                application.final_comments = 'Application approved after 3-stage review'
                application.decided_at = timezone.now()
                application.current_stage = 3
            else:
                application.status = 'REJECTED'
                application.final_decision = 'REJECTED'
                application.final_comments = comments
                application.decided_at = timezone.now()
        
        application.save()
        
        return Response(ApplicationSerializer(application).data)

