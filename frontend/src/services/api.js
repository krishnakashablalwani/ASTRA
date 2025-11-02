import axios from 'axios'

// Prefer same-origin '/api' when running behind the backend; allow override via VITE_API_BASE; fallback to localhost for dev
const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : null;
const sameOriginBase = (typeof window !== 'undefined') ? `${window.location.origin}/api` : null;
const baseURL = envBase || sameOriginBase || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})


// Attach token to requests only if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
});

export default api
