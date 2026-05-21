import { Badge } from '@/shared/ui';
import { EquipmentStatus } from '@/shared/types';

interface EquipmentBadgeProps {
  status: EquipmentStatus;
}

const statusConfig: Record<EquipmentStatus, { label: string; className: string }> = {
  in_stock: {
    label: 'In Stock',
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  },
  deployed: {
    label: 'In Operation',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  decommissioned: {
    label: 'Decommissioned',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
  maintenance: {
    label: 'In Repair',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  },
};

export function EquipmentBadge({ status }: EquipmentBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
