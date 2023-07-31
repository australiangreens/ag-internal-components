import { ReactNode } from 'react';

import { NavBarLink } from './types';
import { classes, Root, NavDrawer } from './Styling';
import { LinksMenu } from './LinksMenu';

// TODO: Add in more common elements (or make another component) for user/organisations/logout etc?
// TODO: Should there be two sets of 'children', one for the list and one for dialogs etc?

export interface NavBarProps {
  open: boolean;

  offsetTop?: number;

  widthOpen: number;

  widthClosed: number;

  /** Set the datatest-id on the root element for using reactdom's getByTestId()
   * function */
  'data-testid'?: string;

  /** The contents to be displayed at the top, specified to the current page */
  top?: ReactNode;

  /** Display be below the top section, always the same regardless of page. Can
   * be provided either as a node directly, or an array of objects that will be
   * used to generate a standard navbar menu.
   *
   * @example
   *
   * ```
   * // As a ReactNode
   * <NavBar open: {open} middle={<TheContent}/>
   * ```
   *
   * @example
   *
   * ```
   * // As an Array
   * <NavBar open: {open} middle={[
   *  {label: 'foo', destPathname: '/foo', icon: {FooIcon}},
   *  {label: 'bar', destPathname: '/bar', icon: {BarIcon}},
   * ]}/>
   * ```
   */
  middle: ReactNode | NavBarLink[];

  /** The contents aligned against bottom of view port, user info etc */
  bottom?: ReactNode;
}

/**
 * A styled navigation bar. At this point in time its pretty unopinionated, it
 * just renders whatever children it is given. The NavBarLightStyledList
 * component can be used for consistent styling against the background.
 */
export default function NavBar({
  open,
  offsetTop = 0,
  widthOpen,
  widthClosed,
  'data-testid': dataTestId,
  middle,
}: NavBarProps) {
  return (
    <Root className={classes.root} data-testid={dataTestId}>
      <NavDrawer
        variant="permanent"
        anchor="left"
        open={open}
        widthOpen={widthOpen}
        widthClosed={widthClosed}
        offsetTop={offsetTop}
      >
        <nav>
          {/* middle is either a ReactNode or an array of NavBarLink objects */}
          {Array.isArray(middle) ? <LinksMenu links={middle as unknown as NavBarLink[]} /> : middle}
        </nav>
      </NavDrawer>
    </Root>
  );
}

// TODO: This is a temporary fix, library clients shouldn't need this
// export { classes as navBarClasses } from './Styling';
