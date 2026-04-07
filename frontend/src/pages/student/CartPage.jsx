import { Link, useNavigate } from 'react-router-dom';
import CartRow from '../../components/cart/CartRow';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { currency } from '../../lib/utils';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  if (!cart.items.length) {
    return (
      <div className="container-page py-10">
        <EmptyState title="Your cart is empty" description="Browse the menu and add delicious items before checkout." action={<Link to="/" className="btn-primary">Go to menu</Link>} />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="section-title">Shopping cart</h1>
              <p className="mt-1 text-sm text-slate-500">Review your selected items before checkout.</p>
            </div>
            <button onClick={() => clearCart()} className="btn-secondary">Clear cart</button>
          </div>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartRow key={item.menuItem?._id || item.menuItem} item={item} onQuantityChange={(row, qty) => updateQuantity(row.menuItem._id || row.menuItem, qty)} onRemove={(row) => removeItem(row.menuItem._id || row.menuItem)} />
            ))}
          </div>
        </div>
        <aside className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Total items</span><span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900"><span>Total amount</span><span>{currency(cart.totalAmount)}</span></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full">Proceed to checkout</button>
        </aside>
      </div>
    </div>
  );
}
