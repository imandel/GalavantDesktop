<script>
  import CenterIcons from "./CenterIcons.svelte";
  import BottomControls from "./BottomControls.svelte";
  import Playbar from "./Playbar.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";
  import VolumeButton from "./VolumeButton.svelte";
  import VolumeControl from "./VolumeControl.svelte";
  import FullscreenButton from "./FullscreenButton.svelte";
  import Time from "./Time.svelte";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";


  //-------------------------------------------------------------------------------------------------------------------
  // APP STATE FLAGS
  //-------------------------------------------------------------------------------------------------------------------

  export let paused = true;

  export let currentTime = 0;
  export let timeDisplay = true;
  

  let duration;
  let buffered = []; // [{start, end}]
  let played = []; // [{start, end}]
  let seeking;

  let isVideoData = false;
  let isPointerOverVideo = false;
  let isPointerOverControls = false;
  let isBuffering = false;
  let isFullscreenEnabled = false;
  let isFullscreen = false;
  let isIdle = false;
  let isScrubbing = false;

  let volume = 1;
  let muteVolume = 1;
  $: muted = volume == 0;

  let isPlayBar = true;

  $: isBottomControlsVisible = true;

  $: isSpinnerVisible = seeking || isBuffering;

  $: isCenterIconVisibile = !isVideoData || (paused && !isScrubbing);


  function onPlayPauseButtonPointerUp(e) {
    paused = !paused;
  }

  function onPlaybarPointerUp(e) {
    if (videoElement != videoElement) paused = false;
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

  function onFullscreenButtonPointerUp(e) {
    isFullscreen = !isFullscreen;
  }
  
  function togglePause() {
    paused = !paused;
  }

</script>


<div>
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
            on:pointerup={onPlaybarPointerUp}
          />
          {#if timeDisplay}
            <Time {duration} {currentTime} />
          {/if}
          <VolumeButton on:pointerup={onVolumeButtonPointerUp} {muted} />
          <VolumeControl bind:volume />
          {#if isFullscreenEnabled}
            <FullscreenButton
              on:pointerup={onFullscreenButtonPointerUp}
              {isFullscreen}
            />
          {/if}
        </BottomControls>
</div>
