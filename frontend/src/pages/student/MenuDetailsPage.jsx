import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { menuApi } from '../../api/services';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import { currency } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function MenuDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    menuApi.getItem(id)
      .then((response) => setItem(response.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    try {
      if (!isAuthenticated) {
        setToast('Please login first to add this item.');
      } else {
        await addToCart(item._id, quantity);
        setToast('Item added to cart successfully.');
      }
    } catch (err) {
      setToast(err?.response?.data?.message || 'Could not add item.');
    } finally {
      setTimeout(() => setToast(''), 2200);
    }
  };

  if (loading) return <Loader label="Loading item details..." />;
  if (!item) return <div className="container-page py-10">Item not found.</div>;

  return (
    <div className="container-page py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700">
        <span>&lt;</span>
        <span>Back to menu</span>
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="card overflow-hidden p-3">
          <div className="overflow-hidden rounded-[28px] bg-slate-100">
            <div className="aspect-[4/3]">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 via-white to-emerald-50 text-slate-500">
                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">🍱</div>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card p-8">
          <span className="pill bg-brand-50 text-brand-700">{item.category?.name || item.category}</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{item.name}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{item.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Price</p>
              <p className="mt-2 text-lg font-semibold">{currency(item.price)}</p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Preparation</p>
              <p className="mt-2 text-lg font-semibold">{item.preparationTime} min</p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Availability</p>
              <p className={`mt-2 text-lg font-semibold ${item.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.isAvailable ? 'In stock' : 'Out of stock'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <select className="input max-w-[120px]" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <button onClick={handleAdd} disabled={!item.isAvailable} className="btn-primary">
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
