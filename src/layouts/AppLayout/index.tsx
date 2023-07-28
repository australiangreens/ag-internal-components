import { Box, CssBaseline } from '@mui/material';

import { AppLayoutProps } from './types';
import TopBar from './TopBar';
import NavBar from './NavBar';
import PageContainer from './PageContainer';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';

function AppLayout({
  children,
  navBarContent,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
}: AppLayoutProps) {
  // TODO: Would it be cleaner to have the NavBar have its own provider, so there is a separate useAppLayout() and useNavBar()?
  const { navBarOpen, titleText } = useAppLayout();

  return (
    <Box>
      <CssBaseline />
      <TopBar titleText={titleText} data-testid={topBarDataTestId} />

      <Box sx={{ display: 'flex' }}>
        <NavBar open={navBarOpen}>{navBarContent}</NavBar>

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
