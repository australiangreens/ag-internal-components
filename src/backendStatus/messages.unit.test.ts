import { detailsForBackendDownReason, messageForBackendDownReason } from './messages';

describe('messageForBackendDownReason', () => {
  it('returns human-readable messages for known reasons', () => {
    expect(messageForBackendDownReason('SERVER_UNCONTACTABLE')).toBe(
      'Unable to contact the backend server'
    );
    expect(messageForBackendDownReason('DATABASE_UNCONTACTABLE')).toMatch(/database/i);
    expect(messageForBackendDownReason('CIVI_CRM_UNCONTACTABLE')).toMatch(/CiviCRM/);
  });

  it('returns Unknown issue for UNKNOWN and empty', () => {
    expect(messageForBackendDownReason('UNKNOWN')).toBe('Unknown issue');
    expect(messageForBackendDownReason('')).toBe('Unknown issue');
  });
});

describe('detailsForBackendDownReason', () => {
  it('exposes a stable error name for each reason', () => {
    expect(detailsForBackendDownReason('DATABASE_UNCONTACTABLE').name).toBe(
      'DatabaseUncontactableError'
    );
    expect(detailsForBackendDownReason('CIVI_CRM_UNCONTACTABLE').name).toBe(
      'CiviCrmUncontactableError'
    );
    expect(detailsForBackendDownReason('UNKNOWN').name).toBe('ServerUncontactableError');
  });
});
