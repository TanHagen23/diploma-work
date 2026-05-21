from rest_framework import viewsets, filters
from .models import Decommission
from .serializers import DecommissionSerializer


class DecommissionViewSet(viewsets.ModelViewSet):
    queryset = Decommission.objects.select_related('equipment').all()
    serializer_class = DecommissionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['equipment__name', 'equipment__inventory_number', 'approved_by', 'act_number', 'reason']
    filterset_fields = ['equipment', 'decommission_date', 'approved_by']
    ordering_fields = ['decommission_date', 'created_at']
    ordering = ['-decommission_date']
