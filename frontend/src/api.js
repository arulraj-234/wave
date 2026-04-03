import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Capacitor Android WebView doesn't need cookie credentials — we use Bearer tokens.
// withCredentials + wildcard CORS origin causes browsers to reject responses.
const isCapacitor = typeof window !== 'undefined' && window.Capacitor !== undefined;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: !isCapacitor,
});

// Attach JWT token to every request if available (Legacy fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: resolve backend asset URLs (images, audio files)
export const resolveUrl = (url) => {
  if (!url) return url;
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

export default api;
