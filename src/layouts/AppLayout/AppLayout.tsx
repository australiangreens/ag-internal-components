import { PropsWithChildren, ComponentProps } from 'react';
import { Box, CssBaseline } from '@mui/material';

import TopBar from './TopBar';
import NavBar from './NavBar';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';
import PageContainer from './PageContainer';
import { AppLayoutContextActions, AppLayoutContextState } from './AppLayoutContext';
import { NavBarProps } from './NavBar';

export interface BaseAppLayoutProps {
  /** Either an array of objects used to automatically generate the content of
   * the navbar, or a node to render directly.*/
  navBarMiddle: NavBarProps['middle'];

  /**
   * Override the height of the top bar in pixels
   */
  topBarHeight?: number;

  /**
   * Override the width of the navbar when closed
   */
  navBarWidthClosed?: number;

  /**
   * Override the width of the navbar when open
   */
  navBarWidthOpen?: number;

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
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
  navBarDataTestId,
  navBarMiddle,
}: AppLayoutProps) {
  const { navBarOpen, titleText, topBarHeight, navBarWidthOpen, navBarWidthClosed } =
    useAppLayout();

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
