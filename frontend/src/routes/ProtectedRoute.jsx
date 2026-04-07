import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAdmin, bootstrapping } = useAuth();

  if (bootstrapping) return <Loader label="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
