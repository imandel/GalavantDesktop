import { writable } from 'svelte/store';
import { TimingObject } from 'timing-object';

var now = new TimingObject();
export const timingObject = writable(now);

// key: source value: duration
export const Videos = writable({});

// subtitles
export const title = writable("");