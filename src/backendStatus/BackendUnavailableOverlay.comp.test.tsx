import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as JotaiProvider, createStore } from 'jotai';

import BackendUnavailableOverlay from './BackendUnavailableOverlay';
import { DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS } from './constants';
import { backendStatusAtom } from './latch';
import type { BackendStatus } from './types';

function renderOverlay(
  initialStatus: BackendStatus = { status: 'DOWN', reason: 'UNKNOWN' },
  options: {
    probeHealth?: () => Promise<unknown>;
    onRecover?: () => void;
    title?: string | ((reason: string) => string);
    userMessage?: string | ((reason: string) => string);
    technicalDetails?:
      | string
      | Record<string, string>
      | ((reason: string) => string | Record<string, string>);
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
        <BackendUnavailableOverlay
          probeHealth={probeHealth}
          onRecover={onRecover}
          title={options.title}
          userMessage={options.userMessage}
          technicalDetails={options.technicalDetails}
        />
        <div>Page content still here</div>
      </JotaiProvider>
    ),
  };
}

async function expectOverlayVisible() {
  await waitFor(
    () => {
      expect(screen.getByText('An error has occurred in the application')).toBeInTheDocument();
    },
    { timeout: DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS + 500 }
  );
}

describe('BackendUnavailableOverlay', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the error dialog over page content when backend is DOWN', async () => {
    renderOverlay();

    await expectOverlayVisible();
    expect(
      screen.getByText(/Something went wrong contacting the application/i)
    ).toBeInTheDocument();
    const technical = screen.getByTestId('backend-unavailable-technical-details');
    expect(within(technical).getByText(/name = ServerUncontactableError/)).toBeInTheDocument();
    expect(within(technical).getByText(/message = Unknown issue/)).toBeInTheDocument();
    expect(screen.getByText('Page content still here')).toBeInTheDocument();
  });

  it('shows database-specific details for DATABASE_UNCONTACTABLE', async () => {
    renderOverlay({ status: 'DOWN', reason: 'DATABASE_UNCONTACTABLE' });

    await expectOverlayVisible();
    expect(screen.getByText(/cannot connect to the database/i)).toBeInTheDocument();
    const technical = screen.getByTestId('backend-unavailable-technical-details');
    expect(within(technical).getByText(/name = DatabaseUncontactableError/)).toBeInTheDocument();
  });

  it('shows Redis-specific details for REDIS_UNCONTACTABLE without probing', async () => {
    const probeHealth = vi.fn().mockResolvedValue({ ok: true });
    const { store } = renderOverlay(
      { status: 'DOWN', reason: 'REDIS_UNCONTACTABLE' },
      { probeHealth }
    );

    await expectOverlayVisible();
    expect(screen.getByText(/cannot connect to Redis/i)).toBeInTheDocument();
    const technical = screen.getByTestId('backend-unavailable-technical-details');
    expect(within(technical).getByText(/name = RedisConnectionError/)).toBeInTheDocument();
    expect(probeHealth).not.toHaveBeenCalled();
    expect(store.get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'REDIS_UNCONTACTABLE',
    });
  });

  it('does not show the dialog when backend is UP', () => {
    renderOverlay({ status: 'UP', reason: '' });

    expect(screen.queryByText('An error has occurred in the application')).not.toBeInTheDocument();
    expect(screen.getByText('Page content still here')).toBeInTheDocument();
  });

  it('dismisses when the user clicks try again and calls onRecover', async () => {
    const user = userEvent.setup();
    const { store, onRecover } = renderOverlay();

    await expectOverlayVisible();
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

    await expectOverlayVisible();
    expect(screen.getByText(/cannot connect to CiviCRM/i)).toBeInTheDocument();

    expect(probeHealth).not.toHaveBeenCalled();
    expect(store.get(backendStatusAtom)).toEqual({
      status: 'DOWN',
      reason: 'CIVI_CRM_UNCONTACTABLE',
    });
  });

  it('uses title, userMessage and technicalDetails prop overrides', async () => {
    renderOverlay(
      { status: 'DOWN', reason: 'SERVER_UNCONTACTABLE' },
      {
        title: 'Custom outage title',
        userMessage: 'Custom outage copy',
        technicalDetails: { code: 'X1', hint: 'check logs' },
      }
    );

    await waitFor(
      () => {
        expect(screen.getByText('Custom outage title')).toBeInTheDocument();
      },
      { timeout: DEPENDENCY_DOWN_OVERLAY_DEBOUNCE_MS + 500 }
    );
    expect(
      screen.queryByText('An error has occurred in the application')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Custom outage copy')).toBeInTheDocument();
    expect(screen.queryByText(/cannot connect to the backend server/i)).not.toBeInTheDocument();
    const technical = screen.getByTestId('backend-unavailable-technical-details');
    expect(within(technical).getByText(/code = X1/)).toBeInTheDocument();
    expect(within(technical).getByText(/hint = check logs/)).toBeInTheDocument();
  });
});
