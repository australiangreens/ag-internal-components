import { render, screen } from '@testing-library/react';

import NavBar from '.';

const NAVBAR_TEST_ID = 'the-nav-bar';

const commonProps = {
  widthOpen: 256,
  widthClosed: 64,
  middle: <div>Nothing</div>,
};

describe('NavBar', () => {
  it('Renders middle content', async () => {
    render(
      <NavBar {...commonProps} open={true} middle={<div>Hello this is the middle</div>}></NavBar>
    );

    expect(screen.getByText('Hello this is the middle')).toBeVisible();
  });

  it('Renders top content', async () => {
    render(<NavBar {...commonProps} open={true} top={<div>Some top stuff</div>}></NavBar>);

    expect(screen.getByText('Some top stuff')).toBeVisible();
  });

  it('Renders bottom content', async () => {
    render(<NavBar {...commonProps} open={true} top={<div>Down the bottom we go!</div>}></NavBar>);

    expect(screen.getByText('Down the bottom we go!')).toBeVisible();
  });

  it('has expected width when open', async () => {
    render(<NavBar {...commonProps} open={true} data-testid={NAVBAR_TEST_ID} widthOpen={642} />);

    const navBar = screen.getByTestId(NAVBAR_TEST_ID);

    // Not an ideal way of testing this...
    const muiDrawer = navBar.querySelector('.MuiDrawer-root');
    expect(muiDrawer).not.toBeNull();

    const computedStyle = window.getComputedStyle(muiDrawer as Element);

    expect(computedStyle.width).toEqual(`${642}px`);
  });

  it('has expected width when closed', async () => {
    render(<NavBar {...commonProps} open={false} data-testid={NAVBAR_TEST_ID} widthClosed={42} />);

    const navBar = screen.getByTestId(NAVBAR_TEST_ID);

    const muiDrawer = navBar.querySelector('.MuiDrawer-root');
    expect(muiDrawer).not.toBeNull();

    const computedStyle = window.getComputedStyle(muiDrawer as Element);

    expect(computedStyle.width).toEqual(`${42}px`);
  });
});
