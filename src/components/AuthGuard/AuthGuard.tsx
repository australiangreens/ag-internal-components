import { AppState, RedirectLoginOptions, useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { PropsWithChildren, useEffect, useMemo } from 'react';

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
}: PropsWithChildren<AuthGuardProps>) {
  const { isAuthenticated, isLoading, error, loginWithRedirect, logout } = useAuth0();

  // Wrapped in a useEffect to avoid re-renders doubling it up
  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  const options: RedirectLoginOptions<AppState> = useMemo(
    () => ({
      appState: {
        returnTo: `${window.location.pathname}${window.location.search}`,
      },
    }),
    []
  );
  useEffect(() => {
    if (isLoading || isAuthenticated || error) return;

    loginWithRedirect(options);
  }, [isLoading, isAuthenticated, error, loginWithRedirect, onError, options]);

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
        message = `The Auth0 login flow exceeded the time limit (20s). Try again in a minute by clicking the RELOAD button below.`;
      } else if (error.message === 'Invalid state') {
        const redirectCount = localStorage.getItem('auth0_redirect_count');
        if (!redirectCount) {
          localStorage.setItem('auth0_redirect_count', '1');
          loginWithRedirect(options);
        } else if (redirectCount && parseInt(redirectCount) < 2) {
          localStorage.setItem('auth0_redirect_count', String(parseInt(redirectCount) + 1));
          loginWithRedirect(options);
        }
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
            {title === 'Auth0 script execution time exceeded' && (
              <Button href={window.location.origin + window.location.pathname}>Reload</Button>
            )}
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
    localStorage.removeItem('auth0_redirect_count');
    return <>{children}</>;
  }

  return <Skeleton variant="rectangular" animation="pulse" height="100vh" width="100vw" />;
}
