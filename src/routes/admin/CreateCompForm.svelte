<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer";
  import { Button } from "$lib/components/ui/button";
  import Input from "$lib/components/ui/input/input.svelte";
  import { enhance } from "$app/forms";
</script>

<Drawer.Root>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]}>Create Competition</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Create Competition</Drawer.Title>
    </Drawer.Header>
    <div>
      <!-- TODO: shadcn svelte form https://www.shadcn-svelte.com/docs/components/form -->
      <form method="post" action="?/createComp" use:enhance>
        <Input
          type="text"
          placeholder="Link on Orange Alliance"
          name="toaLink"
        />
        <Button type="submit">Create</Button>
      </form>
    </div>
  </Drawer.Content>
</Drawer.Root>
