import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import AgDataGrid, { AgDataGridProps } from './AgDataGrid';
import {
  countriesByPopulationDensity,
  countriesByPopulationDensityColumns,
  countriesByPopulationDensityInitialState,
} from './countriesByPopulationDensity.grid';

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

const meta = {
  component: AgDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shared DataGrid wrapper. The **Countries and territories** story uses data from [Wikipedia — List of countries and dependencies by population density](https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density) (UN/FAO 2025 figures as cited on that page).',
      },
    },
  },
} satisfies Meta<typeof AgDataGrid>;

export default meta;

export const CountriesAndTerritories: StoryObj = {
  render: () => (
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
