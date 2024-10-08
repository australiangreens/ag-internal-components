import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';

import NavBar, { NAVBAR_WIDTH_CLOSED, NAVBAR_WIDTH_OPENED, withNavBarProvider } from './NavBar';

const NAVBAR_TEST_ID = 'the-nav-bar';

describe('NavBar', () => {
  it('Renders children', async () => {
    const Contents = () => <div>Hello this is the contents</div>;

    render(
      <NavBar>
        <Contents />
      </NavBar>,
      {
        wrapper: wrap(withNavBarProvider({ open: true })) as React.FC,
      }
    );

    expect(screen.getByText('Hello this is the contents')).toBeVisible();
  });

  it('has expected width when open', async () => {
    render(<NavBar data-testid={NAVBAR_TEST_ID} />, {
      wrapper: wrap(withNavBarProvider({ open: true })) as React.FC,
    });

    const navBar = screen.getByTestId(NAVBAR_TEST_ID);

    // Not an ideal way of testing this, very implementation oriented
    const muiDrawer = navBar.querySelector('.MuiDrawer-root');
    expect(muiDrawer).not.toBeNull();

    const computedStyle = window.getComputedStyle(muiDrawer as Element);

    expect(computedStyle.width).toEqual(`${NAVBAR_WIDTH_OPENED}px`);
  });

  it('has expected width when closed', async () => {
    render(<NavBar data-testid={NAVBAR_TEST_ID} />, {
      wrapper: wrap(withNavBarProvider({ open: false })) as React.FC,
    });

    const navBar = screen.getByTestId(NAVBAR_TEST_ID);

    // Implementation detail, not sur ehow else to test this
    const muiDrawer = navBar.querySelector('.MuiDrawer-root');
    expect(muiDrawer).not.toBeNull();

    const computedStyle = window.getComputedStyle(muiDrawer as Element);

    expect(computedStyle.width).toEqual(`${NAVBAR_WIDTH_CLOSED}px`);
  });
});
