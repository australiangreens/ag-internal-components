import { Box, Divider, Toolbar } from '@mui/material';
import { ReactNode } from 'react';

import { useSetAtom } from 'jotai';
import { DomainCode } from '../../../domainCode';
import { useSmallScreen } from '../mobile';
import { navBarOpenAtom } from '../stateAtoms';
import { LinksMenu } from './LinksMenu';
import { NavDrawer, Root, classes } from './Styling';
import UserInfo from './UserInfo';
import { NavBarLink, User } from './types';

export interface NavBarProps {
  open: boolean;

  offsetTop?: number;

  widthOpen: number;

  widthClosed: number;

  /** Set the datatest-id on the root element for using reactdom's getByTestId()
   * function */
  'data-testid'?: string;

  /** The contents to be displayed at the top, specific to the current page */
  top?: ReactNode;

  /**
   * Display be below the top section, intended to always be the same,
   * regardless of the current route. Can be provided either as a node directly,
   * or an array of objects that will be used to generate a standard navbar menu.
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

  /** User information displayed at bottom of navabar when it is open*/
  user?: User;

  /** Displayed below the user information when available */
  domainCode?: DomainCode;

  /**
   * The contents to be displayed at the bottom, intended to always be the
   * same, regardless of current route.
   */
  bottom?: ReactNode;
}

/**
 * A styled navigation bar. At this point in time its pretty unopinionated, it
 * just renders whatever children it is given. The NavBarLightStyledList
 * component can be used for consistent styling against the background.
 */
export default function NavBar({
  open,
  widthClosed,
  widthOpen,
  'data-testid': dataTestId,
  top,
  middle,
  bottom,
  user,
  domainCode,
}: NavBarProps) {
  const isSmallScreen = useSmallScreen();
  const setNavBarOpen = useSetAtom(navBarOpenAtom);

  return (
    <Root className={classes.root} data-testid={dataTestId}>
      <NavDrawer
        open={open}
        widthOpen={widthOpen}
        widthClosed={widthClosed}
        anchor="left"
        variant={!isSmallScreen ? 'permanent' : 'temporary'}
        PaperProps={{
          component: 'nav',
        }}
        onClose={() => {
          setNavBarOpen(false);
        }}
        isSmallScreen={isSmallScreen}
      >
        {!isSmallScreen && <Toolbar />}
        {top && (
          <Box flexGrow="0">
            {top}
            <Divider variant="middle" />
          </Box>
        )}

        <Box flexGrow="1">
          {/* middle is either a ReactNode or an array of NavBarLink objects */}
          {Array.isArray(middle) ? <LinksMenu links={middle as unknown as NavBarLink[]} /> : middle}
        </Box>

        <Box flexGrow="0">
          <Divider variant="middle" />
          <UserInfo user={user} domainCode={domainCode} open={open} />

          {bottom && <>{bottom}</>}
        </Box>
      </NavDrawer>
    </Root>
  );
}

// TODO: This is a temporary fix, library clients shouldn't need this
// export { classes as navBarClasses } from './Styling';
