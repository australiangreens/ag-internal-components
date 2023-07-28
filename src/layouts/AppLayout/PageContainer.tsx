import { PropsWithChildren } from 'react';
import { Container, Box } from '@mui/material';

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

interface PageContainerProps {}

function PageContainer({ children }: PropsWithChildren<PageContainerProps>) {
  return (
    <Box
      sx={{
        overflow: 'auto',
        height: (theme) => `calc(100vh - ${theme.topBar.height}px)`,
        scrollbarGutter: 'stable',
        // scrollbarGutter: 'stable both-edges',
        flexGrow: 1,
      }}
    >
      <Container
        component="main"
        id="main-content"
        sx={{ paddingTop: 3, paddingBottom: 3, flexGrow: 1 }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default PageContainer;
