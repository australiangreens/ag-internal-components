import { styled, CSSObject, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

import {
  DEFAULT_TOP_BAR_HEIGHT,
  DEFAULT_NAV_BAR_WIDTH_OPEN,
  DEFAULT_NAV_BAR_WIDTH_CLOSED,
  DEFAULT_NAV_BAR_BACKGROUND_COLOR,
} from '../defaults';

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

const sharedOverrides = (theme: Theme): CSSObject => ({
  height: `calc(100vh - ${theme?.topBar?.height ?? DEFAULT_TOP_BAR_HEIGHT})`,
  top: theme?.topBar?.height ?? DEFAULT_TOP_BAR_HEIGHT,
  overflowX: 'hidden',
  overflowY: 'hidden',
  color: 'inherit',
  backgroundColor: theme?.navBar?.backgroundColor ?? DEFAULT_NAV_BAR_BACKGROUND_COLOR,
});

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme?.navBar?.widthOpen ?? DEFAULT_NAV_BAR_WIDTH_OPEN,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...sharedOverrides(theme),
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: theme?.navBar?.widthClosed ?? DEFAULT_NAV_BAR_WIDTH_CLOSED,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',

  ...sharedOverrides(theme),
});

interface NavDrawerProps {
  open: boolean;
}

export const NavDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['open'].includes(prop as string),
})<NavDrawerProps>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));
