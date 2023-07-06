import { SnackbarCloseReason } from '@mui/material/Snackbar';

export type Notification = {
  key?: number;
  message?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'standard' | 'outlined' | 'filled';
  progressIndicator?: string;
  autoHideDuration?: number;
};

export type SaladBarCloseReason = SnackbarCloseReason | 'closeAlert';

export type SaladBarState = {
  open: boolean;
};

export type SaladBarActions = {
  /**
   * Call as enqueueNotification(notification) where notification include
   * message and severity of 'error' ,'warning', 'info' or 'success'
   */
  enqueueNotification: (notification: Notification) => void;

  /**
   * Call as const key = enqueueSuccessNotification('a message')
   */
  enqueueSuccessNotification: (message: string) => Notification['key'];

  /**
   * Call as const key = enqueueInfoNotification(msg)
   */
  enqueueInfoNotification: (message: string) => Notification['key'];

  /**
   * Call as const key = enqueueWarningNotification(msg)
   */
  enqueueWarningNotification: (message: string) => Notification['key'];

  /**
   * Call as const key = enqueueErrorNotification(msg)
   */
  enqueueErrorNotification: (message: string) => Notification['key'];

  /**
   * Call as removeNotification(key)
   */
  removeNotification: (key: Notification['key']) => Notification | Notification[] | undefined;

  /** Internal, do not use */
  setOpen: (newVal: boolean) => void;
};

export type SaladBarContext = SaladBarState & SaladBarActions;
