from django.contrib import admin
from .models import DocumentCategory, Document


@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'requires_verification', 'is_active', 'created_at']
    list_filter = ['is_active', 'requires_verification']
    search_fields = ['name', 'description']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'user', 'category', 'status', 
        'file_size', 'uploaded_at'
    ]
    list_filter = ['status', 'category', 'uploaded_at']
    search_fields = [
        'title', 'user__first_name', 'user__last_name', 
        'document_number'
    ]
    readonly_fields = ['uploaded_at', 'updated_at', 'file_size']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'category', 'title', 'description')
        }),
        ('File Details', {
            'fields': ('file', 'file_size', 'file_type')
        }),
        ('Verification', {
            'fields': (
                'status', 'verified_by', 'verified_at', 
                'rejection_reason'
            )
        }),
        ('Document Metadata', {
            'fields': (
                'document_number', 'issue_date', 'expiry_date',
                'version', 'replaced_by'
            )
        }),
        ('Timestamps', {
            'fields': ('uploaded_at', 'updated_at')
        }),
    )
