<script>
  import VideoPlayer from "./Video/VideoPlayer.svelte";
  import { timingObject } from "./time";

  // varibles
  let files;
  let paused = true;
  let reset = false;
  let timing;
  $: file_name = files ? files[0].name.split(".")[0] : 0;
  $: source = files ? URL.createObjectURL(files[0]) : "";
  
  
  timingObject.subscribe((value) => {
    timing = value;
  });

  function time_change() {
    if (timing.readyState === "open") {
      if (paused) {
        timing.update({ velocity: 0 });
      } else {
        timing.update({ velocity: 1 });
      }
	  if (reset){
		  timing.update({ position: 0 });
		  reset = false;
	  }
	  timingObject.set(timing);
    }
  }

  $: paused, reset, source && time_change();

</script>

<div class="topbar">
  <h1>Multi-modal video analysis toolkit</h1>
  <input type="file" accept="video/*" bind:files />
  {#if files && files[0]}
    <p>
      Showing the video of {file_name}
      {source}
    </p>
  {/if}
</div>

<div>
  <button on:click={() => (paused = true)}>pause</button>
  <button on:click={() => (paused = false)}>play</button>
  <button on:click={() => (reset = true)}> reset</button>
</div>



<div class="wrapper">
  <VideoPlayer {source}  />
  <VideoPlayer {source}  />
  <VideoPlayer {source}  />
  <VideoPlayer {source}  />
  <VideoPlayer {source}  />
  <VideoPlayer {source}  />
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1em;
  }
</style>
