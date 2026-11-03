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
  type MarkBackendUpOptions,
} from 'ag-internal-components';

type ScheduledMarkUp = MarkBackendUpOptions | 'plain';

function ThrowCiviOnDemand({ armed }: { armed: boolean }): React.ReactNode {
  if (armed) {
    throw Object.assign(new Error('Demo: CiviCRM uncontactable'), {
      name: 'CiviCrmUncontactableError',
    });
  }
  return null;
}

function scheduledMarkUpLabel(scheduled: ScheduledMarkUp): string {
  if (scheduled === 'plain') return 'markBackendUp() in ~2s…';
  if (scheduled.clearCivi) return 'markBackendUp({ clearCivi }) in ~2s…';
  if (scheduled.clearDatabase) return 'markBackendUp({ clearDatabase }) in ~2s…';
  if (scheduled.clearRedis) return 'markBackendUp({ clearRedis }) in ~2s…';
  return 'markBackendUp() in ~2s…';
}

export default function BackendStatusDemo() {
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);
  const status = useAtomValue(backendStatusAtom);
  const [probeSucceeds, setProbeSucceeds] = useState(false);
  const [throwCivi, setThrowCivi] = useState(false);
  const [recoverLog, setRecoverLog] = useState('—');
  const [scheduledMarkUp, setScheduledMarkUp] = useState<ScheduledMarkUp | null>(null);

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

  useEffect(() => {
    if (scheduledMarkUp == null) return undefined;
    const timeoutId = window.setTimeout(() => {
      markBackendUp(scheduledMarkUp === 'plain' ? {} : scheduledMarkUp);
      setScheduledMarkUp(null);
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [scheduledMarkUp]);

  const latch = (reason: Exclude<BackendStatusReason, ''>) => {
    setThrowCivi(false);
    const demoError = Object.assign(new Error(`Demo latch: ${reason}`), {
      name: `${reason}_DemoError`,
    });
    setBackendDown(reason, demoError);
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
            <Button variant="outlined" onClick={() => latch('REDIS_UNCONTACTABLE')}>
              Latch REDIS_UNCONTACTABLE
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
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              disabled={scheduledMarkUp != null}
              onClick={() => setScheduledMarkUp('plain')}
            >
              {scheduledMarkUp === 'plain'
                ? scheduledMarkUpLabel(scheduledMarkUp)
                : 'Schedule markBackendUp() in 2s'}
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={scheduledMarkUp != null}
              onClick={() => setScheduledMarkUp({ clearCivi: true })}
            >
              {scheduledMarkUp != null &&
              scheduledMarkUp !== 'plain' &&
              scheduledMarkUp.clearCivi
                ? scheduledMarkUpLabel(scheduledMarkUp)
                : 'Schedule clearCivi in 2s'}
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={scheduledMarkUp != null}
              onClick={() => setScheduledMarkUp({ clearDatabase: true })}
            >
              {scheduledMarkUp != null &&
              scheduledMarkUp !== 'plain' &&
              scheduledMarkUp.clearDatabase
                ? scheduledMarkUpLabel(scheduledMarkUp)
                : 'Schedule clearDatabase in 2s'}
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={scheduledMarkUp != null}
              onClick={() => setScheduledMarkUp({ clearRedis: true })}
            >
              {scheduledMarkUp != null &&
              scheduledMarkUp !== 'plain' &&
              scheduledMarkUp.clearRedis
                ? scheduledMarkUpLabel(scheduledMarkUp)
                : 'Schedule clearRedis in 2s'}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Plain <code>markBackendUp()</code> clears UNKNOWN / SERVER only. The clear*
            buttons mimic app recovery probes for Civi / DB / Redis.
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
          Tip: all downs debounce ~400ms before the overlay opens. Dependency downs
          (Civi/DB/Redis) skip /hashz probing — clear them with Try again (apps clear
          Redis/Civi/DB via markBackendUp clear options after a proving probe).
        </Typography>
      </Stack>
    </ServerStatusErrorBoundary>
  );
}
