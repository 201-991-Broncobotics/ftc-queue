<script lang="ts">
  import "../../app.pcss";
  import Nav from "./Nav.svelte";
  import type { LayoutData } from "./$types";
  import { ModeWatcher } from "mode-watcher";

  export let data: LayoutData;
</script>

<Nav
  name={data.user.name}
  pfp_url={data.user.pfp_url}
  phone_number={data.user.phone_number}
/>

<ModeWatcher />
<slot />
