import { atom } from 'jotai';
import { ReactNode } from 'react';

import {
  DEFAULT_NAV_BAR_WIDTH_CLOSED,
  DEFAULT_NAV_BAR_WIDTH_OPEN,
  DEFAULT_TOP_BAR_HEIGHT,
} from './defaults';

export const navBarOpenAtom = atom(true);

export const navBarWidthOpenAtom = atom(DEFAULT_NAV_BAR_WIDTH_OPEN);

export const navBarWidthClosedAtom = atom(DEFAULT_NAV_BAR_WIDTH_CLOSED);

export const titleTextAtom = atom('');

export const topBarMiddleAtom = atom<ReactNode>(undefined);

export const topBarHeightAtom = atom(DEFAULT_TOP_BAR_HEIGHT);

// TODO: Would navBarTop be handled better with a portal?
export const navBarTopAtom = atom<ReactNode>(undefined);
