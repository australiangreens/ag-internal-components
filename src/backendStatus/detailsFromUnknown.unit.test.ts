import { detailsFromUnknown } from './detailsFromUnknown';

describe('detailsFromUnknown', () => {
  it('returns undefined when no source is provided', () => {
    expect(detailsFromUnknown('SERVER_UNCONTACTABLE')).toBeUndefined();
    expect(detailsFromUnknown('SERVER_UNCONTACTABLE', null)).toBeUndefined();
  });

  it('maps an Error to name and message with the latched reason', () => {
    const error = new Error('socket hang up');
    error.name = 'ServerUncontactableError';
    expect(detailsFromUnknown('SERVER_UNCONTACTABLE', error)).toEqual({
      reason: 'SERVER_UNCONTACTABLE',
      name: 'ServerUncontactableError',
      message: 'socket hang up',
    });
  });

  it('maps a plain string to a generic Error name', () => {
    expect(detailsFromUnknown('REDIS_UNCONTACTABLE', 'redis timeout')).toEqual({
      reason: 'REDIS_UNCONTACTABLE',
      name: 'Error',
      message: 'redis timeout',
    });
  });

  it('keeps extra string fields from a details-like object', () => {
    expect(
      detailsFromUnknown('CIVI_CRM_UNCONTACTABLE', {
        name: 'CiviCrmUncontactableError',
        message: '503 from Civi',
        code: 'CIVI_503',
      })
    ).toEqual({
      reason: 'CIVI_CRM_UNCONTACTABLE',
      name: 'CiviCrmUncontactableError',
      message: '503 from Civi',
      code: 'CIVI_503',
    });
  });
});
