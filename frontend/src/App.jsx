import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import HomePage from './pages/student/HomePage';
import MenuDetailsPage from './pages/student/MenuDetailsPage';
import CartPage from './pages/student/CartPage';
import CheckoutPage from './pages/student/CheckoutPage';
import OrdersPage from './pages/student/OrdersPage';
import OrderDetailsPage from './pages/student/OrderDetailsPage';
import ProfilePage from './pages/student/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route path="/" element={<AppShell><HomePage /></AppShell>} />
      <Route path="/menu/:id" element={<AppShell><MenuDetailsPage /></AppShell>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<AppShell><CartPage /></AppShell>} />
        <Route path="/checkout" element={<AppShell><CheckoutPage /></AppShell>} />
        <Route path="/orders" element={<AppShell><OrdersPage /></AppShell>} />
        <Route path="/orders/:id" element={<AppShell><OrderDetailsPage /></AppShell>} />
        <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AppShell><AdminLayout /></AppShell>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
