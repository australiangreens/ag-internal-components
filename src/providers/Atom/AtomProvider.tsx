import { Provider, createStore, getDefaultStore } from 'jotai';
import { PropsWithChildren } from 'react';

export const atomStore: ReturnType<typeof getDefaultStore> = getDefaultStore();

export const AtomProvider = ({
  children,
  store,
}: PropsWithChildren<{ store?: ReturnType<typeof createStore> }>) => (
  <Provider store={store ?? atomStore}>{children}</Provider>
);
