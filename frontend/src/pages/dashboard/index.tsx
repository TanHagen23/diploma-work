import { AppLayout } from '@/widgets/app-layout';
import { StatsCards } from '@/widgets/stats-cards';
import { RecentMovementsTable } from '@/widgets/recent-movements-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { DashboardStats } from '@/shared/types';

const mockStats: DashboardStats = {
  totalEquipment: 2450,
  totalEquipmentChange: '+4.75%',
  deployed: 2181,
  deployedChange: '+2.3%',
  inStock: 275,
  inStockChange: '-1.8%',
  decommissioned: 182,
  decommissionedChange: '+0.5%',
};

export default function DashboardPage() {
  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Overview of warehouse assets and operations"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={mockStats} />

        {/* Recent Movements and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentMovementsTable />
          </div>

          <div className="space-y-4">
            {/* Warehouse Health */}
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Storage Capacity</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Equipment Utilization</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Maintenance Due</span>
                    <span className="text-sm font-medium">7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-[#2E74B5] hover:bg-blue-100 transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Equipment
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Move Equipment
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
