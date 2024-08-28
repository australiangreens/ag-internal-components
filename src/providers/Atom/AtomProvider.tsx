import { Provider, createStore, getDefaultStore, Store } from 'jotai';
import { PropsWithChildren } from 'react';

export const atomStore: Store = getDefaultStore();

export const AtomProvider = ({
  children,
  store,
}: PropsWithChildren<{ store?: ReturnType<typeof createStore> }>) => (
  <Provider store={store ?? atomStore}>{children}</Provider>
);
