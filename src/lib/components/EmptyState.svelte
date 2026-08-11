<script lang="ts">
  import JButton from "./JButton.svelte";

  let {
    title,
    body = null,
    cta = null,
    oncta = () => {},
  }: {
    title: string;
    body?: string | null;
    cta?: { label: string; href?: string } | null;
    oncta?: () => void;
  } = $props();
</script>

<div class="empty">
  <span class="empty-mark" aria-hidden="true">❦</span>
  <h2 class="empty-title">{title}</h2>
  {#if body}
    <p class="empty-body">{body}</p>
  {/if}
  {#if cta}
    {#if cta.href}
      <a class="empty-cta" href={cta.href} aria-label={cta.label}>
        <jelly-button variant="graphite">{cta.label}</jelly-button>
      </a>
    {:else}
      <JButton variant="graphite" label={cta.label} onclick={oncta} />
    {/if}
  {/if}
</div>

<style>
  .empty {
    display: grid;
    justify-items: center;
    gap: 0.5rem;
    text-align: center;
    padding-block: clamp(2.5rem, 8vw, 5rem);
  }
  .empty-mark {
    color: var(--color-accent);
    font-size: 1.6rem;
    line-height: 1;
  }
  .empty-title {
    font-size: clamp(1.4rem, 3.5vw, 1.9rem);
  }
  .empty-body {
    color: var(--color-ink-muted);
    max-width: 42ch;
    margin: 0;
  }
  .empty-cta {
    margin-block-start: 0.75rem;
    text-decoration: none;
  }
</style>
