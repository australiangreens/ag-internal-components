import { useMediaQuery, useTheme } from '@mui/material';

export const useSmallScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};
