<script lang="ts">
	import JButton from './JButton.svelte';
	import ConfirmDialog from './ConfirmDialog.svelte';
	import { library } from '$lib/stores/library.svelte';
	import { toast } from '$lib/toast';
	import type { LibraryEntry, StartConflict } from '$lib/types';

	let {
		entry,
		label = 'Começar a ler',
		variant = 'graphite',
		size = 'medium',
		onstarted = () => {}
	}: {
		entry: LibraryEntry;
		label?: string;
		variant?: string;
		size?: string;
		onstarted?: () => void;
	} = $props();

	let conflict = $state<StartConflict | null>(null);

	function start(): void {
		const c = library.startReading(entry.id);
		if (c) {
			conflict = c;
		} else {
			toast(`Vais começar «${entry.meta.title}».`, 'info');
			onstarted();
		}
	}

	function swap(): void {
		if (!conflict) return;
		library.forceSwap(conflict.requested.id);
		toast(`Passaste a ler «${conflict.requested.meta.title}».`, 'success');
		conflict = null;
	}
</script>

<JButton {variant} {size} {label} onclick={start} />

<ConfirmDialog
	open={!!conflict}
	title="Trocar de leitura?"
	body={conflict
		? `Já estás a ler «${conflict.current.meta.title}». Devolve-o à pilha e começa «${conflict.requested.meta.title}»?`
		: ''}
	confirmLabel="Trocar"
	onConfirm={swap}
	onClose={() => (conflict = null)}
/>
