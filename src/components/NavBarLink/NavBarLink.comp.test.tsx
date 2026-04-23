import { Home as HomeIcon } from '@mui/icons-material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, createStore } from 'jotai';
import { config as reactTransitionGroupConfig } from 'react-transition-group';
import { MemoryRouter } from 'react-router';

import { navBarOpenAtom } from '../../layouts/AppLayout/stateAtoms';

vi.mock('../../layouts/AppLayout/mobile', () => ({
  useSmallScreen: vi.fn(),
}));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return {
    ...actual,
    Tooltip: ({
      title,
      children,
    }: {
      title?: unknown;
      children: React.ReactNode;
    }) => <div data-tooltip-title={String(title ?? '')}>{children}</div>,
  };
});

import { useSmallScreen } from '../../layouts/AppLayout/mobile';
import NavBarLink from '.';

reactTransitionGroupConfig.disabled = true;

type RenderOpts = {
  pathname?: string;
  navBarOpen?: boolean;
  smallScreen?: boolean;
};

const renderNavBarLink = (
  props: React.ComponentProps<typeof NavBarLink>,
  { pathname = '/', navBarOpen = true, smallScreen = false }: RenderOpts = {}
) => {
  vi.mocked(useSmallScreen).mockReturnValue(smallScreen);

  const store = createStore();
  store.set(navBarOpenAtom, navBarOpen);

  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[pathname]}>
        <NavBarLink {...props} />
      </MemoryRouter>
    </Provider>
  );

  const tooltipWrapper = result.container.querySelector('[data-tooltip-title]');
  if (!tooltipWrapper) {
    throw new Error('Expected Tooltip wrapper to exist');
  }

  return { ...result, tooltipWrapper, store };
};

