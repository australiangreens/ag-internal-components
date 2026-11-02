import { getDefaultStore } from 'jotai';

import { backendStatusAtom, markBackendUp, setBackendDown } from './latch';

describe('backend status latch helpers', () => {
  beforeEach(() => {
    getDefaultStore().set(backendStatusAtom, { status: '', reason: '' });
  });

  it('setBackendDown latches DOWN with the given reason', () => {
    setBackendDown('SERVER_UNCONTACTABLE');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'SERVER_UNCONTACTABLE',
    });
  });

  it('setBackendDown stores technical details from a thrown Error', () => {
    const error = new Error('ECONNREFUSED');
    error.name = 'ServerUncontactableError';
    setBackendDown('SERVER_UNCONTACTABLE', error);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'SERVER_UNCONTACTABLE',
      details: {
        reason: 'SERVER_UNCONTACTABLE',
        name: 'ServerUncontactableError',
        message: 'ECONNREFUSED',
      },
    });
  });

  it('setBackendDown without details clears stale details from a prior outage', () => {
    setBackendDown('SERVER_UNCONTACTABLE', new Error('old'));
    setBackendDown('UNKNOWN');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'UNKNOWN',
    });
    expect(getDefaultStore().get(backendStatusAtom).details).toBeUndefined();
  });

  it('markBackendUp clears a non-dependency outage and returns true', () => {
    setBackendDown('UNKNOWN', new Error('boom'));
    expect(markBackendUp()).toBe(true);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({ status: 'UP', reason: '' });
    expect(getDefaultStore().get(backendStatusAtom).details).toBeUndefined();
  });

  it('markBackendUp does not clear a latched Civi outage and returns false', () => {
    setBackendDown('CIVI_CRM_UNCONTACTABLE');
    expect(markBackendUp()).toBe(false);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('markBackendUp clears Civi when clearCivi is set', () => {
    setBackendDown('CIVI_CRM_UNCONTACTABLE', new Error('civi down'));
    expect(markBackendUp({ clearCivi: true })).toBe(true);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({ status: 'UP', reason: '' });
  });

  it('markBackendUp does not clear a latched database outage and returns false', () => {
    setBackendDown('DATABASE_UNCONTACTABLE');
    expect(markBackendUp()).toBe(false);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'DATABASE_UNCONTACTABLE',
    });
  });

  it('markBackendUp does not clear a latched Redis outage and returns false', () => {
    setBackendDown('REDIS_UNCONTACTABLE');
    expect(markBackendUp()).toBe(false);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'REDIS_UNCONTACTABLE',
    });
  });

  it('markBackendUp clears Redis when clearRedis is set', () => {
    setBackendDown('REDIS_UNCONTACTABLE');
    expect(markBackendUp({ clearRedis: true })).toBe(true);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({ status: 'UP', reason: '' });
  });

  it('clearRedis does not clear a Civi outage', () => {
    setBackendDown('CIVI_CRM_UNCONTACTABLE');
    expect(markBackendUp({ clearRedis: true })).toBe(false);
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('does not let a network failure overwrite a latched Civi outage or its details', () => {
    setBackendDown('CIVI_CRM_UNCONTACTABLE', new Error('civi'));
    setBackendDown('UNKNOWN', new Error('network'));
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
      details: {
        reason: 'CIVI_CRM_UNCONTACTABLE',
        name: 'Error',
        message: 'civi',
      },
    });
  });

  it('does not let a network failure overwrite a latched Redis outage', () => {
    setBackendDown('REDIS_UNCONTACTABLE');
    setBackendDown('SERVER_UNCONTACTABLE');
    expect(getDefaultStore().get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'REDIS_UNCONTACTABLE',
    });
  });
});
