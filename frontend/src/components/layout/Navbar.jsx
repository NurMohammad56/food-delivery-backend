import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const navClass = ({ isActive }) => isActive ? 'text-brand-700 font-semibold' : 'text-slate-600 hover:text-slate-900';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white">NUB</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Campus Food Delivery</p>
            <p className="text-xs text-slate-500">Fresh meals, faster pickup</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>Menu</NavLink>
          {isAuthenticated && !isAdmin ? (
            <>
              <NavLink to="/cart" className={navClass}>Cart ({itemCount})</NavLink>
              <NavLink to="/orders" className={navClass}>Orders</NavLink>
              <NavLink to="/profile" className={navClass}>Profile</NavLink>
            </>
          ) : null}
          {isAdmin ? <NavLink to="/admin" className={navClass}>Admin Panel</NavLink> : null}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary hidden sm:inline-flex">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
