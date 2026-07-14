import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FloorMapPage } from './features/floor-map/FloorMapPage';
import { FloorEditorPage } from './features/floor-map/FloorEditorPage';
import { MenuPage } from './features/menu/MenuPage';
import { ShiftsPage } from './features/shifts/ShiftsPage';
import { EmployeesPage } from './features/employees/EmployeesPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { MyShiftPage } from './features/employee/MyShiftPage';
import { MyTablesPage } from './features/employee/MyTablesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, currentUser } = useAuth();
  const isEmployee = currentUser?.role === 'waiter' || currentUser?.role === 'cashier';

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={isEmployee ? '/app/my-shift' : '/app/dashboard'} replace /> : <LoginPage />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to={isEmployee ? 'my-shift' : 'dashboard'} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="floor" element={<FloorMapPage />} />
        <Route path="floor/edit" element={<FloorEditorPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="shifts" element={<ShiftsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="my-shift" element={<MyShiftPage />} />
        <Route path="my-tables" element={<MyTablesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
