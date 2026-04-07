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
      <Link to="/" className="text-sm font-medium text-brand-600">← Back to menu</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="overflow-hidden rounded-3xl bg-white">
          <div className="aspect-[4/3] bg-slate-100">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">No image available</div>}
          </div>
        </div>
        <div className="card p-8">
          <p className="text-sm font-semibold text-brand-600">{item.category?.name || item.category}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{item.name}</h1>
          <p className="mt-4 text-slate-600">{item.description}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Price</p><p className="mt-1 text-lg font-semibold">{currency(item.price)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Preparation</p><p className="mt-1 text-lg font-semibold">{item.preparationTime} min</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Availability</p><p className={`mt-1 text-lg font-semibold ${item.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>{item.isAvailable ? 'In stock' : 'Out of stock'}</p></div>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <select className="input max-w-[120px]" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <button onClick={handleAdd} disabled={!item.isAvailable} className="btn-primary">Add to cart</button>
          </div>
        </div>
      </div>
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
