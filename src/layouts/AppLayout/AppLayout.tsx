import { Box, CssBaseline } from '@mui/material';
import { ComponentProps, PropsWithChildren, useEffect } from 'react';

import { useAtom } from 'jotai';
import NavBar, { NavBarProps } from './NavBar';
import PageContainer from './PageContainer';
import TopBar from './TopBar';
import {
  navBarOpenAtom,
  navBarTopAtom,
  navBarWidthClosedAtom,
  navBarWidthOpenAtom,
  titleTextAtom,
  topBarHeightAtom,
} from './stateAtoms';

export interface BaseAppLayoutProps {
  /** Either an array of objects used to automatically generate the content of
   * the navbar (WIP), or a node to render directly.*/
  navBarMiddle: NavBarProps['middle'];

  /** A node to render directly.*/
  navBarBottom: NavBarProps['bottom'];

  /**
   * The initial titleText. Shortcut for calling a setter from useAppLayout()
   * hook since its such a common action.
   */
  initialTitleText?: string;

  /**
   * The initial open state of the navbar, which is true by default. Shortcut
   * for calling a setter from useAppLayout() hook since its such a common
   * action.
   */
  initialNavBarOpen?: boolean;

  /** Props applied to the PageContainer component, which is a styled MUI
   * Container */
  pageContainerProps?: ComponentProps<typeof PageContainer>;

  /** Passed directly as prop of TopBar component */
  topBarDataTestId?: string;

  /** Passed directly as prop of PageContainer component */
  pageContentDataTestId?: string;

  /** Passed down as prop to the root element of the NavBar component */
  navBarDataTestId?: string;

  /** Used to display user name and provided picture as avatar or one generated
   * from unitials of the name */
  user?: NavBarProps['user'];

  /** Display under the user's name */
  domainCode?: NavBarProps['domainCode'];
}

type AppLayoutProps = PropsWithChildren<BaseAppLayoutProps>;

export default function AppLayout({
  children,
  initialTitleText,
  initialNavBarOpen,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
  navBarDataTestId,
  navBarMiddle,
  navBarBottom,
  user,
  domainCode,
}: AppLayoutProps) {
  const [navBarOpen, setNavBarOpen] = useAtom(navBarOpenAtom);
  const [navBarWidthOpen] = useAtom(navBarWidthOpenAtom);
  const [navBarWidthClosed] = useAtom(navBarWidthClosedAtom);
  const [titleText, setTitleText] = useAtom(titleTextAtom);
  const [topBarHeight] = useAtom(topBarHeightAtom);
  const [navBarTop] = useAtom(navBarTopAtom);

  // Allow open state of navbar to start differently than the default. Unlike
  // changing widths and such, this could be a common scenario.
  useEffect(() => {
    if (initialTitleText !== undefined) setTitleText(initialTitleText);
  }, [initialTitleText, setTitleText]);

  // Similarly for navbar open state.
  useEffect(() => {
    if (initialNavBarOpen !== undefined) setNavBarOpen(initialNavBarOpen);
  }, [initialNavBarOpen, setNavBarOpen]);

  // Can't imagine initial prop values for other states would be useful

  return (
    <Box>
      <CssBaseline />
      <TopBar titleText={titleText} data-testid={topBarDataTestId} height={topBarHeight} />

      <Box sx={{ display: 'flex' }}>
        <NavBar
          open={navBarOpen}
          top={navBarTop}
          middle={navBarMiddle}
          bottom={navBarBottom}
          user={user}
          domainCode={domainCode}
          widthOpen={navBarWidthOpen}
          widthClosed={navBarWidthClosed}
          offsetTop={topBarHeight}
          data-testid={navBarDataTestId}
        />

        <PageContainer
          data-testid={pageContentDataTestId}
          topBarHeight={topBarHeight}
          {...pageContainerProps}
        >
          {children}
        </PageContainer>
      </Box>
    </Box>
  );
}
