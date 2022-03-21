<script>
  export let playerBgColor;
  export let borderRadius;
  export let aspectRatio;
  export let files;
  let fileinput;
</script>

<style>
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
</style>

<div class="aspect" on:pointerup={()=>{fileinput.click();}}
style="padding-top:{aspectRatio * 100}%; background-color:{playerBgColor}; border-radius:{borderRadius}">
  <input style="display:none" bind:this={fileinput}
   type="file" accept="video/*"   
   bind:files />

</div>



