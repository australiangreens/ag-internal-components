import { useAuth0 } from '@auth0/auth0-react';
import AgDialog, { AgDialogButtonConfig } from '../AgDialog';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

// This gets the auth0 expiry value for a token. If the token cannot be
// parsed, then -1 is returned.
//
// The following code is from here (but has been updated to go from atob
// to Buffer.from).
//
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library#38552302
//
// Note: for confusion, the exp value is in seconds after the epoch:
// NumericDate
// A JSON numeric value representing the number of seconds from
// 1970-01-01T00:00:00Z UTC until the specified UTC date/time,
// ignoring leap seconds.  This is equivalent to the IEEE Std 1003.1,
// 2013 Edition [POSIX.1] definition "Seconds Since the Epoch", in
// which each day is accounted for by exactly 86400 seconds, other
// than that non-integer values can be represented.  See RFC 3339
// [RFC3339] for details regarding date/times in general and UTC in
// particular.
// https://www.rfc-editor.org/rfc/rfc7519#section-2
// To use with Date, multiply with 1000.

// A lot of the libraries that we expect in node are not available out
// of the box with vite, like Buffer. This is why we need to import it
// seperately. See:
// https://stackoverflow.com/questions/70714690/buffer-is-not-defined-in-react-vite

export const getAuth0Expiry = (token: string) => {
  if (!token) {
    return -1;
  }
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('utf8')
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const jsonParsedPayload = JSON.parse(jsonPayload);
    if (jsonParsedPayload?.exp) {
      return jsonParsedPayload.exp as number;
    }
    return -1;
  } catch (e) {
    return -1;
  }
};

export type SessionExpiryDialogProps = {
  open: boolean;
  closeHandler: () => void;
  setAuth0ExpiryTime: React.Dispatch<React.SetStateAction<number>>;
};

const SessionExpiryDialog = ({
  open = false,
  closeHandler,
  setAuth0ExpiryTime,
}: SessionExpiryDialogProps) => {
  const { logout, getAccessTokenSilently } = useAuth0();

  const [calledContinue, setCalledContinue] = useState(0);

  const handleDialogClose = async () => {
    logout({ logoutParams: { returnTo: `${window.location.origin}` } });
  };

  const handleDialogSuccess = async () => {
    setCalledContinue(calledContinue + 1);
    closeHandler();
  };

  useEffect(() => {
    const updateAuth0Expiry = async () => {
      if (calledContinue > 0) {
        const tokenSecond = await getAccessTokenSilently({ cacheMode: 'off' });
        const tokenExp = getAuth0Expiry(tokenSecond) * 1000;
        setAuth0ExpiryTime(tokenExp);
      }
    };

    updateAuth0Expiry();
  }, [calledContinue, getAccessTokenSilently, setAuth0ExpiryTime]);

  const successButtonConfig = {
    text: 'Continue',
    onClick: handleDialogSuccess,
    disabled: false,
    testId: 'PreferencesDialog',
    buttonColor: 'secondary',
  } as AgDialogButtonConfig;

  const cancelButtonConfig = {
    text: 'Log out',
    onClick: handleDialogClose,
    disabled: false,
    testId: 'PreferencesDialog',
    buttonColor: 'secondary',
  } as AgDialogButtonConfig;

  return (
    <AgDialog
      isOpen={open}
      primaryButton={successButtonConfig}
      secondaryButton={cancelButtonConfig}
      onClose={closeHandler}
      dialogTitle={'Session expiry'}
      disableCloseOnBackdropOrEscape
    >
      <p style={{ marginBottom: 0 }}>
        Your session is about to time out due to inactivity. Do you want to continue?
      </p>
    </AgDialog>
  );
};

export default SessionExpiryDialog;
