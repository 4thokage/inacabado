declare global {
	namespace svelteHTML {
		interface IntrinsicElements {
			'jelly-button': {
				variant?: string;
				size?: string;
				shape?: string;
				block?: boolean;
				disabled?: boolean;
				label?: string;
				type?: string;
				onclick?: (e: MouseEvent) => void;
				children?: unknown;
			};
			'jelly-icon-button': {
				variant?: string;
				size?: string;
				shape?: string;
				label?: string;
				disabled?: boolean;
				onclick?: (e: MouseEvent) => void;
				children?: unknown;
			};
			'jelly-dialog': {
				open?: boolean;
				label?: string;
				onopen?: (e: Event) => void;
				onclose?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-drawer': {
				open?: boolean;
				label?: string;
				side?: 'start' | 'end' | 'left' | 'right' | 'bottom';
				onopen?: (e: Event) => void;
				onclose?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-input': {
				type?: string;
				value?: string;
				placeholder?: string;
				label?: string;
				size?: string;
				disabled?: boolean;
				readonly?: boolean;
				name?: string;
				autocomplete?: string;
				oninput?: (e: Event) => void;
				onchange?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-progress': {
				value?: number;
				indeterminate?: boolean;
				variant?: string;
				label?: string;
				children?: unknown;
			};
			'jelly-spinner': {
				size?: string;
				label?: string;
				children?: unknown;
			};
			'jelly-slider': {
				value?: number | string;
				min?: number | string;
				max?: number | string;
				step?: number | string;
				label?: string;
				size?: string;
				variant?: string;
				disabled?: boolean;
				name?: string;
				oninput?: (e: Event) => void;
				onchange?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-range': {
				min?: number | string;
				max?: number | string;
				step?: number | string;
				low?: number | string;
				high?: number | string;
				label?: string;
				size?: string;
				variant?: string;
				disabled?: boolean;
				name?: string;
				oninput?: (e: Event) => void;
				onchange?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-segmented': {
				class?: string;
				value?: string;
				label?: string;
				size?: string;
				disabled?: boolean;
				onchange?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-segment': {
				value?: string;
				selected?: boolean;
				disabled?: boolean;
				children?: unknown;
			};
			'jelly-chip': {
				variant?: string;
				size?: string;
				shape?: string;
				selectable?: boolean;
				selected?: boolean;
				removable?: boolean;
				disabled?: boolean;
				onchange?: (e: Event) => void;
				onremove?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-alert': {
				tone?: 'info' | 'success' | 'warning' | 'danger';
				size?: string;
				dismissible?: boolean;
				ondismiss?: (e: Event) => void;
				children?: unknown;
			};
			'jelly-badge': {
				class?: string;
				variant?: string;
				size?: string;
				shape?: string;
				outline?: boolean;
				live?: boolean;
				children?: unknown;
			};
		}
	}

	interface JellyDialogElement extends HTMLElement {
		open: boolean;
		showModal(): void;
		focus(options?: FocusOptions): void;
	}

	interface JellyDrawerElement extends HTMLElement {
		open: boolean;
		side: string;
		focus(options?: FocusOptions): void;
	}

	interface HTMLElementTagNameMap {
		'jelly-dialog': JellyDialogElement;
		'jelly-drawer': JellyDrawerElement;
		'jelly-input': HTMLElement & { value: string };
		'jelly-slider': HTMLElement & { value: string };
		'jelly-segmented': HTMLElement & { value: string };
		'jelly-button': HTMLElement & { button: HTMLButtonElement };
	}

	interface Window {
		jellyToast: (
			message: string,
			opts?: { tone?: string; duration?: number }
		) => HTMLElement;
	}
}

export {};
