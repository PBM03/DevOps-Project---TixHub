import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => API.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => API.post('/auth/register', { name, email, password }),
  getMe: () => API.get('/auth/me'),
};

// Event APIs
export const eventAPI = {
  getAll: (params?: any) => API.get('/events', { params }),
  getById: (id: string) => API.get(`/events/${id}`),
  create: (data: any) => API.post('/events', data),
  update: (id: string, data: any) => API.put(`/events/${id}`, data),
  delete: (id: string) => API.delete(`/events/${id}`),
};

// Booking APIs
export const bookingAPI = {
  create: (data: any) => API.post('/bookings', data),
  getAll: () => API.get('/bookings'),
  cancel: (id: string) => API.put(`/bookings/${id}/cancel`),
};

// Admin APIs
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getAllUsers: () => API.get('/admin/users'),
  updateUserRole: (id: string, role: string) => API.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => API.delete(`/admin/users/${id}`),
};

export default API;