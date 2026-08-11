<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label = "",
    variant = "graphite",
    size = "medium",
    type = "button",
    disabled = false,
    block = false,
    onclick,
  }: {
    label?: string;
    variant?: string;
    size?: string;
    type?: string;
    disabled?: boolean;
    block?: boolean;
    onclick?: (e: Event) => void;
    children?: Snippet;
  } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<jelly-button
  {label}
  {variant}
  {size}
  {type}
  disabled={disabled || undefined}
  block={block || undefined}
  {onclick}
>
  {label}
</jelly-button>
