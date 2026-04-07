import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../../api/services';
import Loader from '../../components/common/Loader';
import OrderCard from '../../components/orders/OrderCard';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getOne(id)
      .then((response) => setOrder(response.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading order details..." />;
  if (!order) return <div className="container-page py-10">Order not found.</div>;

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="section-title">Order confirmation</h1>
          <p className="mt-1 text-sm text-slate-500">Your order has been submitted successfully.</p>
        </div>
        <Link to="/orders" className="btn-secondary">Back to orders</Link>
      </div>
      <OrderCard order={order} />
    </div>
  );
}
