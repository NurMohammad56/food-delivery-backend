import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { currency } from '../../lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const estimatedReadyMinutes = useMemo(() => Math.min(Math.max(...cart.items.map((item) => item.menuItem?.preparationTime || 15), 15), 60), [cart.items]);
  const hasAddress = deliveryAddress.trim().length > 0;

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
      const response = await orderApi.place({
        deliveryAddress,
        specialInstructions,
        confirmOrder,
      });
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
          <p className="section-kicker">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Confirm your pickup order</h1>
          <p className="section-subtitle">Cash on pickup is the active payment method for this release.</p>

          <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
            <label className="label">Exact address</label>
            <textarea
              className="input min-h-[120px]"
              maxLength="300"
              placeholder="Enter your hall, building, floor, room, or exact pickup location"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              {deliveryAddress.length}/300 characters
            </p>
            {!hasAddress ? (
              <p className="mt-2 text-xs text-amber-600">
                Add your room, floor, building, or exact pickup point to continue.
              </p>
            ) : null}
          </div>

          <div className="mt-6 rounded-[24px] border border-brand-100 bg-brand-50/70 p-5">
            <p className="text-sm font-semibold text-slate-900">Pickup and verification</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              After placing the order, you will receive a 6 character pickup code.
              Show that code to the canteen staff when receiving the order.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              To reduce fake orders, one account can keep at most 2 active orders at a time.
            </p>
          </div>

          <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
            <label className="label">Special instructions</label>
            <textarea className="input min-h-[140px]" maxLength="200" placeholder="Optional notes for the canteen staff" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
            <p className="mt-2 text-xs text-slate-500">{specialInstructions.length}/200 characters</p>
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmOrder}
              onChange={(e) => setConfirmOrder(e.target.checked)}
              required
            />
            <span>
              I confirm this is a real order, I entered the correct address, and I will receive the food with my pickup code.
            </span>
          </label>

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          {!confirmOrder ? (
            <p className="mt-4 text-xs text-amber-600">
              Confirm the checkbox to place the order.
            </p>
          ) : null}
          <button className="btn-primary mt-6" disabled={loading || !confirmOrder || !hasAddress}>{loading ? 'Placing order...' : 'Confirm order'}</button>
        </form>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <div className="mt-5 space-y-3">
            {cart.items.map((item) => (
              <div key={item.menuItem?._id || item.menuItem} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.name} x {item.quantity}</span>
                <span className="font-medium text-slate-900">{currency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
            <div className="space-y-1">
              <span className="text-slate-500">Address</span>
              <p className="font-medium text-slate-900">
                {deliveryAddress.trim() || 'Add your exact address before placing the order.'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Verification</span>
              <span className={`font-medium ${confirmOrder ? 'text-emerald-600' : 'text-amber-600'}`}>
                {confirmOrder ? 'Confirmed' : 'Waiting'}
              </span>
            </div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Estimated preparation</span><span className="font-medium text-slate-900">{estimatedReadyMinutes} min</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Payment</span><span className="font-medium text-slate-900">Cash on pickup</span></div>
            <div className="flex items-center justify-between text-base font-semibold"><span>Total</span><span>{currency(cart.totalAmount)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
