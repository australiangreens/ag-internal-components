import { Box, IconButton, styled, Typography } from '@mui/material';
import { ArrowForward as ForwardIcon, ArrowBack as BackIcon } from '@mui/icons-material';

const TOP_STRIPE_HEIGHT = 24;
const TITLE_BAR_HEIGHT = 64;

const PREFIX = 'TopBar';

interface PanelProps {
  open: boolean;
  width: number;
  showOpenArrow: boolean;

  /** Called when the arrow button is pressed (if showOpenButton is true) */
  onOpen?: () => void;

  showOpenButton?: boolean;
}

export interface TopBarProps {
  titleText?: string;
  leftPanel?: PanelProps;
  rightPanel?: PanelProps;
  'data-testid'?: string;
}

export const classes = {
  topStripe: `${PREFIX}-topStripe`,
  titleBar: `${PREFIX}-titleBar`,
  titleSlider: `${PREFIX}-titleSlider`,

  titleText: `${PREFIX}-titleText`,
  leftPanelButton: `${PREFIX}-leftPanelButton`,
  rightPanelButton: `${PREFIX}-leftPanelButton`,
};

interface RootProps {
  leftPanel?: PanelProps;
  rightPanel?: PanelProps;
}

const Root = styled('div', {
  shouldForwardProp: (prop) => !(['leftPanel', 'rightPanel'] as Array<PropertyKey>).includes(prop),
  name: PREFIX,
})<RootProps>(({ theme, leftPanel, rightPanel }) => ({
  width: '100%',

  [`& .${classes.topStripe}`]: {
    width: '100%',
    height: `${TOP_STRIPE_HEIGHT}px`,
    backgroundColor: theme.palette.primary.main,
  },

  [`& .${classes.titleBar}`]: {
    backgroundColor: theme.palette.primary.light,
    height: `${TITLE_BAR_HEIGHT}px`,
    padding: theme.spacing(0, 3),
    width: '100%',
  },

  [`& .${classes.titleSlider}`]: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'white',

    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    [`& .${classes.leftPanelButton}`]: {
      marginRight: theme.spacing(2),
      flexGrow: 0,
    },

    [`& .${classes.titleText}`]: {
      flexGrow: 1,
    },

    [`& .${classes.rightPanelButton}`]: {
      flexGrow: 0,
    },

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
  },
}));

/**
 * Goes at the top of every page. Wasn't feeling creative in naming it.
 *
 * This differs from the typical appbar with a toolbar used in most MUI apps in
 * that it has to interact with a sliding side panel that is not the main
 * navbar.
 */
export default function TopBar({
  titleText = '',
  leftPanel,
  rightPanel,
  'data-testid': dataTestId,
}: TopBarProps) {
  return (
    <Root leftPanel={leftPanel} rightPanel={rightPanel} data-testid={dataTestId}>
      <div className={classes.topStripe} />
      <div className={classes.titleBar}>
        <Box className={classes.titleSlider}>
          {leftPanel !== undefined && !leftPanel.open && leftPanel.showOpenArrow && (
            <IconButton
              className={classes.leftPanelButton}
              color="inherit"
              aria-label="Open left side panel"
              onClick={leftPanel?.onOpen}
              edge="start"
              size="large"
            >
              {' '}
              <ForwardIcon />
            </IconButton>
          )}

          <Typography className={classes.titleText} variant="h6" noWrap>
            {titleText}
          </Typography>

          {rightPanel !== undefined && !rightPanel.open && rightPanel.showOpenArrow && (
            <IconButton
              className={classes.rightPanelButton}
              color="inherit"
              aria-label="Open right side panel"
              onClick={rightPanel?.onOpen}
              edge="end"
              size="large"
            >
              {' '}
              <BackIcon />
            </IconButton>
          )}
        </Box>
      </div>
    </Root>
  );
}
