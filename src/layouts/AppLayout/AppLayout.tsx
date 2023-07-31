import { PropsWithChildren, ComponentProps, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';

import TopBar from './TopBar';
import NavBar from './NavBar';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';
import PageContainer from './PageContainer';
import { AppLayoutContextActions, AppLayoutContextState } from './AppLayoutContext';
import { NavBarProps } from './NavBar';

export interface BaseAppLayoutProps {
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

  /** Either an array of objects used to automatically generate the content of
   * the navbar, or a node to render directly.*/
  navBarMiddle: NavBarProps['middle'];

  /** Props applied to the PageContainer component, which is a styled MUI Container */
  pageContainerProps?: ComponentProps<typeof PageContainer>;

  topBarDataTestId?: string;

  pageContentDataTestId?: string;

  navBarDataTestId?: string;

  /** Allow overriding the context state (navBarOpen etc) for tests,
   * particularly with souvlaki */
  overrideContextState?: Partial<AppLayoutContextState>;

  /** Allow overriding the context actions (setNavBarOpen etc) for tests,
   * particularly with souvlaki */
  overrideContextActions?: Partial<AppLayoutContextActions>;
}

type AppLayoutProps = PropsWithChildren<BaseAppLayoutProps>;

function AppLayout({
  children,
  initialTitleText,
  initialNavBarOpen,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
  navBarDataTestId,
  navBarMiddle,
}: AppLayoutProps) {
  const {
    navBarOpen,
    setNavBarOpen,
    titleText,
    setTitleText,
    topBarHeight,
    navBarWidthOpen,
    navBarWidthClosed,
  } = useAppLayout();

  // Allow open state of navbar to start differently than the default. Unlike
  // changing widths and such, this could be a common scenario.
  useEffect(() => {
    if (initialTitleText !== undefined) setTitleText(initialTitleText);
  }, [initialTitleText, setTitleText]);

  // Similarly for navbar open state.
  useEffect(() => {
    console.log(initialNavBarOpen);
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
          middle={navBarMiddle}
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

export default function AppLayoutWithProvider(props: AppLayoutProps) {
  return (
    <AppLayoutProvider>
      <AppLayout {...props} />
    </AppLayoutProvider>
  );
}
