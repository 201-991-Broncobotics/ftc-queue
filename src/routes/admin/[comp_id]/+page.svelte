<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { PageServerData } from "./$types";
  import Match from "./Match.svelte";

  export let data: PageServerData;
</script>

{JSON.stringify(data.comp)}

<form method="POST" action="?/import">
  <Button type="submit">Import from TOA</Button>
</form>

<div class="flex flex-col gap-y-2 px-4">
  {#each data.matches as match}
    <Match {match} comp_id={data.comp.id} />
  {/each}
</div>
