<script lang="ts">
	let { children }: { children?: import('svelte').Snippet } = $props();
</script>

<section class="marquee">
	<h1 class="marquee-title">O que vais ler a seguir?</h1>
	<div class="rule-single" aria-hidden="true"></div>
	{#if children}
		<div class="marquee-below">
			{@render children()}
		</div>
	{/if}
</section>

<style>
	.marquee {
		display: grid;
		gap: clamp(1.25rem, 3.5vw, 2.5rem);
	}
	.marquee-title {
		font-size: clamp(2.75rem, 11.5vw, 7.5rem);
		line-height: 0.98;
		letter-spacing: -0.045em;
		font-weight: 560;
		max-width: 12ch;
		text-wrap: balance;
		margin: 0;
	}
	.marquee-below {
		display: grid;
		gap: clamp(1.5rem, 4vw, 2.5rem);
	}
</style>
