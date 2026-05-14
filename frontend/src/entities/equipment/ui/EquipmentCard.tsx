import { Card, CardContent } from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { EquipmentBadge } from './EquipmentBadge';

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect?: (equipment: Equipment) => void;
}

export function EquipmentCard({ equipment, onSelect }: EquipmentCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect?.(equipment)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{equipment.name}</h3>
            <p className="text-sm text-gray-500">{equipment.type}</p>
          </div>
          <EquipmentBadge status={equipment.status} />
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Serial Number:</span>
            <span className="text-gray-900">{equipment.serialNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-900">{equipment.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Department:</span>
            <span className="text-gray-900">{equipment.department}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
