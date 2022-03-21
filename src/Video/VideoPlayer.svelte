<script>
  import VideoPlayerClient from './VideoPlayerClient.svelte';
  import VideoPlayerServer from './VideoPlayerServer.svelte';

  // let isClient = typeof window !== 'undefined' ? true : false;

  //-------------------------------------------------------------------------------------------------------------------
  // PROPS
  //-------------------------------------------------------------------------------------------------------------------

  export let width = 1920;
  export let height = 1080;
  export let poster = '';
  export let source = '';
  export let playerBgColor =  '#fb7299';
  export let iconColor = '#fb7299';
  export let borderRadius = '8px';
  export let loop = false;
  export let skipSeconds = 5;
  export let controlsOnPause = true;
  export let timeDisplay = false;
  export let video_id = 0;
  export let files = "";

  $: source = files ? URL.createObjectURL(files[0]) : "";
  $: _width = parseInt(width);
  $: _height = parseInt(height);
  $: aspectRatio = _height / _width;
</script>

{#if source}
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
    {video_id}/>

{:else}
  <VideoPlayerServer {playerBgColor} {borderRadius} {aspectRatio} bind:files={files} />
{/if}
    