import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';

import TopBar from './TopBar';
import { withAppLayout } from './testWrappers';

describe('TopBar', () => {
  beforeEach(() => {});

  it('Should show the provided titleText', async () => {
    render(<TopBar titleText="The quick brown FOX JuMped Over the lazy dog" />, {
      wrapper: wrap(withAppLayout()),
    });

    expect(screen.getByText('The quick brown FOX JuMped Over the lazy dog')).toBeInTheDocument();
  });
});
