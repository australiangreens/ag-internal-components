import { render, screen } from '@testing-library/react';
import TopBar from './TopBar';

describe('TopBar', () => {
  beforeEach(() => {});

  it('Should show the provided titleText', async () => {
    render(<TopBar titleText="The quick brown FOX JuMped Over the lazy dog" />, {});

    expect(screen.getByText('The quick brown FOX JuMped Over the lazy dog')).toBeInTheDocument();
  });
});
