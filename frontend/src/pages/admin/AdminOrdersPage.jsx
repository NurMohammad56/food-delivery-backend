import { useEffect, useState } from 'react';
import { orderApi } from '../../api/services';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { currency, formatDateTime } from '../../lib/utils';

const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });

  const loadOrders = async () => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach((key) => !params[key] && delete params[key]);
    const response = await orderApi.getAll(params);
    setOrders(response.data.data);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filters.status, filters.startDate, filters.endDate]);

  const updateStatus = async (id, status) => {
    await orderApi.updateStatus(id, { status });
    loadOrders();
  };

  if (loading) return <Loader label="Loading orders..." />;

  return (
    <div className="card p-6">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{order.user?.name} • {order.user?.studentId} • {formatDateTime(order.orderDate)}</p>
                <p className="mt-1 text-sm text-slate-500">Total: {currency(order.totalAmount)}</p>
              </div>
              <select className="input max-w-[200px]" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="mt-4 grid gap-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <span className="text-slate-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-slate-900">{currency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            {order.specialInstructions ? <p className="mt-4 text-sm text-slate-600"><span className="font-semibold">Instructions:</span> {order.specialInstructions}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
