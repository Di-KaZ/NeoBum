import { writable } from 'svelte/store';

export const colors = writable({ fg: '#fff', bg: '#000' });
