import { fetchApi } from './api.js';

export const foodApi = {
  getFoods: async (params = {}) => {
    const { q, lat, lon, page = 1, per_page = 20, ...otherParams } = params;
    const queryParams = {
      page,
      per_page,
      ...otherParams
    };
    
    if (q) queryParams.q = q;
    if (lat) queryParams.lat = lat;
    if (lon) queryParams.lon = lon;
    
    return await fetchApi('/api/food/', 'GET', null, queryParams);
  },

  getFoodDetail: async (id) => {
    return await fetchApi(`/api/food/${id}/`, 'GET');
  },

  getCategories: async () => {
    return await fetchApi('/api/category/', 'GET');
  },
};
