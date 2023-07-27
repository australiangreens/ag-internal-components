import { PropsWithChildren } from 'react';
import { Container, Box } from '@mui/material';
import { DEFAULT_TOP_BAR_HEIGHT } from './defaults';

interface PageContainerProps {
  topBarHeight?: number;
}

function PageContainer({ children }: PropsWithChildren<PageContainerProps>) {
  return (
    <Box
      sx={{
        overflow: 'auto',
        height: (theme) => `calc(100vh - ${theme?.topBar?.height ?? DEFAULT_TOP_BAR_HEIGHT}px)`,
        scrollbarGutter: 'stable',
      }}
    >
      <Container component="main" id="main-content" sx={{ paddingTop: 3, paddingBottom: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

export default PageContainer;
