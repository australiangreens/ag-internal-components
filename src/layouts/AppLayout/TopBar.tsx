import { Box, styled, Typography } from '@mui/material';

const TOP_STRIPE_HEIGHT = 24;
const TITLE_BAR_HEIGHT = 64;

const PREFIX = 'TopBar';

export interface TopBarProps {
  titleText?: string;
  'data-testid'?: string;
}

export const classes = {
  topStripe: `${PREFIX}-topStripe`,
  titleBar: `${PREFIX}-titleBar`,
  titleSlider: `${PREFIX}-titleSlider`,

  titleText: `${PREFIX}-titleText`,
};

interface RootProps {}

const Root = styled('div', {
  shouldForwardProp: (prop) => !(['leftPanel', 'rightPanel'] as Array<PropertyKey>).includes(prop),
  name: PREFIX,
})<RootProps>(({ theme }) => ({
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

    [`& .${classes.titleText}`]: {
      flexGrow: 1,
    },
  },
}));

/**
 * Goes at the top of every page. Wasn't feeling creative in naming it.
 *
 * This differs from the more complex TopBar used in the PageLayout component
 * that it has to interact with a sliding side panel that is not the main
 * navbar.
 */
export default function TopBar({ titleText = '', 'data-testid': dataTestId }: TopBarProps) {
  return (
    <Root data-testid={dataTestId}>
      <div className={classes.topStripe} />
      <div className={classes.titleBar}>
        <Box className={classes.titleSlider}>
          <Typography className={classes.titleText} variant="h6" noWrap>
            {titleText}
          </Typography>
        </Box>
      </div>
    </Root>
  );
}
