import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, bootstrapping } = useAuth();

  if (bootstrapping) return <Loader label="Checking admin session..." />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
