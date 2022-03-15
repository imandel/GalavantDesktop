import { writable } from 'svelte/store';

export const count = writable(0);

import { TimingObject } from 'timing-object';
import { setTimingsrc } from 'timingsrc';

const mediaElement = document.getElementsByTagName('video')[0];
const timingObject = new TimingObject();

const deleteTimingsrc = setTimingsrc(mediaElement, timingObject);

// The synchronization can be stopped again at any point in time.
deleteTimingsrc();