import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
        
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${tokens.refresh_token}`
          }
        });
        
        const { access_token } = response.data.data;
        const newTokens = { ...tokens, access_token };
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
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

const fetchApi = async (url, method="GET", data = null, params = null) => {
  try {
    const response = await api({
      url,
      method,
      data,
      params
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};

export { fetchApi };
