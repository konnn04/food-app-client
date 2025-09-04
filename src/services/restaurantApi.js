import { fetchApi } from './api.js';

export const restaurantApi = {
  getPublicRestaurants: async (params = {}) => {
    return await fetchApi('/api/restaurant/public', 'GET', null, params);
  },

  getRestaurantDetail: async (restaurantId) => {
    return await fetchApi(`/api/restaurant/${restaurantId}/detail`, 'GET');
  },
};


