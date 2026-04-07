import { useEffect, useState } from 'react';
import { adminApi, menuApi } from '../../api/services';
import Loader from '../../components/common/Loader';

const initialForm = { name: '', description: '', category: '', price: '', preparationTime: '', isAvailable: true, image: null };

export default function AdminMenuPage() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [categoryResponse, menuResponse] = await Promise.all([menuApi.getCategories(), menuApi.getMenu()]);
    setCategories(categoryResponse.data.data);
    setMenu(menuResponse.data.data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const buildFormData = () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') data.append(key, value);
    });
    return data;
  };

  const submitMenu = async (event) => {
    event.preventDefault();
    if (editingId) await adminApi.updateMenu(editingId, buildFormData());
    else await adminApi.createMenu(buildFormData());
    setForm(initialForm);
    setEditingId('');
    loadData();
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
    await adminApi.createCategory(categoryForm);
    setCategoryForm({ name: '', description: '' });
    loadData();
  };

  if (loading) return <Loader label="Loading menu management..." />;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
        <form onSubmit={submitMenu} className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit menu item' : 'Add menu item'}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><label className="label">Item name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="md:col-span-2"><label className="label">Description</label><textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
            <div><label className="label">Category</label><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></div>
            <div><label className="label">Price</label><input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
            <div><label className="label">Preparation time</label><input className="input" type="number" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} required /></div>
            <div><label className="label">Image</label><input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} /></div>
            <div className="flex items-center gap-3"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /><span className="text-sm text-slate-700">Available for ordering</span></div>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="btn-primary">{editingId ? 'Update item' : 'Create item'}</button>
            {editingId ? <button type="button" onClick={() => { setEditingId(''); setForm(initialForm); }} className="btn-secondary">Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-8">
          <form onSubmit={submitCategory} className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Create category</h2>
            <div className="mt-6 space-y-5">
              <div><label className="label">Category name</label><input className="input" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required /></div>
              <div><label className="label">Description</label><textarea className="input min-h-[100px]" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></div>
              <button className="btn-primary">Create category</button>
            </div>
          </form>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Existing categories</h2>
            <div className="mt-5 space-y-3">{categories.map((category) => <div key={category._id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm"><p className="font-medium text-slate-800">{category.name}</p><p className="text-slate-500">{category.description || 'No description'}</p></div>)}</div>
          </div>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">All menu items</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-3">Name</th><th className="py-3">Category</th><th className="py-3">Price</th><th className="py-3">Status</th><th className="py-3">Actions</th></tr></thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id} className="border-t border-slate-200">
                  <td className="py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="py-4 text-slate-600">{item.category?.name || item.category}</td>
                  <td className="py-4 text-slate-600">{item.price}</td>
                  <td className="py-4 text-slate-600">{item.isAvailable ? 'Available' : 'Unavailable'}</td>
                  <td className="py-4"><div className="flex gap-2"><button onClick={() => startEdit(item)} className="btn-secondary">Edit</button><button onClick={() => adminApi.toggleAvailability(item._id).then(loadData)} className="btn-secondary">Toggle</button><button onClick={() => adminApi.deleteMenu(item._id).then(loadData)} className="btn-danger">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
