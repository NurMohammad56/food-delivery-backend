import { useEffect, useState } from 'react';
import { orderApi } from '../../api/services';
import Loader from '../../components/common/Loader';
import { currency } from '../../lib/utils';

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach((key) => !params[key] && delete params[key]);
    const response = await orderApi.stats(params);
    setStats(response.data.data);
    setLoading(false);
  };

  useEffect(() => { loadStats(); }, [filters.startDate, filters.endDate]);

  const exportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Orders', stats?.overall?.totalOrders || 0],
      ['Total Revenue', stats?.overall?.totalRevenue || 0],
      ['Average Order Value', stats?.overall?.averageOrderValue || 0],
    ];
    (stats?.popularItems || []).forEach((item) => rows.push([`Popular Item - ${item._id}`, item.totalOrdered]));
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sales-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader label="Loading reports..." />;

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
          <button onClick={exportCsv} className="btn-primary">Export CSV</button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6"><p className="text-sm text-slate-500">Total orders</p><p className="mt-3 text-3xl font-bold">{stats?.overall?.totalOrders || 0}</p></div>
        <div className="card p-6"><p className="text-sm text-slate-500">Revenue</p><p className="mt-3 text-3xl font-bold">{currency(stats?.overall?.totalRevenue || 0)}</p></div>
        <div className="card p-6"><p className="text-sm text-slate-500">Average order value</p><p className="mt-3 text-3xl font-bold">{currency(stats?.overall?.averageOrderValue || 0)}</p></div>
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Most popular items</h2>
        <div className="mt-5 space-y-3">
          {(stats?.popularItems || []).map((item) => <div key={item._id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"><span>{item._id}</span><span>{item.totalOrdered} ordered • {currency(item.revenue)}</span></div>)}
        </div>
      </div>
    </div>
  );
}
