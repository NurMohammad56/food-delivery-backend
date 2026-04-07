import { useState } from 'react';
import { userApi } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await userApi.updateProfile(profile);
      setUser(response.data.data);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await userApi.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage('Password changed successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Profile settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal information and password securely.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Basic information</h2>
          <div className="mt-6 space-y-5">
            <div><label className="label">Name</label><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="label">Email</label><input className="input bg-slate-50" value={user?.email || ''} disabled /></div>
              <div><label className="label">Student ID</label><input className="input bg-slate-50" value={user?.studentId || ''} disabled /></div>
            </div>
            <button className="btn-primary">Save changes</button>
          </div>
        </form>
        <form onSubmit={changePassword} className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
          <div className="mt-6 space-y-5">
            <div><label className="label">Current password</label><input className="input" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></div>
            <div><label className="label">New password</label><input className="input" type="password" minLength="8" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></div>
            <button className="btn-primary">Update password</button>
          </div>
        </form>
      </div>
      {message ? <p className="mt-6 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
