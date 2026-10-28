import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as JotaiProvider, createStore } from 'jotai';

import BackendUnavailableOverlay from './BackendUnavailableOverlay';
import {
  CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS,
  DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS,
  markCiviUncontactableOverlayShown,
  resetCiviUncontactableOverlayCooldown,
} from './constants';
import { backendStatusAtom } from './latch';
import type { BackendStatus } from './types';

function renderOverlay(
  initialStatus: BackendStatus = { status: 'DOWN', reason: 'UNKNOWN' },
  options: {
    probeHealth?: () => Promise<unknown>;
    onRecover?: () => void;
  } = {}
) {
  const store = createStore();
  store.set(backendStatusAtom, initialStatus);
  const probeHealth = options.probeHealth ?? vi.fn().mockRejectedValue(new Error('still down'));
  const onRecover = options.onRecover ?? vi.fn();

  return {
    store,
    probeHealth,
    onRecover,
    ...render(
      <JotaiProvider store={store}>
        <BackendUnavailableOverlay probeHealth={probeHealth} onRecover={onRecover} />
        <div>Page content still here</div>
      </JotaiProvider>
    ),
  };
}

describe('BackendUnavailableOverlay', () => {
  beforeEach(() => {
    resetCiviUncontactableOverlayCooldown();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the error dialog over page content when backend is DOWN', () => {
    renderOverlay();

    expect(screen.getByText('An error has occurred in the application')).toBeInTheDocument();
    expect(screen.getByText('Unknown issue')).toBeInTheDocument();
    expect(screen.getByText(/name = ServerUncontactableError/)).toBeInTheDocument();
    expect(screen.getByText('Page content still here')).toBeInTheDocument();
  });

  it('shows database-specific details for DATABASE_UNCONTACTABLE', async () => {
    renderOverlay({ status: 'DOWN', reason: 'DATABASE_UNCONTACTABLE' });

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/unable to contact the database it needs to work/i).length
        ).toBeGreaterThan(0);
      },
      { timeout: DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS + 500 }
    );
    expect(screen.getByText(/name = DatabaseUncontactableError/)).toBeInTheDocument();
  });

  it('does not show the dialog when backend is UP', () => {
    renderOverlay({ status: 'UP', reason: '' });

    expect(screen.queryByText('An error has occurred in the application')).not.toBeInTheDocument();
    expect(screen.getByText('Page content still here')).toBeInTheDocument();
  });

  it('dismisses when the user clicks try again and calls onRecover', async () => {
    const user = userEvent.setup();
    const { store, onRecover } = renderOverlay();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(store.get(backendStatusAtom)).toEqual({ status: 'UP', reason: '' });
    expect(onRecover).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText('An error has occurred in the application')).not.toBeInTheDocument();
    });
  });

  it('auto-dismisses when the health probe succeeds', async () => {
    const probeHealth = vi.fn().mockResolvedValue({ ok: true });
    const { store, onRecover } = renderOverlay(undefined, { probeHealth });

    await waitFor(() => {
      expect(store.get(backendStatusAtom)).toEqual({ status: 'UP', reason: '' });
    });
    expect(probeHealth).toHaveBeenCalled();
    expect(onRecover).toHaveBeenCalled();
  });

  it('does not health-probe or auto-dismiss while Civi is uncontactable', async () => {
    const probeHealth = vi.fn().mockResolvedValue({ ok: true });
    const { store } = renderOverlay(
      { status: 'DOWN', reason: 'CIVI_CRM_UNCONTACTABLE' },
      { probeHealth }
    );

    expect(screen.queryByText('An error has occurred in the application')).not.toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getAllByText(/unable to contact CiviCRM/i).length).toBeGreaterThan(0);
      },
      { timeout: DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS + 500 }
    );

    expect(probeHealth).not.toHaveBeenCalled();
    expect(store.get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('keeps Civi latched but hides the dialog during the one-minute cooldown', async () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    vi.setSystemTime(now);
    markCiviUncontactableOverlayShown(now);
    const probeHealth = vi.fn().mockResolvedValue({ ok: true });
    const { store } = renderOverlay(
      { status: 'DOWN', reason: 'CIVI_CRM_UNCONTACTABLE' },
      { probeHealth }
    );

    expect(screen.queryByText('An error has occurred in the application')).not.toBeInTheDocument();
    expect(store.get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
    expect(probeHealth).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS + 100);
    });
    expect(screen.queryByText('An error has occurred in the application')).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS);
    });
    expect(screen.getByText('An error has occurred in the application')).toBeInTheDocument();
  });
});
