import { styled, CSSObject, Theme } from '@mui/material/styles';
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

const sharedOverrides = (theme: Theme): CSSObject => ({
  height: `calc(100vh - ${theme.topBar.height})`,
  top: theme.topBar.height,
  overflowX: 'hidden',
  overflowY: 'hidden',
  color: 'inherit',
  backgroundColor: theme.navBar.backgroundColor,
});

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme.navBar.widthOpen,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...sharedOverrides(theme),
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: theme.navBar.widthClosed,
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
