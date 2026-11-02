export type BackendStatusReason =
  | 'UNKNOWN'
  | 'SERVER_UNCONTACTABLE'
  | 'CIVI_CRM_UNCONTACTABLE'
  | 'DATABASE_UNCONTACTABLE'
  | 'REDIS_UNCONTACTABLE'
  | '';

/**
 * Structured diagnostics stored on a DOWN latch (shown in overlay technical details).
 * Always includes the latched reason plus error name/message when known.
 */
export type BackendStatusDetails = {
  reason: string;
  name: string;
  message: string;
} & Record<string, string>;

export type BackendStatus = {
  status: 'UP' | 'DOWN' | '';
  reason: BackendStatusReason;
  /** Present only while DOWN when a call site passed thrown-error diagnostics. */
  details?: BackendStatusDetails;
};

export const BACKEND_STATUS_UP: BackendStatus = { status: 'UP', reason: '' };
