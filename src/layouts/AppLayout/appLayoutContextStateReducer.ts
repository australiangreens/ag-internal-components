import { AppLayoutContextState } from './AppLayoutContext';

type Action =
  | { type: 'toggleNavBarOpen' }
  | { type: 'setNavBarOpen'; payload: AppLayoutContextState['navBarOpen'] }
  | { type: 'setTitleText'; payload: AppLayoutContextState['titleText'] };

export const INITIAL_PAGE_LAYOUT_CONTEXT_STATE: AppLayoutContextState = {
  navBarOpen: true,
  titleText: '',
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

    default:
      throw new Error(`Invalid action.type`);
  }
}
