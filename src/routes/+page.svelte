<script lang="ts">
	import MarqueeHero from '$lib/components/MarqueeHero.svelte';
	import StartFlow from '$lib/components/StartFlow.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import AddBook from '$lib/components/AddBook.svelte';
	import JButton from '$lib/components/JButton.svelte';
	import Cover from '$lib/components/Cover.svelte';
	import { library } from '$lib/stores/library.svelte';
	import { reveal } from '$lib/actions';

	let adding = $state(false);

	const pick = $derived(library.recommendation());

	const stats = $derived([
		{ href: '/por-ler', n: library.porLer.length, label: 'Por Ler' },
		{ href: '/a-ler', n: library.aLer.length, label: 'A Ler' },
		{ href: '/concluidos', n: library.concluidos.length, label: 'Concluídos' },
		{ href: '/abandonados', n: library.abandonados.length, label: 'Abandonados' }
	]);

	const empty = $derived(
		library.porLer.length === 0 && library.aLer.length === 0
	);

	function reroll(): void {
		library.reroll();
	}
</script>

<svelte:head>
	<title>Entrelinhas — o que vais ler a seguir</title>
	<meta name="description" content="A tua fila de leitura, decidida sem pressa." />
</svelte:head>

<MarqueeHero>
	{#if empty}
		<div use:reveal>
			<EmptyState
				title="A pilha está vazia."
				body="Adiciona livros e decide, sem pressa, o que ler a seguir."
				cta={{ label: 'Adicionar livro' }}
				oncta={() => (adding = true)}
			/>
		</div>
	{:else if pick}
		<section class="rec" use:reveal>
			<p class="issue-line rec-label">Sugestão da pilha</p>
			<div class="rec-grid">
				<div class="rec-cover">
					<Cover
						coverId={pick.entry.meta.coverId}
						title={pick.entry.meta.title}
						author={pick.entry.meta.authors[0]}
					/>
				</div>
				<div class="rec-body">
					<h2 class="rec-title">{pick.entry.meta.title}</h2>
					{#if pick.entry.meta.authors.length}
						<p class="rec-author">{pick.entry.meta.authors.join(', ')}</p>
					{/if}
					<ul class="rec-reasons">
						{#each pick.reasons as reason (reason)}
							<li class="rec-reason">
								<span class="rec-mark" aria-hidden="true">❦</span>
								{reason}
							</li>
						{/each}
					</ul>
					<div class="rec-actions">
						<StartFlow entry={pick.entry} label="Começar a ler" />
						<JButton
							variant="platinum"
							label="Escolher outra"
							onclick={reroll}
						/>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<nav class="counts" aria-label="Resumo da biblioteca">
		{#each stats as s (s.href)}
			<a class="count" href={s.href}>
				<span class="count-n">{s.n}</span>
				<span class="count-l">{s.label}</span>
			</a>
		{/each}
	</nav>
</MarqueeHero>

<AddBook open={adding} onClose={() => (adding = false)} />

<style>
	.rec {
		display: grid;
		gap: 1rem;
	}
	.rec-label {
		display: block;
	}
	.rec-grid {
		display: grid;
		grid-template-columns: clamp(7rem, 22vw, 10rem) 1fr;
		gap: clamp(1.25rem, 4vw, 2.5rem);
		align-items: start;
	}
	.rec-cover {
		box-shadow: 0 2px 6px rgba(74, 59, 49, 0.12);
		border: 1px solid var(--color-hairline);
		border-radius: 4px;
		overflow: hidden;
	}
	.rec-title {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
	}
	.rec-author {
		margin: 0.35rem 0 0;
		color: var(--color-ink-muted);
	}
	.rec-reasons {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	.rec-reason {
		display: flex;
		gap: 0.7rem;
		align-items: baseline;
		color: var(--color-ink-muted);
		max-width: 52ch;
	}
	.rec-mark {
		color: var(--color-accent);
		flex: none;
		font-size: 0.9rem;
	}
	.rec-actions {
		margin-block-start: 1.4rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.counts {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: var(--color-hairline);
		border: 1px solid var(--color-hairline);
		border-radius: 4px;
		overflow: hidden;
	}
	.count {
		display: grid;
		place-items: center;
		gap: 0.15rem;
		padding: 0.9rem 0.5rem;
		background: var(--color-paper-elevated);
		text-align: center;
		text-decoration: none;
		transition: background var(--dur-short) var(--ease-out);
	}
	.count-n {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 4vw, 2rem);
		font-weight: 560;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.count-l {
		font-family: var(--font-display);
		font-variant: small-caps;
		letter-spacing: 0.06em;
		text-transform: lowercase;
		font-size: 0.78rem;
		color: var(--color-ink-muted);
	}
	@media (hover: hover) {
		.count:hover {
			background: var(--color-paper-shade);
		}
	}

	@media (max-width: 30rem) {
		.counts {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
