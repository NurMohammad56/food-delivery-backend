import { useEffect, useMemo, useState } from 'react';
import { menuApi } from '../../api/services';
import MenuCard from '../../components/menu/MenuCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', search: '', minPrice: '', maxPrice: '', isAvailable: 'true' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters };
      Object.keys(params).forEach((key) => params[key] === '' && delete params[key]);
      const [menuResponse, categoryResponse] = await Promise.all([
        menuApi.getMenu(params),
        menuApi.getCategories(),
      ]);
      setMenuItems(menuResponse.data.data);
      setCategories(categoryResponse.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    const timeout = setTimeout(loadData, 250);
    return () => clearTimeout(timeout);
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.isAvailable]);

  const matchingCount = useMemo(() => menuItems.length, [menuItems]);

  const handleAdd = async (item) => {
    if (!isAuthenticated) {
      setToast('Please login first to add items to your cart.');
      setTimeout(() => setToast(''), 2200);
      return;
    }
    try {
      await addToCart(item._id, 1);
      setToast(`${item.name} added to cart.`);
    } catch (err) {
      setToast(err?.response?.data?.message || 'Could not add item.');
    } finally {
      setTimeout(() => setToast(''), 2200);
    }
  };

  if (loading) return <Loader label="Loading menu..." />;

  return (
    <div className="container-page py-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 p-8 text-white">
          <p className="text-sm font-medium text-brand-100">NUB Campus Food Delivery</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight">Order ahead, skip the queue, and collect your meals on time.</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-100/85">Browse the daily menu, manage your cart, and track every order from pending to pickup with a polished student-facing experience.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Quick filters</h2>
          <div className="mt-5 grid gap-4">
            <input className="input" placeholder="Search by item name or description" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input" type="number" min="0" placeholder="Min price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
              <input className="input" type="number" min="0" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
            </div>
            <select className="input" value={filters.isAvailable} onChange={(e) => setFilters({ ...filters, isAvailable: e.target.value })}>
              <option value="true">Available only</option>
              <option value="">All items</option>
              <option value="false">Unavailable only</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Today&apos;s menu</h2>
            <p className="mt-1 text-sm text-slate-500">{matchingCount} item(s) match your current filters.</p>
          </div>
        </div>
        {error ? <div className="card p-6 text-sm text-rose-600">{error}</div> : null}
        {!error && menuItems.length === 0 ? <EmptyState title="No menu items found" description="Try adjusting your filters or search keywords." /> : null}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => <MenuCard key={item._id} item={item} onAdd={handleAdd} />)}
        </div>
      </section>
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
