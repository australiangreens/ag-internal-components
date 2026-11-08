import { useSyncExternalStore } from 'react';

// Not in lib.dom.ts: non-standard but shipped by Chromium.
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listening = false;
const subscribers = new Set<() => void>();

const setDeferredPrompt = (event: BeforeInstallPromptEvent | null) => {
  deferredPrompt = event;
  subscribers.forEach((notify) => notify());
};

/** Forget the held event, for example after it has been used (it is single-use). */
export const clearPwaInstallPrompt = () => setDeferredPrompt(null);

/**
 * Start holding the browser's `beforeinstallprompt` event. Call this once, as early as
 * possible, from the app's entry point (`main.tsx`).
 *
 * Chrome fires the event once, shortly after page load, and never replays it. If the first
 * thing to listen is a component that only mounts later (after Auth0 has finished, say),
 * the event is already gone. Safe to call more than once.
 */
export const capturePwaInstallPrompt = () => {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('beforeinstallprompt', (event) => {
    // Suppress Chrome's own mini-infobar; the app shows its own hint.
    event.preventDefault();
    setDeferredPrompt(event as BeforeInstallPromptEvent);
  });
  window.addEventListener('appinstalled', clearPwaInstallPrompt);
};

const subscribe = (notify: () => void) => {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
};

/** The held `beforeinstallprompt` event, or `null`. */
export const usePwaInstallPromptEvent = () =>
  useSyncExternalStore(subscribe, () => deferredPrompt);
