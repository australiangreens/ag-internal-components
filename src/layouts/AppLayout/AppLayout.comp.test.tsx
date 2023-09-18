import { Button } from '@mui/material';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config as reactTransitionGroupConfig } from 'react-transition-group';

import { useSetAtom } from 'jotai';
import AppLayout, { titleTextAtom, topBarMiddleAtom } from '.';

reactTransitionGroupConfig.disabled = true;

const ChildPageComponent1 = () => {
  const setTitleText = useSetAtom(titleTextAtom);

  return (
    <>
      <Button onClick={() => setTitleText('New title text')}>Change title</Button>
      <p>Some content on the page yay!</p>
    </>
  );
};

const ChildPageComponent2 = () => {
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);

  return <Button onClick={() => setTopBarMiddle(<div>New content</div>)}>Change middle</Button>;
};

describe('AppLayout', () => {
  it('Visible title changes with titleTextAtom', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout
        navBarMiddle={<div>Nothing</div>}
        navBarBottom={<div>Nothing</div>}
        topBarDataTestId="topBar"
      >
        <ChildPageComponent1 />
      </AppLayout>
    );

    const withinTopBar = within(screen.getByTestId('topBar'));
    expect(screen.getByText('Some content on the page yay!')).toBeInTheDocument();
    expect(withinTopBar.queryByText('New title text')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Change title' }));

    expect(withinTopBar.queryByText('New title text')).toBeVisible();
  });

  it('Visible top bar middle changes with topBarMiddleAtom', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout
        navBarMiddle={<div>Nothing</div>}
        navBarBottom={<div>Nothing</div>}
        topBarDataTestId="topBar"
      >
        <ChildPageComponent2 />
      </AppLayout>
    );

    const withinTopBar = within(screen.getByTestId('topBar'));
    expect(withinTopBar.queryByText('New content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Change middle' }));

    expect(withinTopBar.queryByText('New content')).toBeVisible();
  });
});
