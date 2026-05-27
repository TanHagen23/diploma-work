import { Card, CardContent } from '@/shared/ui';
import { TrendingUp, TrendingDown, Monitor, Wrench, Package, FileText } from 'lucide-react';
import { DashboardStats } from '@/shared/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Всего оборудования',
      value: stats.totalEquipment.toLocaleString(),
      change: stats.totalEquipmentChange,
      isPositive: stats.totalEquipmentChange.startsWith('+'),
      icon: Monitor,
      iconColor: 'text-[#2E74B5]',
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Активно',
      value: stats.active.toLocaleString(),
      change: stats.activeChange,
      isPositive: stats.activeChange.startsWith('+'),
      icon: Package,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'На обслуживании',
      value: stats.maintenance.toLocaleString(),
      change: stats.maintenanceChange,
      isPositive: stats.maintenanceChange.startsWith('+'),
      icon: Wrench,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Списано',
      value: stats.decommissioned.toLocaleString(),
      change: stats.decommissionedChange,
      isPositive: false,
      icon: FileText,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="border border-gray-100 dark:border-[#334155] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.iconBg} dark:bg-white/10`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  card.isPositive
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                }`}
              >
                {card.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-[#94a3b8] mt-0.5">{card.label}</p>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400 dark:text-[#94a3b8]">
              {card.isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span>текущие данные из БД</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
