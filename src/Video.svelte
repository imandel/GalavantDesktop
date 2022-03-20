<script>
  import VideoPlayer from "./Video/VideoPlayer.svelte";
  import VideoPlayBar from "./Video/VideoPlayBar.svelte";
  import { timingObject } from "./time";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  // Section1 : varibles to control videos
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


  //-------------------------------------------------------------------------------------------------------------------
  // REACTIVE CONFIG CONTEXT
  //-------------------------------------------------------------------------------------------------------------------

  // Section2 : styles
  // These changes will change the styles of all videos

  const config = writable({});
  setContext("config", config);
  export let controlsHeight = '55px';
  export let trackHeight = '6px';
  export let thumbSize = '15px';
  export let centerIconSize = '60px';
  export let playerBgColor = 'black';
  export let color = '#F03400';
  export let focusColor = 'white';
  export let barsBgColor = 'white';
  export let iconColor = 'white';
  export let bufferedColor = '#FF9600';
  export let chunkBars = false;
  export let borderRadius = '8px';
  export let loop = false;
  export let controlsOnPause = true;
  export let timeDisplay = true;


  $: $config.controlsHeight = controlsHeight;
  $: $config.thumbSize = thumbSize;
  $: $config.trackHeight = trackHeight;
  $: $config.centerIconSize = centerIconSize;
  $: $config.color = color;
  $: $config.playerBgColor = playerBgColor;
  $: $config.focusColor = focusColor;
  $: $config.barsBgColor = barsBgColor;
  $: $config.iconColor = iconColor;
  $: $config.bufferedColor = bufferedColor;
  $: $config.chunkBars = chunkBars;
  $: $config.loop = loop;
  $: $config.borderRadius = borderRadius;
  $: $config.controlsOnPause = controlsOnPause;
  $: $config.timeDisplay = timeDisplay;

</script>

<div class="topbar">
  <h1>Multi-modal video analysis toolkit</h1>
  <input type="file" accept="video/*" bind:files />
</div>

<div>
  <button on:click={() => paused = !paused}> </button>
  <button on:click={() => (paused = true)}>pause</button>
  <button on:click={() => (paused = false)}>play</button>
  <button on:click={() => (reset = true)}> reset</button>
</div>



<div class="videos">
  <div class="videos layout1">
    <VideoPlayer {source}  />
    <VideoPlayer {source}  />
    <VideoPlayer {source}  />
  </div>
  <div class="videos layout2">
    <VideoPlayer {source}  />
    <VideoPlayer {source}  />
  </div>
</div>

<VideoPlayBar />

<style>
  .videos {
    display: grid;
    grid-gap: 1em;
  }
  .layout1{
    grid-template-columns: repeat(3, 1fr);
  }
  .layout2{
    grid-template-columns: repeat(2, 1fr);
  }

</style>
