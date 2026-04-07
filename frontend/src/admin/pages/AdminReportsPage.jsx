import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import { currency } from '../../lib/utils';

const REPORT_PAGE_SIZE = 5;

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [reportPage, setReportPage] = useState(1);

  const loadStats = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const params = { ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const response = await orderApi.stats(params);
      setStats(response.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load report statistics');
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    setReportPage(1);
    loadStats({ silent: !loading });
  }, [filters.startDate, filters.endDate]);

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

  const pagedPopularItems = useMemo(() => {
    const allItems = stats?.popularItems || [];
    const start = (reportPage - 1) * REPORT_PAGE_SIZE;
    return allItems.slice(start, start + REPORT_PAGE_SIZE);
  }, [stats, reportPage]);

  const reportPages = Math.max(1, Math.ceil((stats?.popularItems?.length || 0) / REPORT_PAGE_SIZE));

  if (loading) return <Loader label="Loading reports..." />;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]">
          <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
          <button onClick={exportCsv} className="btn-primary">Export CSV</button>
          {refreshing ? <span className="pill self-center bg-white text-slate-500">Refreshing...</span> : null}
        </div>
      </div>

      {error ? <div className="card p-6 text-sm text-rose-600">{error}</div> : null}

      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total orders</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{stats?.overall?.totalOrders || 0}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Revenue</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{currency(stats?.overall?.totalRevenue || 0)}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Average order value</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{currency(stats?.overall?.averageOrderValue || 0)}</p>
        </div>
      </div>

      <div className={`card p-6 transition-opacity duration-200 ${refreshing ? 'opacity-70' : 'opacity-100'}`}>
        <h2 className="text-xl font-semibold text-slate-900">Most popular items</h2>
        {!(stats?.popularItems || []).length ? <div className="mt-5"><EmptyState title="No report data yet" description="Once orders are placed, item performance will appear here." /></div> : null}
        <div className="mt-5 space-y-3">
          {pagedPopularItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-[22px] border border-slate-200 px-4 py-3 text-sm">
              <span>{item._id}</span>
              <span>{item.totalOrdered} ordered / {currency(item.revenue)}</span>
            </div>
          ))}
        </div>

        <Pagination page={reportPage} pages={reportPages} onPageChange={setReportPage} className="mt-6" />
      </div>
    </div>
  );
}
