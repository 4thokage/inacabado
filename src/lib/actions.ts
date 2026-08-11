export function reveal(node: HTMLElement): { destroy: () => void } {
	let io: IntersectionObserver | null = null;
	if ('IntersectionObserver' in window) {
		io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add('in-view');
						io?.disconnect();
					}
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0 }
		);
		io.observe(node);
	} else {
		node.classList.add('in-view');
	}
	return {
		destroy() {
			io?.disconnect();
		}
	};
}
