import { useEffect, useMemo, useState } from 'react';
import { adminApi, menuApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 10;
const initialForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  preparationTime: '',
  isAvailable: true,
  image: null,
};

export default function AdminMenuPage() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });

  const loadData = async ({ silent = false, page = meta.page } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [categoryResponse, menuResponse] = await Promise.all([
        menuApi.getCategories(),
        menuApi.getMenu({ page, limit: PAGE_SIZE }),
      ]);

      setCategories(categoryResponse.data.data);
      setMenu(menuResponse.data.data);
      setMeta({
        page: menuResponse.data.page || page,
        pages: menuResponse.data.pages || 1,
        total: menuResponse.data.total || menuResponse.data.data.length,
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load menu management data');
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    loadData({ page: 1 });
  }, []);

  const summary = useMemo(() => ({
    totalMenuCount: meta.total,
    visibleCount: menu.length,
    categoryCount: categories.length,
  }), [meta.total, menu.length, categories.length]);

  const buildFormData = () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') data.append(key, value);
    });
    return data;
  };

  const resetMenuForm = () => {
    setForm(initialForm);
    setEditingId('');
    setMenuModalOpen(false);
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setEditingId('');
    setMenuModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category?._id || item.category,
      price: item.price,
      preparationTime: item.preparationTime,
      isAvailable: item.isAvailable,
      image: null,
    });
    setMenuModalOpen(true);
  };

  const submitMenu = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        await adminApi.updateMenu(editingId, buildFormData());
        setMessage('Menu item updated successfully.');
      } else {
        await adminApi.createMenu(buildFormData());
        setMessage('Menu item created successfully.');
      }

      resetMenuForm();
      loadData({ silent: true, page: meta.page });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save menu item');
    }
  };

  const removeMenu = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    setMessage('');
    setError('');

    try {
      await adminApi.deleteMenu(id);
      setMessage('Menu item deleted successfully.');
      const nextPage = meta.page > 1 && menu.length === 1 ? meta.page - 1 : meta.page;
      loadData({ silent: true, page: nextPage });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const toggleAvailability = async (id) => {
    setMessage('');
    setError('');

    try {
      await adminApi.toggleAvailability(id);
      setMessage('Menu availability updated.');
      loadData({ silent: true, page: meta.page });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to toggle availability');
    }
  };

  if (loading) return <Loader label="Loading menu management..." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total menu items</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{summary.totalMenuCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Visible on page</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{summary.visibleCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Categories</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{summary.categoryCount}</p>
        </div>
      </div>

      {message ? <div className="card p-4 text-sm text-emerald-600">{message}</div> : null}
      {error ? <div className="card p-4 text-sm text-rose-600">{error}</div> : null}

      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Menu inventory</h2>
            <p className="mt-2 text-sm text-slate-500">Manage menu items and availability. Category editing now lives in the separate Categories module.</p>
          </div>
          <div className="flex items-center gap-3">
            {refreshing ? <span className="pill bg-white text-slate-500">Refreshing...</span> : null}
            <button type="button" onClick={openCreateModal} className="btn-primary">Add menu item</button>
          </div>
        </div>

        {!menu.length ? <div className="mt-5"><EmptyState title="No menu items yet" description="Create a menu item to populate the public menu." /></div> : null}

        <div className="mt-5 -mx-6 overflow-x-auto px-6">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Prep time</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id} className="border-t border-slate-200 align-top">
                  <td className="py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="py-4 text-slate-600">{item.category?.name || item.category}</td>
                  <td className="py-4 text-slate-600">{item.price}</td>
                  <td className="py-4 text-slate-600">{item.preparationTime} min</td>
                  <td className="py-4 text-slate-600">{item.isAvailable ? 'Available' : 'Unavailable'}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" onClick={() => openEditModal(item)} className="btn-secondary">Edit</button>
                      <button type="button" onClick={() => toggleAvailability(item._id)} className="btn-secondary">Toggle</button>
                      <button type="button" onClick={() => removeMenu(item._id)} className="btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={meta.page} pages={meta.pages} onPageChange={(page) => loadData({ silent: true, page })} className="mt-6" />
      </div>

      <Modal open={menuModalOpen} onClose={resetMenuForm} title={editingId ? 'Edit menu item' : 'Create menu item'}>
        <form onSubmit={submitMenu} className="space-y-5">
          <div>
            <label className="label">Item name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Price</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="label">Preparation time</label>
              <input className="input" type="number" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} required />
            </div>
            <div>
              <label className="label">Image</label>
              <input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
            </div>
          </div>
          <label className="flex items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
            Available for ordering
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">{editingId ? 'Save changes' : 'Create item'}</button>
            <button type="button" onClick={resetMenuForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
