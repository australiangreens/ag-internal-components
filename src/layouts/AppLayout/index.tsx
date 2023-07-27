import { Box, CssBaseline } from '@mui/material';

import { AppLayoutProps } from './types';
import { NAVBAR_DEFAULTS } from './defaults';
import TopBar from './TopBar';
import NavBar from './NavBar';
import PageContainer from './PageContainer';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';

function AppLayout({
  children,
  navBar = NAVBAR_DEFAULTS,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
}: AppLayoutProps) {
  // TODO: Would it be cleaner to have the NavBar have its own provider, so there is a separate useAppLayout() and useNavBar()?
  const { navBarOpen, titleText } = useAppLayout();

  const {
    content: navBarContent,
    widthOpen: navBarWidthOpen,
    widthClosed: navBarWidthClosed,
  } = navBar ? { ...NAVBAR_DEFAULTS, ...navBar } : { ...NAVBAR_DEFAULTS };

  return (
    <Box>
      <CssBaseline />
      <TopBar titleText={titleText} data-testid={topBarDataTestId} />

      <Box sx={{ display: 'flex' }}>
        <NavBar open={navBarOpen} widthOpen={navBarWidthOpen} widthClosed={navBarWidthClosed}>
          {navBarContent}
        </NavBar>

        <PageContainer data-testid={pageContentDataTestId} {...pageContainerProps}>
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

export * from './AppLayoutContext';
