<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import JButton from '$lib/components/JButton.svelte';
	import Cover from '$lib/components/Cover.svelte';
	import { library } from '$lib/stores/library.svelte';
	import { toast } from '$lib/toast';

	const reading = $derived(library.reading);
	let progress = $state(0);

	let completing = $state(false);
	let abandoning = $state(false);

	$effect(() => {
		progress = reading?.progress ?? 0;
	});

	const pages = $derived(reading?.meta.pages ?? null);

	function onProgress(e: Event): void {
		if (!reading) return;
		const val = Number((e.currentTarget as HTMLElement & { value?: string }).value);
		library.updateProgress(reading.id, val);
		if (val >= 100) completing = true;
	}

	function complete(): void {
		const r = reading;
		if (!r) return;
		library.completeReading(r.id);
		toast(`«${r.meta.title}» concluído.`, 'success');
	}

	function abandon(): void {
		if (!reading) return;
		library.abandonReading(reading.id);
		toast('Não era para ser. Voltou à estante dos abandonados.', 'info');
	}

	function back(): void {
		const r = reading;
		if (!r) return;
		library.backToPile(r.id);
		toast(`«${r.meta.title}» voltou à pilha.`, 'info');
	}
</script>

<svelte:head>
	<title>A Ler · Entrelinhas</title>
</svelte:head>

{#if !reading}
	<EmptyState
		title="Nada a ler por agora."
		body="Escolhe um livro da pilha e a leitura começa onde tu quiseres."
		cta={{ label: 'Ver a pilha', href: '/por-ler' }}
	/>
{:else}
	<section class="reading">
		<div class="reading-cover">
			<Cover
				coverId={reading.meta.coverId}
				title={reading.meta.title}
				author={reading.meta.authors[0]}
			/>
		</div>

		<div class="reading-body">
			<p class="issue-line reading-label">A ler agora</p>
			<h1 class="reading-title">{reading.meta.title}</h1>
			{#if reading.meta.authors.length}
				<p class="reading-author">{reading.meta.authors.join(', ')}</p>
			{/if}

			<div class="reading-progress">
				<div class="reading-progress-head">
					<span class="reading-pct">{progress}%</span>
					{#if pages}
						<span class="reading-page">
							pág. {Math.max(1, Math.round((progress / 100) * pages))} de {pages}
						</span>
					{/if}
				</div>
				<jelly-progress value={progress} label="Progresso de leitura"></jelly-progress>
				<jelly-slider
					min="0"
					max="100"
					step="1"
					value={progress}
					label="Progresso de leitura"
					oninput={onProgress}
				></jelly-slider>
			</div>

			<div class="reading-actions">
				<JButton
					variant="graphite"
					label="Concluir leitura"
					onclick={() => (completing = true)}
				/>
				<JButton
					variant="platinum"
					label="Abandonar"
					onclick={() => (abandoning = true)}
				/>
				<JButton variant="platinum" label="Voltar à pilha" onclick={back} />
			</div>

			<p class="reading-hint">
				Queres mudar de livro? Abre a pilha e «Começar a ler» troca automaticamente.
			</p>
		</div>
	</section>
{/if}

<ConfirmDialog
	open={completing}
	title="Concluir leitura?"
	body={reading ? `«${reading.meta.title}» passa a Concluídos.` : ''}
	confirmLabel="Concluir"
	onConfirm={complete}
	onClose={() => (completing = false)}
/>

<ConfirmDialog
	open={abandoning}
	title="Abandonar leitura?"
	body={reading ? `«${reading.meta.title}» passa a Abandonados. Não era para ser.` : ''}
	confirmLabel="Abandonar"
	onConfirm={abandon}
	onClose={() => (abandoning = false)}
/>

<style>
	.reading {
		display: grid;
		grid-template-columns: clamp(8rem, 24vw, 12rem) 1fr;
		gap: clamp(1.5rem, 5vw, 3rem);
		align-items: start;
	}
	.reading-cover {
		box-shadow: 0 3px 10px rgba(74, 59, 49, 0.14);
		border: 1px solid var(--color-hairline);
		border-radius: 4px;
		overflow: hidden;
	}
	.reading-label {
		display: block;
		margin: 0;
	}
	.reading-title {
		margin: 0.4rem 0 0;
		font-size: clamp(1.8rem, 5vw, 3rem);
	}
	.reading-author {
		margin: 0.4rem 0 0;
		color: var(--color-ink-muted);
	}
	.reading-progress {
		margin-block-start: 1.75rem;
		display: grid;
		gap: 0.5rem;
		max-inline-size: 30rem;
	}
	.reading-progress-head {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: baseline;
	}
	.reading-pct {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 560;
		font-variant-numeric: tabular-nums;
	}
	.reading-page {
		font-size: 0.85rem;
		color: var(--color-ink-muted);
	}
	.reading-actions {
		margin-block-start: 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		align-items: center;
	}
	.reading-hint {
		margin-block-start: 1.5rem;
		font-size: 0.85rem;
		color: var(--color-ink-faint);
	}
	@media (max-width: 30rem) {
		.reading {
			grid-template-columns: 1fr;
		}
		.reading-cover {
			inline-size: min(12rem, 60vw);
		}
	}
</style>
