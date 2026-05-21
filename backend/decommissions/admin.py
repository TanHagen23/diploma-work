from django.contrib import admin
from .models import Decommission


@admin.register(Decommission)
class DecommissionAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'act_number', 'decommission_date', 'approved_by', 'created_at']
    list_filter = ['decommission_date']
    search_fields = ['equipment__name', 'equipment__inventory_number', 'act_number', 'approved_by']
    ordering = ['-decommission_date']
