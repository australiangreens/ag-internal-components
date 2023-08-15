import { Breakpoint } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { PropsWithChildren, useState } from 'react';

type ButtonConfig = {
  text: string;
  onClick?: () => Promise<void>;
  disabled?: boolean;
  testId?: string;
  buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
};

type Props = PropsWithChildren<{
  isOpen: boolean;
  dialogTitle: string;
  maxWidth?: false | Breakpoint;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  onClose: () => void;
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
}: Props) => {
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (areButtonsDisabled) return;
        handleClose();
      }}
      fullWidth
      maxWidth={maxWidth ?? 'xs'}
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
