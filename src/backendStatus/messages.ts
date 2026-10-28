export type BackendDownDetails = {
  name: string;
  message: string;
};

/** Stable display details for a latched backendStatusAtom reason (no app error classes). */
export function detailsForBackendDownReason(reason: string): BackendDownDetails {
  switch (reason) {
    case 'SERVER_UNCONTACTABLE':
      return {
        name: 'ServerUncontactableError',
        message: 'Unable to contact the backend server',
      };
    case 'CIVI_CRM_UNCONTACTABLE':
      return {
        name: 'CiviCrmUncontactableError',
        message: 'The backend server is running, but is unable to contact CiviCRM',
      };
    case 'DATABASE_UNCONTACTABLE':
      return {
        name: 'DatabaseUncontactableError',
        message:
          'The backend server is running, but is unable to contact the database it needs to work.',
      };
    case 'UNKNOWN':
    default:
      return {
        name: 'ServerUncontactableError',
        message: 'Unknown issue',
      };
  }
}

/** Human-readable message for a latched backendStatusAtom reason. */
export function messageForBackendDownReason(reason: string): string {
  return detailsForBackendDownReason(reason).message;
}
