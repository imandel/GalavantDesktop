<script>
	import VideoPlayer from './Video/VideoPlayer.svelte';
	import { writable } from 'svelte/store';

    // Selected files
    let files = 0;
	let currentTime = 0;
	let paused = true;
	let start_time = 0;
    // let source = "";
	// let currentTime = writable(0);
    $: file_name = files ? files[0].name.split('.')[0] : 0;
	$: source = files ? URL.createObjectURL(files[0]) : "";
	// render video


	import { TimingObject } from 'timing-object';
	import { setTimingsrc } from 'timingsrc';

	function synchronization(){
		const mediaElement = document.getElementsByTagName('video');
		console.log(mediaElement)
		const timingObject = new TimingObject();

		const deleteTimingsrc = setTimingsrc(mediaElement, timingObject);

		// The synchronization can be stopped again at any point in time.
		deleteTimingsrc();
	}
</script>

<div class = "topbar">
	<h1>Multi-modal video analysis toolkit</h1>
	<input type = "file" accept="video/*"  bind:files>
	<button on:click={synchronization}>synchronization</button>
	{#if files && files[0]}
		<p>
			Showing the video of { file_name }
			{source}
		</p>
	{/if}
</div>

<div class="wrapper">
	<VideoPlayer {source}  bind:paused = {paused} bind:start_time = {start_time}/>
	<VideoPlayer {source}  bind:paused = {paused} bind:start_time = {start_time}/>
	<VideoPlayer {source}  bind:paused = {paused} bind:start_time = {start_time}/>
	<VideoPlayer {source}  bind:paused = {paused} bind:start_time = {start_time}/>
	<VideoPlayer {source}  bind:paused = {paused} bind:start_time = {start_time}/>
	<VideoPlayer {source}  bind:paused = {paused} bind:start_time = {start_time}/>
</div>


<style>

	.wrapper{
		display:grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1em;
	}

	
</style>
