import { Badge } from '@/shared/ui';
import { UserRole } from '@/shared/types';

interface UserRoleBadgeProps {
  role: UserRole;
}

const roleConfig = {
  admin: {
    label: 'Admin',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  operator: {
    label: 'Operator',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  viewer: {
    label: 'Viewer',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
