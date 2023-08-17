import { Provider, createStore, getDefaultStore, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PropsWithChildren } from 'react';

export const atomStore = getDefaultStore();

export const AtomProvider = ({
  children,
  store,
}: PropsWithChildren<{ store?: ReturnType<typeof createStore> }>) => (
  <Provider store={store ?? atomStore}>{children}</Provider>
);

export const useLibraryAtom = (atom: Parameters<typeof useAtom>) => {
  return useAtom(...atom);
};

export const useSetLibraryAtom = (atom: Parameters<typeof useSetAtom>) => {
  return useSetAtom(...atom);
};

export const useLibraryAtomValue = (atom: Parameters<typeof useAtomValue>) => {
  return useAtomValue(...atom);
};
