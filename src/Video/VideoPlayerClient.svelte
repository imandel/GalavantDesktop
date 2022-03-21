<script context="module">
  let currentVideo;

  function onPlay(e) {
    // no need to pause other videos
    // if (currentVideo && currentVideo !== e.target) currentVideo.pause(); // Pause other videos
    currentVideo = e.target;
  }
</script>

<script>
  import { uid, preloadImage, prepareVideoSources } from "./utils.js";
  import Poster from "./Poster.svelte";
  import Controls from "./Controls.svelte";
  import CenterIcons from "./CenterIcons.svelte";
  import BottomControls from "./BottomControls.svelte";
  import Playbar from "./Playbar.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";
  import VolumeButton from "./VolumeButton.svelte";
  import VolumeControl from "./VolumeControl.svelte";
  import FullscreenButton from "./FullscreenButton.svelte";
  import FullscreenManager from "./FullscreenManager.svelte";
  import IdleDetector from "./IdleDetector.svelte";
  import ScrollDetector from "./ScrollDetector.svelte";
  import Spinner from "./Spinner.svelte";
  import Time from "./Time.svelte";

  //-------------------------------------------------------------------------------------------------------------------
  // PROPS
  //-------------------------------------------------------------------------------------------------------------------

  export let width;
  export let height;
  export let poster;
  export let source;
  export let playerBgColor;
  export let iconColor;
  export let borderRadius;
  export let loop;
  export let skipSeconds;
  export let aspectRatio;
  export let controlsOnPause;
  export let timeDisplay;
  export let video_id;
  let videoElement;

  $: _sources = prepareVideoSources(source);
  $: _skipSeconds = parseFloat(skipSeconds);


  //-------------------------------------------------------------------------------------------------------------------
  // VIDEO ELEMENT BINDINGS
  //-------------------------------------------------------------------------------------------------------------------

  let videoPlayerElement;
  let duration;
  let buffered = []; // [{start, end}]
  let played = []; // [{start, end}]
  let seeking;
  let ended;
  let paused = true;
  let currentTime = 0;
  let volume = 1;
  let muteVolume = 1;
  $: muted = volume == 0;

  $: {
    if (ended) {
      currentTime = 0;
      if (loop) videoElement.play();
    }
  }


  //-------------------------------------------------------------------------------------------------------------------
  // APP STATE FLAGS
  //-------------------------------------------------------------------------------------------------------------------

  let isVideoData = false;
  let isPointerOverVideo = false;
  let isPointerOverControls = false;
  let isBuffering = false;
  let isFullscreenEnabled = false;
  let isFullscreen = false;
  let isIdle = false;
  let isScrolling = false;
  let isScrubbing = false;
  let isKeyDown = false;

  $: isPosterVisible = !isVideoData || (paused && currentTime == 0);

  $: isBottomControlsVisible =
    isVideoData &&
    ((paused && controlsOnPause) || (isPointerOverVideo && !isIdle));

  $: isSpinnerVisible = seeking || isBuffering;

  $: isCenterIconVisibile = !isVideoData || (paused && !isScrubbing);

  // Edited by Chenran: To dynamically change the source video
  let renderVideo = true;
  $: {
    reMountVideo(source);
  }
  async function reMountVideo() {
    renderVideo = false;
    setTimeout(() => {
      renderVideo = true;
    }, 0);
  }

  //-------------------------------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  //-------------------------------------------------------------------------------------------------------------------

  function onVideoLoadedData(e) {
    isVideoData = true;
  }

  function onVideoPlaying(e) {
    isBuffering = false;
  }

  function onVideoWaiting(e) {
    isBuffering = true;
  }

  //-------------------------------------------------------------------------------------------------------------------

  function onPlayerPointerOver(e) {
    isPointerOverVideo = true;
  }

  function onPlayerPointerOut(e) {
    isPointerOverVideo = false;
  }

  function onPlayerPointerUp(e) {
    if (!isPointerOverControls && !isScrolling) {
      paused = !paused;
    }
  }

  //-------------------------------------------------------------------------------------------------------------------

  function onWindowKeyDown(e) {
    if (currentVideo !== videoElement) return;
    switch (e.code) {
      case "Tab":
        if (isKeyDown) break; // Prevent long press
        if (!isBottomControlsVisible) {
          e.stopPropagation();
          e.preventDefault();
          isBottomControlsVisible = true;
        }
        break;
      case "Space":
        if (isKeyDown) break; // Prevent long press
        e.preventDefault(); // Prevent page scroll
        currentVideo.paused ? currentVideo.play() : currentVideo.pause();
        break;
      case "ArrowLeft":
        e.preventDefault();
        timeJump(true);
        break;
      case "ArrowRight":
        e.preventDefault();
        timeJump();
        break;
    }
    isKeyDown = true;
  }

  function onWindowKeyUp(e) {
    if (currentVideo !== videoElement) return;
    isKeyDown = false;
  }

  function timeJump(back) {
    let t = 0;
    const d = videoElement.duration;
    const { position } = timing.query();
    if (back)
      t = position > _skipSeconds ? position - _skipSeconds : 0;
    else
      t = position + _skipSeconds < d ? position + _skipSeconds : d - 0.2;
    timing.update({position: t});
  }

  //-------------------------------------------------------------------------------------------------------------------

  function onFullscreenButtonPointerUp(e) {
    isFullscreen = !isFullscreen;
  }

  function onPlaybarPointerUp(e) {
    if (videoElement != videoElement) paused = false;
  }

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

  function togglePause() {
    paused = !paused;
  }

  // TODO: timing src
  import { timingObject, Videos } from "../time";
  import { setTimingsrc } from "timingsrc";
  let timing;
  timingObject.subscribe((value) => {
    timing = value;
  });

  $: timing, source && videoElement && update_time();


  $: paused, update_paused();

  function update_paused(){
    if(paused){
        timing.update({ velocity: 0 });
      }
      else{
        timing.update({ velocity: 1 });
      }
      timingObject.set(timing);
  }
  function update_time(){
    setTimingsrc(videoElement, timing);
  }

  // TODO: Update videos
  let videos;
  Videos.subscribe((value) =>{
    videos = value;
  });
  function update_video(){
    videos[source] = duration;
    Videos.set(videos);
  }
  $: source, duration && update_video();



