import { useCallback, useEffect, useState } from 'react';
import {
  capturePwaInstallPrompt,
  clearPwaInstallPrompt,
  usePwaInstallPromptEvent,
} from './pwaInstallPrompt';

export const DISMISSED_STORAGE_KEY = 'pwaInstallHintDismissedAt';
export const DISMISS_DAYS = 30;

export type PwaInstallMode =
  /** Nothing to show: already installed, dismissed, or not installable. */
  | 'none'
  /** Browser offered a native install prompt (Chromium/Android). */
  | 'prompt'
  /** iOS: no prompt exists, the user must use Share, then Add to Home Screen. */
  | 'ios';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () =>
  /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
  // iPadOS reports a desktop Mac user agent
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

// Storage can throw (private mode, blocked site data), so never let it break the hint.
const readDismissedAt = (): number | undefined => {
  try {
    const raw = localStorage.getItem(DISMISSED_STORAGE_KEY);
    return raw ? Number(raw) : undefined;
  } catch {
    return undefined;
  }
};

const isDismissalActive = () => {
  const dismissedAt = readDismissedAt();
  return (
    dismissedAt !== undefined &&
    !Number.isNaN(dismissedAt) &&
    Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000
  );
};

/**
 * What, if anything, to tell the user about installing the app. For the native prompt to be
 * available, call `capturePwaInstallPrompt()` at app startup: this hook calls it too, but
 * by the time it mounts the browser's one-off event may already have fired.
 */
export const usePwaInstall = () => {
  const installEvent = usePwaInstallPromptEvent();
  const [hidden, setHidden] = useState(() => isStandalone() || isDismissalActive());

  useEffect(() => {
    capturePwaInstallPrompt();
    const onInstalled = () => setHidden(true);
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, String(Date.now()));
    } catch {
      // Dismissal just won't persist across sessions.
    }
    setHidden(true);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    // The event is single-use whatever the outcome.
    clearPwaInstallPrompt();
    setHidden(true);
  }, [installEvent]);

  let mode: PwaInstallMode = 'none';
  if (!hidden) {
    if (installEvent) mode = 'prompt';
    else if (isIos()) mode = 'ios';
  }

  return { mode, promptInstall, dismiss };
};
