import { createContext, useContext, PropsWithChildren, useState, useCallback } from 'react';
import { ContextError } from '../../errors/ContextError';

export type NavBarState = {
  open: boolean;
};

export type NavBarActions = {
  setOpen: (newVal: boolean) => void;
  toggleOpen: () => void;
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

  const setOpen = useCallback((newVal: boolean) => {
    setNavBarState({ open: newVal });
  }, []);

  const toggleOpen = useCallback(() => {
    setNavBarState((prevState) => ({ ...prevState, open: !prevState.open }));
  }, []);

  const value: NavBarContext = {
    open,
    setOpen,
    toggleOpen,
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
