import { styled } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';
import { Container, ContainerProps } from '@mui/material';

/** Just a simple styled container applying our spacings*/
const PageContainer: StyledComponent<ContainerProps> = styled(Container, {
  name: 'PageContainer',
})(({ theme }) => ({
  // Horizontal padding comes from the Container's gutter
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  // TODO: Remove max width
}));

export default PageContainer;
