export {
  default as BackendUnavailableOverlay,
  DEFAULT_BACKEND_UNAVAILABLE_TITLE,
} from './BackendUnavailableOverlay';
export type {
  BackendUnavailableOverlayProps,
  BackendUnavailableOverlayTechnicalDetails,
} from './BackendUnavailableOverlay';

export { default as ServerStatusErrorBoundary } from './ServerStatusErrorBoundary';

export {
  BACKEND_RECOVERY_POLL_MS,
  DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS,
  DEPENDENCY_DOWN_REASONS,
  isDependencyDownReason,
} from './constants';
export type { DependencyDownReason } from './constants';

export { detailsFromUnknown } from './detailsFromUnknown';

export { backendStatusAtom, markBackendUp, setBackendDown } from './latch';
export type { MarkBackendUpOptions } from './latch';

export { detailsForBackendDownReason, messageForBackendDownReason } from './messages';
export type { BackendDownDetails, BackendDownTechnicalDetails } from './messages';

export { BACKEND_STATUS_UP } from './types';
export type { BackendStatus, BackendStatusDetails, BackendStatusReason } from './types';
