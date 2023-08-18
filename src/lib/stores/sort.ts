import { writable } from "svelte/store";

export interface SortStoreModel<T extends Record<PropertyKey, any>> {
  data: T[];
  sorted: T[];
  sort: boolean;
}

export const createSortStore = <T extends Record<PropertyKey, any>>(
  data: T[]
) => {
  const { subscribe, set, update } = writable<SortStoreModel<T>>({
    data,
    sorted: data,
    sort: false,
  });

  return {
    subscribe,
    set,
    update,
  };
};

export const sortHandler = <T extends Record<PropertyKey, any>>(
  store: SortStoreModel<T>
) => {
  const sort = store.sort || false;

  store.sorted = store.data.sort((a, b) => b.casillero - a.casillero);
};
