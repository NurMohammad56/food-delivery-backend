import { useEffect, useState } from 'react';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import OrderCard from '../../components/orders/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMine(status ? { status } : {});
      setOrders(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [status]);

  const cancelOrder = async (id) => {
    await orderApi.cancel(id);
    loadOrders();
  };

  if (loading) return <Loader label="Loading your orders..." />;

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">My orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track active orders and review past purchases.</p>
        </div>
        <select className="input max-w-[220px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      {!orders.length ? <EmptyState title="No orders yet" description="Place your first order from the menu page." /> : null}
      <div className="space-y-5">
        {orders.map((order) => <OrderCard key={order._id} order={order} action={order.status === 'Pending' ? <button onClick={() => cancelOrder(order._id)} className="btn-secondary">Cancel order</button> : null} />)}
      </div>
    </div>
  );
}
