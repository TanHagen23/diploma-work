import { Badge } from '@/shared/ui';
import { UserRole } from '@/shared/types';

interface UserRoleBadgeProps {
  role: UserRole;
}

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: {
    label: 'Администратор',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  manager: {
    label: 'Менеджер',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  viewer: {
    label: 'Наблюдатель',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = roleConfig[role] ?? { label: role, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
