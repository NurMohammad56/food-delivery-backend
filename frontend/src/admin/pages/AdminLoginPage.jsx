import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, persistSession } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(form);
      const { token, user } = response.data.data;

      if (user.role !== 'admin') {
        setError('This login page is only for admin accounts.');
        return;
      }

      persistSession(token, user);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-white/10 bg-white/10 p-8 text-white">
      <p className="section-kicker !text-brand-200">Admin login</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to admin</h2>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="label !text-white/80">Email</label>
          <input className="input border-white/15 bg-white/95" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label !text-white/80">Password</label>
          <input className="input border-white/15 bg-white/95" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login to admin'}</button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm text-white/70">
        <Link to="/login" className="hover:text-white">Student login</Link>
        <Link to="/" className="hover:text-white">Back to website</Link>
      </div>
    </div>
  );
}
