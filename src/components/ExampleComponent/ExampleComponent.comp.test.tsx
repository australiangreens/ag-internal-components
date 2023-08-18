import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ExampleComponent from './ExampleComponent';

describe('ExampleComponent', () => {
  it('renders prop', () => {
    render(<ExampleComponent text="Hello this is some Text" />);

    expect(screen.getByText('Hello this is some Text')).toBeInTheDocument();
  });

  it('increments counter when button clicked', async () => {
    render(<ExampleComponent text="Hello this is some Text" />);
    const user = userEvent.setup();

    expect(
      screen.getByText('This number will incremember when button pressed: 0')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(
      screen.getByText('This number will incremember when button pressed: 1')
    ).toBeInTheDocument();
  });
});
