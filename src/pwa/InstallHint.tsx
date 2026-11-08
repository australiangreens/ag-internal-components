import IosShareIcon from '@mui/icons-material/IosShare';
import { Alert, Button, useMediaQuery, useTheme } from '@mui/material';
import { usePwaInstall } from './usePwaInstall';

export type InstallHintProps = {
  /** Shown in the message, for example "Greens Events". */
  appName: string;
};

/**
 * Mobile-only banner nudging users to install the app to their home screen. Offers the
 * native install prompt where the browser has one, and Add to Home Screen instructions on
 * iOS. Dismissal is remembered for 30 days.
 *
 * Call `capturePwaInstallPrompt()` from the app's entry point so the browser's one-off
 * install event is not missed.
 */
const InstallHint = ({ appName }: InstallHintProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode, promptInstall, dismiss } = usePwaInstall();

  if (!isSmallScreen || mode === 'none') return null;

  return (
    <Alert
      icon={false}
      severity="info"
      variant="filled"
      sx={{
        position: 'fixed',
        left: 8,
        right: 8,
        // Clear the iOS home indicator in standalone/cover viewports.
        bottom: 'calc(8px + env(safe-area-inset-bottom))',
        zIndex: (t) => t.zIndex.snackbar,
        alignItems: 'center',
      }}
      action={
        <>
          {mode === 'prompt' && (
            <Button color="inherit" size="small" onClick={() => void promptInstall()}>
              Install
            </Button>
          )}
          <Button color="inherit" size="small" onClick={dismiss}>
            Dismiss
          </Button>
        </>
      }
    >
      {mode === 'prompt' ? (
        `Install ${appName} on your device for quick access.`
      ) : (
        <>
          Install {appName}: tap{' '}
          <IosShareIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} /> then
          &ldquo;Add to Home Screen&rdquo;.
        </>
      )}
    </Alert>
  );
};

export default InstallHint;
