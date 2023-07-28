import { Box, CssBaseline } from '@mui/material';

import { AppLayoutProps } from './types';
import TopBar from './TopBar';
import NavBar from './NavBar';
import PageContainer from './PageContainer';
import { AppLayoutProvider, useAppLayout } from './AppLayoutContext';

function AppLayout({
  children,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
  navBarMiddle,
}: AppLayoutProps) {
  const { navBarOpen, titleText } = useAppLayout();

  return (
    <Box>
      <CssBaseline />
      <TopBar titleText={titleText} data-testid={topBarDataTestId} />

      <Box sx={{ display: 'flex' }}>
        <NavBar open={navBarOpen} middle={navBarMiddle} />

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
