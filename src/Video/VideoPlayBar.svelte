<script>
  import BottomControls from "./BottomControls.svelte";
  import Playbar from "./Playbar.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";
  import VolumeButton from "./VolumeButton.svelte";
  import VolumeControl from "./VolumeControl.svelte";
  import Time from "./Time.svelte";
  import { timingObject} from "../time";

  //-------------------------------------------------------------------------------------------------------------------
  // APP STATE FLAGS
  //-------------------------------------------------------------------------------------------------------------------

  export let paused = true;
  export let currentTime = 0;
  export let timeDisplay = true;
  export let duration = 0;
  export let startTime = 0;
  

  let buffered = []; // [{start, end}]
  let played = []; // [{start, end}]

  let isPointerOverControls = false;
  let isScrubbing = false;

  let volume = 1;
  let muteVolume = 1;
  $: muted = volume == 0;
  let isPlayBar = true;
  let isBottomControlsVisible = true;

  // Section Timer: To create a false current timer!
  // It's not actuall current time, but a fake one.

  let timer;
  $: paused == false && count_current();
  $: paused == true && timer && stop_current();

  function count_current(){
    timer = setInterval(() => {
			currentTime += 1;
	  }, 1000);
  }
  function stop_current(){
    clearInterval(timer);
  }


  // Section Synchronization: Update from timingObject

  let timing;
  timingObject.subscribe((value) => {
    timing = value;
  });

  function update_current(){
    const { position } = timing.query();
    currentTime = position;
  }

  $: timing , update_current();

  $: startTime, update_start();

  // After backward or forward click, change the current time.

  function update_start(){
    currentTime = startTime;
    timing.update( {position: startTime} ) ;
  }


  // Section controls

  function onPlayPauseButtonPointerUp(e) {
    paused = !paused;
  }


  function onVolumeButtonPointerUp(e) {
    if (!muted) {
      muteVolume = volume;
      volume = 0;
    } else {
      volume = muteVolume;
      muteVolume = 1;
    }
  }
</script>

<div class="videoplaybar">
  <BottomControls
    hidden={!isBottomControlsVisible}
    bind:isPointerOver={isPointerOverControls}
    {isPlayBar}
  >
    <PlayPauseButton on:pointerup={onPlayPauseButtonPointerUp} {paused} />
    <Playbar
      {duration}
      {buffered}
      {played}
      {isBottomControlsVisible}
      bind:currentTime
      bind:paused
      bind:isScrubbing
      bind:startTime
    />
    {#if timeDisplay}
      <Time {duration} {currentTime} />
    {/if}
    <VolumeButton on:pointerup={onVolumeButtonPointerUp} {muted} />
    <VolumeControl bind:volume />
  </BottomControls>
</div>
