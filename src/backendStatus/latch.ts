import { atom, getDefaultStore } from 'jotai';

import {
  isCiviUncontactableOverlayInCooldownoldown,
  isDependencyDownReason,
} from './constants';
import type { BackendStatus } from './types';

export const backendStatusAtom = atom<BackendStatus>({
  status: '',
  reason: '',
});

/**
 * Clears app-unreachable / unknown DOWN states after a successful response.
 * Civi/DB dependency outages stay latched until the user clicks "Try again" —
 * otherwise parallel successful non-Civi calls (or health probes) clear the overlay
 * while Civi is still failing and the dialog flickers.
 *
 * @returns true if status was cleared (or was not a latched dependency outage);
 *          false if a dependency outage remains latched.
 */
export function markBackendUp(): boolean {
  const current = getDefaultStore().get(backendStatusAtom);
  if (current.status === 'DOWN' && isDependencyDownReason(current.reason)) {
    return false;
  }
  getDefaultStore().set(backendStatusAtom, { status: 'UP', reason: '' });
  return true;
}

/**
 * Latch dependency outages: do not let a parallel network blip overwrite
 * CIVI/DB DOWN with UNKNOWN/SERVER_UNCONTACTABLE (that re-enables health-probe
 * auto-dismiss and makes the overlay flicker).
 *
 * Cooldown must not block latching CIVI/DB — only the overlay visibility
 * respects it. During Civi cooldown, ignore transient network downs so
 * health probes cannot start a show/hide loop after the user dismissed.
 */
export function setBackendDown(reason: BackendStatus['reason']) {
  const current = getDefaultStore().get(backendStatusAtom);
  if (
    current.status === 'DOWN' &&
    isDependencyDownReason(current.reason) &&
    !isDependencyDownReason(reason)
  ) {
    return;
  }
  if (!isDependencyDownReason(reason || '') && isCiviUncontactableOverlayInCooldownoldown()) {
    return;
  }
  getDefaultStore().set(backendStatusAtom, { status: 'DOWN', reason });
}
