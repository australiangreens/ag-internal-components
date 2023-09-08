import {
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  Theme,
} from '@mui/material';

import { PropsWithChildren, useState } from 'react';

export type AgDialogButtonConfig = {
  text: string;
  onClick?: () => Promise<void>;
  disabled?: boolean;
  testId?: string;
  buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
};

export type AgDialogProps = PropsWithChildren<{
  isOpen: boolean;
  dialogTitle: string;
  maxWidth?: false | Breakpoint;
  primaryButton?: AgDialogButtonConfig;
  secondaryButton?: AgDialogButtonConfig;
  'data-testid'?: string;
  onClose: () => void;
  sx?: SxProps<Theme>;
}>;

/**
 * Standard dialog that will auto disable it's buttons while the primaryButton onClick function is pending.
 *
 */
const AgDialog = ({
  isOpen,
  dialogTitle,
  children,
  maxWidth,
  primaryButton,
  secondaryButton,
  onClose: handleClose,
  sx,
  'data-testid': dataTestId,
}: AgDialogProps) => {
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onClose={async () => {
        if (areButtonsDisabled) return;
        if (secondaryButton?.onClick) {
          await secondaryButton.onClick();
        } else {
          handleClose();
        }
      }}
      fullWidth
      maxWidth={maxWidth ?? 'xs'}
      data-testid={dataTestId}
      sx={sx}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent sx={{ '& > :last-child': { marginBottom: 0 } }}>{children}</DialogContent>
      <DialogActions>
        <Button
          onClick={secondaryButton?.onClick ?? handleClose}
          data-testid={secondaryButton?.testId}
          disabled={secondaryButton?.disabled || areButtonsDisabled}
          color={secondaryButton?.buttonColor}
        >
          {secondaryButton?.text ?? 'Cancel'}
        </Button>
        {primaryButton && (
          <Button
            onClick={async () => {
              setButtonsDisabled(true);
              await primaryButton.onClick?.();
              setButtonsDisabled(false);
            }}
            data-testid={primaryButton.testId}
            disabled={primaryButton.disabled || areButtonsDisabled}
            color={primaryButton?.buttonColor}
          >
            {primaryButton.text}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AgDialog;
