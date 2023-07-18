import { styled, Container } from '@mui/material';

/** Just a simple styled container applying our spacings*/
const PageContainer = styled(Container, {
  name: 'PageContainer',
})(({ theme }) => ({
  // Horizontal padding comes from the Container's gutter
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

export default PageContainer;
