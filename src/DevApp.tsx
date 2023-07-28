import { ThemeProvider } from '@mui/material/styles';

import { internalAgSystemsTheme } from './themes';
import { SaladBarProvider } from '.';
import DevDemo from './DevDemo';

export default function DevApp() {
  return (
    <ThemeProvider theme={internalAgSystemsTheme}>
      <SaladBarProvider>
        <DevDemo />
      </SaladBarProvider>
    </ThemeProvider>
  );
}
