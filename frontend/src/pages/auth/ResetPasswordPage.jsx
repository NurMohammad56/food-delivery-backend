import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../../api/services';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword(token, { password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-slate-900">Set a new password</h2>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="label">New password</label>
          <input className="input" type="password" minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Updating...' : 'Reset password'}</button>
      </form>
    </div>
  );
}
