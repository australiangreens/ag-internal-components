/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';

import { BrowserRouter } from 'react-router-dom';
import { NavBarActions, NavBarProvider, NavBarState } from './NavBarContext';

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

export const withBrowserRouter = createHelper(() => ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
));
