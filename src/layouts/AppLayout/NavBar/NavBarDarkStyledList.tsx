import { styled } from '@mui/material/styles';
import List, { ListProps } from '@mui/material/List';

const SELECTED_INDICATOR_WIDTH = 7;

export const NavBarDarkStyledList = styled(List)<ListProps>(({ theme }) => ({
  backgroundColor: 'black',
  color: 'white',

  '& .MuiListItem-root': {
    padding: 'unset',
  },

  '& .MuiListItemButton-root': {
    ' .MuiListItemIcon-root': {
      color: 'white',
      padding: `${SELECTED_INDICATOR_WIDTH}px`,
    },

    // Focus state
    '&.Mui-focusVisible': {
      backgroundColor: theme.palette.grey[700],
    },

    // Selected state
    '&.Mui-selected': {
      borderLeftStyle: 'solid',
      borderLeftWidth: '7px',
      borderLeftColor: theme.palette.primary.main,
      paddingLeft: `calc(${theme.spacing(2)} - ${SELECTED_INDICATOR_WIDTH}px)`,
    },

    // Hover state
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },

    // Focus+Selected state
    '&.Mui-selected.Mui-focusVisible': {
      backgroundColor: theme.palette.grey[700],
    },

    // Hover+Selected state
    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.dark,
    },

    // Focus+Hover+Selected state doesn't need to be specified
    // '&.Mui-selected.Mui-focusVisible:hover': {
    // },
  },
})) as typeof List;
