/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';

import {
  AppLayoutProvider,
  AppLayoutContextActions,
  AppLayoutContextState,
} from './AppLayoutContext';

export type Builder<T> = (overrides?: Partial<T>) => T;

export const buildState: Builder<AppLayoutContextState> = (overrides = {}) => ({
  navBarOpen: true,
  navBarWidthOpen: 64,
  navBarWidthClosed: 256,
  topBarHeight: 64,
  titleText: '',
  navBarTop: undefined,
  ...overrides,
});

export const withAppLayout = createHelper(
  (
      state: Partial<AppLayoutContextState> = buildState(),
      actions: Partial<AppLayoutContextActions> = {}
    ) =>
    ({ children }) => {
      return (
        <AppLayoutProvider overrideState={state} overrideActions={actions}>
          {children}
        </AppLayoutProvider>
      );
    }
);
