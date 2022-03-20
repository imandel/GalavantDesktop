<script>
  import VideoPlayerClient from './VideoPlayerClient.svelte';
  import VideoPlayerServer from './VideoPlayerServer.svelte';

  let isClient = typeof window !== 'undefined' ? true : false;

  //-------------------------------------------------------------------------------------------------------------------
  // PROPS
  //-------------------------------------------------------------------------------------------------------------------

  export let width = 1920;
  export let height = 1080;
  export let poster = '';
  export let source = '';
  export let playerBgColor = 'black';
  export let iconColor = 'white';
  export let borderRadius = '8px';
  export let loop = false;
  export let skipSeconds = 5;
  export let controlsOnPause = true;
  export let timeDisplay = true;
  export let currentTime = 0;

  export let paused = true;
  export let start_time = 0;

  export let video_id = 0;
  export let videoElement = 0;

  $: _width = parseInt(width);
  $: _height = parseInt(height);
  $: aspectRatio = _height / _width;
</script>

  <VideoPlayerClient
    {width}
    {height}
    {poster}
    {source}
    {playerBgColor}
    {iconColor}
    {borderRadius}
    {loop}
    {skipSeconds}
    {aspectRatio}
    {controlsOnPause}
    {timeDisplay} 
    bind:paused = {paused}
    bind:currentTime = {currentTime}
    bind:start_time = {start_time}
    bind:videoElement = {videoElement}
    {video_id}/>


    