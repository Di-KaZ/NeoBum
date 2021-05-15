import { writable } from 'svelte/store';

const initialState = false;

export const showQueryStore = writable(initialState);

export const toggleShowQuery = (): void => showQueryStore.update((val) => !val);
