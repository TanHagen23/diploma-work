import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardPage from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import EquipmentPage from '@/pages/equipment';
import UsersPage from '@/pages/users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}