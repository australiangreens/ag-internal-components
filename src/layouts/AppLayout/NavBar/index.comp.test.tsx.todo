import { wrap } from 'souvlaki';
import { render, screen } from '@testing-library/react';

import NavBar, { withNavBarProvider, NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from '.';

const NAVBAR_TEST_ID = 'the-nav-bar';

describe('NavBar', () => {
  it('Renders children', async () => {
    const Contents = () => <div>Hello this is the contents</div>;

    render(
      <NavBar>
        <Contents />
      </NavBar>,
      {
        wrapper: wrap(withNavBarProvider({ open: true })),
      }
    );

    expect(screen.getByText('Hello this is the contents')).toBeVisible();
  });

  it('has expected width when open', async () => {
    render(<NavBar data-testid={NAVBAR_TEST_ID} />, {
      wrapper: wrap(withNavBarProvider({ open: true })),
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
      wrapper: wrap(withNavBarProvider({ open: false })),
    });

    const navBar = screen.getByTestId(NAVBAR_TEST_ID);

    // Implementation detail, not sur ehow else to test this
    const muiDrawer = navBar.querySelector('.MuiDrawer-root');
    expect(muiDrawer).not.toBeNull();

    const computedStyle = window.getComputedStyle(muiDrawer as Element);

    expect(computedStyle.width).toEqual(`${NAVBAR_WIDTH_CLOSED}px`);
  });
});
