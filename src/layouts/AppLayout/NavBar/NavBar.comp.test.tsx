import { render, screen } from '@testing-library/react';

import NavBar from './NavBar';

const NAVBAR_TEST_ID = 'the-nav-bar';

const commonProps = {
  widthOpen: 256,
  widthClosed: 64,
  middle: <div>Nothing</div>,
};

const userWithPicture = {
  name: 'Rosio Cinelli',
  picture: 'https://www.rosiocinelli.com.au',
};

const userWithoutPicture = {
  name: 'Rosio Cinelli',
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

  it('Renders domain code when open', async () => {
    render(<NavBar {...commonProps} open={true} domainCode={'wa'} />);
    expect(screen.getByText('WA')).toBeVisible();
  });

  it('Does not show domain code when closed', async () => {
    render(<NavBar {...commonProps} open={false} />);
    expect(screen.queryByText('WA')).not.toBeInTheDocument();
  });

  it('Renders user as initials and name when open; user has no picture', async () => {
    render(<NavBar {...commonProps} open={true} user={userWithoutPicture} />);
    expect(screen.getByText('Rosio Cinelli')).toBeVisible();
    expect(screen.getByText('RC')).toBeVisible();
  });

  it('Renders user as initials (but not name) when closed; user has no picture', async () => {
    render(<NavBar {...commonProps} open={false} user={userWithoutPicture} />);
    expect(screen.getByText('RC')).toBeVisible();
    expect(screen.queryByText('Rosio Cinelli')).not.toBeInTheDocument();
  });

  it('Renders user as name but not initials when open; user has picture', async () => {
    render(<NavBar {...commonProps} open={true} user={userWithPicture} />);
    expect(screen.getByText('Rosio Cinelli')).toBeVisible();
    expect(screen.queryByText('RC')).not.toBeInTheDocument();
  });

  it('Renders user with neither name nor initials when closed; user has picture', async () => {
    render(<NavBar {...commonProps} open={false} user={userWithPicture} />);
    expect(screen.queryByText('RC')).not.toBeInTheDocument();
    expect(screen.queryByText('Rosio Cinelli')).not.toBeInTheDocument();
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
