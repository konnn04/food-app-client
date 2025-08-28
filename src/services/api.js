import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Đăng nhập staff bằng username/password
  staffLogin: (username, password) => 
    api.post('/auth/staff/login', { username, password }),
  
  // Gửi OTP cho khách hàng
  sendOTP: (phone) => 
    api.post('/auth/customer/send-otp', { phone }),
  
  // Xác thực OTP
  verifyOTP: (phone, otp_code) => 
    api.post('/auth/customer/verify-otp', { phone, otp_code }),
  
  // Cập nhật thông tin khách hàng
  updateCustomerProfile: (data) => 
    api.post('/auth/customer/update-profile', data),
  
  // Lấy thông tin người dùng hiện tại
  getProfile: () => 
    api.get('/auth/profile'),
  
  // Refresh token
  refreshToken: () => 
    api.post('/auth/refresh')
};

// Food API
export const foodAPI = {
  getAllFoods: (params) => 
    api.get('/food', { params }),
  
  getFoodById: (id) => 
    api.get(`/food/${id}`),
  
  createFood: (data) => 
    api.post('/food', data)
};

// Order API
export const orderAPI = {
  createOrder: (data) => 
    api.post('/order', data),
  
  getCustomerOrders: (customerId) => 
    api.get(`/order/customer/${customerId}`),
  
  updateOrderStatus: (orderId, status) => 
    api.put(`/order/${orderId}/status`, { status })
};

// Admin API
export const adminAPI = {
  getDashboardData: () => 
    api.get('/admin/dashboard'),
  
  getUsers: (params) => 
    api.get('/admin/users', { params }),
  
  getCustomers: (params) => 
    api.get('/admin/customers', { params }),
  
  getAllOrders: (params) => 
    api.get('/admin/orders', { params })
};

export default api;
