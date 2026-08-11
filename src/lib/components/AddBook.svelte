<script lang="ts">
  import Cover from "./Cover.svelte";
  import JButton from "./JButton.svelte";
  import { searchBooks, type OLSearchResult } from "$lib/services/openlibrary";
  import { library } from "$lib/stores/library.svelte";
  import { toast } from "$lib/toast";

  let {
    open = false,
    onClose = () => {},
  }: { open?: boolean; onClose?: () => void } = $props();

  let query = $state("");
  let results = $state<OLSearchResult[]>([]);
  let searching = $state(false);
  let searched = $state(false);
  let error = $state<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  let controller: AbortController | null = null;
  let searchInput: HTMLElement | undefined = $state();

  function focusSearch(): void {
    requestAnimationFrame(() => searchInput?.focus());
  }

  function reset(): void {
    controller?.abort();
    controller = null;
    query = "";
    results = [];
    searched = false;
    error = null;
  }

  function onSearch(): void {
    clearTimeout(timer);
    const q = query.trim();
    if (q.length < 2) {
      results = [];
      searched = false;
      error = null;
      return;
    }
    timer = setTimeout(() => run(q), 350);
  }

  async function run(q: string): Promise<void> {
    controller?.abort();
    const ctrl = new AbortController();
    controller = ctrl;
    searching = true;
    error = null;
    try {
      const res = await searchBooks(q, ctrl.signal);
      results = res;
      searched = true;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      results = [];
      searched = true;
      error = "Não foi possível procurar agora. Tenta outra vez.";
    } finally {
      if (!ctrl.signal.aborted) searching = false;
    }
  }

  function add(r: OLSearchResult): void {
    const meta = {
      title: r.title,
      authors: r.authors,
      coverId: r.coverId ?? null,
      workKey: r.key,
      pages: r.pages ?? null,
      year: r.year ?? null,
      genres: r.genres,
    };
    const entry = library.addBook(meta);
    if (entry) {
      toast(`«${r.title}» juntou-se à pilha.`, "success");
      reset();
      onClose();
    } else {
      toast("Esse livro já está na pilha.", "warning");
    }
  }
</script>

<jelly-drawer
  {open}
  label="Adicionar livro"
  side="bottom"
  onopen={focusSearch}
  onclose={() => {
    reset();
    onClose();
  }}
>
  <div class="addbook">
    <h2 class="addbook-title">Adicionar livro</h2>
    <p class="addbook-hint">Procura por título ou autor.</p>

    <jelly-input
      bind:this={searchInput}
      placeholder="Saramago, Duna…"
      label="Pesquisar livros"
      size="small"
      value={query}
      oninput={(e) => {
        query =
          (e.currentTarget as HTMLElement & { value?: string }).value ?? "";
        onSearch();
      }}
    ></jelly-input>

    {#if searching}
      <div class="addbook-status" role="status">
        <jelly-spinner size="large"></jelly-spinner>
        <span>A procurar…</span>
      </div>
    {:else if error}
      <jelly-alert tone="danger">{error}</jelly-alert>
    {:else if searched && results.length === 0}
      <jelly-alert tone="info"
        >Nada encontrado para «{query.trim()}».</jelly-alert
      >
    {:else}
      <ul class="addbook-results">
        {#each results as r (r.key + r.title)}
          <li class="addbook-row">
            <span class="addbook-thumb">
              <Cover
                coverId={r.coverId}
                title={r.title}
                author={r.authors[0]}
              />
            </span>
            <div class="addbook-info">
              <span class="addbook-name">{r.title}</span>
              <span class="addbook-meta">
                {r.authors[0] ?? "Autor desconhecido"}
                {#if r.year}
                  · {r.year}{/if}
                {#if r.genres?.[0]}
                  · {r.genres[0]}{/if}
              </span>
            </div>
            <JButton
              size="small"
              variant="platinum"
              label="Adicionar"
              onclick={() => add(r)}
            />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</jelly-drawer>

<style>
  jelly-drawer[side="bottom"]::part(sheet) {
    max-width: min(42rem, calc(100vw - 32px));
    margin-inline: auto;
  }
  .addbook {
    display: grid;
    gap: 0.9rem;
    overflow-y: hidden;
  }
  .addbook-title {
    margin: 0;
    font-size: 1.45rem;
    padding-inline-end: 2.5rem;
  }
  .addbook-hint {
    margin: 0;
    color: var(--color-ink-muted);
    font-size: 0.9rem;
  }
  .addbook-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-ink-muted);
    font-size: 0.9rem;
    padding-block: 0.75rem;
  }
  .addbook-results {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.35rem;
    max-block-size: min(50vh, calc(82vh - 12rem));
    overflow-y: auto;
  }
  @supports (height: 1dvh) {
    .addbook-results {
      max-block-size: min(50vh, calc(82dvh - 12rem));
    }
  }
  .addbook-row {
    display: grid;
    grid-template-columns: 2.5rem 1fr auto;
    gap: 0.85rem;
    align-items: center;
    padding: 0.5rem;
    border-radius: 6px;
    background: var(--color-paper);
  }
  .addbook-thumb {
    inline-size: 2.5rem;
    box-shadow: 0 1px 2px rgba(74, 59, 49, 0.08);
    border: 1px solid var(--color-hairline);
    border-radius: 2px;
    overflow: hidden;
  }
  .addbook-info {
    display: grid;
    min-width: 0;
  }
  .addbook-name {
    font-family: var(--font-display);
    font-weight: 600;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  .addbook-meta {
    font-size: 0.78rem;
    color: var(--color-ink-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
