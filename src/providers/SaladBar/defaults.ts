// The default props passed to the underlying Snackbar component
import { SnackbarOrigin } from '@mui/material/Snackbar';

export const defaultSnackbarProps = {
  autoHideDuration: 6000,
  anchorOrigin: { vertical: 'top', horizontal: 'center' } as SnackbarOrigin,

  // The default is false. If we prefer timer to continue when window loses
  // focus, change to true
  disableWindowBlurListener: false,
};

export const defaultEnqueueNotificationOptions = {
  message: '',
  severity: 'info',
  variant: 'standard',
  progressIndicator: undefined, // Can use 'circular' or 'linear'
};
