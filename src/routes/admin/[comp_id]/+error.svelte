<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/button/button.svelte";
</script>

{#if $page.status === 404}
  <h1>
    This competition either doesn't exist, or you don't have access to it.
  </h1>
  <p>
    try joining a competition on the admin page, or with the link sent to you by
    the head queuer
  </p>
  <Button href="/admin">Back to the admin page</Button>
{:else}
  <h1>{$page.status}: {$page?.error?.message}</h1>
{/if}
