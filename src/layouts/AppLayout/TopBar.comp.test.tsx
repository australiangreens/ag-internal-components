import { render, screen } from '@testing-library/react';

import TopBar from './TopBar';
import { DEFAULT_TOP_BAR_HEIGHT } from './defaults';

describe('TopBar', () => {
  beforeEach(() => {});

  it('Should show the provided titleText', async () => {
    render(
      <TopBar
        height={DEFAULT_TOP_BAR_HEIGHT}
        titleText="The quick brown FOX JuMped Over the lazy dog"
      />
    );

    expect(screen.getByText('The quick brown FOX JuMped Over the lazy dog')).toBeInTheDocument();
  });

  it('Should have default aria-label on the menu button', () => {
    render(<TopBar height={DEFAULT_TOP_BAR_HEIGHT} titleText="Test" />);

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
  });

  it('Should use custom menuButtonAriaLabel when provided', () => {
    render(
      <TopBar
        height={DEFAULT_TOP_BAR_HEIGHT}
        titleText="Test"
        menuButtonAriaLabel="Toggle sidebar"
      />
    );

    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toBeInTheDocument();
  });
});
