import React from 'react';
import type { Preview } from '@storybook/react';

import AgTheme from '../src/providers/AgTheme';

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
      <AgTheme>
        <Story />
      </AgTheme>
    ),
  ],
};

export default preview;
