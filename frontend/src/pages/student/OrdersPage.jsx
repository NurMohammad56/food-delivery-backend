import { useEffect, useMemo, useRef, useState } from 'react';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import OrderCard from '../../components/orders/OrderCard';
import { currency, formatDateTime } from '../../lib/utils';

const PAGE_SIZE = 6;
const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const loadOrders = async ({ silent = false, page = meta.page } = {}) => {
    const requestId = ++requestIdRef.current;
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const params = { ...filters, page, limit: PAGE_SIZE };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const response = await orderApi.getMine(params);
      if (requestId !== requestIdRef.current) return;
      setOrders(response.data.data);
      setMeta({
        page: response.data.page || page,
        pages: response.data.pages || 1,
        total: response.data.total || response.data.data.length,
      });
      if (selectedOrder) {
        const updatedSelectedOrder = response.data.data.find((order) => order._id === selectedOrder._id);
        if (updatedSelectedOrder) setSelectedOrder(updatedSelectedOrder);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      if (requestId !== requestIdRef.current) return;
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
  }, [filters.status, filters.search]);

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    await orderApi.cancel(id);
    const nextPage = meta.page > 1 && orders.length === 1 ? meta.page - 1 : meta.page;
    if (selectedOrder?._id === id) {
      setSelectedOrder((current) => (current ? { ...current, status: 'Cancelled' } : current));
    }
    await loadOrders({ silent: true, page: nextPage });
  };

  const totals = useMemo(() => ({
    total: meta.total,
    active: orders.filter((order) => ['Pending', 'Preparing', 'Ready'].includes(order.status)).length,
    visible: orders.length,
  }), [meta.total, orders]);

  if (loading) return <Loader label="Loading your orders..." />;

  return (
    <div className="container-page space-y-6 py-10">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total matching orders</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{totals.total}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active on this page</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{totals.active}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Visible on page</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{totals.visible}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="section-title">My orders</h1>
            <p className="mt-1 text-sm text-slate-500">Track active orders, search your history, and open full details only when you need them.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,320px)_220px_120px]">
            <input
              className="input"
              placeholder="Search by item, address, code, or note"
              value={filters.search}
              onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))}
            />
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
            >
              <option value="">All statuses</option>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <div className="flex min-h-[44px] items-center justify-end">
              {refreshing ? <span className="pill bg-white text-slate-500">Refreshing...</span> : null}
            </div>
          </div>
        </div>
      </div>

      {error ? <div className="card p-6 text-sm text-rose-600">{error}</div> : null}
      {!error && !orders.length ? <EmptyState title="No orders found" description="Try a different filter or place a new order from the menu page." /> : null}

      <div className="grid min-h-[340px] gap-4">
        {orders.map((order) => {
          const pickupCode = order.pickupCode || '-';
          const deliveryAddress = order.deliveryAddress || 'Not provided';
          const firstItem = order.items[0]?.name || 'Order item';

          return (
            <div key={order._id} className="card p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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
                  <p className="mt-2 text-sm text-slate-500">{formatDateTime(order.orderDate)} • {currency(order.totalAmount)} • {order.items.length} items</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{firstItem}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">Address: {deliveryAddress}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setSelectedOrder(order)} className="btn-secondary">
                    Details
                  </button>
                  {order.status === 'Pending' ? (
                    <button type="button" onClick={() => cancelOrder(order._id)} className="btn-secondary">
                      Cancel order
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination page={meta.page} pages={meta.pages} onPageChange={(page) => loadOrders({ silent: true, page })} alwaysShow />

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder._id.slice(-6).toUpperCase()}` : 'Order details'}
        size="max-w-4xl"
      >
        {selectedOrder ? (
          <OrderCard
            order={selectedOrder}
            action={selectedOrder.status === 'Pending' ? (
              <button type="button" onClick={() => cancelOrder(selectedOrder._id)} className="btn-secondary">
                Cancel order
              </button>
            ) : null}
          />
        ) : null}
      </Modal>
    </div>
  );
}
