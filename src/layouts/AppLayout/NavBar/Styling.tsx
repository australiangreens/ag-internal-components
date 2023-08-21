import { styled, CSSObject, Theme } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';
import { Box, BoxProps, Drawer, DrawerProps } from '@mui/material';

const PREFIX = 'Navbar';

export const classes = {
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  hide: `${PREFIX}-hide`,
  content: `${PREFIX}-content`,
  // userInfoHolder: `${PREFIX}-userInfoHolder`,
  // settings: `${PREFIX}-settings`,
  // pieChartIcon: `${PREFIX}-pieChartIcon`,
};

// TODO: Explicit type annotation needed until following issue fixed:
// https://github.com/microsoft/TypeScript/issues/48212
export const Root: StyledComponent<BoxProps> = styled(Box, { name: 'NavBar' })(({ theme }) => ({
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

  // [`& .${classes.userInfoHolder}`]: {
  //   height: '148px',
  //   marginTop: '64px',
  //   marginBottom: '16px',
  // },
}));

const sharedOverrides = (theme: Theme, offsetTop: number): CSSObject => ({
  height: `calc(100vh - ${offsetTop}px)`,
  top: offsetTop,
  overflowX: 'hidden',
  overflowY: 'hidden',
  color: 'inherit',
  backgroundColor: theme?.navBar?.backgroundColor ?? 'white', // Provide default so tests don't need to wrap theme provider
});

const openedMixin = (theme: Theme, width: number, offsetTop: number): CSSObject => ({
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...sharedOverrides(theme, offsetTop),
});

const closedMixin = (theme: Theme, width: number, offsetTop: number): CSSObject => ({
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',

  ...sharedOverrides(theme, offsetTop),
});

interface NavDrawerProps {
  open: boolean;
  widthOpen: number;
  widthClosed: number;
  offsetTop: number;
}

// TODO: Explicit type annotation needed until following issue fixed:
// https://github.com/microsoft/TypeScript/issues/48212
// We also use the second Generic parameter
export const NavDrawer: StyledComponent<DrawerProps, NavDrawerProps> = styled(Drawer, {
  shouldForwardProp: (prop) =>
    !['open', 'widthOpen', 'widthClosed', 'offsetTop'].includes(prop as string),
})<NavDrawerProps>(({ theme, open, widthOpen, widthClosed, offsetTop }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',

  ...(open && {
    ...openedMixin(theme, widthOpen, offsetTop),
    '& .MuiDrawer-paper': openedMixin(theme, widthOpen, offsetTop),
  }),
  ...(!open && {
    ...closedMixin(theme, widthClosed, offsetTop),
    '& .MuiDrawer-paper': closedMixin(theme, widthClosed, offsetTop),
  }),
}));
