import { PropsWithChildren } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material';

export const DEFAULT_PANEL_WIDTH = 400;

interface SidePanelDrawerProps extends DrawerProps {
  anchor: 'left' | 'right';
  width?: number;
  debugOpacity?: boolean;
  navBarOpen: boolean;
  navBarWidthOpen: number;
  navBarWidthClosed: number;
}

const SidePanelDrawer = styled(Drawer, {
  shouldForwardProp: (prop) =>
    // Note we do want anchor to be forwarded to the Drawer component
    !(
      [
        'width',
        'debug',
        'debugOpacity',
        'navBarOpen',
        'navBarWidthOpen',
        'navBarWidthClosed',
      ] as Array<PropertyKey>
    ).includes(prop),
  name: 'SidePanelDrawer',
})<SidePanelDrawerProps>(
  ({ width, debugOpacity = false, anchor, navBarOpen, navBarWidthOpen, navBarWidthClosed }) => ({
    width,

    '& .MuiDrawer-paper': {
      position: 'absolute',
      width,
      boxSizing: 'border-box',
      border: 'unset',
      boxShadow:
        '0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2)',

      ...(debugOpacity && {
        opacity: '50%',
      }),

      ...(anchor === 'left' && {
        marginLeft: `${navBarWidthClosed}px`,
        ...(navBarOpen && {
          marginLeft: `${navBarWidthOpen}px`,
        }),
      }),
    },
  })
);

interface DrawerHeaderBoxProps {
  anchor: 'left' | 'right';
}

const DrawerHeaderBox = styled(Box, {
  shouldForwardProp: (prop) => !(['anchor'] as Array<PropertyKey>).includes(prop),
})<DrawerHeaderBoxProps>(({ theme, anchor }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  ...theme.mixins.toolbar,
  justifyContent: anchor === 'left' ? 'space-between' : 'flex-start',
  backgroundColor: theme.palette.primary.light,
  height: '88px',

  '&,*': {
    color: 'white',
  },

  ' .MuiTypography-root': {
    fontSize: '22px',
  },

  ' .MuiButtonBase-root': {
    marginRight: anchor === 'right' ? theme.spacing(2) : 0,
  },
}));

type SidePanelProps = PropsWithChildren<{
  open: boolean;
  anchor?: 'left' | 'right';
  onClose?: React.MouseEventHandler<HTMLElement>;
  titleText?: string;
  width?: number;
  showCloseArrow?: boolean;
  debugOpacity?: boolean;
  headerBoxProps?: BoxProps;
  onOpened?: () => void;
  onClosed?: () => void;
  'data-testid'?: string;
  navBarOpen?: boolean;
  navBarWidthOpen?: number;
  navBarWidthClosed?: number;
}>;

/**
 * The SidePanel is designed to be used along with the TopBar component for a
 * consistent look and feel.
 */
export default function SidePanel({
  children,
  anchor = 'left',
  open,
  onClose = () => {},
  titleText = '',
  width = DEFAULT_PANEL_WIDTH,
  showCloseArrow = true,
  debugOpacity = false,
  headerBoxProps = {},
  onOpened,
  onClosed,
  'data-testid': dataTestId,
  navBarOpen = false,
  navBarWidthOpen = 0,
  navBarWidthClosed = 0,
}: SidePanelProps) {
  return (
    <SidePanelDrawer
      SlideProps={{
        onEntered: () => onOpened?.(),
        onExited: () => onClosed?.(),
      }}
      variant="persistent"
      anchor={anchor}
      open={open}
      width={width}
      debugOpacity={debugOpacity}
      data-testid={dataTestId}
      navBarOpen={navBarOpen}
      navBarWidthOpen={navBarWidthOpen}
      navBarWidthClosed={navBarWidthClosed}
    >
      <DrawerHeaderBox anchor={anchor} {...headerBoxProps}>
        {/* Might be a cleaner way to do this, but it does the job */}
        {anchor === 'left' ? (
          <>
            <Typography variant="h6" color="inherit" component="div">
              {titleText}
            </Typography>

            {showCloseArrow && (
              <IconButton onClick={onClose} size="large" aria-label="Close left side panel">
                <ArrowBackIcon data-testid="arrowbackicon" />{' '}
              </IconButton>
            )}
          </>
        ) : (
          <>
            {showCloseArrow && (
              <IconButton onClick={onClose} size="large" aria-label="Close right side panel">
                <ArrowForwardIcon />{' '}
              </IconButton>
            )}

            <Typography variant="h6" color="inherit" component="div">
              {titleText}
            </Typography>
          </>
        )}
      </DrawerHeaderBox>
      {children}
    </SidePanelDrawer>
  );
}
