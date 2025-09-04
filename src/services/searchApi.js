import { fetchApi } from './api.js';

export const searchApi = {
  search: async (params = {}) => {
    // Expected params: q, lat, lon, min_price, max_price, sort_by, sort_order, page, per_page
    return await fetchApi('/api/search/', 'GET', null, params);
  },
};


