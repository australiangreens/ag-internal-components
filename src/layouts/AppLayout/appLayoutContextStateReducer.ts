import { AppLayoutContextState } from './AppLayoutContext';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  DEFAULT_NAV_BAR_WIDTH_OPEN,
  DEFAULT_NAV_BAR_WIDTH_CLOSED,
} from './defaults';

type Action =
  | { type: 'toggleNavBarOpen' }
  | { type: 'setNavBarOpen'; payload: AppLayoutContextState['navBarOpen'] }
  | { type: 'setTopBarHeight'; payload: AppLayoutContextState['topBarHeight'] }
  | { type: 'setNavBarWidthOpen'; payload: AppLayoutContextState['navBarWidthOpen'] }
  | { type: 'setNavBarWidthClosed'; payload: AppLayoutContextState['navBarWidthClosed'] }
  | { type: 'setTitleText'; payload: AppLayoutContextState['titleText'] }
  | { type: 'setNavBarTop'; payload: AppLayoutContextState['navBarTop'] };

export const INITIAL_PAGE_LAYOUT_CONTEXT_STATE: AppLayoutContextState = {
  navBarOpen: true,
  titleText: '',
  navBarWidthOpen: DEFAULT_NAV_BAR_WIDTH_OPEN,
  navBarWidthClosed: DEFAULT_NAV_BAR_WIDTH_CLOSED,
  topBarHeight: DEFAULT_TOP_BAR_HEIGHT,
  navBarTop: undefined,
};

export function appLayoutContextStateReducer(
  state: AppLayoutContextState,
  action: Action
): AppLayoutContextState {
  switch (action.type) {
    case 'toggleNavBarOpen':
      return {
        ...state,
        navBarOpen: !state.navBarOpen,
      };

    case 'setNavBarOpen':
      return {
        ...state,
        navBarOpen: action.payload,
      };

    case 'setTitleText':
      return {
        ...state,
        titleText: action.payload,
      };

    case 'setNavBarWidthOpen':
      return {
        ...state,
        navBarWidthOpen: action.payload,
      };

    case 'setTopBarHeight':
      return {
        ...state,
        topBarHeight: action.payload,
      };

    case 'setNavBarTop':
      return {
        ...state,
        navBarTop: action.payload,
      };

    default:
      throw new Error(`Invalid action.type`);
  }
}
