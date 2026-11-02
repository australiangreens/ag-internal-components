import type { BackendStatusReason } from './types';

export type BackendDownTechnicalDetails = {
  reason: string;
  name: string;
  message: string;
};

export type BackendDownDetails = {
  /** Plain-language explanation shown in the primary overlay body. */
  userMessage: string;
  /** Structured diagnostics for the secondary technical-details section. */
  technical: BackendDownTechnicalDetails;
  /** @deprecated Prefer `userMessage`. Kept for older call sites. */
  message: string;
  /** @deprecated Prefer `technical.name`. Kept for older call sites. */
  name: string;
};

function details(
  reason: string,
  name: string,
  userMessage: string,
  technicalMessage: string
): BackendDownDetails {
  return {
    userMessage,
    technical: { reason, name, message: technicalMessage },
    message: userMessage,
    name,
  };
}

/** Stable display details for a latched backendStatusAtom reason (no app error classes). */
export function detailsForBackendDownReason(reason: string): BackendDownDetails {
  switch (reason as BackendStatusReason) {
    case 'SERVER_UNCONTACTABLE':
      return details(
        'SERVER_UNCONTACTABLE',
        'ServerUncontactableError',
        'We cannot connect to the backend server right now. Please wait a minute while we try to reconnect.',
        'Unable to connect to the backend server'
      );
    case 'CIVI_CRM_UNCONTACTABLE':
      return details(
        'CIVI_CRM_UNCONTACTABLE',
        'CiviCrmUncontactableError',
        'We cannot connect to CiviCRM right now. Please wait a minute while we try to reconnect.',
        'The backend server is running, but is unable to contact CiviCRM'
      );
    case 'DATABASE_UNCONTACTABLE':
      return details(
        'DATABASE_UNCONTACTABLE',
        'DatabaseUncontactableError',
        'We cannot connect to the database right now. Please wait a minute while we try to reconnect.',
        'The backend server is running, but is unable to contact the database'
      );
    case 'REDIS_UNCONTACTABLE':
      return details(
        'REDIS_UNCONTACTABLE',
        'RedisConnectionError',
        'We cannot connect to Redis right now. Please wait a minute while we try to reconnect.',
        'The backend server is running, but is unable to contact Redis'
      );
    case 'UNKNOWN':
    default:
      return details(
        reason || 'UNKNOWN',
        'ServerUncontactableError',
        'Something went wrong contacting the application. Please wait a minute while we try to reconnect.',
        'Unknown issue'
      );
  }
}

/** Human-readable message for a latched backendStatusAtom reason. */
export function messageForBackendDownReason(reason: string): string {
  return detailsForBackendDownReason(reason).userMessage;
}
