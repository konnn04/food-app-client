import { fetchApi } from './api.js';

export const couponApi = {
	listPublic: async () => fetchApi('/api/coupon/', 'GET'),
	getByCode: async (code) => fetchApi(`/api/coupon/code/${encodeURIComponent(code)}`, 'GET'),
	apply: async ({ code, order_amount, restaurant_id, food_ids }) =>
		fetchApi('/api/coupon/apply', 'POST', { code, order_amount, restaurant_id, food_ids }, null, { toastError: true }),
};

export default couponApi;
