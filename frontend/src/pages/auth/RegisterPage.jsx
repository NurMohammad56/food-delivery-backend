import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { persistSession } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', studentId: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register(form);
      const { token, user } = response.data.data;
      persistSession(token, user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
      <p className="mt-2 text-sm text-slate-500">Register as a student to browse the menu and place orders.</p>
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <div>
          <label className="label">Full name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Student ID</label>
            <input className="input" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Already registered? <Link className="text-brand-600" to="/login">Login here</Link></p>
    </div>
  );
}
