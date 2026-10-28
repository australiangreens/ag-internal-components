/**
 * DOWN reasons that mean the app backend itself is reachable but a dependency is not.
 * These stay latched until the user dismisses the overlay — auto-clearing on
 * health probes or other successful non-dependency calls causes irritating flicker.
 */
export const DEPENDENCY_DOWN_REASONS = [
  'CIVI_CRM_UNCONTACTABLE',
  'DATABASE_UNCONTACTABLE',
] as const;

export type DependencyDownReason = (typeof DEPENDENCY_DOWN_REASONS)[number];

export function isDependencyDownReason(reason: string): reason is DependencyDownReason {
  return (DEPENDENCY_DOWN_REASONS as readonly string[]).includes(reason);
}

/** Delay before showing the overlay for dependency outages (avoids one-frame flashes). */
export const DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS = 400;

/**
 * Minimum time between showing the CiviCRM-uncontactable dialog.
 * Does not apply when the app backend itself is unreachable.
 */
export const CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS = 60_000;

/** How often the overlay probes backend health while open for non-dependency downs. */
export const BACKEND_RECOVERY_POLL_MS = 4000;

let lastCiviUncontactableOverlayShownAtMs = 0;

/** True if we should not open the Civi overlay again yet. */
export function isCiviUncontactableOverlayInCooldownoldown(nowMs: number = Date.now()): boolean {
  return msUntilCiviUncontactableOverlayCooldownEnds(nowMs) > 0;
}

/** Milliseconds left before the Civi overlay may be shown again (0 if allowed now). */
export function msUntilCiviUncontactableOverlayCooldownEnds(nowMs: number = Date.now()): number {
  if (lastCiviUncontactableOverlayShownAtMs === 0) return 0;
  const elapsed = nowMs - lastCiviUncontactableOverlayShownAtMs;
  if (elapsed >= CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS) return 0;
  return CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS - elapsed;
}

/** Record that the Civi-uncontactable overlay was shown (starts the 1-minute gap). */
export function markCiviUncontactableOverlayShown(nowMs: number = Date.now()): void {
  lastCiviUncontactableOverlayShownAtMs = nowMs;
}

/** Test helper — reset cooldown between tests. */
export function resetCiviUncontactableOverlayCooldown(): void {
  lastCiviUncontactableOverlayShownAtMs = 0;
}
