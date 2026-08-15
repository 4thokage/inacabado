<script lang="ts">
  import Cover from "./Cover.svelte";
  import StartFlow from "./StartFlow.svelte";
  import JButton from "./JButton.svelte";
  import type { LibraryEntry } from "$lib/types";

  type Actions = {
    start?: (entry: LibraryEntry) => void;
    back?: (entry: LibraryEntry) => void;
    remove?: (entry: LibraryEntry) => void;
  };

  let {
    entry,
    actions = {},
    startflow = false,
  }: {
    entry: LibraryEntry;
    actions?: Actions;
    startflow?: boolean;
  } = $props();

  const firstAuthor = $derived(entry.meta.authors[0] ?? null);
  const authorsText = $derived(entry.meta.authors.join(", "));

  const genre = $derived(entry.meta.genres?.[0] ?? null);

  const primary = $derived.by(() => {
    if (entry.status === "por-ler" && actions.start) {
      return { label: "Começar a ler", fn: actions.start };
    }
    if (entry.status !== "por-ler" && actions.back) {
      return { label: "Voltar à pilha", fn: actions.back };
    }
    return null;
  });
</script>

<jelly-card class="bcard">
  <div class="bcard-cover">
    <Cover
      coverId={entry.meta.coverId}
      title={entry.meta.title}
      author={firstAuthor}
    />
  </div>

  <div class="bcard-main">
    <h3 class="bcard-title">{entry.meta.title}</h3>
    {#if authorsText}
      <p class="bcard-author">{authorsText}</p>
    {/if}
    <p class="bcard-meta">
      {#if entry.meta.year}
        <span>{entry.meta.year}</span>
      {/if}
      {#if entry.meta.pages}
        <span>{entry.meta.pages} pág.</span>
      {/if}
      {#if genre}
        <jelly-chip variant="rose" size="small" shape="square"
          >{genre}</jelly-chip
        >
      {/if}
    </p>

    <div class="bcard-actions">
      {#if entry.status === "por-ler" && startflow}
        <StartFlow {entry} size="small" />
      {:else if primary}
        <JButton
          size="small"
          variant="graphite"
          label={primary.label}
          onclick={() => primary.fn(entry)}
        />
      {/if}
      {#if actions.remove && entry.status === "abandonado"}
        <JButton
          size="small"
          variant="platinum"
          label="Remover"
          onclick={() => actions.remove?.(entry)}
        />
      {/if}
    </div>
  </div>
</jelly-card>

<style>
  .bcard {
    grid-template-columns: clamp(5rem, 17vw, 6.5rem) 1fr;
    gap: clamp(1rem, 3vw, 1.5rem);
    padding: clamp(0.9rem, 2.5vw, 1.4rem);
    align-items: start;
  }
  .bcard-cover {
    box-shadow: 0 1px 2px rgba(74, 59, 49, 0.08);
    border: 1px solid var(--color-hairline);
    border-radius: 3px;
    overflow: hidden;
  }
  .bcard-main {
    min-width: 0;
  }
  .bcard-title {
    margin: 0;
    font-size: clamp(1.05rem, 2.5vw, 1.3rem);
  }
  .bcard-author {
    margin: 0.2rem 0 0;
    color: var(--color-ink-muted);
    font-size: 0.9rem;
  }
  .bcard-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.9rem;
    margin: 0.55rem 0 0;
    font-family: var(--font-display);
    font-variant: small-caps;
    letter-spacing: 0.05em;
    text-transform: lowercase;
    font-size: 0.78rem;
    color: var(--color-ink-faint);
  }
  .bcard-actions {
    margin-block-start: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }
</style>
