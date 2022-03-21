<script>
  import { getContext } from "svelte";
  import Button from "./Button.svelte";

  export let title;
  let fileinput;
  let files;
  $: title = files ? URL.createObjectURL(files[0]) : "";

  const cfg = getContext("config");
</script>

<Button  on:pointerup={()=>{fileinput.click();}}>
  <i class="fa-solid fa-closed-captioning " style="color:{$cfg.iconColor}">
    <input bind:this={fileinput} style="display:none" type="file" accept=".vtt" bind:files />
  </i>
</Button>
