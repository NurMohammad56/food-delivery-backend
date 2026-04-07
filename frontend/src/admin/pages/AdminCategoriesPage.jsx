import { useEffect, useState } from 'react';
import { adminApi, menuApi } from '../../api/services';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const initialCategoryForm = { name: '', description: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadCategories = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const response = await menuApi.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const resetForm = () => {
    setCategoryForm(initialCategoryForm);
    setEditingCategoryId('');
    setModalOpen(false);
  };

  const openCreate = () => {
    setCategoryForm(initialCategoryForm);
    setEditingCategoryId('');
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({ name: category.name, description: category.description || '' });
    setModalOpen(true);
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
      resetForm();
      loadCategories({ silent: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setMessage('');
    setError('');
    try {
      await adminApi.deleteCategory(id);
      setMessage('Category deleted successfully.');
      loadCategories({ silent: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <Loader label="Loading categories..." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total categories</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{categories.length}</p>
        </div>
        <div className="metric-card md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Category module</p>
              <p className="mt-3 text-sm text-slate-600">A dedicated module for category CRUD, separate from menu item inventory.</p>
            </div>
            <button type="button" onClick={openCreate} className="btn-primary">Add category</button>
          </div>
        </div>
      </div>

      {message ? <div className="card p-4 text-sm text-emerald-600">{message}</div> : null}
      {error ? <div className="card p-4 text-sm text-rose-600">{error}</div> : null}

      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Category directory</h2>
          {refreshing ? <span className="pill bg-white text-slate-500">Refreshing...</span> : null}
        </div>

        {!categories.length ? <div className="mt-5"><EmptyState title="No categories yet" description="Create the first category to start organizing menu items." /></div> : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category._id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{category.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{category.description || 'No description'}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(category)} className="btn-secondary">Edit</button>
                  <button type="button" onClick={() => removeCategory(category._id)} className="btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={resetForm} title={editingCategoryId ? 'Edit category' : 'Create category'} size="max-w-xl">
        <form onSubmit={submitCategory} className="space-y-5">
          <div>
            <label className="label">Category name</label>
            <input className="input" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[120px]" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button className="btn-primary">{editingCategoryId ? 'Save changes' : 'Create category'}</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