describe('NavBarLink', () => {
  it('sets selected on root and submenu items based on pathname', async () => {
    renderNavBarLink(
      {
        label: 'Root',
        to: '/root',
        icon: <HomeIcon />,
        subMenu: [
          { label: 'Sub1', to: '/sub1' },
          { label: 'Sub2', to: '/sub2' },
        ],
        subMenuInitialOpen: true,
      },
      { pathname: '/sub2', navBarOpen: true }
    );

    const root = screen.getByLabelText('Root');
    expect(root).not.toHaveClass('Mui-selected');

    const sub2Button = screen.getByText('Sub2').closest('button,a');
    const sub1Button = screen.getByText('Sub1').closest('button,a');
    expect(sub2Button).not.toBeNull();
    expect(sub1Button).not.toBeNull();
    expect(sub2Button as Element).toHaveClass('Mui-selected');
    expect(sub1Button as Element).not.toHaveClass('Mui-selected');
  });

  it('toggles submenu on root click when navbar is open and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderNavBarLink({
      label: 'Root',
      to: '/root',
      icon: <HomeIcon />,
      onClick,
      subMenu: [{ label: 'Sub1', to: '/sub1' }],
      subMenuInitialOpen: false,
    });

    expect(screen.queryByText('Sub1')).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Root'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByText('Sub1')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Root'));
    expect(screen.queryByText('Sub1')).not.toBeInTheDocument();
  });

  it('closes navbar on root click when closeOnSmallScreen=true and small screen', async () => {
    const user = userEvent.setup();

    const { store } = renderNavBarLink(
      {
        label: 'Root',
        to: '/root',
        icon: <HomeIcon />,
        closeOnSmallScreen: true,
      },
      { navBarOpen: true, smallScreen: true }
    );

    expect(store.get(navBarOpenAtom)).toBe(true);
    await user.click(screen.getByLabelText('Root'));
    expect(store.get(navBarOpenAtom)).toBe(false);
  });

  it('opens navbar and submenu when navbar is closed and submenu exists', async () => {
    const user = userEvent.setup();

    const { store } = renderNavBarLink(
      {
        label: 'Root',
        to: '/root',
        icon: <HomeIcon />,
        subMenu: [{ label: 'Sub1', to: '/sub1' }],
        subMenuInitialOpen: false,
      },
      { navBarOpen: false }
    );

    expect(store.get(navBarOpenAtom)).toBe(false);
    expect(screen.queryByText('Sub1')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Root'));

    expect(store.get(navBarOpenAtom)).toBe(true);
    expect(screen.getByText('Sub1')).toBeInTheDocument();
  });

  it('does not open navbar when navbar is closed and there is no submenu (but calls onClick)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { store } = renderNavBarLink(
      {
        label: 'Root',
        to: '/root',
        icon: <HomeIcon />,
        onClick,
      },
      { navBarOpen: false }
    );

    expect(store.get(navBarOpenAtom)).toBe(false);
    await user.click(screen.getByLabelText('Root'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(store.get(navBarOpenAtom)).toBe(false);
  });

  it('calls submenu item onClick and closes navbar on small screen when configured', async () => {
    const user = userEvent.setup();
    const subClick = vi.fn();

    const { store } = renderNavBarLink(
      {
        label: 'Root',
        to: '/root',
        icon: <HomeIcon />,
        subMenu: [{ label: 'Sub1', onClick: subClick, closeOnSmallScreen: true }],
        subMenuInitialOpen: true,
      },
      { navBarOpen: true, smallScreen: true }
    );

    expect(store.get(navBarOpenAtom)).toBe(true);
    await user.click(screen.getByText('Sub1'));
    expect(subClick).toHaveBeenCalledOnce();
    expect(store.get(navBarOpenAtom)).toBe(false);
  });

  it('resolves tooltip title with correct precedence', async () => {
    const { tooltipWrapper, rerender } = renderNavBarLink(
      {
        label: 'Root',
        to: '/root',
        icon: <HomeIcon />,
        tooltipMenuOpen: 'OpenTip',
        tooltipMenuClosed: 'ClosedTip',
      },
      { navBarOpen: true }
    );

    expect(tooltipWrapper).toHaveAttribute('data-tooltip-title', 'OpenTip');

    const storeClosed = createStore();
    storeClosed.set(navBarOpenAtom, false);

    rerender(
      <Provider store={storeClosed}>
        <MemoryRouter initialEntries={['/']}>
          <NavBarLink
            label="Root"
            to="/root"
            icon={<HomeIcon />}
            tooltipMenuOpen="OpenTip"
            tooltipMenuClosed="ClosedTip"
          />
        </MemoryRouter>
      </Provider>
    );

    const wrapper2 = tooltipWrapper.parentElement?.querySelector('[data-tooltip-title]');
    expect(wrapper2).not.toBeNull();
    expect(wrapper2 as Element).toHaveAttribute('data-tooltip-title', 'ClosedTip');

    const storeOpen = createStore();
    storeOpen.set(navBarOpenAtom, true);

    rerender(
      <Provider store={storeOpen}>
        <MemoryRouter initialEntries={['/']}>
          <NavBarLink
            label="Root"
            to="/root"
            icon={<HomeIcon />}
            tooltip="DirectTip"
            tooltipMenuOpen="OpenTip"
            tooltipMenuClosed="ClosedTip"
          />
        </MemoryRouter>
      </Provider>
    );

    const wrapper3 = tooltipWrapper.parentElement?.querySelector('[data-tooltip-title]');
    expect(wrapper3).not.toBeNull();
    expect(wrapper3 as Element).toHaveAttribute('data-tooltip-title', 'DirectTip');
  });

  it('adds new-window props when openInNewWindow=true', async () => {
    renderNavBarLink({
      label: 'Root',
      to: '/root',
      icon: <HomeIcon />,
      openInNewWindow: true,
    });

    const root = screen.getByLabelText('Root');
    expect(root).toHaveAttribute('target', '_blank');
    expect(root).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('prefixes submenu label with NBSP indentation when extraSubIndentSpace > 0', async () => {
    renderNavBarLink({
      label: 'Root',
      to: '/root',
      icon: <HomeIcon />,
      subMenu: [{ label: 'Sub1', to: '/sub1' }],
      subMenuInitialOpen: true,
      extraSubIndentSpace: 2,
    });

    const text = screen.getByText('Sub1').textContent ?? '';
    const nbspCount = Array.from(text).filter((c) => c === '\u00a0').length;
    expect(nbspCount).toBeGreaterThanOrEqual(2);
  });

  it('remounts inner component when subMenuInitialOpen changes, resetting menuOpen', async () => {
    const user = userEvent.setup();

    const { rerender } = renderNavBarLink({
      label: 'Root',
      to: '/root',
      icon: <HomeIcon />,
      subMenu: [{ label: 'Sub1', to: '/sub1' }],
      subMenuInitialOpen: false,
    });

    expect(screen.queryByText('Sub1')).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Root'));
    expect(screen.getByText('Sub1')).toBeInTheDocument();

    const store = createStore();
    store.set(navBarOpenAtom, true);

    rerender(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <NavBarLink
            label="Root"
            to="/root"
            icon={<HomeIcon />}
            subMenu={[{ label: 'Sub1', to: '/sub1' }]}
            subMenuInitialOpen={undefined}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Sub1')).not.toBeInTheDocument();
  });
});

