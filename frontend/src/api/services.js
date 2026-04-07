import client from './client';

export const authApi = {
  register: (payload) => client.post('/auth/register', payload),
  login: (payload) => client.post('/auth/login', payload),
  forgotPassword: (payload) => client.post('/auth/forgot-password', payload),
  resetPassword: (token, payload) => client.post(`/auth/reset-password/${token}`, payload),
  me: () => client.get('/auth/me'),
};

export const userApi = {
  updateProfile: (payload) => client.put('/users/profile', payload),
  uploadAvatar: (formData) => client.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAvatar: () => client.delete('/users/avatar'),
  changePassword: (payload) => client.put('/users/change-password', payload),
  getUsers: (params) => client.get('/users/admin/all', { params }),
  updateRole: (id, payload) => client.put(`/users/admin/${id}/role`, payload),
};

export const menuApi = {
  getMenu: (params) => client.get('/menu', { params }),
  getItem: (id) => client.get(`/menu/${id}`),
  getCategories: () => client.get('/menu/categories'),
  search: (q) => client.get('/menu/search', { params: { q } }),
};

export const cartApi = {
  get: () => client.get('/cart'),
  add: (payload) => client.post('/cart/items', payload),
  update: (menuItemId, payload) => client.put(`/cart/items/${menuItemId}`, payload),
  remove: (menuItemId) => client.delete(`/cart/items/${menuItemId}`),
  clear: () => client.delete('/cart'),
};

export const orderApi = {
  place: (payload) => client.post('/orders', payload),
  getMine: (params) => client.get('/orders', { params }),
  getOne: (id) => client.get(`/orders/${id}`),
  cancel: (id) => client.put(`/orders/${id}/cancel`),
  getAll: (params) => client.get('/orders/admin/all', { params }),
  updateStatus: (id, payload) => client.put(`/orders/${id}/status`, payload),
  stats: (params) => client.get('/orders/admin/stats', { params }),
};

export const adminApi = {
  createMenu: (formData) => client.post('/admin/menu', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateMenu: (id, formData) => client.put(`/admin/menu/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteMenu: (id) => client.delete(`/admin/menu/${id}`),
  toggleAvailability: (id) => client.patch(`/admin/menu/${id}/availability`),
  createCategory: (payload) => client.post('/admin/categories', payload),
  updateCategory: (id, payload) => client.put(`/admin/categories/${id}`, payload),
  deleteCategory: (id) => client.delete(`/admin/categories/${id}`),
};
