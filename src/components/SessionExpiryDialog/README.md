# SessionExpiryDialog

## Purpose

This is used in React apps that utilise Auth0, and looks forward to when the
Auth0 token expires. If expiry time is in the *near* future, it presents a
dialog to the user with the message "Your session is about to time out due to
inactivity. Do you want to continue?" The user can then press "Continue" to
stay logged in, or "Log out" to log out. (Here, *near* can be anything that
the developer wants, such as "in five minute's time".)

## Usage

The `SessionExpiryDialog` component must be used within a `Auth0Provider` where
`useRefreshTokens` is `true` and `useRefreshTokensFallback` is also `true`.

The `SessionExpiryDialog` should also be used in a component which "polls" the
access token for the expiry time, and opens the dialog if that time is *near*
enough.

The `SessionExpiryDialog` takes three properties:

* `open`: a `boolean`; `true` to show the dialog, and `false` to hide it.
* `closeHandler`: a zero parameter method that you use to close the dialog.
* `setAuth0ExpiryTime`: a setter for a `useState` variable of type `number`.
  If the user presses "Continue", then the application refreshes the access
  token, and sets the new expiry time in the calling component. This time
  is a Unix timestamp indicating milliseconds since the epoch (January 1,
  1970 12:00:00 AM).

For example, here is some code that polls the expiry time every minute, and
open the dialog if it is five minutes in the future. The code uses
`getAuth0Expiry`, a method that takes a token as a string, and returns
the number of seconds since the 'epoch'.


```jsx
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { SessionExpiryDialog, getAuth0Expiry } from '@australiangreens/ag-internal-components';

const MINUTE_LENGTH = 60000; // In milliseconds.
const TIMEOUT_SHOW_DIALOG = 5 * 60 * 1000; // 5 minutes, in milliseconds.

...

function App() {

...

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin, audience: AUTH0_AUDIENCE }}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
    >

...

      <AppInsideAuth />

...

    </Auth0Provider>
  );
}


// This is basically a subapp of App that has access to things like getAccessTokenSilently and
// isAuthenticated and other Auth0 goodness accessible from useEffects. It was created for EVNT-17.

function AppInsideAuth() {
  const [auth0ExpiryTime, setAuth0ExpiryTime] = useState(defaultExpiryTime);
  const [showSessionExpiry, setShowSessionExpiry] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();


  useEffect(() => {
    const getTokenClaims = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const tokenExp = getAuth0Expiry(token) * 1000;
        setAuth0ExpiryTime(tokenExp);
      }
    };

    getTokenClaims();
  }, [getAccessTokenSilently, isAuthenticated, setAuth0ExpiryTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date().getTime();
      const leftOver = auth0ExpiryTime - currentDate;
      if (leftOver < TIMEOUT_SHOW_DIALOG) {
        setShowSessionExpiry(true);
      }
    }, MINUTE_LENGTH);
    return () => clearInterval(interval);
  }, [auth0ExpiryTime, setShowSessionExpiry]);

  return (
    <>

...

      <SessionExpiryDialog
        open={showSessionExpiry}
        setAuth0ExpiryTime={setAuth0ExpiryTime}
        closeHandler={() => {
          setShowSessionExpiry(false);
        }}
      />

...

    </>
  );
}



```

