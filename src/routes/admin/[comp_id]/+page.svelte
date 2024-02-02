<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

{JSON.stringify(data.comp)}

<form method="POST" action="?/import">
  <Button type="submit">Import from TOA</Button>
</form>
