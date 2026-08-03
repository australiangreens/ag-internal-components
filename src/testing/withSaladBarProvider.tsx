/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';

import SaladBarProvider, {
  SaladBarProviderProps,
} from '../providers/SaladBar/SaladBarContext';

export const withSaladBarProvider = createHelper(
  (
    props: SaladBarProviderProps = { autoHideDuration: 1 },
    state: Partial<unknown> = {},
    actions: Partial<unknown> = {}
  ) =>
    ({ children }) => {
      return (
        <SaladBarProvider {...props} overrideState={state} overrideActions={actions}>
          <>{children}</>
        </SaladBarProvider>
      );
    }
);
