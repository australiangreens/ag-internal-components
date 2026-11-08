import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstallHint from './InstallHint';
import * as pwaInstall from './usePwaInstall';

const mockHook = (mode: pwaInstall.PwaInstallMode) => {
  const promptInstall = vi.fn();
  const dismiss = vi.fn();
  vi.spyOn(pwaInstall, 'usePwaInstall').mockReturnValue({ mode, promptInstall, dismiss });
  return { promptInstall, dismiss };
};

// MUI's useMediaQuery reads window.matchMedia. Every query gets the same answer, which is
// enough here: the only query InstallHint makes is the small-screen breakpoint.
const mockSmallScreen = (small: boolean) =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: small,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }) as unknown as MediaQueryList
  );

describe('InstallHint', () => {
  beforeEach(() => {
    mockSmallScreen(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when mode is none', () => {
    mockHook('none');
    const { container } = render(<InstallHint appName="Greens Events" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing on a large screen', () => {
    mockSmallScreen(false);
    mockHook('prompt');
    const { container } = render(<InstallHint appName="Greens Events" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('names the app and offers an Install button when the browser supports a native prompt', async () => {
    const { promptInstall } = mockHook('prompt');
    render(<InstallHint appName="Greens Events" />);
    expect(screen.getByText(/Install Greens Events/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Install' }));
    expect(promptInstall).toHaveBeenCalledOnce();
  });

  it('explains Add to Home Screen on iOS, with no Install button', () => {
    mockHook('ios');
    render(<InstallHint appName="Greens Events" />);
    expect(screen.getByText(/Install Greens Events/)).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Install' })).not.toBeInTheDocument();
  });

  it('can be dismissed', async () => {
    const { dismiss } = mockHook('ios');
    render(<InstallHint appName="Greens Events" />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(dismiss).toHaveBeenCalledOnce();
  });
});
