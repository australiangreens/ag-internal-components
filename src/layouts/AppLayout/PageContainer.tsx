import { Box, Container, ContainerProps } from '@mui/material';
import { PropsWithChildren } from 'react';

// const NavBarAwareMargins = styled('div', {
//   shouldForwardProp: (prop) => !(['leftPanel', 'rightPanel'] as Array<PropertyKey>).includes(prop),
//   name: 'PanelAwareMargins',
// })<PanelAwareMarginsProps>(({ theme, leftPanel, rightPanel }) => ({
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),

//   ...(leftPanel?.open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: `${leftPanel?.width ?? 0}px`,
//   }),
//   ...(rightPanel?.open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginRight: `${rightPanel?.width ?? 0}px`,
//   }),
// }));

interface PageContainerProps {
  topBarHeight: number;

  /** Passed to underlying Container. False be default.*/
  maxWidth?: ContainerProps['maxWidth'];
  noPadding?: boolean;
}

/**
 * An MUI Container component wrapped in a Box whose height adapts to the
 * topBarHeight and has a stable scrollbar gutter.
 */
function PageContainer({
  children,
  topBarHeight,
  maxWidth = false,
  noPadding,
}: PropsWithChildren<PageContainerProps>) {
  return (
    <Box
      sx={{
        overflow: 'auto',
        height: `calc(100vh - ${topBarHeight}px)`,
        scrollbarGutter: 'stable',
        // scrollbarGutter: 'stable both-edges',
        flexGrow: 1,
      }}
    >
      {noPadding ? (
        <Box component="main" id="main-content">
          {children}
        </Box>
      ) : (
        <Container
          component="main"
          id="main-content"
          maxWidth={maxWidth}
          sx={{ paddingTop: 3, paddingBottom: 3, flexGrow: 1 }}
        >
          {children}
        </Container>
      )}
    </Box>
  );
}

export default PageContainer;
