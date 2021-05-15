import { writable } from 'svelte/store';

const initialState = { search: '', filterBy: 'name', order: true };

export const searchStore = writable(initialState);

export const handleChangeSearch = (value: string): void => {
  searchStore.update((state) => ({ ...state, search: value }));
};

export const handleChhangeSort = (): void => {
  searchStore.update((state) => ({ ...state, order: !state.order }));
  return;
};

export const handleChangeFilter = (value: string): void => {
  searchStore.update((state) => ({ ...state, filterBy: value }));
  return;
};
