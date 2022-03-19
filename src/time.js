import { writable } from 'svelte/store';
import { TimingObject } from 'timing-object';
import { setTimingsrc } from 'timingsrc';

var now = new TimingObject();
export const timingObject = writable(now);
