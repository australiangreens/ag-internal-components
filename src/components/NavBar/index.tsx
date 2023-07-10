import { PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import { classes, Root, NavDrawer } from './Styling';
import { useNavBar } from './NavBarContext';

export { NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from './Styling';

export type NavbarProps = {
  /** Set the datatest-id on the root element for using reactdom's getByTestId()
   * function */
  'data-testid'?: string;
};

// TODO: Add in more common elements (or make another component) for user/organisations/logout etc?
// TODO: Should there be two sets of 'children', one for the list and one for dialogs etc?

// TODO: Rather than exporting the min and max widths, would it make more sense
// TODO: to just share them via the context provider?

/**
 * A (currently uncontrolled) styled navigation bar wth a context provider to
 * retrieve its current open/closed state. At this point in time its pretty
 * unopinionated, it just renders whatever children it is given. THe
 * NavBarDarkStyledList component can be used for consistent styling against the
 * background. We'll be changing the way we use NavBars soon anyway, so not much
 * point solidying the patterns yet.
 */
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
