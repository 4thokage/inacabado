<script lang="ts">
  import "@fontsource-variable/fraunces/full.css";
  import "@fontsource-variable/instrument-sans";
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/state";
  import { library } from "$lib/stores/library.svelte";

  let { children } = $props();

  const nav = [
    { href: "/", label: "~", count: false },
    { href: "/por-ler", label: "Por Ler", count: true },
    { href: "/a-ler", label: "A Ler", count: true },
    { href: "/concluidos", label: "Concluídos", count: true },
    { href: "/abandonados", label: "Abandonados", count: true },
  ];

  const counts: Record<string, number> = $derived({
    "/por-ler": library.porLer.length,
    "/a-ler": library.aLer.length,
    "/concluidos": library.concluidos.length,
    "/abandonados": library.abandonados.length,
  });

  function isActive(href: string): boolean {
    if (href === "/") return page.url.pathname === "/";
    return page.url.pathname.startsWith(href);
  }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="shell">
  <a class="skip-link" href="#main">Saltar para o conteúdo</a>

  <header class="masthead">
    <p class="issue-line">
      <span>Caderno pessoal de leitura</span>
      <span class="sep" aria-hidden="true">·</span>
      <span>{library.porLer.length} na pilha</span>
    </p>
    <a class="wordmark" href="/">Entrelinhas</a>
    <nav class="mastnav" aria-label="Navegação principal">
      <ul>
        {#each nav as item (item.href)}
          <li>
            <a
              class="navlink"
              class:active={isActive(item.href)}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <span>{item.label}</span>
              {#if item.count && counts[item.href] !== undefined}
                <jelly-badge class="navcount" variant="graphite" shape="square"
                  >{counts[item.href]}</jelly-badge
                >
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    <div class="rule-double mastrule" aria-hidden="true"></div>
  </header>

  <main id="main" class="main">
    {@render children()}
  </main>

  <footer class="footer">
    <div class="rule-double footerrule" aria-hidden="true"></div>
    <div class="footer-row">
      <span class="wordmark-sm">Entrelinhas</span>
      <span class="fleurons" aria-hidden="true">❦</span>
      <span class="tagline">Descobre o que vais ler a seguir.</span>
    </div>
    <p class="colophon">
      <span>Capas via Open Library</span>
      <span>Dados guardados apenas neste navegador</span>
    </p>
  </footer>
</div>
