import { Alert, AlertTitle, Box, Button, Modal, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  BACKEND_RECOVERY_POLL_MS,
  DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS,
  isDependencyDownReason,
  markCiviUncontactableOverlayShown,
  msUntilCiviUncontactableOverlayCooldownEnds,
} from './constants';
import { backendStatusAtom } from './latch';
import { detailsForBackendDownReason } from './messages';

/**
 * Matches MUI Alert root horizontal padding (`padding: '6px 16px'`).
 * Used as the white dialog's inset so space outside the red alert equals
 * the space from alert text to the alert border.
 */
const DIALOG_INSET_PX = 16;

export type BackendUnavailableOverlayProps = {
  /** App-owned health check (e.g. GET /hashz). Called while the overlay is open for non-dependency downs. */
  probeHealth: () => Promise<unknown>;
  /** Called after the overlay clears status (user dismiss or successful probe). Typically invalidateQueries. */
  onRecover?: () => void;
};

/**
 * Blocking overlay shown while backendStatusAtom is DOWN. Keeps the current page
 * visible underneath (dimmed) so users do not think their work disappeared.
 */
export default function BackendUnavailableOverlay({
  probeHealth,
  onRecover,
}: BackendUnavailableOverlayProps) {
  const [backendStatus, setBackendStatus] = useAtom(backendStatusAtom);
  const isDown = backendStatus.status === 'DOWN';
  const isDependencyDown = isDependencyDownReason(backendStatus.reason);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const dismiss = useCallback(() => {
    // Explicit clear — dependency outages are latched against automatic markBackendUp.
    setBackendStatus({ status: 'UP', reason: '' });
    onRecover?.();
  }, [setBackendStatus, onRecover]);

  useEffect(() => {
    if (!isDown) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync visibility when backend recovers / user dismisses
      setIsOverlayVisible(false);
      return undefined;
    }
    if (!isDependencyDown) {
      setIsOverlayVisible(true);
      return undefined;
    }
    // Debounce blips; also wait out the Civi 1-minute gap so dismiss → retry
    // does not immediately re-open the dialog (status stays latched meanwhile).
    const cooldownRemaining =
      backendStatus.reason === 'CIVI_CRM_UNCONTACTABLE'
        ? msUntilCiviUncontactableOverlayCooldownEnds()
        : 0;
    const delayMs = Math.max(DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS, cooldownRemaining);
    const timeoutId = window.setTimeout(() => {
      setIsOverlayVisible(true);
      if (backendStatus.reason === 'CIVI_CRM_UNCONTACTABLE') {
        markCiviUncontactableOverlayShown();
      }
    }, delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [isDown, isDependencyDown, backendStatus.reason]);

  useEffect(() => {
    // App health probes do not prove Civi/DB are back — probing would flicker.
    if (!isDown || isDependencyDown) return undefined;

    let cancelled = false;

    const probe = async () => {
      try {
        await probeHealth();
        if (!cancelled) dismiss();
      } catch {
        // Backend still down — keep polling.
      }
    };

    void probe();
    const intervalId = window.setInterval(probe, BACKEND_RECOVERY_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isDown, isDependencyDown, dismiss, probeHealth]);

  const details = useMemo(
    () => detailsForBackendDownReason(backendStatus.reason),
    [backendStatus.reason]
  );

  return (
    <Modal
      open={isOverlayVisible}
      onClose={(_event, reason) => {
        // Only dismiss via the button or auto-recover — not backdrop/Escape.
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
      }}
      aria-labelledby="backend-unavailable-title"
      aria-describedby="backend-unavailable-description"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
        },
      }}
    >
      <Box
        sx={{
          outline: 'none',
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          p: 2,
        }}
      >
        <Box
          sx={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 720,
            bgcolor: 'common.white',
            borderRadius: 1,
            boxShadow: 24,
            p: `${DIALOG_INSET_PX}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: `${DIALOG_INSET_PX}px`,
          }}
        >
          <Alert severity="error" variant="outlined">
            <AlertTitle id="backend-unavailable-title">
              An error has occurred in the application
            </AlertTitle>
            <Box id="backend-unavailable-description" sx={{ overflowWrap: 'anywhere' }}>
              <Typography>{details.message}</Typography>
              <br />
              <Typography variant="subtitle2">Details</Typography>
              <Typography variant="body2">name = {details.name}</Typography>
              <Typography variant="body2">message = {details.message}</Typography>
            </Box>
          </Alert>
          <Button variant="contained" type="button" onClick={dismiss}>
            Click here to try again
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
