import { ViewHeadline as HamburgerIcon } from '@mui/icons-material';
import { IconButton, Paper, Typography } from '@mui/material';

import { useSetAtom } from 'jotai';
import { navBarOpenAtom } from './stateAtoms';

const PREFIX = 'TopBar';

export interface TopBarProps {
  titleText?: string;
  height: number;
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
export default function TopBar({ titleText = '', height, 'data-testid': dataTestId }: TopBarProps) {
  const setNavBarOpen = useSetAtom(navBarOpenAtom);

  const toggleNavBar = () => setNavBarOpen((prevVal) => !prevVal);

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
          height,
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
