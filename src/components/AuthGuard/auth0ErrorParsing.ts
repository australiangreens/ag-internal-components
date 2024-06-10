import { OAuthError } from '@auth0/auth0-react';

/**
 * instanceof OAuthError doesn't work in for whatever useAuth0 hook returns, so
 * we use duck typing guard. There are other specified properties too, but only error
 * seems to be guaranteed
 */
export function isOAuthError(error: Error): error is OAuthError {
  return 'error' in error;
}

/**
 * Will only return true if the error looks like it was caused by our custom
 * Application-Access and Role-Based-Application-Access actions in the login
 * flow of auth0 tenant. See README.md for detail
 */
export function errorFromApplicationAccessRejection(errorObject: OAuthError) {
  const error = errorObject.error;
  const errorDescription = errorObject?.error_description ?? '';

  return (
    error === 'access_denied' &&
    errorDescription.startsWith('You do not have the required authorization')
  );
}

/**
 * Will only return true if the error looks like it was caused by a user not
 * granting the application access to their profile in the tenant when asked on
 * first login.
 */
export function errorFromUserNotAuthorisingApp(errorObject: OAuthError) {
  const error = errorObject.error;
  const errorDescription = errorObject?.error_description ?? '';

  return (
    error === 'access_denied' && errorDescription.startsWith('User did not authorize the request')
  );
}

/**
 * Will only return true if the error looks like it was due to script execution
 * time issue. Specifically, the execution of custom actions in the login flow
 * exceeded the time limit (20s at time of writing). Mostly likely issues
 * syncing user data with AG internal systems.
 */
export function errorFromScriptExecutionTimeout(errorObject: OAuthError) {
  const error = errorObject.error;
  const errorDescription = errorObject?.error_description ?? '';

  return error === 'access_denied' && errorDescription.match(/Script.*time.*exceeded/);
}
