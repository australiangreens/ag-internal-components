import { ViewHeadline as HamburgerIcon } from '@mui/icons-material';
import { IconButton, Paper, Typography, useTheme } from '@mui/material';

import { useSetAtom } from 'jotai';
import { ReactNode } from 'react';
import { useSmallScreen } from './mobile';
import { navBarOpenAtom } from './stateAtoms';

const PREFIX = 'TopBar';

export interface TopBarProps {
  titleText?: string;

  /**
   * The contents to be displayed to the right of the titleText, left aligned to
   * the starting position of the navbar. There is no right content, so at the
   * moment it fills up the remaining space
   */
  middle?: ReactNode;

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
export default function TopBar({
  titleText = '',
  height,
  'data-testid': dataTestId,
  middle,
}: TopBarProps) {
  const setNavBarOpen = useSetAtom(navBarOpenAtom);

  const toggleNavBar = () => setNavBarOpen((prevVal) => !prevVal);
  const theme = useTheme();
  const isSmallScreen = useSmallScreen();
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
          zIndex: isSmallScreen ? 0 : theme.zIndex.drawer + 1,
        }}
      >
        <IconButton
          size="medium"
          color="inherit"
          sx={{ padding: 1.5, marginLeft: '12px' }}
          onClick={toggleNavBar}
        >
          <HamburgerIcon fontSize="medium" />
        </IconButton>
        <Typography className={classes.titleText} variant="h6" component="h1">
          {titleText}
        </Typography>

        {middle}
      </Paper>
    </header>
  );
}
