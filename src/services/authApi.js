import { fetchApi } from './api.js';

export const authApi = {
  // Customer OTP
  sendCustomerOTP: async (phone) => {
    return await fetchApi('/api/auth/customer/send-otp/', 'POST', { phone });
  },

  verifyCustomerOTP: async (phone, otp) => {
    return await fetchApi('/api/auth/customer/verify-otp/', 'POST', { phone, otp_code: otp });
  },

  // Staff Auth
  staffRegister: async (data) => {
    return await fetchApi('/api/auth/staff/register/', 'POST', data);
  },

  staffLogin: async (email, password) => {
    return await fetchApi('/api/auth/staff/login/', 'POST', { email, password });
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await fetchApi('/api/auth/refresh/', 'POST', {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
  }
};
