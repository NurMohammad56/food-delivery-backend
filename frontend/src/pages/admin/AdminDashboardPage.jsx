import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../../api/services';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/common/Loader';
import { currency } from '../../lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.stats().then((response) => setStats(response.data.data)).finally(() => setLoading(false));
  }, []);

  const statusMap = useMemo(() => Object.fromEntries((stats?.byStatus || []).map((row) => [row._id, row.count])), [stats]);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={stats?.overall?.totalOrders || 0} />
        <StatCard label="Pending orders" value={statusMap.Pending || 0} />
        <StatCard label="Orders preparing" value={statusMap.Preparing || 0} />
        <StatCard label="Revenue" value={currency(stats?.overall?.totalRevenue || 0)} />
      </div>
      <div className="grid gap-8 xl:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Popular items</h2>
          <div className="mt-5 space-y-3">
            {(stats?.popularItems || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-700">{item._id}</span>
                <span className="text-slate-500">{item.totalOrdered} ordered</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">7-day order activity</h2>
          <div className="mt-5 space-y-3">
            {(stats?.byDate || []).map((day) => (
              <div key={day._id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-700">{day._id}</span>
                <span className="text-slate-500">{day.count} orders • {currency(day.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
