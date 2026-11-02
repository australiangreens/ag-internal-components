import { atom, getDefaultStore } from 'jotai';

import { isDependencyDownReason } from './constants';
import type { BackendStatus } from './types';

export const backendStatusAtom = atom<BackendStatus>({
  status: '',
  reason: '',
});

export type MarkBackendUpOptions = {
  /** Clear a latched Redis outage after a Redis-proving authenticated success. */
  clearRedis?: boolean;
  /** Clear a latched Civi outage after a Civi-proving authenticated success. */
  clearCivi?: boolean;
};

/**
 * Clears app-unreachable / unknown DOWN states after a successful response.
 * Dependency outages stay latched by default so /hashz and unrelated successes
 * cannot dismiss Redis/Civi/DB overlays. Pass clearRedis / clearCivi from the
 * matching recovery path only.
 *
 * @returns true if status was cleared (or was not a latched dependency outage);
 *          false if a dependency outage remains latched.
 */
export function markBackendUp(options: MarkBackendUpOptions = {}): boolean {
  const current = getDefaultStore().get(backendStatusAtom);
  if (current.status === 'DOWN' && isDependencyDownReason(current.reason)) {
    if (options.clearRedis && current.reason === 'REDIS_UNCONTACTABLE') {
      getDefaultStore().set(backendStatusAtom, { status: 'UP', reason: '' });
      return true;
    }
    if (options.clearCivi && current.reason === 'CIVI_CRM_UNCONTACTABLE') {
      getDefaultStore().set(backendStatusAtom, { status: 'UP', reason: '' });
      return true;
    }
    return false;
  }
  getDefaultStore().set(backendStatusAtom, { status: 'UP', reason: '' });
  return true;
}

/**
 * Latch dependency outages: do not let a parallel network blip overwrite
 * CIVI/DB/Redis DOWN with UNKNOWN/SERVER_UNCONTACTABLE (that re-enables
 * health-probe auto-dismiss and makes the overlay flicker).
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
  getDefaultStore().set(backendStatusAtom, { status: 'DOWN', reason });
}
