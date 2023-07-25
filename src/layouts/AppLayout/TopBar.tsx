import { ReactElement, cloneElement } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useScrollTrigger,
  IconButton,
  styled,
} from '@mui/material';

import { ViewHeadline as HamburgerIcon } from '@mui/icons-material';

const PREFIX = 'TopBar';

export interface TopBarProps {
  titleText?: string;
  'data-testid'?: string;
}

export const classes = {
  titleText: `${PREFIX}-titleText`,
};

interface StyledRootProps {}

const StyledRoot = styled('div', {
  name: PREFIX,
})<StyledRootProps>(({ theme }) => ({
  ['& .MuiToolbar-root']: {
    display: 'flex',
    height: theme.spacing(8),
    alignItems: 'left',
    gap: theme.spacing(2),
    flexShrink: 0,
    padding: 0,
  },
}));

function ElevationScroll({ children }: { children: ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

/**
 * Goes at the top of every page. Wrapper for the MUI AppBar
 */
export default function TopBar({ titleText = '', 'data-testid': dataTestId }: TopBarProps) {
  const handleClickHamburger = () => {
    console.log('handleClickHamburger()');
  };

  return (
    <StyledRoot data-testid={dataTestId}>
      <CssBaseline />
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            <IconButton
              size="medium"
              color="inherit"
              sx={{ padding: 1.5 }}
              onClick={handleClickHamburger}
            >
              <HamburgerIcon fontSize="medium" />
            </IconButton>
            <Typography className={classes.titleText} variant="h6">
              {titleText}
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </StyledRoot>
  );
}
