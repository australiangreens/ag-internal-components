import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { PropsWithChildren, useEffect } from 'react';

import {
  errorFromApplicationAccessRejection,
  errorFromScriptExecutionTimeout,
  errorFromUserNotAuthorisingApp,
  isOAuthError,
} from './auth0ErrorParsing';

export interface AuthGuardProps {
  appName?: string;

  /** Defaults to 'unknown'. If set to 'all', will always re-throw the error, so
   * won't display the normal message to user and be handled elsewhere in the
   * app. If set to 'unknown', this will only be done if the failure reason
   * couldn't be inferred from the error description etc or if its a completely
   * unknown error without a description etc.*/
  throwErrors?: 'none' | 'unknown' | 'all';

  /** Called in case of an authentication error, regardless of if its recognised
   * or not */
  onError?: (error: Error) => void;

  disableConsoleLogging?: boolean;
  withPopup?: boolean;
}

/**
 * Use as parent of main app (but within Auth0Provider) so when an anonymous
 * user visits the will be redirected to the login page and returned to the page
 * they we're redirected from after login.
 *
 * This is similar to the withAuthenticationRequired HOC from Auth0, which
 * operates on a per-route basis.
 *
 * This component is also responsible for detecting an an authorisation error
 * that is triggered by one of our rules defined for our Auth0 tenant
 *
 * Do not use this if any routes need to be accessible to anonymous users.
 */
export default function AuthGuard({
  children,
  appName = 'the app',
  throwErrors = 'none',
  disableConsoleLogging = false,
  onError = () => {},
  withPopup = false,
}: PropsWithChildren<AuthGuardProps>) {
  const { isAuthenticated, isLoading, error, loginWithRedirect, loginWithPopup, logout } =
    useAuth0();

  // Wrapped in a useEffect to avoid re-renders doubling it up
  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  useEffect(() => {
    if (isLoading || isAuthenticated || error) return;

    const options = {
      appState: {
        returnTo: `${window.location.pathname}${window.location.search}`,
      },
    };

    if (withPopup) {
      const popupButton = document.createElement('button');
      popupButton.onclick = () => loginWithPopup();
      popupButton.click();
      popupButton.remove();
    } else loginWithRedirect(options);
  }, [isLoading, isAuthenticated, error, loginWithRedirect, onError, withPopup, loginWithPopup]);

  if (error) {
    if (!disableConsoleLogging) {
      console.error(
        `Error detected in AuthGuard [isAuthenticated=${isAuthenticated},isLoading=${isLoading}]`,
        error
      );
    }

    if (throwErrors === 'all') {
      throw error;
    } else if (isOAuthError(error)) {
      let title = 'Auth error';
      let message = 'An unknown Auth0 error occurred.';

      if (errorFromApplicationAccessRejection(error)) {
        title = 'Unauthorised';
        message = `You are not authorised to access ${appName}.`;
      } else if (errorFromUserNotAuthorisingApp(error)) {
        title = 'App not authorised';
        message = `You have not authorised ${appName} to access your user profile. This is necessary to use ${appName}.`;
      } else if (errorFromScriptExecutionTimeout(error)) {
        title = 'Auth0 script execution time exceeded';
        message = `The Auth0 login flow exceeded the time limit (20s). Try again in a minute.`;
      } else {
        if (throwErrors === 'unknown') throw error;
      }

      return (
        <Dialog open>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Typography>{message}</Typography>
            <br />
            <Typography variant="subtitle2">Details from Auth0</Typography>
            <Typography variant="body2">error: {error?.error ?? 'N/A'}</Typography>
            <Typography variant="body2">
              description: {error?.error_description ?? 'N/A'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      if (throwErrors === 'unknown') throw error;
    }
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Skeleton variant="rectangular" animation="pulse" height="100vh" width="100vw" />;
}
