<script>
  import { getContext } from "svelte";
  import Button from "./Button.svelte";

  export let subtitle;
  let fileinput;
  let files;
  $: subtitle = files ? URL.createObjectURL(files[0]) : "";

  const cfg = getContext("config");
</script>

<style>
  .center {
      text-align: center;
      width: 100%;
      height: 100%;
      margin-top: 20%;
  }
</style>

<Button on:pointerup={()=>{fileinput.click();}}>
  <input bind:this={fileinput} style="display:none" type="file" accept=".vtt" bind:files />
  <i class="fa-solid fa-closed-captioning center" style="color:{$cfg.iconColor}"/>
</Button>
