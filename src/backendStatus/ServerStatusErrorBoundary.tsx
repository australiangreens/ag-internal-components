import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import AgDialog from '../components/AgDialog';

const CIVI_ERROR_NAME = 'CiviCrmUncontactableError';

/**
 * Catches thrown CiviCRM-uncontactable errors (matched by `error.name`) and shows
 * a reload dialog. Other errors are rethrown for outer boundaries.
 */
export default function ServerStatusErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      onError={(err) => {
        if ((err as Error).name !== CIVI_ERROR_NAME) throw err;
      }}
      fallback={
        <AgDialog
          isOpen={true}
          dialogTitle="CiviCRM service unavailable"
          primaryButton={{ text: 'Reload', onClick: async () => window.location.reload() }}
          onClose={() => {}}
          disableCloseOnBackdropOrEscape
        >
          <p style={{ marginBottom: 0 }}>
            Our CiviCRM system is currently unavailable. Please try reloading the page again later.
            Sorry for the inconvenience!
          </p>
        </AgDialog>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
