import { fetchApi } from './api.js';

export const authApi = {
  sendCustomerOTP: async (phone) => {
    return await fetchApi('/api/auth/customer/send-otp/', 'POST', { phone });
  },

  verifyCustomerOTP: async (phone, otp_code) => {
    return await fetchApi('/api/auth/customer/verify-otp/', 'POST', { phone, otp_code });
  },

  staffRegister: async (data) => {
    return await fetchApi('/api/auth/staff/register/', 'POST', data);
  },

  staffLogin: async (username, password) => {
    return await fetchApi('/api/auth/staff/login/', 'POST', { username, password });
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await fetchApi('/api/auth/refresh/', 'POST', null, null, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
  }
};
