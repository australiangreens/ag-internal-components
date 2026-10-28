import { Box, Button, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import {
  BackendUnavailableOverlay,
  backendStatusAtom,
  markBackendUp,
  navBarTopAtom,
  ServerStatusErrorBoundary,
  setBackendDown,
  topBarMiddleAtom,
  type BackendStatusReason,
} from 'ag-internal-components';

function ThrowCiviOnDemand({ armed }: { armed: boolean }): React.ReactNode {
  if (armed) {
    throw Object.assign(new Error('Demo: CiviCRM uncontactable'), {
      name: 'CiviCrmUncontactableError',
    });
  }
  return null;
}

export default function BackendStatusDemo() {
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);
  const status = useAtomValue(backendStatusAtom);
  const [probeSucceeds, setProbeSucceeds] = useState(false);
  const [throwCivi, setThrowCivi] = useState(false);
  const [recoverLog, setRecoverLog] = useState('—');
  const [scheduledMarkUp, setScheduledMarkUp] = useState(false);

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

  useEffect(() => {
    if (!scheduledMarkUp) return undefined;
    const timeoutId = window.setTimeout(() => {
      markBackendUp();
      setScheduledMarkUp(false);
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [scheduledMarkUp]);

  const latch = (reason: Exclude<BackendStatusReason, ''>) => {
    setThrowCivi(false);
    setBackendDown(reason);
  };

  return (
    <ServerStatusErrorBoundary>
      <ThrowCiviOnDemand armed={throwCivi} />
      <BackendUnavailableOverlay
        probeHealth={async () => {
          if (!probeSucceeds) {
            throw new Error('Demo probe: still down');
          }
          // Delay so the overlay is visible before auto-recover (real /hashz is not instant).
          await new Promise((resolve) => {
            window.setTimeout(resolve, 1500);
          });
        }}
        onRecover={() => setRecoverLog(`onRecover at ${new Date().toLocaleTimeString()}`)}
      />

      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <Typography variant="h5">Backend Status Demo</Typography>
        <Typography>
          Current atom: status=<strong>{status.status || '(empty)'}</strong>, reason=
          <strong>{status.reason || '(empty)'}</strong>
        </Typography>
        <Typography variant="body2">Last onRecover: {recoverLog}</Typography>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Overlay (latches backendStatusAtom)
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => latch('UNKNOWN')}>
              Latch UNKNOWN
            </Button>
            <Button variant="outlined" onClick={() => latch('SERVER_UNCONTACTABLE')}>
              Latch SERVER_UNCONTACTABLE
            </Button>
            <Button variant="outlined" onClick={() => latch('CIVI_CRM_UNCONTACTABLE')}>
              Latch CIVI_CRM_UNCONTACTABLE
            </Button>
            <Button variant="outlined" onClick={() => latch('DATABASE_UNCONTACTABLE')}>
              Latch DATABASE_UNCONTACTABLE
            </Button>
          </Stack>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                checked={probeSucceeds}
                onChange={(_, checked) => setProbeSucceeds(checked)}
              />
            }
            label="probeHealth succeeds after ~1.5s (auto-recover for non-dependency downs)"
          />
          <Typography variant="body2" color="text.secondary">
            With this on, UNKNOWN / SERVER_UNCONTACTABLE still open the overlay, then clear once
            the delayed probe resolves. With it off, the overlay stays until Try again.
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Simulate successful API response
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Apps call <code>markBackendUp()</code> from <code>call.ts</code> when a fetch
            succeeds — not from a button under the overlay. Schedule it before (or while) the
            overlay is open so you can still observe the effect.
          </Typography>
          <Button
            variant="contained"
            color="success"
            disabled={scheduledMarkUp}
            onClick={() => setScheduledMarkUp(true)}
          >
            {scheduledMarkUp ? 'markBackendUp() in ~2s…' : 'Schedule markBackendUp() in 2s'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try: schedule, then latch UNKNOWN (overlay should clear) vs schedule, then latch
            CIVI (overlay stays — dependency latch ignores markBackendUp).
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            ServerStatusErrorBoundary
          </Typography>
          <Button variant="outlined" color="error" onClick={() => setThrowCivi(true)}>
            Throw CiviCrmUncontactableError
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Tip: dependency downs (Civi/DB) debounce ~400ms, skip health probing, and Civi has a
          1-minute overlay cooldown after it is shown. Clear a dependency outage with the
          overlay&apos;s Try again button.
        </Typography>
      </Stack>
    </ServerStatusErrorBoundary>
  );
}
