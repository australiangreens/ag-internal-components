export type BackendStatusReason =
  | 'UNKNOWN'
  | 'SERVER_UNCONTACTABLE'
  | 'CIVI_CRM_UNCONTACTABLE'
  | 'DATABASE_UNCONTACTABLE'
  | '';

export type BackendStatus = {
  status: 'UP' | 'DOWN' | '';
  reason: BackendStatusReason;
};
