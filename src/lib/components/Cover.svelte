<script lang="ts">
	import { coverUrl } from '$lib/services/openlibrary';

	let {
		coverId,
		title,
		author = null,
		class: cls = ''
	}: {
		coverId?: number | null;
		title: string;
		author?: string | null;
		class?: string;
	} = $props();

	let failed = $state(false);
</script>

<div class="cover-frame {cls}">
	{#if coverId && !failed}
		<img
			class="cover-img"
			src={coverUrl(coverId, 'M')}
			alt=""
			loading="lazy"
			decoding="async"
			onerror={() => (failed = true)}
		/>
	{:else}
		<span class="cover-ph" role="img" aria-label={title}>
			<span class="cover-ph-title">{title}</span>
			{#if author}
				<span class="cover-ph-author">{author}</span>
			{/if}
		</span>
	{/if}
</div>

<style>
	.cover-frame {
		aspect-ratio: 2 / 3;
		inline-size: 100%;
		overflow: hidden;
		background: var(--color-paper-shade);
	}
	.cover-img {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		background: var(--color-paper-shade);
	}
	.cover-ph-title {
		display: block;
		font-size: clamp(0.8rem, 2.2vw, 1rem);
	}
	.cover-ph-author {
		display: block;
		margin-block-start: 0.5rem;
		font-family: var(--font-ui);
		font-size: 0.68rem;
		font-weight: 430;
		letter-spacing: 0.04em;
		color: var(--color-ink-muted);
	}
</style>
