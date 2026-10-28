import { getDefaultStore } from 'jotai';

import {
  isCiviUncontactableOverlayInCooldownoldown,
  markCiviUncontactableOverlayShown,
  resetCiviUncontactableOverlayCooldown,
} from './constants';
import { backendStatusAtom, markBackendUp, setBackendDown } from './latch';

describe('backend status latch helpers', () => {
  beforeEach(() => {
    resetCiviUncontactableOverlayCooldown();
    getDefaultStore().set(backendStatusAtom, { status: '', reason: '' });
  });

  it('setBackendDown latches DOWN with the given reason', () => {
    setBackendDown('SERVER_UNCONTACTABLE');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'SERVER_UNCONTACTABLE',
    });
  });

  it('markBackendUp clears a non-dependency outage', () => {
    setBackendDown('UNKNOWN');
    markBackendUp();
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({ status: 'UP', reason: '' });
  });

  it('markBackendUp does not clear a latched Civi outage', () => {
    setBackendDown('CIVI_CRM_UNCONTACTABLE');
    markBackendUp();
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('markBackendUp does not clear a latched database outage', () => {
    setBackendDown('DATABASE_UNCONTACTABLE');
    markBackendUp();
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'DATABASE_UNCONTACTABLE',
    });
  });

  it('does not let a network failure overwrite a latched Civi outage', () => {
    setBackendDown('CIVI_CRM_UNCONTACTABLE');
    setBackendDown('UNKNOWN');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('still latches Civi DOWN during overlay cooldown', () => {
    markCiviUncontactableOverlayShown(Date.now());
    expect(isCiviUncontactableOverlayInCooldownoldown()).toBe(true);

    setBackendDown('CIVI_CRM_UNCONTACTABLE');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('ignores transient network downs during Civi overlay cooldown', () => {
    markCiviUncontactableOverlayShown(Date.now());
    setBackendDown('UNKNOWN');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({ status: '', reason: '' });
  });
});
