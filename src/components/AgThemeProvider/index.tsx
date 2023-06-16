import { PropsWithChildren } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import { internalAGSystemsTheme, fed21Theme } from './themes';

export type AgThemeName = 'internal' | 'fed21';

export interface AgThemeProviderProps {
  name?: AgThemeName;
}

export default function AgThemeProvider({
  name = 'internal',
  children,
}: PropsWithChildren<AgThemeProviderProps>) {
  const theme =
    name === 'internal' ? internalAGSystemsTheme : name === 'fed21' ? fed21Theme : undefined;

  // Should be resolved when we move to React >= 18
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
