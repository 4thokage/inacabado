import type { ToastTone } from './types';

const TONE_LABEL: Record<ToastTone, string> = {
	info: 'info',
	success: 'success',
	warning: 'warning',
	danger: 'danger'
};

export function toast(message: string, tone: ToastTone = 'info', duration = 3800): void {
	if (typeof window === 'undefined') return;
	const push = window.jellyToast;
	if (typeof push === 'function') {
		push(message, { tone: TONE_LABEL[tone], duration });
	}
}
