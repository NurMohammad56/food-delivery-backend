import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { currency } from '../../lib/utils';
import StatCard from '../components/StatCard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi.stats()
      .then((response) => setStats(response.data.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load dashboard statistics'))
      .finally(() => setLoading(false));
  }, []);

  const statusMap = useMemo(() => Object.fromEntries((stats?.byStatus || []).map((row) => [row._id, row.count])), [stats]);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <div className="card p-6 text-sm text-rose-600">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[32px] bg-brand-900 p-7 text-white shadow-soft sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,126,217,0.34),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_bottom_right,rgba(2,154,87,0.2),transparent_32%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">Operational snapshot</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight">Monitor demand, revenue, and queue pressure in one place.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Completed</p>
                <p className="mt-3 text-3xl font-semibold">{statusMap.Completed || 0}</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Ready now</p>
                <p className="mt-3 text-3xl font-semibold">{statusMap.Ready || 0}</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Cancelled</p>
                <p className="mt-3 text-3xl font-semibold">{statusMap.Cancelled || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <p className="section-kicker">Performance</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Top selling menu items</h2>
          <div className="mt-5 space-y-3">
            {(stats?.popularItems || []).slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-[22px] bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-800">{item._id}</span>
                  <span className="text-sm text-slate-500">{item.totalOrdered} ordered</span>
                </div>
              </div>
            ))}
            {!(stats?.popularItems || []).length ? <EmptyState title="No popular items yet" description="Item demand will appear here once orders are placed." /> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={stats?.overall?.totalOrders || 0} />
        <StatCard label="Pending orders" value={statusMap.Pending || 0} />
        <StatCard label="Preparing" value={statusMap.Preparing || 0} />
        <StatCard label="Revenue" value={currency(stats?.overall?.totalRevenue || 0)} />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">7 day order activity</h2>
          <div className="mt-5 space-y-3">
            {(stats?.byDate || []).map((day) => (
              <div key={day._id} className="flex items-center justify-between rounded-[22px] border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-700">{day._id}</span>
                <span className="text-slate-500">{day.count} orders / {currency(day.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Status distribution</h2>
          <div className="mt-5 space-y-3">
            {Object.entries(statusMap).map(([status, count]) => (
              <div key={status} className="rounded-[22px] bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-700">{status}</span>
                  <span className="text-sm font-semibold text-slate-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
