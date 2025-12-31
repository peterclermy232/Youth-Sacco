from django.contrib import admin
from .models import ContributionType, Contribution, SACCOBalance, ContributionSummary


@admin.register(ContributionType)
class ContributionTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ['member', 'contribution_type', 'amount', 'status', 'submitted_at']
    list_filter = ['status', 'contribution_type', 'submitted_at']
    search_fields = ['member__first_name', 'member__last_name', 'mpesa_transaction_code']
    ordering = ['-submitted_at']
    readonly_fields = ['submitted_at', 'updated_at']


@admin.register(SACCOBalance)
class SACCOBalanceAdmin(admin.ModelAdmin):
    list_display = ['member', 'contribution_type', 'total_balance', 'last_contribution_date']
    list_filter = ['contribution_type']
    search_fields = ['member__first_name', 'member__last_name']


@admin.register(ContributionSummary)
class ContributionSummaryAdmin(admin.ModelAdmin):
    list_display = ['contribution_type', 'total_amount', 'total_contributions', 'active_members', 'last_updated']
    list_filter = ['contribution_type']
    readonly_fields = ['last_updated']