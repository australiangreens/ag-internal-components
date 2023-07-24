/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';

import {
  AppLayoutProvider,
  AppLayoutContextActions,
  AppLayoutContextState,
} from './AppLayoutContext';

export type Builder<T> = (overrides?: Partial<T>) => T;

export const buildNavBarState: Builder<AppLayoutContextState> = (overrides = {}) => ({
  navBarOpen: true,
  navBarWidthClosed: 50,
  navBarWidthOpen: 100,
  titleText: '',
  ...overrides,
});

export const withAppLayout = createHelper(
  (
      state: Partial<AppLayoutContextState> = buildNavBarState(),
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
