from rest_framework import serializers
from .models import Movement
from equipment.serializers import EquipmentSerializer


class MovementSerializer(serializers.ModelSerializer):
    equipment_detail = EquipmentSerializer(source='equipment', read_only=True)

    class Meta:
        model = Movement
        fields = '__all__'
