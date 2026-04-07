import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { currency } from '../../lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const estimatedReadyMinutes = useMemo(() => Math.min(Math.max(...cart.items.map((item) => item.menuItem?.preparationTime || 15), 15), 60), [cart.items]);

  if (!cart.items.length) {
    return (
      <div className="container-page py-10">
        <EmptyState title="Nothing to checkout" description="Your cart is empty right now." />
      </div>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await orderApi.place({ specialInstructions });
      await refreshCart();
      navigate(`/orders/${response.data.data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="card p-6">
          <h1 className="section-title">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">Cash on pickup is the active payment method for this release.</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <label className="label">Special instructions</label>
            <textarea className="input min-h-[140px]" maxLength="200" placeholder="Optional notes for the canteen staff" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
            <p className="mt-2 text-xs text-slate-500">{specialInstructions.length}/200 characters</p>
          </div>
          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          <button className="btn-primary mt-6" disabled={loading}>{loading ? 'Placing order...' : 'Confirm order'}</button>
        </form>
        <aside className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <div className="mt-5 space-y-3">
            {cart.items.map((item) => (
              <div key={item.menuItem?._id || item.menuItem} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.name} × {item.quantity}</span>
                <span className="font-medium text-slate-900">{currency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
            <div className="flex items-center justify-between"><span className="text-slate-500">Estimated preparation</span><span className="font-medium text-slate-900">{estimatedReadyMinutes} min</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Payment</span><span className="font-medium text-slate-900">Cash on Pickup</span></div>
            <div className="flex items-center justify-between text-base font-semibold"><span>Total</span><span>{currency(cart.totalAmount)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
