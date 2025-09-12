import { fetchApi } from './api.js';

export const orderApi = {
  createOrder: async (data) => {
    return await fetchApi('/api/customer/orders/', 'POST', data);
  },

  getOrders: async (params = {}) => {
    return await fetchApi('/api/customer/orders/', 'GET', null, params);
  },

  getOrderDetail: async (orderId) => {
    return await fetchApi(`/api/customer/orders/${orderId}/`, 'GET');
  },

  cancelOrder: async (orderId, reason = '') => {
    // Backend expects a JSON body; send empty reason if not provided
    return await fetchApi(`/api/customer/orders/${orderId}/cancel/`, 'PUT', { reason });
  },

  // Staff endpoints
  getStaffOrders: async (params = {}) => {
    // Some deployments have strict_slashes; call path without trailing slash
    return await fetchApi('/api/staff/orders/', 'GET', null, params);
  },

  getStaffOrderDetail: async (orderId) => {
    return await fetchApi(`/api/staff/orders/${orderId}/`, 'GET');
  },

  acceptStaffOrder: async (orderId) => {
    return await fetchApi(`/api/staff/orders/${orderId}/accept/`, 'PUT');
  },

  markDoneStaffOrder: async (orderId) => {
    return await fetchApi(`/api/staff/orders/${orderId}/done/`, 'PUT');
  },

  completeStaffOrder: async (orderId) => {
    return await fetchApi(`/api/staff/orders/${orderId}/complete/`, 'PUT');
  },

  cancelStaffOrder: async (orderId, reason = '') => {
    return await fetchApi(`/api/staff/orders/${orderId}/cancel/`, 'PUT', { reason });
  }
};

export default orderApi;
