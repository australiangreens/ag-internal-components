import { StyledComponent } from '@emotion/styled';
import {
  Box,
  BoxProps,
  Collapse,
  CollapseProps,
  Drawer,
  DrawerProps,
  useTheme,
} from '@mui/material';
import { CSSObject, Theme, styled } from '@mui/material/styles';

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

export const navbarTransition = (
  theme: Theme,
  property: string | string[],
  action: 'entering' | 'leaving'
) =>
  theme.transitions.create(property, {
    easing: theme.transitions.easing.sharp,
    duration:
      action === 'leaving'
        ? theme.transitions.duration.leavingScreen
        : theme.transitions.duration.enteringScreen,
  });

export const NavbarCollapse = (props: CollapseProps) => {
  const theme = useTheme();
  return (
    <Collapse
      easing={theme.transitions.easing.sharp}
      timeout={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
      }}
      {...props}
    />
  );
};

const sharedOverrides = (theme: Theme): CSSObject => ({
  overflowX: 'hidden',
  color: 'inherit',
  backgroundColor: theme?.navBar?.backgroundColor ?? 'white', // Provide default so tests don't need to wrap theme provider
});

const openedMixin = (theme: Theme, width: number): CSSObject => ({
  width,
  transition: navbarTransition(theme, 'width', 'entering'),
  ...sharedOverrides(theme),
});

const closedMixin = (theme: Theme, width: number): CSSObject => ({
  width,
  transition: navbarTransition(theme, 'width', 'leaving'),
  ...sharedOverrides(theme),
});

interface NavDrawerProps {
  open: boolean;
  widthOpen: number;
  widthClosed: number;
  isSmallScreen: boolean;
}

// TODO: Explicit type annotation needed until following issue fixed:
// https://github.com/microsoft/TypeScript/issues/48212
// We also use the second Generic parameter
export const NavDrawer: StyledComponent<DrawerProps & NavDrawerProps> = styled(Drawer, {
  shouldForwardProp: (prop) =>
    !['widthOpen', 'widthClosed', 'isSmallScreen'].includes(prop as string),
})<DrawerProps & NavDrawerProps>(({ theme, open, widthOpen, widthClosed, isSmallScreen }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',

  ...(open && {
    ...openedMixin(theme, widthOpen),
    backgroundColor: '',
    '& .MuiDrawer-paper': openedMixin(theme, widthOpen),
  }),
  ...(!open && {
    ...closedMixin(theme, isSmallScreen ? widthOpen : widthClosed),
    backgroundColor: '',
    '& .MuiDrawer-paper': closedMixin(theme, isSmallScreen ? widthOpen : widthClosed),
  }),
}));
