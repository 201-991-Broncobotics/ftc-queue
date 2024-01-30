<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { Button } from "$lib/components/ui/button";
  // import type { LayoutData } from "./$types";

  // export let data: LayoutData;
</script>

<Nav>
  <form method="post" action="/logout">
    <Button type="submit">logout</Button>
  </form>
</Nav>

<slot />
