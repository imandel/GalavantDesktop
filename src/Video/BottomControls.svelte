<script>
  import { getContext } from "svelte";

  export let hidden;
  export let isPointerOver;
  export let isPlayBar = false;

  const cfg = getContext("config");
  let lastFocusElement;
  let wasTabDown;
  let style = "height:"+ $cfg.controlsHeight +"; background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.2) 80%);";
  let classname = "controls"; 
  
  if(isPlayBar){
    classname = "controls2";
    style = "height:"+ $cfg.controlsHeight;
  }

  function onPointerOver(e) {
    isPointerOver = true;
  }

  function onPointerOut(e) {
    isPointerOver = false;
  }

  function onTransitionEnd(e) {
    if (e.propertyName == "visibility") {
      if (!hidden && wasTabDown) {
        lastFocusElement.focus({ preventScroll: true }); // Restore focus when controls opened by tab press
      } else {
        lastFocusElement = document.activeElement;
      }
    }
  }
</script>

<style>
  .controls {
    position: relative;
    box-sizing: border-box;
    min-height: 40px;
    max-height: 150px;
    top: 100%;
    transform: translateY(-100%);
    padding: 10px;
    display: flex;
    gap: 6px;
    visibility: visible;
    transition: transform 0.5s ease, visibility 0.5s linear;
  }

  .controls2 {
    position: relative;
    box-sizing: border-box;
    min-height: 40px;
    max-height: 150px;
    padding: 10px;
    display: flex;
    gap: 6px;
    visibility: visible;
  }


  .hidden {
    visibility: hidden;
    transform: translateY(100%);
  }
</style>

<svelte:window
  on:pointermove={() => (wasTabDown = false)}
  on:keydown={(e) => (wasTabDown = e.code === 'Tab')} />

<div
  class:hidden
  class={classname}
  style={style}
  on:pointerover={onPointerOver}
  on:pointerout={onPointerOut}
  on:transitionend={onTransitionEnd}>
  <slot />
</div>
