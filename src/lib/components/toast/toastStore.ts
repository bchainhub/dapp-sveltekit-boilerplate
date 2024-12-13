import { writable } from 'svelte/store';
import type { Toast, ToastMethods } from './types';

export const toasts = writable<Toast[]>([]);

function createToast(): ToastMethods {
	const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

	const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number, className?: string) => {
		const id = generateId();
		const toast: Toast = { id, message, type, duration, className };
		toasts.update((current) => [...current, toast]);

		if (duration) {
			setTimeout(() => {
				toasts.update((current) => current.filter((t) => t.id !== id));
			}, duration);
		}
	};

	return {
		success: (message, duration, className) => addToast(message, 'success', duration, className),
		error: (message, duration, className) => addToast(message, 'error', duration, className),
		info: (message, duration, className) => addToast(message, 'info', duration, className),
		warning: (message, duration, className) => addToast(message, 'warning', duration, className),
	};
}

export const toast = createToast();
