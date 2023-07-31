import { Box, CssBaseline } from '@mui/material';

import { AppLayoutProps } from './types';
import TopBar from './TopBar';
import NavBar from './NavBar';
import PageContainer from './PageContainer';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  DEFAULT_NAV_BAR_WIDTH_OPEN,
  DEFAULT_NAV_BAR_WIDTH_CLOSED,
} from './defaults';

function AppLayout({
  children,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
  navBarMiddle,
  topBarHeight = DEFAULT_TOP_BAR_HEIGHT,
  navBarWidthOpen = DEFAULT_NAV_BAR_WIDTH_OPEN,
  navBarWidthClosed = DEFAULT_NAV_BAR_WIDTH_CLOSED,
}: AppLayoutProps) {
  const { navBarOpen, titleText } = useAppLayout();

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
