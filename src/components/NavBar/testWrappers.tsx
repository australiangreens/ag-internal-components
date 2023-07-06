/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';

import { NavBarProvider, NavBarActions, NavBarState } from './NavBarContext';

export type Builder<T> = (overrides?: Partial<T>) => T;

export const buildNavBarState: Builder<NavBarState> = (overrides = {}) => ({
  open: true,
  ...overrides,
});

export const withNavBarProvider = createHelper(
  (state: Partial<NavBarState> = buildNavBarState(), actions: Partial<NavBarActions> = {}) =>
    ({ children }) => {
      return (
        <NavBarProvider overrideState={state} overrideActions={actions}>
          {children}
        </NavBarProvider>
      );
    }
);
