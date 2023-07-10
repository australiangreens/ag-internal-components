import React, { useRef, useState, createContext, useCallback } from 'react';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import {
  Notification,
  SaladBarCloseReason,
  SaladBarState,
  SaladBarActions,
  SaladBarContext,
} from './types';
import {
  defaultSaladBarProps,
  defaultSnackbarProps,
  defaultEnqueueNotificationOptions,
} from './defaults';

const MAX_QUEUE_LENGTH = 100;
const MAX_QUEUE_HIT_REPORT_INTERVAL = 2000;
const SALADBAR_INDEX = 2000;

// No need to use uuids, just use an incremented value
const generateNotificationKey = (() => {
  let previousKey = 0;
  return () => {
    previousKey += 1;
    return previousKey;
  };
})();

const alertWithLinearProgressStyle = {
  borderBottomLeftRadius: '0px',
  borderBottomRightRadius: '0px',
};

// Note: Must be at at this scope, otherwise useEffect will loop infinitely
const defaultOverrideState = {};
const defaultOverrideActions = {};

export const Context = createContext<SaladBarContext | null>(null);

export interface SaladBarProviderProps extends SnackbarProps {
  /** Allow overriding the state of the SaladBar (for tests etc)*/
  overrideState?: Partial<SaladBarState>;

  /** Allow overriding the actions of the SaladBar (for tests etc)*/
  overrideActions?: Partial<SaladBarActions>;

  /** Called when an event triggers closing of currently displayed snackbar.
   * Default implementation returns false if reason is 'clickaway', otherwise
   * true.*/
  shouldClose?: (
    event: Event | React.SyntheticEvent<Element, Event>,
    reason: SaladBarCloseReason
  ) => boolean;
}

export default function SaladBarProvider({
  overrideState = defaultOverrideState,
  overrideActions = defaultOverrideActions,
  shouldClose = defaultSaladBarProps.shouldClose,
  children,
  ...snackbarProps
}: SaladBarProviderProps) {
  const [{ open }, setSaladBarState] = useState({ open: false });

  // We use a ref instead of a state to store the actual data, because we want
  // queue to be persistent across the whole lifetime of component. I considered
  // using yocto-queue because it would be O(1) instead of O(n), but its not
  // designed to access the head without removing it and its not going to make
  // much difference anyway.
  const queueRef = useRef<Notification[]>([]);

  const limitLastHitAt = useRef(Date.now());
  const limitHitCountSinceLastReport = useRef(0);

  const setOpen = useCallback((newVal: boolean) => {
    setSaladBarState({ open: newVal });
  }, []);

  const enqueueNotification = useCallback((notification: Notification = {}) => {
    limitHitCountSinceLastReport.current += 1;
    if (queueRef.current.length >= MAX_QUEUE_LENGTH) {
      // If the queue length is hit, probably stuck in some sort of loop, so
      // don't want to spam logs instantly so space it out
      if (Date.now() - limitLastHitAt.current >= MAX_QUEUE_HIT_REPORT_INTERVAL) {
        limitLastHitAt.current = Date.now();
        console.error(
          `SaladBarProvider: MAX_QUEUE_LENGTH (${MAX_QUEUE_LENGTH}) hit ${limitHitCountSinceLastReport.current} times in last ${MAX_QUEUE_HIT_REPORT_INTERVAL}ms)`
        );
        limitHitCountSinceLastReport.current = 0;
      }
    }

    const newNotification = {
      ...defaultEnqueueNotificationOptions,
      key: generateNotificationKey(), // Can be overridden.
      ...notification, // This could result in collisons, but unlikely.
    };

    // Add to the end of queue
    queueRef.current.push(newNotification as Notification);

    // If the queue was previously empty, then open the snackbar. We don't do it
    // whenever enqueueNotification is called since it will mess up transitions
    if (queueRef.current.length === 1) setSaladBarState({ open: true });

    return newNotification.key;
  }, []);

  const enqueueSuccessNotification = (message = '', options = {}) =>
    enqueueNotification({ message, severity: 'success', ...options });

  const enqueueInfoNotification = (message = '', options = {}) =>
    enqueueNotification({ message, severity: 'info', ...options });

  const enqueueWarningNotification = (message = '', options = {}) =>
    enqueueNotification({ message, severity: 'warning', ...options });

  const enqueueErrorNotification = (message = '', options = {}) =>
    enqueueNotification({ message, severity: 'error', ...options });

  /**
   * Remove the notification with specified key from the queue. If the key is
   * not found, immediately returns null.
   *
   * @param key - The key as returned from enqueue...() function.
   *
   * @returns The removed notification
   */
  const removeNotification = (key: Notification['key']) => {
    const index = queueRef.current.findIndex((x) => x.key === key);
    if (index === -1) return;

    if (index === 0) {
      // If its at the front of the queue, it is either currently being
      // displayed or in process of being closed. Either way, we can just set
      // open to false
      setSaladBarState({ open: false });
      return queueRef.current[0];
    }
    // Otherwise we just remove it from the queue, it won't need to transition
    return queueRef.current.splice(index, 1);
  };

  const handleClose = (
    event: Event | React.SyntheticEvent<Element, Event>,
    reason: SaladBarCloseReason
  ) => {
    if (shouldClose(event, reason)) setSaladBarState({ open: false });
  };

  // Callback fired before the transition is exiting.
  const handleExit = () => {};

  // Callback fired when the transition has exited.
  const handleExited = () => {
    // Remove head of queue
    queueRef.current.shift();

    // If there is still something on the queue, then re-open
    if (queueRef.current.length > 0) setSaladBarState({ open: true });
  };

  // The notification to display is the one at head of queue
  const currentNotification = queueRef.current[0] ?? {
    ...defaultEnqueueNotificationOptions,
  };

  // Can also override certain props on a notification level
  const currentNotificationSnackbarProps: { autoHideDuration?: number } = {};
  // Probably a better way of doing this
  if ('autoHideDuration' in currentNotification) {
    currentNotificationSnackbarProps.autoHideDuration = currentNotification.autoHideDuration;
  }

  // Note the order of props in Snackbar, we don't allow overriding open and
  // onClose directly.
  const snackbarFinalProps = {
    ...defaultSnackbarProps,
    ...snackbarProps,
  };

  const value: SaladBarContext = {
    open,
    setOpen,
    enqueueNotification,
    enqueueSuccessNotification,
    enqueueInfoNotification,
    enqueueWarningNotification,
    enqueueErrorNotification,
    removeNotification,
    ...overrideState,
    ...overrideActions,
  };

  return (
    <Context.Provider value={value}>
      {children}
      <Snackbar
        {...snackbarFinalProps}
        {...currentNotificationSnackbarProps}
        open={open}
        onClose={handleClose}
        TransitionProps={{
          onExited: handleExited,
          onExit: handleExit,
        }}
        sx={{ zIndex: SALADBAR_INDEX }}
      >
        <div>
          <Alert
            onClose={(event) => handleClose(event, 'closeAlert')}
            severity={currentNotification.severity}
            variant={'filled'}
            icon={
              currentNotification.progressIndicator === 'circular' ? (
                <CircularProgress size="1em" />
              ) : undefined
            }
            style={
              currentNotification.progressIndicator === 'linear'
                ? alertWithLinearProgressStyle
                : undefined
            }
          >
            {currentNotification.message}
          </Alert>
          {currentNotification.progressIndicator === 'linear' && <LinearProgress color="primary" />}
        </div>
      </Snackbar>
    </Context.Provider>
  );
}
