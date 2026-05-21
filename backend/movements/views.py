from rest_framework import viewsets, filters
from .models import Movement
from .serializers import MovementSerializer


class MovementViewSet(viewsets.ModelViewSet):
    queryset = Movement.objects.select_related('equipment').all()
    serializer_class = MovementSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['equipment__name', 'equipment__inventory_number', 'from_location', 'to_location', 'responsible_person', 'reason']
    filterset_fields = ['equipment', 'from_location', 'to_location', 'movement_date']
    ordering_fields = ['movement_date', 'created_at']
    ordering = ['-movement_date']
