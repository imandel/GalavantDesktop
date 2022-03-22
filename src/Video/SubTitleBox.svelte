<script lang="ts">
  import { title } from "../time";
  import { ASS } from "./parsers/ASS";
  import { SubRip } from "./parsers/SubRip";
  import { onMount, onDestroy } from "svelte";
  let subtitle;
  let parsedSubtitles;
  let fileName = "sub";
  let playerBgColor = "#fb7299";
  let borderRadius = "8px";
  let insideColor = "#fb72996c";

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
</script>

<div
  class="overflow-y-auto grid grid-cols-1 grid-flow-row gap-4 place-content-center"
  style="background-color:{playerBgColor}; border-radius:{borderRadius}"
>
  {#if parsedSubtitles}
    {#each parsedSubtitles.subs as subtitle}
      <p class="z-auto text-slate-500 hover:text-blue-600">
        {subtitle.text}
      </p>
    {/each}
  {/if}
</div>
