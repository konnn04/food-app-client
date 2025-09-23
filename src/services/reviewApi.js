import { fetchApi } from './api.js';

export const reviewApi = {
  // Public fetch reviews by food or restaurant
  getFoodReviews: async (foodId, params = {}) => {
    return await fetchApi(`/api/customer/reviews/${foodId}/`, 'GET', null, params);
  },
  getRestaurantReviews: async (restaurantId, params = {}) => {
    return await fetchApi(`/api/review/restaurant/${restaurantId}/`, 'GET', null, params);
  },

  // Customer create review (requires purchased)
  createCustomerReview: async ({ food_id, rating, comment }) => {
    return await fetchApi('/api/customer/reviews/', 'POST', { food_id, rating, comment }, null, {
      toastSuccess: true,
      successMessage: 'Đã gửi đánh giá',
      toastError: true,
    });
  },

  // Staff/Owner get own restaurant reviews
  getStaffRestaurantReviews: async (params = {}) => {
    return await fetchApi('/api/staff/reviews/', 'GET', null, params);
  },
};

export default reviewApi;


