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
  errorFromAuthorisationFailure,
  errorFromUserNotAuthorisingApp,
  isOAuthError,
} from './auth0ErrorParsing';

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
export default function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, error, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (isLoading || isAuthenticated || error) return;

    const options = {
      appState: {
        returnTo: `${window.location.pathname}${window.location.search}`,
      },
    };

    loginWithRedirect(options);
  }, [isLoading, isAuthenticated, error, loginWithRedirect]);

  if (error && isOAuthError(error)) {
    let title = 'Auth error';
    let message = 'An unknown Auth0 error occurred.';

    if (errorFromApplicationAccessRejection(error)) {
      title = 'Unauthorised';
      message = 'You are not authorised to access the app.';
    } else if (errorFromUserNotAuthorisingApp(error)) {
      title = 'App not authorised';
      message =
        'You have not authorised the application to access your user profile. This is necessary to use the app.';
    } else if (errorFromAuthorisationFailure(error)) {
      title = 'Unauthorised';
      message = 'Authorisation with auth0 failed for an unknown reason.';
    }

    return (
      <Dialog open>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Skeleton variant="rectangular" animation="pulse" height="100vh" width="100vw" />;
}
