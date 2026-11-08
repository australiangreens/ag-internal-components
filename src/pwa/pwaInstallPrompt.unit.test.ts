import { act, renderHook } from '@testing-library/react';
import {
  capturePwaInstallPrompt,
  clearPwaInstallPrompt,
  usePwaInstallPromptEvent,
} from './pwaInstallPrompt';

const fireBeforeInstallPrompt = () => {
  const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
    prompt: vi.fn().mockResolvedValue(undefined),
    userChoice: Promise.resolve({ outcome: 'accepted' as const }),
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
};

describe('pwaInstallPrompt', () => {
  beforeEach(() => {
    capturePwaInstallPrompt();
  });

  afterEach(() => {
    act(() => clearPwaInstallPrompt());
  });

  it('holds the event so a hook that mounts later still gets it', () => {
    const event = fireBeforeInstallPrompt();
    const { result } = renderHook(() => usePwaInstallPromptEvent());
    expect(result.current).toBe(event);
  });

  it('prevents the default mini-infobar', () => {
    expect(fireBeforeInstallPrompt().defaultPrevented).toBe(true);
  });

  it('is safe to call more than once: one event is stored once, not handled repeatedly', () => {
    capturePwaInstallPrompt();
    capturePwaInstallPrompt();
    const addSpy = vi.spyOn(window, 'addEventListener');
    capturePwaInstallPrompt();
    expect(addSpy).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });

  it('clears the held event once the browser reports the app installed', () => {
    fireBeforeInstallPrompt();
    const { result } = renderHook(() => usePwaInstallPromptEvent());
    expect(result.current).not.toBeNull();
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });
    expect(result.current).toBeNull();
  });

  it('can be cleared explicitly', () => {
    fireBeforeInstallPrompt();
    const { result } = renderHook(() => usePwaInstallPromptEvent());
    act(() => clearPwaInstallPrompt());
    expect(result.current).toBeNull();
  });
});
