import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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

  navBar: {
    backgroundColor: '#E8E8E8',
  },
});

export default theme;
