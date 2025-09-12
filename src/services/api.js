import axios from 'axios';
import { toast } from '@/utils/toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://food-app-server-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens && tokens.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        if (!tokens || !tokens.refresh_token) {
          throw new Error('No refresh token available');
        }
        // avoid recursive refresh
        if (originalRequest.url?.includes('/api/auth/refresh/')) {
          throw new Error('Cannot refresh');
        }

        const response = await api.post('/api/auth/refresh/', null, {
          headers: {
            Authorization: `Bearer ${tokens.refresh_token}`,
          },
        });
        
        const { access_token } = response.data.data || response.data;
        const newTokens = { ...tokens, access_token };
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// fetchApi now supports toast options via config: { toastSuccess, toastError }
const fetchApi = async (url, method = 'GET', data = null, params = null, config = {}) => {
  const { toastSuccess, toastError, successMessage, errorMessage, ...axiosConfig } = config || {};
  try {
    const response = await api({
      url,
      method,
      data,
      params,
      ...axiosConfig,
    });
    const body = response.data;
    if (toastSuccess) {
      const msg = successMessage || body?.message || 'Thành công';
      toast.success(msg);
    }
    return body;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'API request failed';
    if (toastError) {
      toast.error(errorMessage || msg);
    }
    if (error.response) {
      throw new Error(error.response.data?.message || `HTTP ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error(msg);
    }
  }
};

export { fetchApi, api };
