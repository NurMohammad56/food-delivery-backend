import { useEffect, useState } from 'react';
import { userApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const response = await userApi.getUsers(params);
      setUsers(response.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 250);
    return () => clearTimeout(timeout);
  }, [filters.search, filters.role]);

  const updateRole = async (id, role) => {
    await userApi.updateRole(id, { role });
    loadUsers();
  };

  if (loading) return <Loader label="Loading users..." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Visible users</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admins</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{users.filter((user) => user.role === 'admin').length}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Students</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{users.filter((user) => user.role === 'student').length}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <input className="input" placeholder="Search by name, email, or student ID" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="input" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All roles</option>
            <option value="student">student</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>

      {error ? <div className="card p-6 text-sm text-rose-600">{error}</div> : null}
      {!error && !users.length ? <EmptyState title="No users found" description="No user accounts match the current filters." /> : null}

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-900">User management</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Student ID</th>
                <th className="py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-200">
                  <td className="py-4 font-medium text-slate-800">{user.name}</td>
                  <td className="py-4 text-slate-600">{user.email}</td>
                  <td className="py-4 text-slate-600">{user.studentId}</td>
                  <td className="py-4">
                    <select className="input max-w-[160px]" value={user.role} onChange={(e) => updateRole(user._id, e.target.value)}>
                      <option value="student">student</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
