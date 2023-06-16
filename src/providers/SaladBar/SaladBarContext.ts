import { createContext } from 'react';

import { ContextError } from '../../errors/ContextError';

const stub: () => void = () => {
  throw new ContextError('SaladBarContext can only be used in a child of a <SaladBarProvider>');
};

export type NotificationType = {
  key: number;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error' | undefined;
  variant: 'standard' | 'outlined' | 'filled' | undefined;
  progressIndicator: string | undefined;
  autoHideDuration: number | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notstub = (key: unknown): NotificationType | NotificationType[] | void => {
  throw new ContextError('SaladBarContext can only be used in a child of a <SaladBarProvider>');
};

type SaladBarContextFunction = typeof stub | typeof notstub;

type SaladBarContextType = {
  enqueueNotification: SaladBarContextFunction; // Call as enqueueNotification(options)
  // where options include message and severity of 'error' ,'warning', 'info' or
  // 'success'
  enqueueSuccessNotification: SaladBarContextFunction; // Call as const key =
  // enqueueSuccessNotification(msg),
  enqueueInfoNotification: SaladBarContextFunction; //  Call as const key =
  // enqueueInfoNotification(msg),
  enqueueWarningNotification: SaladBarContextFunction; // Call as const key =
  // enqueueWarningNotification(msg),
  enqueueErrorNotification: SaladBarContextFunction; // Call as const key =
  // enqueueErrorNotification(msg),
  removeNotification: SaladBarContextFunction; // Call as enqueueErrorNotification(key),
};

// The defaultValue argument is only used when a component does not have a
// matching Provider above it in the tree. See
// https://reactjs.org/docs/context.html#reactcreatecontext
// Using createContext doesn't itself maintain any type of state exactly, it
// just provides a way for children to access shared references.
const defaultValue = {
  enqueueNotification: stub,
  enqueueSuccessNotification: stub,
  enqueueInfoNotification: stub,
  enqueueWarningNotification: stub,
  enqueueErrorNotification: stub,
  removeNotification: notstub,
} as SaladBarContextType;

/**
 * @returns A SaladBarContext
 */
const SaladBarContext = createContext(defaultValue);

export default SaladBarContext;
