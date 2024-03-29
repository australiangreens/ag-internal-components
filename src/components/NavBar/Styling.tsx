import { styled, CSSObject } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';
import { Box, BoxProps, Drawer, DrawerProps } from '@mui/material';

export const NAVBAR_WIDTH_OPENED = 330;
export const NAVBAR_WIDTH_CLOSED = 73;

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

// TODO: Explicit type annotation needed until following issue fixed:
// https://github.com/microsoft/TypeScript/issues/48212
export const Root: StyledComponent<BoxProps> = styled(Box, {
  name: 'NavBar',
})(({ theme }) => ({
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
  color: 'white',
  backgroundColor: 'black',
  // backgroundColor: '#e8e8e8',
});

const openedMixin = (): CSSObject => ({
  width: NAVBAR_WIDTH_OPENED,
  ...sharedOverrides(),
});

const closedMixin = (): CSSObject => ({
  width: NAVBAR_WIDTH_CLOSED,
  ...sharedOverrides(),
});

// TODO: Explicit type annotation needed until following issue fixed:
// https://github.com/microsoft/TypeScript/issues/48212
export const NavDrawer: StyledComponent<DrawerProps> = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? NAVBAR_WIDTH_OPENED : NAVBAR_WIDTH_CLOSED,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  zIndex: theme.zIndex.drawer + 100,

  ...(open && {
    '& .MuiDrawer-paper': openedMixin(),
  }),
  ...(!open && {
    '& .MuiDrawer-paper': closedMixin(),
  }),
}));
