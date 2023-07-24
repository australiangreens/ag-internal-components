import { createContext, useContext, PropsWithChildren, useMemo, useReducer } from 'react';
import { ContextError } from '../../errors/ContextError';
import {
  INITIAL_PAGE_LAYOUT_CONTEXT_STATE,
  appLayoutContextStateReducer,
} from './appLayoutContextStateReducer';

export interface AppLayoutContextState {
  navBarOpen: boolean;
  titleText: string;
  navBarWidthOpen: number;
  navBarWidthClosed: number;
}

export interface AppLayoutContextActions {
  toggleNavBarOpen: () => void;
  setNavBarOpen: (newVal: boolean) => void;
  setTitleText: (newVal: string) => void;
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
  const [{ titleText, navBarOpen, navBarWidthOpen, navBarWidthClosed }, appLayoutContextDispatch] =
    useReducer(appLayoutContextStateReducer, INITIAL_PAGE_LAYOUT_CONTEXT_STATE);

  const appLayoutContextDispatchWrappers = useMemo(
    () => ({
      toggleNavBarOpen: () => appLayoutContextDispatch({ type: 'toggleNavBarOpen' }),

      setNavBarOpen: (newValue: boolean) =>
        appLayoutContextDispatch({ type: 'setNavBarOpen', payload: newValue }),

      setTitleText: (newValue: string) =>
        appLayoutContextDispatch({ type: 'setTitleText', payload: newValue }),
    }),
    []
  );

  const value: AppLayoutContext = {
    navBarOpen,
    titleText,
    navBarWidthOpen,
    navBarWidthClosed,
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
