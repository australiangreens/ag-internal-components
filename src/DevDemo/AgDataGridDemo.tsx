import { Typography } from '@mui/material';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import {
  AgDataGrid,
  AgDataGridProps,
  navBarTopAtom,
  topBarMiddleAtom,
} from 'ag-internal-components';
import {
  countriesByPopulationDensity,
  countriesByPopulationDensityColumns,
  countriesByPopulationDensityInitialState,
} from '../components/AgDataGrid/countriesByPopulationDensity.grid';

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

export default function AgDataGridDemo() {
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

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
      <AgDataGridWithPagination
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
    </>
  );
}
