import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ServerStatusErrorBoundary from './ServerStatusErrorBoundary';

function ThrowCivi(): React.ReactNode {
  throw Object.assign(new Error('civi down'), { name: 'CiviCrmUncontactableError' });
}

function ThrowOther(): React.ReactNode {
  throw Object.assign(new Error('boom'), { name: 'SomeOtherError' });
}

describe('ServerStatusErrorBoundary', () => {
  it('shows the Civi dialog for CiviCrmUncontactableError by name', () => {
    render(
      <ServerStatusErrorBoundary>
        <ThrowCivi />
      </ServerStatusErrorBoundary>
    );

    expect(screen.getByText('CiviCRM service unavailable')).toBeInTheDocument();
    expect(screen.getByText(/Our CiviCRM system is currently unavailable/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });

  it('reloads the page when Reload is clicked', async () => {
    const user = userEvent.setup();
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });

    render(
      <ServerStatusErrorBoundary>
        <ThrowCivi />
      </ServerStatusErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: /reload/i }));
    expect(reload).toHaveBeenCalled();
  });

  it('does not swallow non-Civi errors', () => {
    // react-error-boundary rethrows from onError; React still needs an outer catch for the render throw.
    expect(() =>
      render(
        <ServerStatusErrorBoundary>
          <ThrowOther />
        </ServerStatusErrorBoundary>
      )
    ).toThrow();
  });
});
