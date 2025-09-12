import { fetchApi } from './api.js';

export const userApi = {
	getProfile: async (role = 'customer') => {
		if (role === 'staff' || role === 'owner') {
			return await fetchApi('/api/staff/profile/', 'GET');
		}
		return await fetchApi('/api/customer/profile/', 'GET');
	},
	updateProfile: async (role = 'customer', data) => {
		if (role === 'staff' || role === 'owner') {
			return await fetchApi('/api/staff/profile/', 'PUT', data, null, { toastSuccess: true, successMessage: 'Đã cập nhật thông tin' , toastError: true });
		}
		return await fetchApi('/api/customer/profile/', 'PUT', data, null, { toastSuccess: true, successMessage: 'Đã cập nhật thông tin' , toastError: true });
	},
	getWalletBalance: async () => {
		return await fetchApi('/api/payment/wallet/balance/', 'GET');
	}
};

export default userApi;
