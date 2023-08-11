import { Provider, createStore } from 'jotai';
import { PropsWithChildren } from 'react';

const defaultStore = createStore();

export const atomProvider = ({ children }: PropsWithChildren) => (
  <Provider store={defaultStore}>{children}</Provider>
);
