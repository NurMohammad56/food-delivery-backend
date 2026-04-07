import { useEffect, useMemo, useState } from 'react';
import { adminApi, menuApi } from '../../api/services';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const initialForm = { name: '', description: '', category: '', price: '', preparationTime: '', isAvailable: true, image: null };
const initialCategoryForm = { name: '', description: '' };

export default function AdminMenuPage() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [categoryResponse, menuResponse] = await Promise.all([menuApi.getCategories(), menuApi.getMenu()]);
      setCategories(categoryResponse.data.data);
      setMenu(menuResponse.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load menu management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const summary = useMemo(() => ({
    menuCount: menu.length,
    availableCount: menu.filter((item) => item.isAvailable).length,
    categoryCount: categories.length,
  }), [menu, categories]);

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
  };

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryForm);
    setEditingCategoryId('');
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
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save menu item');
    }
  };

  const startEdit = (item) => {
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
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      if (editingCategoryId) {
        await adminApi.updateCategory(editingCategoryId, categoryForm);
        setMessage('Category updated successfully.');
      } else {
        await adminApi.createCategory(categoryForm);
        setMessage('Category created successfully.');
      }
      resetCategoryForm();
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const removeMenu = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    setMessage('');
    setError('');
    try {
      await adminApi.deleteMenu(id);
      setMessage('Menu item deleted successfully.');
      loadData();
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
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to toggle availability');
    }
  };

  const startCategoryEdit = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({ name: category.name, description: category.description || '' });
  };

  const removeCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setMessage('');
    setError('');
    try {
      await adminApi.deleteCategory(id);
      setMessage('Category deleted successfully.');
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <Loader label="Loading menu management..." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Menu items</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{summary.menuCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Available now</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{summary.availableCount}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Categories</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{summary.categoryCount}</p>
        </div>
      </div>

      {message ? <div className="card p-4 text-sm text-emerald-600">{message}</div> : null}
      {error ? <div className="card p-4 text-sm text-rose-600">{error}</div> : null}

      <div className="grid gap-8 xl:grid-cols-[1fr_0.92fr]">
        <form onSubmit={submitMenu} className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit menu item' : 'Create menu item'}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Item name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
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
            <div className="flex items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-3">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
              <span className="text-sm text-slate-700">Available for ordering</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary">{editingId ? 'Update item' : 'Create item'}</button>
            {editingId ? <button type="button" onClick={resetMenuForm} className="btn-secondary">Cancel</button> : null}
          </div>
        </form>

        <div className="space-y-8">
          <form onSubmit={submitCategory} className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900">{editingCategoryId ? 'Edit category' : 'Create category'}</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label className="label">Category name</label>
                <input className="input" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[100px]" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary">{editingCategoryId ? 'Update category' : 'Create category'}</button>
                {editingCategoryId ? <button type="button" onClick={resetCategoryForm} className="btn-secondary">Cancel</button> : null}
              </div>
            </div>
          </form>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900">Category directory</h2>
            {!categories.length ? <div className="mt-5"><EmptyState title="No categories yet" description="Create the first category to start organizing menu items." /></div> : null}
            <div className="mt-5 space-y-3">
              {categories.map((category) => (
                <div key={category._id} className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{category.name}</p>
                      <p className="mt-1 text-slate-500">{category.description || 'No description'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startCategoryEdit(category)} className="btn-secondary">Edit</button>
                      <button type="button" onClick={() => removeCategory(category._id)} className="btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Menu inventory</h2>
          <span className="pill bg-slate-100">{summary.menuCount} items</span>
        </div>

        {!menu.length ? <div className="mt-5"><EmptyState title="No menu items yet" description="Create a menu item to populate the public menu." /></div> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id} className="border-t border-slate-200">
                  <td className="py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="py-4 text-slate-600">{item.category?.name || item.category}</td>
                  <td className="py-4 text-slate-600">{item.price}</td>
                  <td className="py-4 text-slate-600">{item.isAvailable ? 'Available' : 'Unavailable'}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(item)} className="btn-secondary">Edit</button>
                      <button type="button" onClick={() => toggleAvailability(item._id)} className="btn-secondary">Toggle</button>
                      <button type="button" onClick={() => removeMenu(item._id)} className="btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
