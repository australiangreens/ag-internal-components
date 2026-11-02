import { detailsForBackendDownReason, messageForBackendDownReason } from './messages';

describe('messageForBackendDownReason', () => {
  it('returns plain-language user messages for known reasons', () => {
    expect(messageForBackendDownReason('SERVER_UNCONTACTABLE')).toMatch(
      /cannot connect to the backend server/i
    );
    expect(messageForBackendDownReason('DATABASE_UNCONTACTABLE')).toMatch(
      /cannot connect to the database/i
    );
    expect(messageForBackendDownReason('CIVI_CRM_UNCONTACTABLE')).toMatch(
      /cannot connect to CiviCRM/i
    );
    expect(messageForBackendDownReason('REDIS_UNCONTACTABLE')).toMatch(
      /cannot connect to Redis/i
    );
  });

  it('returns a generic wait message for UNKNOWN and empty', () => {
    expect(messageForBackendDownReason('UNKNOWN')).toMatch(/Something went wrong/i);
    expect(messageForBackendDownReason('')).toMatch(/Something went wrong/i);
  });
});

describe('detailsForBackendDownReason', () => {
  it('exposes userMessage and structured technical details for each reason', () => {
    const database = detailsForBackendDownReason('DATABASE_UNCONTACTABLE');
    expect(database.userMessage).toMatch(/cannot connect to the database/i);
    expect(database.technical).toEqual({
      reason: 'DATABASE_UNCONTACTABLE',
      name: 'DatabaseUncontactableError',
      message: expect.stringMatching(/database/i),
    });
    expect(database.name).toBe('DatabaseUncontactableError');
    expect(database.message).toBe(database.userMessage);

    expect(detailsForBackendDownReason('CIVI_CRM_UNCONTACTABLE').technical.name).toBe(
      'CiviCrmUncontactableError'
    );
    expect(detailsForBackendDownReason('REDIS_UNCONTACTABLE').technical.name).toBe(
      'RedisConnectionError'
    );
    expect(detailsForBackendDownReason('UNKNOWN').technical).toEqual({
      reason: 'UNKNOWN',
      name: 'ServerUncontactableError',
      message: 'Unknown issue',
    });
  });
});
