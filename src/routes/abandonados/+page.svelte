<script lang="ts">
  import BookCard from "$lib/components/BookCard.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import ConfirmDialog from "$lib/components/ConfirmDialog.svelte";
  import { library } from "$lib/stores/library.svelte";
  import { toast } from "$lib/toast";
  import type { LibraryEntry } from "$lib/types";

  const sorted = $derived(
    [...library.abandonados].sort((a, b) =>
      (b.finishedAt ?? "").localeCompare(a.finishedAt ?? ""),
    ),
  );

  let toRemove = $state<LibraryEntry | null>(null);

  function back(entry: LibraryEntry): void {
    library.backToPile(entry.id);
    toast(`«${entry.meta.title}» voltou à pilha.`, "info");
  }

  function remove(entry: LibraryEntry): void {
    library.remove(entry.id);
    toast(`«${entry.meta.title}» saiu da biblioteca.`, "info");
  }
</script>

<svelte:head>
  <title>Abandonados · Entrelinhas</title>
</svelte:head>

<header class="pagehead">
  <h1 class="pagehead-title">Abandonados</h1>
  {#if sorted.length > 0}
    <p class="pagehead-sub">
      {sorted.length}
      {sorted.length === 1 ? "livro" : "livros"} · não era para ser
    </p>
  {/if}
</header>

{#if sorted.length === 0}
  <EmptyState
    title="Nenhum abandonado."
    body="Ou nada ficou pelo caminho, ou nada foi admitido."
  />
{:else}
  <div class="grid">
    {#each sorted as entry (entry.id)}
      <BookCard
        {entry}
        actions={{ back, remove: (e) => (toRemove = e) }}
      />
    {/each}
  </div>
{/if}

<ConfirmDialog
  open={!!toRemove}
  title="Remover livro?"
  body={toRemove
    ? `«${toRemove.meta.title}» sai da biblioteca para sempre.`
    : ""}
  confirmLabel="Remover"
  onConfirm={() => toRemove && remove(toRemove)}
  onClose={() => (toRemove = null)}
/>

<style>
  .pagehead {
    display: grid;
    gap: 0.4rem;
    margin-block-end: clamp(1.5rem, 4vw, 2.5rem);
  }
  .pagehead-title {
    margin: 0;
    font-size: clamp(2rem, 6vw, 3rem);
  }
  .pagehead-sub {
    margin: 0;
    color: var(--color-ink-muted);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: clamp(0.9rem, 2.5vw, 1.25rem);
  }
  @media (max-width: 26rem) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
