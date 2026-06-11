import { Box, Skeleton, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import type { Meta, StoryObj } from '@storybook/react';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

import AgDataGrid, { AgDataGridProps, PaginationModel } from './AgDataGrid';
import {
  countriesByPopulationDensity,
  countriesByPopulationDensityColumns,
  countriesByPopulationDensityInitialState,
} from './countriesByPopulationDensity.grid';

const EM_PAGE_SIZE = 10;

const AgDataGridWithPagination = ({
  paginationModel: initialPaginationModel,
  ...rest
}: AgDataGridProps) => {
  const [paginationModel, setPaginationModel] = useState(
    initialPaginationModel ?? { page: 0, pageSize: 25 }
  );

  return (
    <AgDataGrid
      {...rest}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  );
};

/** ParticipantTable pattern: grid pagination with footer hidden and MUI Pagination below. */
const AgDataGridWithExternalPagination = ({
  pageSize = EM_PAGE_SIZE,
  rows = [],
  ...rest
}: Omit<AgDataGridProps, 'paginationModel' | 'onPaginationModelChange'> & { pageSize?: number }) => {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({ page: 0, pageSize });
  const pageTotal = useMemo(
    () => (rows.length ? Math.max(Math.ceil(rows.length / pageSize), 1) : 1),
    [rows.length, pageSize]
  );

  return (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <AgDataGrid
        {...rest}
        rows={rows}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <Pagination
        sx={{ alignSelf: 'center' }}
        count={pageTotal}
        page={paginationModel.page + 1}
        onChange={(_, page) => setPaginationModel((current) => ({ ...current, page: page - 1 }))}
      />
    </Box>
  );
};

const CustomLoadingOverlay = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    <Skeleton variant="rectangular" width="80%" height={40} />
  </Box>
);

function StorybookTablePagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      page={page + 1}
      count={pageCount}
      // @ts-expect-error MUI PaginationItem accepts disableRipple at runtime
      renderItem={(props) => <PaginationItem {...props} disableRipple />}
      onChange={(_event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const eventsManagerTableSx = {
  border: 'unset',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#ebf0ed',
  },
  '& .MuiDataGrid-row--lastVisible': { borderBottom: '1px solid #e0e0e0' },
};

const meta = {
  component: AgDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shared DataGrid wrapper. Use `layout="fixed"` with skeleton loading for List Manager tables, or `layout="auto"` with `footer="hidden"` / `loadingVariant="custom"` for Events Manager patterns.',
      },
    },
  },
} satisfies Meta<typeof AgDataGrid>;

export default meta;

/** List Manager default: fixed height, skeleton loading, standard footer. */
export const CountriesAndTerritories: StoryObj = {
  render: () => (
    <AgDataGridWithPagination
      layout="fixed"
      footer="standard"
      loadingVariant="skeleton"
      loading={false}
      skeletonColumnWidths={[12, 7, 9, 9]}
      rows={countriesByPopulationDensity}
      columns={countriesByPopulationDensityColumns}
      initialState={countriesByPopulationDensityInitialState}
      paginationModel={{ page: 0, pageSize: 25 }}
      noRowsMessage="No countries to display"
      noResultsMessage="No countries match the filter"
      aria-label="Countries and territories by population density"
    />
  ),
};

export const Loading: StoryObj = {
  render: () => (
    <AgDataGridWithPagination
      loading
      skeletonColumnWidths={[12, 7, 9, 9]}
      rows={[]}
      columns={countriesByPopulationDensityColumns}
      paginationModel={{ page: 0, pageSize: 10 }}
    />
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <AgDataGridWithPagination
      loading={false}
      skeletonColumnWidths={[12, 7, 9, 9]}
      rows={[]}
      columns={countriesByPopulationDensityColumns}
      paginationModel={{ page: 0, pageSize: 10 }}
      noRowsMessage="No countries to display"
    />
  ),
};

/** Events Manager ParticipantTable pattern: auto height, in-grid footer hidden, MUI Pagination below. */
export const EventsManagerExternalPagination: StoryObj = {
  render: () => (
    <AgDataGridWithExternalPagination
      layout="auto"
      footer="hidden"
      loadingVariant="custom"
      loading={false}
      rows={countriesByPopulationDensity}
      columns={countriesByPopulationDensityColumns}
      initialState={countriesByPopulationDensityInitialState}
      pageSize={EM_PAGE_SIZE}
      sx={{ ...eventsManagerTableSx, '--DataGrid-overlayHeight': '520px' }}
      slots={{
        loadingOverlay: CustomLoadingOverlay,
      }}
      noRowsMessage="No rows to display"
    />
  ),
};

/** Events Manager EventsList pattern: auto height, custom in-grid pagination slot. */
export const EventsManagerCustomPagination: StoryObj = {
  render: () => (
    <AgDataGridWithPagination
      layout="auto"
      footer="custom"
      loadingVariant="custom"
      loading={false}
      rows={countriesByPopulationDensity}
      columns={countriesByPopulationDensityColumns}
      initialState={countriesByPopulationDensityInitialState}
      paginationModel={{ page: 0, pageSize: 10 }}
      pageSizeOptions={[10]}
      sx={eventsManagerTableSx}
      slots={{
        pagination: StorybookTablePagination,
        loadingOverlay: CustomLoadingOverlay,
        noRowsOverlay: () => (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>No rows meet your filter criteria</Typography>
          </Box>
        ),
      }}
    />
  ),
};

/** Events Manager FeesAndFinance pattern: capped height, all rows, in-grid scroll. */
export const EventsManagerStaticTable: StoryObj = {
  render: () => (
    <Box display="flex" flexDirection="column" gap={1} width="100%">
      <AgDataGrid
        layout="auto"
        maxHeight="70vh"
        footer="hidden"
        loadingVariant="none"
        loading={false}
        rows={countriesByPopulationDensity}
        columns={countriesByPopulationDensityColumns}
        initialState={countriesByPopulationDensityInitialState}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#ebf0ed',
          },
          '&.MuiDataGrid-root .MuiDataGrid-footerContainer': {
            maxHeight: '0px',
            height: '0px',
            minHeight: '0px',
          },
        }}
        slots={{
          pagination: null,
        }}
        noRowsMessage="No prices to display"
      />
      <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
        Note: MUI community DataGrid shows at most 100 rows at a time.
      </Typography>
    </Box>
  ),
};
