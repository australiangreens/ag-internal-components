import { alpha, createTheme } from '@mui/material/styles';

export const internalAGSystemsTheme = createTheme({
  palette: {
    primary: {
      main: '#007236',
      dark: '#005221',
      light: '#00A04E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#662D91',
      dark: '#440E62',
      light: '#93268F',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      dark: '#C62828',
      light: '#EF5350',
    },
    info: {
      main: '#0288D1',
      dark: '#01579B',
      light: '#03A9F4',
    },
    success: {
      main: '#0288D1',
      dark: '#01579B',
      light: '#03A9F4',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: { color: 'secondary' },
    },
    MuiToggleButtonGroup: {
      defaultProps: { color: 'secondary' },
    },
    MuiCheckbox: {
      defaultProps: { color: 'secondary' },
    },
    MuiSelect: {
      defaultProps: { color: 'secondary' },
    },
    MuiSwitch: {
      defaultProps: { color: 'secondary' },
    },
    MuiFormControl: {
      defaultProps: { color: 'secondary' },
    },
    MuiMenuItem: {
      // Setting defaultProps for color on MenuItem does not work, so update manually
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-selected': {
            backgroundColor: alpha(
              theme.palette.secondary.main,
              theme.palette.action.selectedOpacity
            ),
            '&:hover': {
              backgroundColor: alpha(
                theme.palette.secondary.main,
                theme.palette.action.selectedOpacity
              ),
            },
            '&.Mui-focusVisible': {
              backgroundColor: alpha(
                theme.palette.secondary.main,
                theme.palette.action.focusOpacity
              ),
            },
          },
        }),
      },
    },
  },
  typography: {
    // I couldn't think of what to call this. It is an attempt to match
    // https://www.figma.com/file/atonRPl2YD9A1NCntbDtKR/List-Filter-and-Product-Concept?node-id=1187%3A43730
    // but not sure if line height should be changed
    explainer: {
      fontSize: '14px',
      marginBlockStart: '1em',
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 700,
    },
  },
});

export const fed21Theme = createTheme({
  palette: {
    primary: {
      dark: '#00A651',
      light: '#A3D39C',
      main: '#007236',
      contrastText: '#FFF',
    },
    warning: {
      main: '#F5871F',
      light: '#FCC589',
      dark: '#A2590A',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#662D91',
      light: '#BD8CBF',
      dark: '#440E62',
      contrastText: '#FFF',
    },
    error: {
      main: '#D43C95',
      light: '#8F2064',
      dark: '#F9CDE0',
      contrastText: '#FFF',
    },
    info: {
      main: '#00A88D',
      light: '#ADDCCF',
      dark: '#005243',
      contrastText: '#FFF',
    },
    success: {
      main: '#00A651',
      light: '#A3D39C',
      dark: '#007236',
      contrastText: '#FFF',
    },
  },
  typography: {
    // I couldn't think of what to call this. It is an attempt to match
    // https://www.figma.com/file/atonRPl2YD9A1NCntbDtKR/List-Filter-and-Product-Concept?node-id=1187%3A43730
    // but not sure if line height should be changed
    explainer: {
      fontSize: '14px',
      marginBlockStart: '1em',
    },
  },
});
