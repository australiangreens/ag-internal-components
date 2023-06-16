import { useContext } from 'react';
import SaladBarContext from './SaladBarContext';

/**
 * Use the `useSaladBar` hook in components to access the enqueueNotification()
 * method to add a snackbar message to queue.
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
export default function useSaladBar() {
  return useContext(SaladBarContext);
}
