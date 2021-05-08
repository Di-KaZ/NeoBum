import { writable } from 'svelte/store';

export const searchStore = writable(null);

export const handleChangeSearch = (value: string): string => {
  searchStore.set(value);
  return value;
};
