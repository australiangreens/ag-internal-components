import { Button } from '@mui/material';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config as reactTransitionGroupConfig } from 'react-transition-group';

import { useSetAtom } from 'jotai';
import AppLayout, { titleTextAtom } from '.';

reactTransitionGroupConfig.disabled = true;

const ChildPageComponent = () => {
  const setTitleText = useSetAtom(titleTextAtom);

  return (
    <>
      <Button onClick={() => setTitleText('New title text')}>Change title</Button>
      <p>Some content on the page yay!</p>
    </>
  );
};

describe('AppLayout', () => {
  it('Visible title changes with titleTextAtom', async () => {
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
