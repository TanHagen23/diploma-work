from django.contrib import admin
from .models import Equipment


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'inventory_number', 'category', 'status', 'location', 'responsible_person', 'created_at']
    list_filter = ['status', 'category']
    search_fields = ['name', 'inventory_number', 'location', 'responsible_person']
    ordering = ['-created_at']
