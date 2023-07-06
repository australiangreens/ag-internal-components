import { PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import { classes, Root, NavDrawer } from './Styling';
import { useNavBar } from './NavBarContext';

export { NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from './Styling';

// eslint-disable-next-line
type NavbarProps = {
  'data-testid'?: string;
};

// TODO: Add in more common elements (or make another component) for user/organisations/logout etc?
// TODO: Should there be two sets of 'children', one for the list and one for dialogs etc?
export default function NavBar({
  'data-testid': dataTestId,
  children,
}: PropsWithChildren<NavbarProps>) {
  const { open } = useNavBar();

  return (
    <Root className={classes.root} data-testid={dataTestId}>
      <CssBaseline />
      <NavDrawer
        variant="permanent"
        anchor="left"
        // We aren't using transitions, and {0} will still create an unwanted timeout
        transitionDuration={null as unknown as number}
        open={open}
      >
        {children}
      </NavDrawer>
    </Root>
  );
}

export * from './NavBarContext';
export * from './testWrappers';

export * from './NavBarDarkStyledList';

// TODO: This is a temporary fix, library clients shouldn't need this
export { classes as navBarClasses } from './Styling';
