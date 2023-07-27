import { Typography, IconButton, Paper } from '@mui/material';
import { ViewHeadline as HamburgerIcon } from '@mui/icons-material';

import { DEFAULT_TOP_BAR_HEIGHT } from './defaults';
import { useAppLayout } from './AppLayoutContext';

const PREFIX = 'TopBar';

export interface TopBarProps {
  titleText?: string;
  'data-testid'?: string;
}

export const classes = {
  titleText: `${PREFIX}-titleText`,
};

/**
 * Top bar of every page, above the content. Works a bit like MUI's AppBar but
 * the scroll bar will not appear for the whole page, instead just the page
 * content
 */
export default function TopBar({ titleText = '', 'data-testid': dataTestId }: TopBarProps) {
  const { toggleNavBarOpen: toggleNavBar } = useAppLayout();

  return (
    <header data-testid={dataTestId}>
      <Paper
        square
        elevation={0}
        sx={{
          width: '100%',
          position: 'sticky',
          color: 'primary.contrastText',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexShrink: 0,
          height: (theme) => theme?.topBar?.height ?? DEFAULT_TOP_BAR_HEIGHT,
        }}
      >
        <IconButton size="medium" color="inherit" sx={{ padding: 1.5 }} onClick={toggleNavBar}>
          <HamburgerIcon fontSize="medium" />
        </IconButton>
        <Typography className={classes.titleText} variant="h6">
          {titleText}
        </Typography>
      </Paper>
    </header>
  );
}
