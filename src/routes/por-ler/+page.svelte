<script lang="ts">
  import BookCard from "$lib/components/BookCard.svelte";
  import AddBook from "$lib/components/AddBook.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import JButton from "$lib/components/JButton.svelte";
  import { library } from "$lib/stores/library.svelte";

  let adding = $state(false);

  const sorted = $derived(
    [...library.porLer].sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
  );
</script>

<svelte:head>
  <title>Por Ler · Entrelinhas</title>
</svelte:head>

<header class="pagehead">
  <h1 class="pagehead-title">Por Ler</h1>
  <p class="pagehead-sub">A pilha de leitura. O que espera por ti.</p>
  <JButton
    variant="graphite"
    label="Adicionar livro"
    onclick={() => (adding = true)}
  />
</header>

{#if sorted.length === 0}
  <EmptyState
    title="Nada à espera."
    body="Adiciona um livro — a pilha não se constrói sozinha."
    cta={{ label: "Adicionar livro" }}
    oncta={() => (adding = true)}
  />
{:else}
  <div class="grid">
    {#each sorted as entry (entry.id)}
      <BookCard
        {entry}
        startflow
        onInterest={(n) => library.setInterest(entry.id, n)}
      />
    {/each}
  </div>
{/if}

<AddBook open={adding} onClose={() => (adding = false)} />

<style>
  .pagehead {
    display: grid;
    gap: 0.4rem;
    margin-block-end: clamp(1.5rem, 4vw, 2.5rem);
    justify-items: start;
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
