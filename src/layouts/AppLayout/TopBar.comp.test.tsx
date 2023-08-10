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
});
