import { AppLayoutProps } from './types';
import { NAVBAR_DEFAULTS } from './defaults';
import TopBar from './TopBar';
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
  const {
    // navBarOpen,
    titleText,
  } = useAppLayout();

  // eslint-disable-next-line no-empty-pattern
  const {
    // content: navBarContent,
    // widthOpen: navBarWidthOpen,
    // widthClosed: navBarWidthClosed,
  } = navBar ? { ...NAVBAR_DEFAULTS, ...navBar } : { ...NAVBAR_DEFAULTS };

  // return (
  //   <Box display="flex" flexDirection="column" height="100vh">
  //     <Box display="flex" position="relative" flexGrow={1} overflow="hidden">
  //       <NavBar open={navBarOpen} widthOpen={navBarWidthOpen} widthClosed={navBarWidthClosed}>
  //         {navBarContent}
  //       </NavBar>
  //       <Box component="main" id="main-content" flexGrow={1} overflow="auto" tabIndex={-1}>
  //         <Box>
  //           <TopBar titleText={titleText} data-testid={topBarDataTestId} />

  //           <PageContainer data-testid={pageContentDataTestId} {...pageContainerProps}>
  //             {children}
  //           </PageContainer>
  //         </Box>
  //       </Box>
  //     </Box>
  //   </Box>
  // );

  return (
    <>
      <TopBar titleText={titleText} data-testid={topBarDataTestId} />

      <PageContainer data-testid={pageContentDataTestId} {...pageContainerProps}>
        {children}
      </PageContainer>
    </>
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
