import { createContext, useContext, PropsWithChildren, useState, useCallback } from 'react';
import { ContextError } from '../../errors/ContextError';

export type NavBarState = {
  open: boolean;
};

export type NavBarActions = {
  setOpen: (newVal: boolean) => void;
};

type NavBarContext = NavBarState & NavBarActions;

const Context = createContext<NavBarContext | null>(null);

type NavBarProviderProps = {
  overrideState?: Partial<NavBarState>;
  overrideActions?: Partial<NavBarActions>;
};

// Note: Must be at at this scope, otherwise useEffect will loop infinitely
const defaultOverrideState = {};
const defaultOverrideActions = {};

export const NavBarProvider = ({
  overrideState = defaultOverrideState,
  overrideActions = defaultOverrideActions,
  children,
}: PropsWithChildren<NavBarProviderProps>) => {
  const [{ open }, setNavBarState] = useState<NavBarState>({ open: true });

  // TODO: Is this needed? We don't have it backed by anything like localstorage
  // useEffect(() => {
  //   if (overrideState.open) return;
  // }, [overrideState]);

  // We allow setOpen to be a boolean or a function, same as a useState() hook
  // However this will have to be dependent on open, so not memoized really...
  // const setOpen = useCallback((valOrFn: SetStateAction<boolean>) => {
  //   let newVal;

  //   if (typeof valOrFn === 'function') {
  //     newVal = valOrFn(open);
  //   } else {
  //     newVal = valOrFn;
  //   }
  //   setNavBarState({ open: newVal });
  // }, []);

  const setOpen = useCallback((newVal: boolean) => {
    setNavBarState({ open: newVal });
  }, []);

  const value: NavBarContext = {
    open,
    setOpen,
    ...overrideState,
    ...overrideActions,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useNavBar = () => {
  const context = useContext(Context);

  if (context === null) {
    throw new ContextError('Error: Tried to useNavBar outside of a <NavBarProvider>');
  }

  return context;
};
