import { ReactNode } from 'react';
import { atom } from 'jotai';

import {
  DEFAULT_TOP_BAR_HEIGHT,
  DEFAULT_NAV_BAR_WIDTH_OPEN,
  DEFAULT_NAV_BAR_WIDTH_CLOSED,
} from './defaults';

export const navBarOpenAtom = atom(true);

export const navBarWidthOpenAtom = atom(DEFAULT_NAV_BAR_WIDTH_OPEN);

export const navBarWidthClosedAtom = atom(DEFAULT_NAV_BAR_WIDTH_CLOSED);

export const titleTextAtom = atom('');

export const topBarHeightAtom = atom(DEFAULT_TOP_BAR_HEIGHT);

// TODO: Would navBarTop be handled better with a portal?
export const navBarTopAtom = atom<ReactNode>(undefined);
