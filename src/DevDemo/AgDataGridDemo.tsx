import { Box, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import type { GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import {
  AgDataGrid,
  navBarTopAtom,
  PaginationModel,
  topBarMiddleAtom,
} from 'ag-internal-components';
import {
  countriesByPopulationDensity,
  countriesByPopulationDensityColumns,
  countriesByPopulationDensityInitialState,
} from '../components/AgDataGrid/countriesByPopulationDensity.grid';

type DemoStyle = 'listManager' | 'eventsManager';

const defaultSortModel: GridSortModel =
  countriesByPopulationDensityInitialState.sorting?.sortModel ?? [{ field: 'name', sort: 'asc' }];

const eventsManagerTableSx = {
  border: 'unset',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#ebf0ed',
  },
  '& .MuiDataGrid-row--lastVisible': { borderBottom: '1px solid #e0e0e0' },
};

const CustomLoadingOverlay = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    <Skeleton variant="rectangular" width="80%" height={40} />
  </Box>
);

function DemoTablePagination() {
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

export default function AgDataGridDemo() {
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);
  const [style, setStyle] = useState<DemoStyle>('listManager');
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>(defaultSortModel);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

  const isListManager = style === 'listManager';

  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        AgDataGrid Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Countries and territories by population density. Data from{' '}
        <a
          href="https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density"
          target="_blank"
          rel="noreferrer"
        >
          Wikipedia
        </a>{' '}
        (UN/FAO 2025 figures as cited on that page).
      </Typography>
      <ToggleButtonGroup
        value={style}
        exclusive
        onChange={(_, value: DemoStyle | null) => value && setStyle(value)}
        sx={{ mb: 2 }}
        aria-label="Table style"
      >
        <ToggleButton value="listManager">List Manager</ToggleButton>
        <ToggleButton value="eventsManager">Events Manager</ToggleButton>
      </ToggleButtonGroup>
      <AgDataGrid
        layout={isListManager ? 'fixed' : 'auto'}
        footer={isListManager ? 'standard' : 'custom'}
        loadingVariant={isListManager ? 'skeleton' : 'custom'}
        loading={false}
        skeletonColumnWidths={isListManager ? [12, 7, 9, 9] : undefined}
        rows={countriesByPopulationDensity}
        columns={countriesByPopulationDensityColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        pageSizeOptions={[25]}
        sx={isListManager ? undefined : eventsManagerTableSx}
        slots={
          isListManager
            ? undefined
            : {
                pagination: DemoTablePagination,
                loadingOverlay: CustomLoadingOverlay,
                noRowsOverlay: () => (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography>No rows meet your filter criteria</Typography>
                  </Box>
                ),
              }
        }
        noRowsMessage={isListManager ? 'No countries to display' : 'No rows to display'}
        noResultsMessage={
          isListManager ? 'No countries match the filter' : 'No rows meet your filter criteria'
        }
        aria-label="Countries and territories by population density"
      />
    </>
  );
}
