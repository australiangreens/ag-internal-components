import { styled } from '@mui/material';

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

/** With the optional leftPanel and rightPanel props providing state and width,
 * the children of of the PanelAwareMargins will looks like they is pushed aside
 * by the panels by transitioning the margins. */
const PanelAwareMargins = styled('div', {
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
