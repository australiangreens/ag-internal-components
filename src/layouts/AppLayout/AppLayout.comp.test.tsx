import { render, screen, within } from '@testing-library/react';
import { Button } from '@mui/material';
import { config as reactTransitionGroupConfig } from 'react-transition-group';
import userEvent from '@testing-library/user-event';

import AppLayout, { useAppLayout } from './index';

reactTransitionGroupConfig.disabled = true;

const ChildPageComponent = () => {
  const { setTitleText } = useAppLayout();

  return (
    <>
      <Button onClick={() => setTitleText('New title text')}>Change title</Button>
      <p>Some content on the page yay!</p>
    </>
  );
};

describe('AppLayout', () => {
  it('useAppLayout().setTitleText() causes title to update', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout navBarMiddle={<div>Nothing</div>} topBarDataTestId="topBar">
        <ChildPageComponent />
      </AppLayout>
    );

    const withinTopBar = within(screen.getByTestId('topBar'));
    expect(screen.getByText('Some content on the page yay!')).toBeInTheDocument();
    expect(withinTopBar.queryByText('New title text')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Change title' }));

    expect(withinTopBar.queryByText('New title text')).toBeVisible();
  });
});
