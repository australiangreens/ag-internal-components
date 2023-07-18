import type { StorybookConfig } from '@storybook/react-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    // The following 6 addons are included by default as part of
    // @storybook/addon-essentials. However the only way to configure any of
    // them is to list them all individually
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-docs',
      options: {
        // https://tinytip.co/tips/storybook-import-markdown/
        transcludeMarkdown: true
      }
    },
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-toolbars',

    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
