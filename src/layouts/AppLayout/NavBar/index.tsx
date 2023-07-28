import { PropsWithChildren } from 'react';

import { classes, Root, NavDrawer } from './Styling';

export type NavbarProps = {
  open: boolean;
  /** Set the datatest-id on the root element for using reactdom's getByTestId()
   * function */
  'data-testid'?: string;
};

// TODO: Add in more common elements (or make another component) for user/organisations/logout etc?
// TODO: Should there be two sets of 'children', one for the list and one for dialogs etc?

/**
 * A styled navigation bar. At this point in time its pretty unopinionated, it
 * just renders whatever children it is given. The NavBarLightStyledList
 * component can be used for consistent styling against the background.
 */
export default function NavBar({
  open,
  'data-testid': dataTestId,
  children,
}: PropsWithChildren<NavbarProps>) {
  return (
    <Root className={classes.root} data-testid={dataTestId}>
      <NavDrawer variant="permanent" anchor="left" open={open}>
        {children}
      </NavDrawer>
    </Root>
  );
}

export * from './NavBarDarkStyledList';

// TODO: This is a temporary fix, library clients shouldn't need this
export { classes as navBarClasses } from './Styling';
