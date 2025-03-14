export interface Toast {
	id: string;
	message: string;
	type?: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
	className?: string;
}

export interface ToastMethods {
	success: (message: string, duration?: number, className?: string) => void;
	error: (message: string, duration?: number, className?: string) => void;
	info: (message: string, duration?: number, className?: string) => void;
	warning: (message: string, duration?: number, className?: string) => void;
}
