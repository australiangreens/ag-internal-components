import { Box, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import TableLoadingSkeleton from './TableLoadingSkeleton';

type PopperModifierState = {
  elements: { reference: Element };
  modifiersData: { popperOffsets?: { x: number; y: number } };
};

/** Nudge preference panel fully above column headers (smaller y moves the popper up). */
const shiftDataGridPanelAboveColumnHeaders = {
  name: 'shiftDataGridPanelAboveColumnHeaders',
  enabled: true,
  phase: 'main' as const,
  requires: ['popperOffsets'] as const,
  fn({ state }: { state: PopperModifierState }) {
    const ref = state.elements.reference;
    if (!(ref instanceof HTMLElement)) {
      return;
    }
    const gridRoot = ref.closest('.MuiDataGrid-root');
    if (!gridRoot) {
      return;
    }
    const headers = gridRoot.querySelector('.MuiDataGrid-columnHeaders');
    const refRect = ref.getBoundingClientRect();
    const isGridPanelAnchor = ref.getAttribute('data-id') === 'gridPanelAnchor';
    let needsShift = isGridPanelAnchor;
    if (!needsShift && headers instanceof HTMLElement) {
      const headerBottom = headers.getBoundingClientRect().bottom;
      needsShift = refRect.top >= headerBottom - 1;
    }
    if (!needsShift) {
      return;
    }
    const raw = getComputedStyle(gridRoot).getPropertyValue('--DataGrid-headersTotalHeight').trim();
    const headerPx = parseFloat(raw);
    const gap = 8;
    const shift = (Number.isFinite(headerPx) && headerPx > 0 ? headerPx : 56) + gap;
    const offsets = state.modifiersData.popperOffsets;
    if (offsets) {
      offsets.y -= shift;
    }
  },
};

const BASE_TABLE_HEIGHT = 111;
const BASE_DATAGRID_SX = {
  backgroundColor: 'white',
  // We don't want a focused cell to have a border
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
    outline: 'none',
  },
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
};

export type PaginationModel = { page: number; pageSize: number };

/** DataGridProps omits some div ARIA attributes from its typings; we forward these to slotProps.main (v7). */
type GridMainAriaProps = Pick<
  ComponentProps<'div'>,
  'aria-label' | 'aria-labelledby' | 'aria-describedby'
>;

export type AgDataGridProps = {
  loading: boolean;
  skeletonColumnWidths: number[];
  paginationModel: PaginationModel;
  onPaginationModelChange?: (model: PaginationModel) => void;
  autoTableHeight?: boolean;
  noRowsMessage?: string;
  noResultsMessage?: string;
  paginationMode?: 'client' | 'server';
  filterMode?: 'client' | 'server';
} & Omit<DataGridProps, 'page' | 'pageSize' | 'onPageChange' | 'onPageSizeChange'> &
  Partial<GridMainAriaProps>;

/** slotProps.panel forwards to BasePopper; typings omit placement / popperOptions. */
type DataGridPanelSlotAugmented = NonNullable<DataGridProps['slotProps']>['panel'] & {
  placement?: string;
  popperOptions?: { modifiers?: readonly unknown[]; [key: string]: unknown };
};

const inTestMode = process.env.NODE_ENV === 'test';

const AgDataGrid = ({
  loading,
  skeletonColumnWidths,
  paginationModel,
  onPaginationModelChange,
  autoTableHeight = false,
  noRowsMessage = 'No rows',
  noResultsMessage = 'No results',
  rowHeight = 52,
  paginationMode = 'client',
  filterMode = 'client',
  pageSizeOptions = [5, 10, 25, 50, 100],
  rows,
  sx,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  slotProps: incomingSlotProps,
  ...rest
}: AgDataGridProps) => {
  const { main: parentMain, ...parentSlotRest } = incomingSlotProps ?? {};
  const parentPanel = (parentSlotRest.panel ?? {}) as DataGridPanelSlotAugmented;
  const [internalPaginationModel, setInternalPaginationModel] = useState(paginationModel);
  const isControlled = onPaginationModelChange !== undefined;
  const effectivePaginationModel = isControlled ? paginationModel : internalPaginationModel;
  const { pageSize } = effectivePaginationModel;

  const tableHeight = BASE_TABLE_HEIGHT + pageSize * rowHeight;
  const isTableHeightAuto =
    autoTableHeight &&
    rows &&
    rows.length !== 0 &&
    effectivePaginationModel.page !== Math.floor(rows.length / pageSize);

  const handlePaginationModelChange = (model: PaginationModel) => {
    if (!isControlled) {
      setInternalPaginationModel(model);
    } else {
      onPaginationModelChange?.(model);
    }
  };

  const LoadingOverlay = () => (
    <TableLoadingSkeleton numberOfRows={pageSize} columnWidths={skeletonColumnWidths} />
  );

  const NoRowsOverlay = () => (
    <Stack height="100%" alignItems="center" justifyContent="center">
      {!loading ? noRowsMessage : ''}
    </Stack>
  );

  const NoResultsOverlay = () => (
    <Stack height="100%" alignItems="center" justifyContent="center">
      {!loading ? noResultsMessage : ''}
    </Stack>
  );
  const theme = useTheme();

  return (
    <Box height={isTableHeightAuto ? 'auto' : tableHeight} width={'100%'}>
      <DataGrid
        slots={{
          loadingOverlay: LoadingOverlay,
          noRowsOverlay: NoRowsOverlay,
          noResultsOverlay: NoResultsOverlay,
        }}
        slotProps={{
          ...parentSlotRest,
          // Open filter/columns preference panel above the grid body; Popper modifier clears column headers.
          // GridPanel forwards extra props to BasePopper; MUI typings omit several keys on slotProps.panel.
          panel: {
            ...parentPanel,
            placement: parentPanel.placement ?? 'top-end',
            popperOptions: {
              ...parentPanel.popperOptions,
              modifiers: [
                shiftDataGridPanelAboveColumnHeaders,
                ...(parentPanel.popperOptions?.modifiers ?? []),
              ],
            },
          } as NonNullable<DataGridProps['slotProps']>['panel'],
          filterPanel: {
            filterFormProps: {
              columnInputProps: { 'aria-label': 'Filter by column' },
              operatorInputProps: { 'aria-label': 'Filter operator' },
              valueInputProps: { 'aria-label': 'Filter value' },
            },
            ...parentSlotRest.filterPanel,
          },
          main: {
            ...parentMain,
            ...(ariaLabel != null ? { 'aria-label': ariaLabel } : {}),
            ...(ariaLabelledBy != null ? { 'aria-labelledby': ariaLabelledBy } : {}),
            ...(ariaDescribedBy != null ? { 'aria-describedby': ariaDescribedBy } : {}),
          },
        }}
        disableRowSelectionOnClick
        rowHeight={rowHeight}
        autoHeight={isTableHeightAuto}
        sx={{
          ...BASE_DATAGRID_SX,
          ...sx,
          '&.MuiDataGrid-root .Mui-selected': {
            backgroundColor: `${theme.palette.secondary.main}15`,
            '&:hover': {
              backgroundColor: `${theme.palette.secondary.main}1E`,
            },
          },
        }}
        disableVirtualization={inTestMode}
        loading={loading}
        rows={rows}
        paginationModel={effectivePaginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        paginationMode={paginationMode}
        filterMode={filterMode}
        pageSizeOptions={pageSizeOptions}
        {...rest}
      />
    </Box>
  );
};

export default AgDataGrid;
