import { Provider, createStore, getDefaultStore, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PropsWithChildren } from 'react';

export const atomStore = getDefaultStore();

export const AtomProvider = ({
  children,
  store,
}: PropsWithChildren<{ store?: ReturnType<typeof createStore> }>) => (
  <Provider store={store ?? atomStore}>{children}</Provider>
);

export const useLibraryAtom: typeof useAtom = (...atom: Parameters<typeof useAtom>) =>
  useAtom(...atom);

export const useSetLibraryAtom: typeof useSetAtom = <A, B extends [], C>(
  ...atom: Parameters<typeof useSetAtom<A, B, C>>
) => useSetAtom(...atom);

export const useLibraryAtomValue: typeof useAtomValue = (
  ...atom: Parameters<typeof useAtomValue>
) => useLibraryAtomValue(...atom);
