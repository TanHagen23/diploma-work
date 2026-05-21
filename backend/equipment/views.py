from rest_framework import viewsets, filters
from .models import Equipment
from .serializers import EquipmentSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'inventory_number', 'category', 'location', 'responsible_person']
    filterset_fields = ['status', 'category', 'location']
    ordering_fields = ['name', 'inventory_number', 'status', 'created_at', 'updated_at']
    ordering = ['-created_at']
