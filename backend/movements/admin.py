from django.contrib import admin
from .models import Movement


@admin.register(Movement)
class MovementAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'from_location', 'to_location', 'responsible_person', 'movement_date', 'created_at']
    list_filter = ['movement_date']
    search_fields = ['equipment__name', 'equipment__inventory_number', 'from_location', 'to_location']
    ordering = ['-movement_date']
