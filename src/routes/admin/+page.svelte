<script lang="ts">
  import type { PageData } from "./$types";
  import * as Card from "$lib/components/ui/card";
  import JoinCompForm from "./JoinCompForm.svelte";
  import CreateCompForm from "./CreateCompForm.svelte";

  export let data: PageData;
</script>

<div>
  <CreateCompForm />
  <JoinCompForm />
</div>

<div class="flex flex-col gap-y-4">
  {#each data.comps as comp}
    <a href="/admin/{comp.comp_id}">
      <Card.Root>
        <Card.Header>
          {comp.comp_name}
        </Card.Header>
        <Card.Content>
          completed matches: {comp.done_matches}
          queued matches: {comp.queueing_matches}
          total matches: {comp.total_matches}
        </Card.Content>
      </Card.Root>
    </a>
  {/each}
</div>
