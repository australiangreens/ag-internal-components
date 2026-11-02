/**
 * DOWN reasons that mean the app backend itself is reachable but a dependency is not.
 * These stay latched against default markBackendUp / /hashz probes — otherwise
 * parallel successful non-dependency calls clear the overlay while the dependency
 * is still failing.
 */
export const DEPENDENCY_DOWN_REASONS = [
  'CIVI_CRM_UNCONTACTABLE',
  'DATABASE_UNCONTACTABLE',
  'REDIS_UNCONTACTABLE',
] as const;

export type DependencyDownReason = (typeof DEPENDENCY_DOWN_REASONS)[number];

export function isDependencyDownReason(reason: string): reason is DependencyDownReason {
  return (DEPENDENCY_DOWN_REASONS as readonly string[]).includes(reason);
}

/** Delay before showing the overlay for any DOWN reason (avoids one-frame flashes). */
export const DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS = 400;

/**
 * How often apps / the overlay retry recovery while an outage is open.
 * Shared by backend /hashz probes, Redis invalidate polls, and Civi probes.
 */
export const BACKEND_RECOVERY_POLL_MS = 10_000;
