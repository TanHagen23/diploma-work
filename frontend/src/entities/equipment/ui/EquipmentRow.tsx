import { TableCell, TableRow } from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { EquipmentBadge } from './EquipmentBadge';

interface EquipmentRowProps {
  equipment: Equipment;
  onSelect?: (equipment: Equipment) => void;
}

export function EquipmentRow({ equipment, onSelect }: EquipmentRowProps) {
  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => onSelect?.(equipment)}
    >
      <TableCell className="font-medium">{equipment.name}</TableCell>
      <TableCell>{equipment.type}</TableCell>
      <TableCell>{equipment.serialNumber}</TableCell>
      <TableCell>{equipment.location}</TableCell>
      <TableCell>{equipment.department}</TableCell>
      <TableCell>
        <EquipmentBadge status={equipment.status} />
      </TableCell>
    </TableRow>
  );
}