</script>

<svelte:window on:keydown={onWindowKeyDown} on:keyup={onWindowKeyUp} />

<div
  class="aspect"
  style="padding-top:{aspectRatio *
    100}%; background-color:{playerBgColor}; border-radius:{borderRadius}"
>
  {#await preloadImage(poster)}
    <div>
      <Spinner color={iconColor} size="60px" />
    </div>
  {:then}
    <div
      id="video-player-{uid()}"
      tabindex={isVideoData ? "0" : "-1"}
      bind:this={videoPlayerElement}
      on:pointerover={onPlayerPointerOver}
      on:pointerout={onPlayerPointerOut}
      on:pointerup={onPlayerPointerUp}
    >
      {#if renderVideo}
        <video
          {width}
          {height}
          id={video_id}
          bind:this={videoElement}
          bind:currentTime
          bind:duration
          bind:buffered
          bind:seeking
          bind:played
          bind:ended
          bind:paused
          bind:volume
          on:loadeddata|once={onVideoLoadedData}
          on:play={onPlay}
          on:playing={onVideoPlaying}
          on:waiting={onVideoWaiting}
          preload="none"
        >
          <track kind="captions" />
          {#each _sources as { src, type }}
            <source {src} {type} />
          {/each}
          <p>Sorry, your browser doesn't support HTML5 videos.</p>
        </video>
      {/if}

      {#if poster && isPosterVisible}
        <Poster src={poster} />
      {/if}

      <Controls>
        <BottomControls
          hidden={!isBottomControlsVisible}
          bind:isPointerOver={isPointerOverControls}
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
        <CenterIcons
          isIconVisible={isCenterIconVisibile}
          {isSpinnerVisible}
          {isBuffering}
          on:togglePause={togglePause}
        />
      </Controls>
    </div>
  {:catch error}
    <p style="color:red;">{error}</p>
  {/await}

  <IdleDetector bind:isIdle />

  <ScrollDetector bind:isScrolling />

  <FullscreenManager
    element={videoPlayerElement}
    bind:isFullscreenEnabled
    bind:isFullscreen
  />
</div>

<style>
  :global(video::-webkit-media-controls) {
    display: none !important; /* Hide fullscreen native controls */
  }

  .aspect {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%; /* default 1:1 */
    overflow: hidden;
    border-radius: 8px;
    /* Safari overflow:hidden fix */
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    mask-image: -webkit-radial-gradient(white, black);
  }

  .aspect > :first-child {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: none;
  }

  video {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
