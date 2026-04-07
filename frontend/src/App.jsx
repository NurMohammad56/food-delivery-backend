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
import AdminAuthLayout from './admin/layout/AdminAuthLayout';
import AdminLayout from './admin/layout/AdminLayout';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminMenuPage from './admin/pages/AdminMenuPage';
import AdminCategoriesPage from './admin/pages/AdminCategoriesPage';
import AdminUsersPage from './admin/pages/AdminUsersPage';
import AdminReportsPage from './admin/pages/AdminReportsPage';
import AdminProtectedRoute from './admin/routes/AdminProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<AdminAuthLayout />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
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

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
