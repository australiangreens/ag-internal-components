import {
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';
import { ContextError } from '../../errors/ContextError';
import {
  INITIAL_PAGE_LAYOUT_CONTEXT_STATE,
  appLayoutContextStateReducer,
} from './appLayoutContextStateReducer';

export interface AppLayoutContextState {
  navBarOpen: boolean;
  navBarWidthOpen: number;
  navBarWidthClosed: number;
  topBarHeight: number;
  titleText: string;

  /** TODO: Would this be better handled with a portal? */
  navBarTop: ReactNode;
}

export interface AppLayoutContextActions {
  toggleNavBarOpen: () => void;
  setNavBarOpen: (newVal: boolean) => void;
  setTitleText: (newVal: string) => void;
  setNavBarWidthOpen: (newVal: number) => void;
  setNavBarWidthClosed: (newVal: number) => void;
  setNavBarTop: (newVal: ReactNode) => void;
  clearNavBarTop: () => void;
}

export type AppLayoutContext = AppLayoutContextState & AppLayoutContextActions;

interface BasePageProviderProps {
  overrideState?: Partial<AppLayoutContextState>;
  overrideActions?: Partial<AppLayoutContextActions>;
}

export type PageProviderProps = PropsWithChildren<BasePageProviderProps>;

const Context = createContext<AppLayoutContext | null>(null);

// Note: Must be at at this scope, otherwise useEffect will loop infinitely
const defaultOverrideState = {};
const defaultOverrideContextActions = {};

/**
 * Provider of AppLayoutContext, which includes state such as navBarOpen and
 * titleText, along with actions such as setNavBarOpen() and toggleNavBarOpen().
 *
 * These functions provided by the hook are wrappers on the underlying reducer.
 *
 * The overrideState and overrideActions props are designed to be used in tests
 * with the Souvlaki library, for components that rely on being in the context
 * of a AppLayoutProvider, without the need to render the navbar etc.
 */
export const AppLayoutProvider = ({
  overrideState = defaultOverrideState,
  overrideActions = defaultOverrideContextActions,
  children,
}: PageProviderProps) => {
  // Under the hood we use a reducer to manage our state
  const [
    { titleText, topBarHeight, navBarOpen, navBarWidthOpen, navBarWidthClosed, navBarTop },
    appLayoutContextDispatch,
  ] = useReducer(appLayoutContextStateReducer, INITIAL_PAGE_LAYOUT_CONTEXT_STATE);

  const appLayoutContextDispatchWrappers = useMemo(
    () => ({
      toggleNavBarOpen: () => appLayoutContextDispatch({ type: 'toggleNavBarOpen' }),

      setNavBarOpen: (newValue: boolean) =>
        appLayoutContextDispatch({ type: 'setNavBarOpen', payload: newValue }),

      setNavBarWidthOpen: (newValue: number) =>
        appLayoutContextDispatch({ type: 'setNavBarWidthOpen', payload: newValue }),

      setNavBarWidthClosed: (newValue: number) =>
        appLayoutContextDispatch({ type: 'setNavBarWidthClosed', payload: newValue }),

      setTitleText: (newValue: string) =>
        appLayoutContextDispatch({ type: 'setTitleText', payload: newValue }),

      setTopBarHeight: (newValue: number) =>
        appLayoutContextDispatch({ type: 'setTopBarHeight', payload: newValue }),

      setNavBarTop: (newValue: ReactNode) =>
        appLayoutContextDispatch({ type: 'setNavBarTop', payload: newValue }),

      clearNavBarTop: () => appLayoutContextDispatch({ type: 'setNavBarTop', payload: undefined }),
    }),
    []
  );

  const value: AppLayoutContext = {
    navBarOpen,
    navBarWidthOpen,
    navBarWidthClosed,
    titleText,
    topBarHeight,
    navBarTop,
    ...appLayoutContextDispatchWrappers,
    ...overrideState,
    ...overrideActions,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAppLayout = () => {
  const context = useContext(Context);

  if (context === null) {
    throw new ContextError('Error: Tried to call useAppLayout() outside of a <AppLayoutProvider>');
  }

  return context;
};
