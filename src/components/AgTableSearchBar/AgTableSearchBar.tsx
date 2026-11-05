import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Breakpoint, Button, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';

import AgDialog from '../AgDialog';

export type AgTableSearchField = {
  id: string;
  /** Share of the wide-screen row. The events list uses 324 for the name and 204 for the rest. */
  flex: number;
  /** Stays in the bar at every width. The component only calls this field with 'live'. */
  primary?: boolean;
  /** Caps the field on a wide row. The RSVP list sets this; the events list does not. */
  maxWidth?: number | string;
  /** Stops the field shrinking over the next control. Other fields still shrink to zero. */
  minWidth?: number | string;
  render: (mode: 'live' | 'draft') => ReactNode;
};

export type AgTableSearchBarProps = {
  fields: AgTableSearchField[];
  onReset: () => void;
  resetLabel?: string;
  dialogTitle?: string;
  /** Copy live secondary values into the draft. Runs before the dialog is shown. */
  onDialogOpen?: () => void;
  /** Commit the draft. The dialog closes only after this resolves. */
  onApply?: () => void | Promise<void>;
  /** Drop the draft. Cancel, backdrop, and escape all use this. */
  onCancel?: () => void | Promise<void>;
  /** Rendered after Reset on a wide screen, and omitted while the bar is collapsed. */
  actions?: ReactNode;
  /** Collapse when the viewport is below this MUI breakpoint. Default 'sm'. */
  collapseBelow?: Breakpoint;
  /**
   * Flex weight of the Reset slot, in the same units as `fields`. Default 187,
   * matching the events list. The label wraps when this slot is narrower than the words.
   */
  resetFlex?: number;
};

const AgTableSearchBar = ({
  fields,
  onReset,
  resetLabel = 'Reset Filter',
  dialogTitle = 'Filter',
  onDialogOpen,
  onApply,
  onCancel,
  actions,
  collapseBelow = 'sm',
  resetFlex = 187,
}: AgTableSearchBarProps) => {
  const theme = useTheme();
  const collapsed = useMediaQuery(theme.breakpoints.down(collapseBelow));
  const [dialogOpen, setDialogOpen] = useState(false);
  const warnedRef = useRef(false);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  const primaryIndex = fields.findIndex((field) => field.primary);
  const resolvedPrimaryIndex = primaryIndex === -1 ? 0 : primaryIndex;
  const primary = fields[resolvedPrimaryIndex];
  const secondary = fields.filter((_, index) => index !== resolvedPrimaryIndex);
  const visibleFields = collapsed ? fields.filter((field) => field === primary) : fields;

  useEffect(() => {
    if (!import.meta.env.DEV || warnedRef.current) return;
    // One warning per mount when draft callbacks are missing. This is not an event handler.
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler -- mount-time diagnostic
    if (secondary.length > 0 && (onDialogOpen === undefined || onApply === undefined)) {
      warnedRef.current = true;
      console.warn(
        'AgTableSearchBar: pass onDialogOpen and onApply when there are secondary fields so the draft stays in sync.'
      );
    }
  }, [secondary.length, onDialogOpen, onApply]);

  useEffect(() => {
    if (collapsed || !dialogOpen) return undefined;
    let cancelled = false;
    void (async () => {
      try {
        await onCancelRef.current?.();
        if (!cancelled) setDialogOpen(false);
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collapsed, dialogOpen]);

  const handleOpen = () => {
    try {
      onDialogOpen?.();
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async () => {
    try {
      await onApply?.();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async () => {
    try {
      await onCancelRef.current?.();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '12px',
          paddingRight: '12px',
          marginBottom: '16px',
          gap: '12px',
        }}
      >
        {visibleFields.map((field) => (
          <Box
            key={field.id}
            sx={{ flex: field.flex, minWidth: field.minWidth ?? 0, maxWidth: field.maxWidth }}
          >
            {field.render('live')}
          </Box>
        ))}
        <Box sx={{ flex: resetFlex, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          {collapsed && secondary.length > 0 && (
            <IconButton
              aria-label="Filter"
              onClick={handleOpen}
              sx={{ flexShrink: 0, paddingRight: '0px' }}
            >
              <FilterListIcon />
            </IconButton>
          )}
          <Button
            onClick={onReset}
            color="primary"
            sx={{
              flex: '0 1 auto',
              minWidth: 0,
              maxWidth: '100%',
              whiteSpace: 'normal',
              paddingTop: '6px',
              paddingBottom: '6px',
              paddingLeft: '12px',
            }}
          >
            {resetLabel}
          </Button>
          {!collapsed && actions}
        </Box>
      </Box>
      <AgDialog
        isOpen={dialogOpen}
        dialogTitle={dialogTitle}
        onClose={handleCancel}
        secondaryButton={{ text: 'Cancel', onClick: handleCancel }}
        primaryButton={{ text: 'Apply filter', onClick: handleApply }}
      >
        {dialogOpen && (
          <Stack spacing={2} sx={{ paddingTop: '8px' }}>
            {secondary.map((field) => (
              <Box key={field.id} sx={{ width: '100%' }}>
                {field.render('draft')}
              </Box>
            ))}
          </Stack>
        )}
      </AgDialog>
    </>
  );
};

export default AgTableSearchBar;
