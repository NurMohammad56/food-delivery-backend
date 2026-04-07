import { useEffect, useState } from 'react';
import { userApi } from '../../api/services';
import Loader from '../../components/common/Loader';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const response = await userApi.getUsers();
    setUsers(response.data.data);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  if (loading) return <Loader label="Loading users..." />;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-slate-900">User management</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500"><tr><th className="py-3">Name</th><th className="py-3">Email</th><th className="py-3">Student ID</th><th className="py-3">Role</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-slate-200">
                <td className="py-4 font-medium text-slate-800">{user.name}</td>
                <td className="py-4 text-slate-600">{user.email}</td>
                <td className="py-4 text-slate-600">{user.studentId}</td>
                <td className="py-4"><select className="input max-w-[140px]" value={user.role} onChange={(e) => userApi.updateRole(user._id, { role: e.target.value }).then(loadUsers)}><option value="student">student</option><option value="admin">admin</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
