import { styled } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface PanelProps {
  width: number;
  open: boolean;
}

interface PanelAwareMarginsProps {
  /** If the leftPanel prop is omitted but a left panel is still in use on the
   * page, it will slide over the top instead of the default pushing */
  leftPanel?: PanelProps;

  /** If the rightPanel prop is omitted but a right panel is still in use on the
   * page, it will slide over the top instead of the default pushing */
  rightPanel?: PanelProps;
}

// TODO: Explicit type annotation needed until following issue fixed:
// https://github.com/microsoft/TypeScript/issues/48212

/** With the optional leftPanel and rightPanel props providing state and width,
 * the children of of the PanelAwareMargins will looks like they is pushed aside
 * by the panels by transitioning the margins. */
const PanelAwareMargins: StyledComponent<BoxProps> = styled(Box, {
  shouldForwardProp: (prop) => !(['leftPanel', 'rightPanel'] as Array<PropertyKey>).includes(prop),
  name: 'PanelAwareMargins',
})<PanelAwareMarginsProps>(({ theme, leftPanel, rightPanel }) => ({
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(leftPanel?.open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${leftPanel?.width ?? 0}px`,
  }),
  ...(rightPanel?.open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: `${rightPanel?.width ?? 0}px`,
  }),
}));

export default PanelAwareMargins;
