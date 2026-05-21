from rest_framework import serializers
from .models import Decommission
from equipment.serializers import EquipmentSerializer


class DecommissionSerializer(serializers.ModelSerializer):
    equipment_detail = EquipmentSerializer(source='equipment', read_only=True)

    class Meta:
        model = Decommission
        fields = '__all__'
