<script lang="ts">
  import JButton from "./JButton.svelte";

  let {
    open = false,
    title,
    body = "",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm = () => {},
    onClose = () => {},
  }: {
    open?: boolean;
    title: string;
    body?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onClose?: () => void;
  } = $props();

  function confirm(): void {
    onConfirm();
    onClose();
  }
</script>

<jelly-dialog {open} label={title} onclose={onClose}>
  <div class="confirm">
    <h2 class="confirm-title">{title}</h2>
    {#if body}
      <p class="confirm-body">{body}</p>
    {/if}
    <div class="">
      <JButton block variant="platinum" label={cancelLabel} onclick={onClose} />
      <JButton
        block
        variant="graphite"
        label={confirmLabel}
        onclick={confirm}
      />
    </div>
  </div>
</jelly-dialog>

<style>
  .confirm {
    display: grid;
    overflow: hidden;
    gap: 0.4rem;
  }
  .confirm-title {
    margin: 0;
    font-size: 1.35rem;
  }
  .confirm-body {
    margin: 0;
    color: var(--color-ink-muted);
  }
</style>
