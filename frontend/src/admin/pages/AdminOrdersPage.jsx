import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { currency, formatDateTime } from '../../lib/utils';

const PAGE_SIZE = 8;
const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });

  const loadOrders = async ({ silent = false, page = meta.page } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const params = { ...filters, page, limit: PAGE_SIZE };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const response = await orderApi.getAll(params);
      setOrders(response.data.data);
      setMeta({
        page: response.data.page || page,
        pages: response.data.pages || 1,
        total: response.data.total || response.data.data.length,
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders({ page: 1 });
  }, [filters.status, filters.startDate, filters.endDate]);

  const updateStatus = async (id, status) => {
    await orderApi.updateStatus(id, { status });
    loadOrders({ silent: true, page: meta.page });
  };

  const totals = useMemo(() => ({
    orders: meta.total,
    visible: orders.length,
    revenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
  }), [meta.total, orders]);

  if (loading) return <Loader label="Loading orders..." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total matching orders</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{totals.orders}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Visible on page</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{totals.visible}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Revenue on page</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{currency(totals.revenue)}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
          {refreshing ? <span className="pill self-center bg-white text-slate-500">Refreshing...</span> : null}
        </div>
      </div>

      {error ? <div className="card p-6 text-sm text-rose-600">{error}</div> : null}
      {!error && !orders.length ? <EmptyState title="No orders found" description="Try a different filter combination or wait for new student orders." /> : null}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className={`card p-5 transition-opacity duration-200 ${refreshing ? 'opacity-70' : 'opacity-100'}`}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{order.user?.name} / {order.user?.studentId} / {formatDateTime(order.orderDate)}</p>
                <p className="mt-1 text-sm text-slate-500">Total: {currency(order.totalAmount)}</p>
              </div>
              <select className="input max-w-[220px]" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>

            <div className="mt-4 grid gap-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-[22px] bg-slate-50 px-4 py-3 text-sm">
                  <span className="text-slate-700">{item.name} x {item.quantity}</span>
                  <span className="font-medium text-slate-900">{currency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {order.specialInstructions ? <p className="mt-4 text-sm text-slate-600"><span className="font-semibold">Instructions:</span> {order.specialInstructions}</p> : null}
          </div>
        ))}
      </div>

      <Pagination page={meta.page} pages={meta.pages} onPageChange={(page) => loadOrders({ silent: true, page })} />
    </div>
  );
}
