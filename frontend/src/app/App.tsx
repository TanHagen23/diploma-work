import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardPage from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import EquipmentPage from '@/pages/equipment';
import UsersPage from '@/pages/users';
import MovementsPage from '@/pages/movements';
import DecommissionPage from '@/pages/decommission';
import ReportsPage from '@/pages/reports';
import SettingsPage from '@/pages/settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const basename = import.meta.env.PROD ? '/asset' : '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/equipment" element={<PrivateRoute><EquipmentPage /></PrivateRoute>} />
        <Route path="/movements" element={<PrivateRoute><MovementsPage /></PrivateRoute>} />
        <Route path="/decommission" element={<PrivateRoute><DecommissionPage /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
