<script lang="ts">
  import BookCard from "$lib/components/BookCard.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import { library } from "$lib/stores/library.svelte";
  import { toast } from "$lib/toast";

  const sorted = $derived(
    [...library.concluidos].sort((a, b) =>
      (b.finishedAt ?? "").localeCompare(a.finishedAt ?? ""),
    ),
  );

  const totalPages = $derived(
    sorted.reduce((acc, e) => acc + (e.meta.pages ?? 0), 0),
  );

  function back(entry: { id: string; meta: { title: string } }): void {
    library.backToPile(entry.id);
    toast(`«${entry.meta.title}» voltou à pilha.`, "info");
  }
</script>

<svelte:head>
  <title>Concluídos · Entrelinhas</title>
</svelte:head>

<header class="pagehead">
  <h1 class="pagehead-title">Concluídos</h1>
  {#if sorted.length > 0}
    <p class="pagehead-sub">
      {sorted.length}
      {sorted.length === 1 ? "livro lido" : "livros lidos"}
      {#if totalPages > 0}
        <span class="pagehead-sep" aria-hidden="true">·</span>
        {totalPages} páginas
      {/if}
    </p>
  {/if}
</header>

{#if sorted.length === 0}
  <EmptyState
    title="Ainda nada concluído."
    body="Cada livro acabado devolve um lugar à pilha."
    cta={{ label: "Ver a pilha", href: "/por-ler" }}
  />
{:else}
  <div class="grid">
    {#each sorted as entry (entry.id)}
      <BookCard {entry} actions={{ back }} showInterest={false} />
    {/each}
  </div>
{/if}

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
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
  }
  .pagehead-sep {
    color: var(--color-accent);
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
