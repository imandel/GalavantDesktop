<script>
  import VideoPlayer from "./Video/VideoPlayer.svelte";
  import VideoPlayBar from "./Video/VideoPlayBar.svelte";
  import Topbar from "./Components/Topbar.svelte";
  import { timingObject, Videos } from "./time";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  // Section1 : varibles to control videos
  let layout;
  let paused = true;
  let reset = false;
  
  let minimum_duration = 0;

  let timing;
  timingObject.subscribe((value) => {
    timing = value;
  });

  let videos;
  Videos.subscribe((value) =>{
    videos = value;
  });

  function get_duration(){
    for(let key in videos)
      if (minimum_duration == 0 || minimum_duration > videos[key])
        minimum_duration = videos[key];
  }


  $: videos, get_duration();

  function time_change() {
    if (timing.readyState === "open") {
      if (paused) {
        timing.update({ velocity: 0 });
      } else {
        timing.update({ velocity: 1 });
      }
      timingObject.set(timing);
    }
  }

  function update_paused(){
    console.log("?");
    const { position, velocity } = timing.query();
    if(velocity == 0)
      paused = true;
    else
      paused = false; 
  }

  $: timing, update_paused();

  $: paused, reset, minimum_duration && time_change();

  //-------------------------------------------------------------------------------------------------------------------
  // REACTIVE CONFIG CONTEXT
  //-------------------------------------------------------------------------------------------------------------------

  // Section2 : styles
  // These changes will change the styles of all videos

  const config = writable({});
  setContext("config", config);
  export let controlsHeight = "55px";
  export let trackHeight = "6px";
  export let thumbSize = "15px";
  export let centerIconSize = "60px";
  export let playerBgColor = "black";
  export let color = "#fb7299";
  export let focusColor = "white";
  export let barsBgColor = "white";
  export let iconColor = "white";
  export let bufferedColor = "#fb72996c";
  export let chunkBars = false;
  export let borderRadius = "8px";
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

<div class="min-h-screen bg-sky-300 min-w-screen">
  <Topbar bind:layout />
  <div class="container bg-sky-300 mx-auto grid grid-cols-6 gap-4">
    <div class="col-start-2 col-span-4 m-4 grid gap-4">
      {#if layout == 1}
        <div class="layout1">
          <VideoPlayer />
          <VideoPlayer />
          <VideoPlayer />
        </div>
        <div class="layout2">
          <VideoPlayer />
          <VideoPlayer />
        </div>
      {:else if layout == 2}
        <div class="layout1">
          <VideoPlayer />
          <VideoPlayer />
          <VideoPlayer />
        </div>
        <div class="layout1">
          <VideoPlayer />
          <VideoPlayer />
          <VideoPlayer />
        </div>
      {:else if layout == 3}
        <div class="layout2">
          <VideoPlayer />
          <VideoPlayer />
        </div>
        <div class="layout2">
          <VideoPlayer />
          <VideoPlayer />
        </div>
      {/if}
      <VideoPlayBar bind:paused={paused} duration={minimum_duration} />
    </div>
  </div>
</div>

<style>
  .layout1 {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(3, 1fr);
  }
  .layout2 {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(2, 1fr);
  }
</style>
