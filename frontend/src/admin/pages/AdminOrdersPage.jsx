import { useEffect, useMemo, useRef, useState } from 'react';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { currency, formatDateTime } from '../../lib/utils';
import ordersBackground from '../../assets/Section BG.avif';

const PAGE_SIZE = 8;
const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '', search: '' });
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const hasLoadedRef = useRef(false);

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
    loadOrders({ page: 1 }).finally(() => {
      hasLoadedRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return undefined;
    const timeout = setTimeout(() => {
      loadOrders({ silent: true, page: 1 });
    }, 250);
    return () => clearTimeout(timeout);
  }, [filters.status, filters.startDate, filters.endDate, filters.search]);

  const updateStatus = async (id, status) => {
    await orderApi.updateStatus(id, { status });
    loadOrders({ silent: true, page: meta.page });
  };

  const removeOrder = async (id) => {
    if (!window.confirm('Delete this order history? This cannot be undone.')) return;
    await orderApi.remove(id);
    const nextPage = meta.page > 1 && orders.length === 1 ? meta.page - 1 : meta.page;
    loadOrders({ silent: true, page: nextPage });
    if (selectedOrder?._id === id) setSelectedOrder(null);
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

      <div className="card relative overflow-hidden p-6">
        <img
          src={ordersBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.06]"
        />
        <div className="relative grid gap-4 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_auto]">
          <input className="input" placeholder="Search by name, ID, phone, address, or pickup code" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
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

      <div className="grid gap-4">
        {orders.map((order) => (
          (() => {
            const studentName = order.customerName || order.user?.name || '-';
            const studentId = order.customerStudentId || order.user?.studentId || '-';
            const studentPhone = order.customerPhone || order.user?.phone || '-';
            const studentEmail = order.customerEmail || order.user?.email || '-';
            const pickupCode = order.pickupCode || '-';
            const deliveryAddress = order.deliveryAddress || 'Not provided';
            return (
          <div key={order._id} className={`card relative overflow-hidden p-5 transition-opacity duration-200 ${refreshing ? 'opacity-70' : 'opacity-100'}`}>
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand-100/50 blur-3xl" />
            <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <StatusBadge status={order.status} />
                  {pickupCode !== '-' ? (
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                      {pickupCode}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-500">{studentName} / {studentId} / {formatDateTime(order.orderDate)}</p>
                <p className="mt-1 text-sm text-slate-500">Phone: {studentPhone}</p>
                <p className="mt-1 break-all text-sm text-slate-500">Email: {studentEmail}</p>
                <p className="mt-1 text-sm text-slate-500">Total: {currency(order.totalAmount)}</p>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">Address: {deliveryAddress}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select className="input max-w-[220px]" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button type="button" onClick={() => setSelectedOrder(order)} className="btn-secondary">
                  Details
                </button>
                <button type="button" onClick={() => removeOrder(order._id)} className="btn-danger">
                  Delete history
                </button>
              </div>
            </div>
          </div>
            );
          })()
        ))}
      </div>

      <Pagination page={meta.page} pages={meta.pages} onPageChange={(page) => loadOrders({ silent: true, page })} />

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder._id.slice(-6).toUpperCase()}` : 'Order details'}
        size="max-w-4xl"
      >
        {selectedOrder ? (
          (() => {
            const studentName = selectedOrder.customerName || selectedOrder.user?.name || '-';
            const studentId = selectedOrder.customerStudentId || selectedOrder.user?.studentId || '-';
            const studentPhone = selectedOrder.customerPhone || selectedOrder.user?.phone || '-';
            const studentEmail = selectedOrder.customerEmail || selectedOrder.user?.email || '-';
            const pickupCode = selectedOrder.pickupCode || '-';
            const deliveryAddress = selectedOrder.deliveryAddress || 'Not provided';
            return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Student</p>
                <p className="mt-2 font-semibold text-slate-900">{studentName}</p>
                <p className="mt-1 text-sm text-slate-500">{studentId}</p>
              </div>
              <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Contact</p>
                <p className="mt-2 font-semibold text-slate-900">{studentPhone}</p>
                <p className="mt-1 break-all text-sm text-slate-500">{studentEmail}</p>
              </div>
              <div className="rounded-[22px] bg-brand-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-brand-500">Pickup code</p>
                <p className="mt-2 text-2xl font-semibold text-brand-700">{pickupCode}</p>
              </div>
              <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Order total</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{currency(selectedOrder.totalAmount)}</p>
                <p className="mt-1 text-sm text-slate-500">{formatDateTime(selectedOrder.orderDate)}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Exact address</p>
                <p className="mt-3 break-words text-sm leading-6 text-slate-700">{deliveryAddress}</p>
              </div>
              <div className="rounded-[24px] bg-brand-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-brand-500">Staff handoff guide</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">Verify student ID or phone, then confirm the pickup code before handing over the order.</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-[22px] bg-slate-50 px-4 py-3 text-sm">
                  <span className="text-slate-700">{item.name} x {item.quantity}</span>
                  <span className="font-medium text-slate-900">{currency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {selectedOrder.specialInstructions ? (
              <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
                <span className="font-semibold">Instructions:</span> {selectedOrder.specialInstructions}
              </div>
            ) : null}
          </div>
            );
          })()
        ) : null}
      </Modal>
    </div>
  );
}
