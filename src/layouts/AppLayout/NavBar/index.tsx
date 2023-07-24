import { PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import { classes, Root, NavDrawer } from './Styling';

export type NavbarProps = {
  open: boolean;
  widthOpen: number;
  widthClosed: number;

  /** Set the datatest-id on the root element for using reactdom's getByTestId()
   * function */
  'data-testid'?: string;
};

// TODO: Add in more common elements (or make another component) for user/organisations/logout etc?
// TODO: Should there be two sets of 'children', one for the list and one for dialogs etc?

/**
 * A styled navigation bar. At this point in time its pretty unopinionated, it
 * just renders whatever children it is given. The NavBarDarkStyledList
 * component can be used for consistent styling against the background. We'll be
 * changing the way we use NavBars soon anyway, so not much point solidying the
 * patterns yet.
 */
export default function NavBar({
  open,
  widthOpen,
  widthClosed,
  'data-testid': dataTestId,
  children,
}: PropsWithChildren<NavbarProps>) {
  return (
    <Root className={classes.root} data-testid={dataTestId}>
      <CssBaseline />
      <NavDrawer
        variant="permanent"
        anchor="left"
        // We aren't using transitions, and {0} will still create an unwanted timeout
        transitionDuration={null as unknown as number}
        open={open}
        widthOpen={widthOpen}
        widthClosed={widthClosed}
      >
        {children}
      </NavDrawer>
    </Root>
  );
}

export * from './NavBarDarkStyledList';

// TODO: This is a temporary fix, library clients shouldn't need this
export { classes as navBarClasses } from './Styling';
