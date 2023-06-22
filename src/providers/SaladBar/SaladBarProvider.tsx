import React, { useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import SaladBarContext, { NotificationType } from './SaladBarContext';
import { defaultSnackbarProps, defaultEnqueueNotificationOptions } from './defaults';

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

type SaladBarProps = {
  children: React.ReactNode;
};

export default function SaladBarProvider({ children, ...snackbarProps }: SaladBarProps) {
  const [open, setOpen] = useState(false);

  // We use a ref instead of a state to store the actual data, because we want
  // queue to be persistent across the whole lifetime of component. I considered
  // using yocto-queue because it would be O(1) instead of O(n), but its not
  // designed to access the head without removing it and its not going to make
  // much difference anyway.
  const queueRef = useRef<NotificationType[]>([]);

  const limitLastHitAt = useRef(Date.now());
  const limitHitCountSinceLastReport = useRef(0);

  const enqueueNotification = (notification = {}) => {
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
    queueRef.current.push(newNotification as NotificationType);

    // If the queue was previously empty, then open the snackbar. We don't do it
    // whenever enqueueNotification is called since it will mess up transitions
    if (queueRef.current.length === 1) setOpen(true);

    return newNotification.key;
  };

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
  const removeNotification = (key: unknown) => {
    const index = queueRef.current.findIndex((x) => x.key === key);
    if (index === -1) return;

    if (index === 0) {
      // If its at the front of the queue, it is either currently being
      // displayed or in process of being closed. Either way, we can just set
      // open to false
      setOpen(false);
      return queueRef.current[0];
    }
    // Otherwise we just remove it from the queue, it won't need to transition
    return queueRef.current.splice(index, 1);
  };

  // Callback fired when the component requests to be closed
  // const handleClose = (_event, reason) => {
  //   // We ignore click away, letting user continue with UI while its still
  //   // displayed
  //   if (reason === 'clickaway') return;

  //   setOpen(false);
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClose = (_event: Event | React.SyntheticEvent<Element, Event>) => {
    // We ignore click away, letting user continue with UI while its still
    // displayed

    setOpen(false);
  };

  // Callback fired before the transition is exiting.
  const handleExit = () => {};

  // Callback fired when the transition has exited.
  const handleExited = () => {
    // Remove head of queue
    queueRef.current.shift();

    // If there is still something on the queue, then re-open
    if (queueRef.current.length > 0) setOpen(true);
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
  // onClose.

  const snackbarFinalProps = { ...defaultSnackbarProps, ...snackbarProps };

  return (
    // Should be resolved when we move to React >= 18
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <SaladBarContext.Provider
      value={{
        enqueueNotification,
        enqueueSuccessNotification,
        enqueueInfoNotification,
        enqueueWarningNotification,
        enqueueErrorNotification,
        removeNotification,
      }}
    >
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
            onClose={handleClose}
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
    </SaladBarContext.Provider>
  );
}
