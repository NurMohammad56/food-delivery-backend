import { useState } from 'react';
import { authApi } from '../../api/services';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err?.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-slate-900">Forgot your password?</h2>
      <p className="mt-2 text-sm text-slate-500">Enter your registered email to receive a reset link.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>
    </div>
  );
}
