<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar"
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import {toggleMode} from "mode-watcher"
    import { Sun, Moon } from "radix-icons-svelte";
  import {enhance} from "$app/forms"



  export let name:string
  export let pfp_url: string

  function initials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase()
  }
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative w-8 h-8 rounded-full">
			<Avatar.Root class="w-9 h-9">
				<Avatar.Image src={pfp_url} alt={`${name}'s pfp`} />
				<Avatar.Fallback>{initials(name)}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{name}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={toggleMode}>
				 <Sun
    class="transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 h-[1.2rem] w-[1.2rem]"
  />
  <Moon
    class="absolute transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 h-[1.2rem] w-[1.2rem]"
  />
  <span class="sr-only">Toggle theme</span>
			</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<form method="POST" action="/logout" use:enhance>

		<DropdownMenu.Item asChild>
				<Button type="submit">Log out
</Button>			
		</DropdownMenu.Item>

		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
