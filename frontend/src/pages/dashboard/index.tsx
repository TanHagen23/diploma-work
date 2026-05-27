import { useState, useEffect } from 'react';
import { AppLayout } from '@/widgets/app-layout';
import { StatsCards } from '@/widgets/stats-cards';
import { RecentMovementsTable } from '@/widgets/recent-movements-table';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui';
import { DashboardStats } from '@/shared/types';
import { equipmentApi } from '@/shared/api/equipment';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    equipmentApi.getEquipment().then((list) => {
      const total = list.length;
      const active = list.filter((e) => e.status === 'active').length;
      const maintenance = list.filter((e) => e.status === 'maintenance').length;
      const decommissioned = list.filter((e) => e.status === 'decommissioned').length;

      setStats({
        totalEquipment: total,
        totalEquipmentChange: '+0%',
        active,
        activeChange: '+0%',
        maintenance,
        maintenanceChange: '+0%',
        decommissioned,
        decommissionedChange: '+0%',
      });
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Главная</h1>
          <p className="text-muted-foreground mt-1">Обзор складских активов и операций</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        ) : (
          <StatsCards stats={stats!} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentMovementsTable />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Состояние склада</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <>
                    <HealthBar
                      label="Активное оборудование"
                      value={stats!.totalEquipment > 0 ? Math.round((stats!.active / stats!.totalEquipment) * 100) : 0}
                      color="bg-emerald-600"
                    />
                    <HealthBar
                      label="На обслуживании"
                      value={stats!.totalEquipment > 0 ? Math.round((stats!.maintenance / stats!.totalEquipment) * 100) : 0}
                      color="bg-amber-500"
                    />
                    <HealthBar
                      label="Списано"
                      value={stats!.totalEquipment > 0 ? Math.round((stats!.decommissioned / stats!.totalEquipment) * 100) : 0}
                      color="bg-red-500"
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/equipment"
                  className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-[#2E74B5] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить оборудование
                </a>
                <a
                  href="/movements"
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Переместить оборудование
                </a>
                <a
                  href="/decommission"
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Списание
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function HealthBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-[#94a3b8]">{label}</span>
        <span className="text-sm font-medium dark:text-white">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-[#334155] rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
