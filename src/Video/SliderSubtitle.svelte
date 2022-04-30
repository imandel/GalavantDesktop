<script>
  import { onMount } from "svelte";
  import { timingObject, title} from "../time";


  let y = 0;
  let scrollbar;
  let currentTime = 0;
  $: console.log(currentTime);
  export let parsedSubtitles;

  function changeTime(start) {
    currentTime = start / 1000;
  }

  let timing;
  timingObject.subscribe((value) => {
    timing = value;
  });

  function update_current(){
    const { position } = timing.query();
    currentTime = position;
  }

  $: timing , update_current();

  $: currentTime, update_start();

  // After backward or forward click, change the current time.

  function update_start(){
    timing.update( {position: currentTime} ) ;
  }


  onMount(() => {
    // Update elemScrollTop every time the user scrolls
    scrollbar.addEventListener(
      "scroll",
      ({ target }) => (y = target.scrollTop)
    );
  });
</script>

<svelte:window bind:scrollY={y} />

<div class="slider" bind:this={scrollbar}>
  {#if parsedSubtitles}
    {#each parsedSubtitles.subs as subtitle}
      <div class="sub" id={subtitle._id} on:click={(e) => changeTime(subtitle.start)}>
        {subtitle.text}
      </div>
    {/each}
  {/if}
</div>

<style>
  div.slider {
    scroll-snap-type: y mandatory;
    display: grid;
    gap: 0.25em;
    height: 20rem;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
  }
  div.sub {
    color: rgba(243, 243, 243, 1);
    border-radius: 8px;
    transition: background-color 0.25s ease-out 100ms,
      box-shadow 0.25s ease-out 50ms, color 0.25s ease-out 50ms, font-size 0.5s;
    padding: 8px;
    margin: 4px;
  }
  div.sub:hover {
    font-weight: bold;
    cursor: pointer;
    font-size: 1.05em;
    background-color: ghostwhite;
    box-shadow: 4px 2px 2px #fb7299;
    color: #fb7299;
  }
</style>
