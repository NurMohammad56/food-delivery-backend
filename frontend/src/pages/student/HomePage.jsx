import { useEffect, useMemo, useState } from 'react';
import { menuApi } from '../../api/services';
import MenuCard from '../../components/menu/MenuCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import MenuShowcase from '../../components/home/MenuShowcase';
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
  const featuredItems = useMemo(() => {
    const available = menuItems.filter((item) => item.isAvailable);
    return (available.length ? available : menuItems).slice(0, 5);
  }, [menuItems]);

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
    <div className="container-page py-8 sm:py-10">
      <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-soft sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.26),transparent_32%)]" />
          <div className="relative">
            <p className="section-kicker !text-brand-200">BentoBox / Campus menu</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Order ahead, skip the queue, and pick up meals right on time.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">A lighter student experience with faster filtering, richer menu presentation, and a separate admin console for canteen operations.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="pill border-white/10 bg-white/10 text-white">Live menu filtering</span>
              <span className="pill border-white/10 bg-white/10 text-white">Cash on pickup</span>
              <span className="pill border-white/10 bg-white/10 text-white">Admin analytics and reports</span>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Active items</p>
                <p className="mt-3 text-3xl font-semibold">{matchingCount}</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Categories</p>
                <p className="mt-3 text-3xl font-semibold">{categories.length}</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Fastest prep</p>
                <p className="mt-3 text-3xl font-semibold">{featuredItems[0]?.preparationTime || 0} min</p>
              </div>
            </div>
          </div>
        </div>

        <MenuShowcase items={featuredItems} onAdd={handleAdd} />
      </section>

      <section className="mt-8 card p-6 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="section-kicker">Filter menu</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Find something worth the walk</h2>
            <p className="section-subtitle">Search by keyword, narrow by category, and keep the list focused on what is actually available.</p>
          </div>
          <div className="pill w-fit bg-brand-50 text-brand-700">
            {matchingCount} item(s) match your filters
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <input className="input" placeholder="Search by item name or description" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <input className="input" type="number" min="0" placeholder="Min price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <input className="input" type="number" min="0" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          <select className="input" value={filters.isAvailable} onChange={(e) => setFilters({ ...filters, isAvailable: e.target.value })}>
            <option value="true">Available only</option>
            <option value="">All items</option>
            <option value="false">Unavailable only</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setFilters({ ...filters, category: filters.category === category._id ? '' : category._id })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filters.category === category._id ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-6">
          <p className="section-kicker">Today&apos;s menu</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Freshly plated for collection</h2>
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
