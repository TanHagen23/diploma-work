import { Badge } from '@/shared/ui';
import { EquipmentStatus } from '@/shared/types';

interface EquipmentBadgeProps {
  status: EquipmentStatus;
}

const statusConfig = {
  in_stock: {
    label: 'In Stock',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  deployed: {
    label: 'Deployed',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  decommissioned: {
    label: 'Decommissioned',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
};

export function EquipmentBadge({ status }: EquipmentBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
