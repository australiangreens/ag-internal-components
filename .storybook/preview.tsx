import { ThemeProvider } from '@mui/material/styles';
import type { Preview } from '@storybook/react';

import { internalAgSystemsTheme } from '../src/themes';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={internalAgSystemsTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
