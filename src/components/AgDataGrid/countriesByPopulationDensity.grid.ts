import {
  getGridNumericOperators,
  getGridStringOperators,
  GridColDef,
  GridFilterOperator,
  GridInitialState,
} from '@mui/x-data-grid';

import { countriesByPopulationDensity } from './countriesByPopulationDensity.data';

const numberFormatter = (value: number | null | undefined) =>
  value == null ? '' : value.toLocaleString('en-AU');

const withoutEmptyFilterOperators = (operators: GridFilterOperator[]): GridFilterOperator[] =>
  operators.filter((operator) => operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty');

const stringFilterOperators = withoutEmptyFilterOperators(getGridStringOperators());
const numericFilterOperators = withoutEmptyFilterOperators(getGridNumericOperators());

export const countriesByPopulationDensityColumns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Country / territory',
    flex: 1.2,
    minWidth: 200,
    filterOperators: stringFilterOperators,
  },
  {
    field: 'areaKm2',
    headerName: 'Area (km²)',
    type: 'number',
    flex: 0.7,
    minWidth: 120,
    filterOperators: numericFilterOperators,
    valueFormatter: (value) => numberFormatter(value as number),
  },
  {
    field: 'population',
    headerName: 'Population',
    type: 'number',
    flex: 0.9,
    minWidth: 130,
    filterOperators: numericFilterOperators,
    valueFormatter: (value) => numberFormatter(value as number),
  },
  {
    field: 'densityPerKm2',
    headerName: 'Density (people/km²)',
    type: 'number',
    flex: 0.9,
    minWidth: 160,
    filterOperators: numericFilterOperators,
    valueFormatter: (value) => numberFormatter(value as number),
  },
];

export const countriesByPopulationDensityInitialState: GridInitialState = {
  sorting: {
    sortModel: [{ field: 'name', sort: 'asc' }],
  },
};

export { countriesByPopulationDensity };
