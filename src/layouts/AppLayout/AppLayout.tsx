import { Box, CssBaseline } from '@mui/material';
import { ComponentProps, PropsWithChildren } from 'react';

import { useAtom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
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
  topBarMiddleAtom,
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

  //** Do we use the old avatar code or the new one? */
  useNewAvatar?: boolean;
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
  useNewAvatar = false,
}: AppLayoutProps) {
  useHydrateAtoms([
    [navBarOpenAtom, initialNavBarOpen ?? true],
    [titleTextAtom, initialTitleText ?? ''],
  ]);
  const navBarOpen = useAtomValue(navBarOpenAtom);
  const [navBarWidthOpen] = useAtom(navBarWidthOpenAtom);
  const [navBarWidthClosed] = useAtom(navBarWidthClosedAtom);
  const titleText = useAtomValue(titleTextAtom);
  const [topBarHeight] = useAtom(topBarHeightAtom);
  const [topBarMiddle] = useAtom(topBarMiddleAtom);
  const [navBarTop] = useAtom(navBarTopAtom);

  return (
    <Box>
      <CssBaseline />
      <TopBar
        titleText={titleText}
        data-testid={topBarDataTestId}
        height={topBarHeight}
        middle={topBarMiddle}
      />

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
          useNewAvatar={useNewAvatar}
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
