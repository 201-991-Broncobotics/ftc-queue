<script lang="ts">
  import DarkModeToggle from "./DarkModeToggle.svelte";
</script>

<div class="flex flex-row justify-between items-center p-4">
  <h1 class="text-4xl">FTC Queue</h1>
  <!-- logout button -->
  <slot />
  <DarkModeToggle />
</div>
