<script lang="ts">
  import type { BasicMatch } from "./types";
  import * as Card from "$lib/components/ui/card";

  export let match: BasicMatch;
  export let comp_id: string;
</script>

<a href="/admin/{comp_id}/{match.match_id}">
  <Card.Root>
    <Card.Content class="grid grid-cols-3 grid-rows-1">
      <div class="flex flex-col col-span-1 gap-y-1 text-red-500">
        <span>{match.teams.Red1.team_number}</span>
        <span>{match.teams.Red2.team_number}</span>
        {#if match.teams.Red3?.team_number}
          <span>{match.teams.Red3.team_number}</span>
        {/if}
      </div>

      <div class="col-span-1"><h2 class="text-2xl">{match.name}</h2></div>

      <div class="flex flex-col col-span-1 gap-y-1 text-blue-500">
        <span>{match.teams.Blue1.team_number}</span>
        <span>{match.teams.Blue2.team_number}</span>
        {#if match.teams.Blue3?.team_number}
          <span>{match.teams.Blue3.team_number}</span>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</a>
