<script lang="ts">
  import { title } from "../time";
  import { ASS } from "./parsers/ASS";
  import { SubRip } from "./parsers/SubRip";
  import Subtitle from "./Subtitle.svelte";
  import SliderSubtitle from "./SliderSubtitle.svelte";

  let subtitle;
  let parsedSubtitles;
  $: console.log(parsedSubtitles);
  let fileName = "sub";
  let playerBgColor = "#fb7299";
  let borderRadius = "8px";

  title.subscribe((value) => {
    subtitle = value;
  });
  $: subtitle, subtitle && loadSubtitleFile();

  const constructorClasses = {
    ass: ASS,
    ssa: ASS,
    srt: SubRip,
    vtt: SubRip,
  };
  type SubtitleExtension = keyof typeof constructorClasses;

  // method used in "https://github.com/sheodox/jimaku-player"
  async function loadSubtitleFile() {
    const file_url = subtitle,
      reader = new FileReader();
    let blob = await fetch(file_url).then((r) => r.blob());
    reader.addEventListener(
      "load",
      function () {
        let txt = reader.result.toString();
        const extension = "vtt"; // TODO: more extension supports
        parsedSubtitles = new constructorClasses[
          extension as SubtitleExtension
        ](txt, fileName);
      },
      false
    );
    reader.readAsText(blob);
  }

  // Section 2: Update position to current time

  let scrollbar;
  let ele;

  $:scrollbar, scrollbar && console.log(scrollbar.scrollTop);
  $: ele && console.log(ele.scrollTop);

	$: scrollbar && ele && scrollbar.scrollTo(0, ele.offsetHeight);
	
  
</script>



<div class="relative" 
style="background-color:{playerBgColor}; border-radius:{borderRadius}; padding:0.5em;">
  <div class="top-0 left-0">
    <Subtitle />  
  </div>
  <SliderSubtitle {parsedSubtitles} />
</div>

