import { Provider, createStore } from 'jotai';
import { PropsWithChildren } from 'react';

export const defaultStore = createStore();

export const AtomProvider = ({
  children,
  store,
}: PropsWithChildren<{ store?: ReturnType<typeof createStore> }>) => (
  <Provider store={store ?? defaultStore}>{children}</Provider>
);
