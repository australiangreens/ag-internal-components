import type { ErrorEvent, EventHint } from '@sentry/react';

/**
 * Checks whether an error is an Auth0 OAuthError with a specific error code.
 * Auth0's OAuthError shape has an `error` string property (the OAuth2 error
 * code) in addition to the standard Error properties.
 */
function isAuth0ErrorWithCode(error: unknown, code: string): boolean {
  return (
    error != null &&
    typeof error === 'object' &&
    'error' in error &&
    (error as Record<string, unknown>).error === code
  );
}

/**
 * Sentry beforeSend callback that filters out expected Auth0 errors which are
 * already handled by AuthGuard (e.g. by redirecting to login).
 *
 * The Auth0 SPA SDK can emit unhandled promise rejections for errors that
 * AuthGuard subsequently handles through the React context. These show up in
 * Sentry via the global onunhandledrejection handler but are not actionable.
 *
 * See: LISTMANAGER-FRONTEND-Y2
 */
export function sentryBeforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  const error = hint?.originalException;

  // Auth0 emits "login_required" as an unhandled rejection when a user's
  // session has expired. AuthGuard handles this by redirecting to login.
  if (isAuth0ErrorWithCode(error, 'login_required')) {
    return null;
  }

  return event;
}
