import { styled, CSSObject, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

import { DEFAULT_TOP_BAR_HEIGHT } from '../defaults';

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

const sharedOverrides = (theme: Theme): CSSObject => ({
  height: `calc(100vh - ${theme?.topBar?.height ?? DEFAULT_TOP_BAR_HEIGHT})`,
  top: theme?.topBar?.height ?? DEFAULT_TOP_BAR_HEIGHT,
  overflowX: 'hidden',
  overflowY: 'hidden',
  color: 'inherit',
  backgroundColor: '#e8e8e8',
});

const openedMixin = (theme: Theme, width: number): CSSObject => ({
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...sharedOverrides(theme),
});

const closedMixin = (theme: Theme, width: number): CSSObject => ({
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // [theme.breakpoints.up('sm')]: {
  //   width: `calc(${theme.spacing(8)} + 1px)`,
  // },
  overflowX: 'hidden',

  ...sharedOverrides(theme),
});

interface NavDrawerProps {
  open: boolean;
  widthOpen: number;
  widthClosed: number;
}

export const NavDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['open', 'widthOpen', 'widthClosed'].includes(prop as string),
})<NavDrawerProps>(({ theme, open, widthOpen, widthClosed }) => ({
  // width: 240,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  ...(open && {
    ...openedMixin(theme, widthOpen),
    '& .MuiDrawer-paper': openedMixin(theme, widthOpen),
  }),
  ...(!open && {
    ...closedMixin(theme, widthClosed),
    '& .MuiDrawer-paper': closedMixin(theme, widthClosed),
  }),

  // boxShadow:
  //   '0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
}));
