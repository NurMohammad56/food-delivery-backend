import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { persistSession } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login(form);
      const { token, user } = response.data.data;
      persistSession(token, user);
      navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/'));
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-500">Login with your registered email and password.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="text-brand-600 hover:text-brand-700">Forgot password?</Link>
        <Link to="/register" className="text-slate-600 hover:text-slate-900">Create account</Link>
      </div>
    </div>
  );
}
