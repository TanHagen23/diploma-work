import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardPage from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import EquipmentPage from '@/pages/equipment';
import UsersPage from '@/pages/users';
import MovementsPage from '@/pages/movements';
import DecommissionPage from '@/pages/decommission';
import ReportsPage from '@/pages/reports';
import SettingsPage from '@/pages/settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/movements" element={<MovementsPage />} />
        <Route path="/decommission" element={<DecommissionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
