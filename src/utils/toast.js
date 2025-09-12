import { toast as sonnerToast } from 'sonner';

export const toast = {
	success(message, options = {}) {
		sonnerToast.success(message, options);
	},
	error(message, options = {}) {
		sonnerToast.error(message, options);
	},
	info(message, options = {}) {
		sonnerToast(message, options);
	},
	warning(message, options = {}) {
		sonnerToast.warning ? sonnerToast.warning(message, options) : sonnerToast(message, { ...options, description: 'Cảnh báo' });
	},
};

export default toast;
