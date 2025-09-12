import { fetchApi } from './api.js';

export const staffApi = {
  // Foods
  getFoods: async (params = {}) => fetchApi('/api/staff/foods/', 'GET', null, params),
  getFood: async (foodId) => fetchApi(`/api/staff/foods/${foodId}/`, 'GET'),
  createFood: async (data) => {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
    return fetchApi('/api/staff/foods/', 'POST', data, null, {
      toastSuccess: true,
      successMessage: 'Đã tạo món',
      toastError: true,
      headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },
  updateFood: async (foodId, data) => {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
    return fetchApi(`/api/staff/foods/${foodId}/`, 'PUT', data, null, {
      toastSuccess: true,
      successMessage: 'Đã cập nhật món',
      toastError: true,
      headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },
  deleteFood: async (foodId) => fetchApi(`/api/staff/foods/${foodId}/`, 'DELETE', null, null, { toastSuccess: true, successMessage: 'Đã xoá món', toastError: true }),
  toggleFood: async (foodId) => fetchApi(`/api/staff/foods/${foodId}/toggle/`, 'PUT', null, null, { toastSuccess: true, successMessage: 'Đã đổi trạng thái món', toastError: true }),

  // Restaurant
  getRestaurant: async () => fetchApi('/api/staff/restaurant/', 'GET'),
  createRestaurant: async (data) => {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
    return fetchApi('/api/staff/restaurant/create/', 'POST', data, null, {
      toastSuccess: true,
      successMessage: 'Đã tạo nhà hàng',
      toastError: true,
      headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },
  updateRestaurant: async (data) => {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
    return fetchApi('/api/staff/restaurant/', 'PUT', data, null, {
      toastSuccess: true,
      successMessage: 'Đã cập nhật nhà hàng',
      toastError: true,
      headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },
  updateOpeningHours: async (data) => fetchApi('/api/staff/restaurant/hours/', 'PUT', data, null, { toastSuccess: true, successMessage: 'Đã cập nhật giờ mở cửa', toastError: true }),
  toggleRestaurant: async () => fetchApi('/api/staff/restaurant/toggle/', 'PUT', null, null, { toastSuccess: true, successMessage: 'Đã đổi trạng thái hoạt động', toastError: true }),

  // Orders
  getOrders: async (params = {}) => fetchApi('/api/staff/orders/', 'GET', null, params),
  getOrder: async (orderId) => fetchApi(`/api/staff/orders/${orderId}/`, 'GET'),
  acceptOrder: async (orderId) => fetchApi(`/api/staff/orders/${orderId}/accept/`, 'PUT', null, null, { toastSuccess: true, successMessage: 'Đã nhận đơn', toastError: true }),
  completeOrder: async (orderId) => fetchApi(`/api/staff/orders/${orderId}/complete/`, 'PUT', null, null, { toastSuccess: true, successMessage: 'Đã hoàn thành đơn', toastError: true }),
  markDone: async (orderId) => fetchApi(`/api/staff/orders/${orderId}/done/`, 'PUT', null, null, { toastSuccess: true, successMessage: 'Đã xong món', toastError: true }),
  cancelOrder: async (orderId, data) => fetchApi(`/api/staff/orders/${orderId}/cancel/`, 'PUT', data, null, { toastSuccess: true, successMessage: 'Đã hủy đơn', toastError: true }),

  // Reviews
  getReviews: async (params = {}) => fetchApi('/api/staff/reviews/', 'GET', null, params),

  // Revenue
  getRevenue: async (params = {}) => fetchApi('/api/staff/revenue/', 'GET', null, params),

  // Profile
  getProfile: async () => fetchApi('/api/staff/profile/', 'GET'),
  updateProfile: async (data) => fetchApi('/api/staff/profile/', 'PUT', data, null, { toastSuccess: true, successMessage: 'Đã cập nhật thông tin', toastError: true }),

  // Payment
  depositMoney: async (data) => fetchApi('/api/staff/payment/deposit/', 'POST', data, null, { toastSuccess: true, successMessage: 'Đã nạp tiền', toastError: true }),
  withdrawMoney: async (data) => fetchApi('/api/staff/payment/withdraw/', 'POST', data, null, { toastSuccess: true, successMessage: 'Đã rút tiền', toastError: true }),
};

export default staffApi;


