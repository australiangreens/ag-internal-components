import type { Meta, StoryObj } from '@storybook/react-vite';

import ExampleComponent from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  // title: 'ExampleComponent',
  component: ExampleComponent,
  tags: ['autodocs'],
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} satisfies Meta<typeof ExampleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FunText: Story = {
  args: {
    text: 'Fun! 😀',
  },
};

export const NotFunText: Story = {
  args: {
    text: 'Not fun 🙁',
  },
};
