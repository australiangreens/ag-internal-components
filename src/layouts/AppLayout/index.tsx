import { AppLayoutProps } from './types';
import { NAVBAR_DEFAULTS } from './defaults';
import TopBar from './TopBar';
import NavBar from './NavBar';
import PageContainer from './PageContainer';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

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
    <Box sx={{ overflow: 'hidden' }}>
      <CssBaseline />
      <TopBar titleText={titleText} data-testid={topBarDataTestId} />
      <NavBar open={navBarOpen} widthOpen={navBarWidthOpen} widthClosed={navBarWidthClosed}>
        {navBarContent}
      </NavBar>

      <PageContainer data-testid={pageContentDataTestId} {...pageContainerProps}>
        {children}
      </PageContainer>
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
