import { act, renderHook } from '@testing-library/react';
import { capturePwaInstallPrompt, clearPwaInstallPrompt } from './pwaInstallPrompt';
import { DISMISSED_STORAGE_KEY, DISMISS_DAYS, usePwaInstall } from './usePwaInstall';

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

const setUserAgent = (ua: string) =>
  vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(ua);

const mockStandalone = (standalone: boolean) =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: standalone && query === '(display-mode: standalone)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList
  );

const fireBeforeInstallPrompt = () => {
  const prompt = vi.fn().mockResolvedValue(undefined);
  const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
    prompt,
    userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return { event, prompt };
};

describe('usePwaInstall', () => {
  beforeEach(() => {
    capturePwaInstallPrompt();
    localStorage.clear();
    setUserAgent(ANDROID_UA);
    mockStandalone(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    act(() => clearPwaInstallPrompt());
  });

  it('is "none" on a desktop-ish browser that has not offered an install prompt', () => {
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.mode).toBe('none');
  });

  it('is "prompt" once the browser fires beforeinstallprompt, and suppresses the mini-infobar', () => {
    const { result } = renderHook(() => usePwaInstall());
    const { event } = fireBeforeInstallPrompt();
    expect(event.defaultPrevented).toBe(true);
    expect(result.current.mode).toBe('prompt');
  });

  // Chrome fires beforeinstallprompt once, shortly after load. Apps call
  // capturePwaInstallPrompt() at startup because the hook may mount much later (for
  // example after Auth0 has finished), by which time the event has already gone.
  it('is "prompt" when the event fired before the hook mounted', () => {
    fireBeforeInstallPrompt();
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.mode).toBe('prompt');
  });

  it('triggers the native prompt and then hides the hint', async () => {
    const { result } = renderHook(() => usePwaInstall());
    const { prompt } = fireBeforeInstallPrompt();
    await act(async () => {
      await result.current.promptInstall();
    });
    expect(prompt).toHaveBeenCalledOnce();
    expect(result.current.mode).toBe('none');
  });

  it('is "ios" on iOS Safari when not installed', () => {
    setUserAgent(IPHONE_UA);
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.mode).toBe('ios');
  });

  it('is "none" when already running standalone', () => {
    setUserAgent(IPHONE_UA);
    mockStandalone(true);
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.mode).toBe('none');
  });

  it('is "none" after dismissal and remembers it', () => {
    setUserAgent(IPHONE_UA);
    const { result, unmount } = renderHook(() => usePwaInstall());
    act(() => result.current.dismiss());
    expect(result.current.mode).toBe('none');
    unmount();
    const { result: second } = renderHook(() => usePwaInstall());
    expect(second.current.mode).toBe('none');
  });

  it('shows again once the dismissal has expired', () => {
    setUserAgent(IPHONE_UA);
    const expired = Date.now() - (DISMISS_DAYS + 1) * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISSED_STORAGE_KEY, String(expired));
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.mode).toBe('ios');
  });

  it('still works when localStorage throws', () => {
    setUserAgent(IPHONE_UA);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.mode).toBe('ios');
    act(() => result.current.dismiss());
    expect(result.current.mode).toBe('none');
  });
});
