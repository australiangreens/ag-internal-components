import { Alert, AlertTitle, Box, Button, Modal, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  BACKEND_RECOVERY_POLL_MS,
  DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS,
  isDependencyDownReason,
} from './constants';
import { backendStatusAtom } from './latch';
import { detailsForBackendDownReason } from './messages';
import { BACKEND_STATUS_UP, type BackendStatusReason } from './types';

/**
 * Matches MUI Alert root horizontal padding (`padding: '6px 16px'`).
 * Used as the white dialog's inset so space outside the red alert equals
 * the space from alert text to the alert border.
 */
const DIALOG_INSET_PX = 16;

export const DEFAULT_BACKEND_UNAVAILABLE_TITLE =
  'An error has occurred in the application';

export type BackendUnavailableOverlayTechnicalDetails =
  | string
  | Record<string, string>;

export type BackendUnavailableOverlayProps = {
  /** App-owned health check (e.g. GET /hashz). Called while the overlay is open for non-dependency downs. */
  probeHealth: () => Promise<unknown>;
  /** Called after the overlay clears status (user dismiss or successful probe). Typically invalidateQueries. */
  onRecover?: () => void;
  /** Replaces the default alert title for the current outage. */
  title?: string | ((reason: BackendStatusReason) => string);
  /** Replaces the default plain-language message for the current outage. */
  userMessage?: string | ((reason: BackendStatusReason) => string);
  /** Replaces the default technical-details block for the current outage. */
  technicalDetails?:
    | BackendUnavailableOverlayTechnicalDetails
    | ((reason: BackendStatusReason) => BackendUnavailableOverlayTechnicalDetails);
};

function resolveOverride<T>(
  override: T | ((reason: BackendStatusReason) => T) | undefined,
  reason: BackendStatusReason
): T | undefined {
  if (override === undefined) return undefined;
  return typeof override === 'function'
    ? (override as (reason: BackendStatusReason) => T)(reason)
    : override;
}

function technicalEntries(
  technical: BackendUnavailableOverlayTechnicalDetails
): Array<[string, string]> {
  if (typeof technical === 'string') {
    return [['details', technical]];
  }
  return Object.entries(technical);
}

/**
 * Blocking overlay shown while backendStatusAtom is DOWN. Keeps the current page
 * visible underneath (dimmed) so users do not think their work disappeared.
 */
export default function BackendUnavailableOverlay({
  probeHealth,
  onRecover,
  title: titleOverride,
  userMessage: userMessageOverride,
  technicalDetails: technicalDetailsOverride,
}: BackendUnavailableOverlayProps) {
  const [backendStatus, setBackendStatus] = useAtom(backendStatusAtom);
  const isDown = backendStatus.status === 'DOWN';
  const isDependencyDown = isDependencyDownReason(backendStatus.reason);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const dismiss = useCallback(() => {
    // Explicit clear — dependency outages are latched against automatic markBackendUp.
    setBackendStatus(BACKEND_STATUS_UP);
    onRecover?.();
  }, [setBackendStatus, onRecover]);

  useEffect(() => {
    if (!isDown) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync visibility when backend recovers / user dismisses
      setIsOverlayVisible(false);
      return undefined;
    }
    const timeoutId = window.setTimeout(() => {
      setIsOverlayVisible(true);
    }, DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isDown, backendStatus.reason]);

  useEffect(() => {
    // App health probes do not prove Redis/Civi/DB are back — apps own those polls.
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

  const defaults = useMemo(
    () => detailsForBackendDownReason(backendStatus.reason),
    [backendStatus.reason]
  );

  const title =
    resolveOverride(titleOverride, backendStatus.reason) ?? DEFAULT_BACKEND_UNAVAILABLE_TITLE;

  const userMessage =
    resolveOverride(userMessageOverride, backendStatus.reason) ?? defaults.userMessage;

  const technical =
    resolveOverride(technicalDetailsOverride, backendStatus.reason) ??
    backendStatus.details ??
    defaults.technical;

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
            <AlertTitle id="backend-unavailable-title">{title}</AlertTitle>
            <Box id="backend-unavailable-description" sx={{ overflowWrap: 'anywhere' }}>
              <Typography>{userMessage}</Typography>
              <Box
                component="details"
                sx={{ mt: 1.5 }}
                data-testid="backend-unavailable-technical-details"
              >
                <Box
                  component="summary"
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Typography variant="subtitle2" component="span">
                    Technical details
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  {technicalEntries(technical).map(([key, value]) => (
                    <Typography variant="body2" key={key}>
                      {key} = {value}
                    </Typography>
                  ))}
                </Box>
              </Box>
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
