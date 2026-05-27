import { Badge } from '@/shared/ui';
import { EquipmentStatus } from '@/shared/types';

interface EquipmentBadgeProps {
  status: EquipmentStatus;
}

const statusConfig: Record<EquipmentStatus, { label: string; className: string }> = {
  active: {
    label: 'Активно',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-100',
  },
  maintenance: {
    label: 'На обслуживании',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 hover:bg-amber-100',
  },
  decommissioned: {
    label: 'Списано',
    className: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 hover:bg-red-100',
  },
};

export function EquipmentBadge({ status }: EquipmentBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
        {status ?? 'Unknown'}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
