import { styled, CSSObject } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

const PREFIX = 'Navbar';

export const classes = {
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  hide: `${PREFIX}-hide`,
  content: `${PREFIX}-content`,
  userInfoHolder: `${PREFIX}-userInfoHolder`,
  settings: `${PREFIX}-settings`,
  pieChartIcon: `${PREFIX}-pieChartIcon`,
};

export const Root = styled('div', { name: 'NavBar' })(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.menuButton}`]: {
    marginRight: 36,
  },

  [`& .${classes.hide}`]: {
    display: 'none',
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  [`& .${classes.userInfoHolder}`]: {
    height: '148px',
    marginTop: '64px',
    marginBottom: '16px',
  },
}));

// The starting point for this was the "Mini variant drawer" of
// https://mui.com/components/drawers/#main-content

const sharedOverrides = (): CSSObject => ({
  position: 'absolute',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'hidden',
  color: 'inherit',
  backgroundColor: '#e8e8e8',
});

const openedMixin = (width: number): CSSObject => ({
  width,
  ...sharedOverrides(),
});

const closedMixin = (width: number): CSSObject => ({
  width,
  ...sharedOverrides(),
});

interface NavDrawerProps {
  open: boolean;
  widthOpen: number;
  widthClosed: number;
}

export const NavDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['open', 'widthOpen', 'widthClosed'].includes(prop as string),
})<NavDrawerProps>(({ theme, open, widthOpen, widthClosed }) => ({
  width: open ? widthOpen : widthClosed,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  zIndex: theme.zIndex.drawer + 100,

  ...(open && {
    '& .MuiDrawer-paper': openedMixin(widthOpen),
  }),
  ...(!open && {
    '& .MuiDrawer-paper': closedMixin(widthClosed),
  }),
}));
