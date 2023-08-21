import { useContext } from 'react';

import { Context } from './SaladBarContext';
import { ContextError } from '../../errors/ContextError';

/**
 * Use the `useSaladBar` hook in components to access the enqueueNotification()
 * method to add a snackbar message to queue.
 *
 * Must be used inside a <SaladBarProvider>
 *
 * Example:
 *
 * ```js
 * const {
 *   enqueueNotification,
 *   enqueueSuccessNotification,
 *   enqueueInfoNotification,
 *   enqueueWarningNotification,
 *   enqueueErrorNotification,
 * } = useSaladBar();
 * ...
 * enqueueNotification({message: 'hello', severity: 'info'});
 * // or
 * enqueueInfoNotification('hello');
 * ```
 */
export function useSaladBar() {
  const context = useContext(Context);

  if (context === null) {
    throw new ContextError('Error: Tried to useSaladBar outside of a <SaladBarProvider>');
  }

  return context;
}
