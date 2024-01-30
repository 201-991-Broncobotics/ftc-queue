<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{JSON.stringify(data)}

{#each data.comps as comp}
  {JSON.stringify(comp, null, 2)}
{/each}
