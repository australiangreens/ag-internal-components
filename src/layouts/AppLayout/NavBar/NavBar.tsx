import { ReactNode } from 'react';
import { Divider, Box } from '@mui/material';

import { NavBarLink, User } from './types';
import { classes, Root, NavDrawer } from './Styling';
import { LinksMenu } from './LinksMenu';
import { DomainCode } from '../../../domainCode';
import UserInfo from './UserInfo';
import SettingsEtcPlaceholder from './SettingsEtcPlaceholder';

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

  /** User information displayed at bottom of navabar when it is open*/
  user?: User;

  /** Displayed below the user information when available */
  domainCode?: DomainCode;
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
  top,
  middle,
  user,
  domainCode,
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
        PaperProps={{
          component: 'nav',
        }}
      >
        {top && (
          <Box sx={{ flex: '0 0 auto' }}>
            {top}
            <Divider variant="middle" />
          </Box>
        )}

        <Box sx={{ flex: '1 0 auto' }}>
          {/* middle is either a ReactNode or an array of NavBarLink objects */}
          {Array.isArray(middle) ? <LinksMenu links={middle as unknown as NavBarLink[]} /> : middle}
        </Box>

        <Box sx={{ flex: '0 0 auto' }}>
          <Divider variant="middle" />
          <UserInfo user={user} domainCode={domainCode} open={open} />
          <SettingsEtcPlaceholder navBarOpen={open} />
        </Box>
      </NavDrawer>
    </Root>
  );
}

// TODO: This is a temporary fix, library clients shouldn't need this
// export { classes as navBarClasses } from './Styling';
