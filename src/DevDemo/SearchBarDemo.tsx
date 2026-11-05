import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  AgDataGrid,
  AgTableSearchBar,
  AutocompleteGenericEntity,
  SingleAutocomplete,
  navBarTopAtom,
  topBarMiddleAtom,
} from 'ag-internal-components';
import { useSetAtom } from 'jotai';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';

import {
  REGIONS,
  type Region,
  type StateSearch,
  emptyStateSearch,
  filterSovereignStates,
  sovereignStates,
} from './sovereignStates';

interface CountryOption extends AutocompleteGenericEntity {
  id: string;
}

const countryOptions: CountryOption[] = sovereignStates.map((row) => ({
  id: String(row.id),
  label: row.name,
}));

const lookupCountry = async (lookupValue: string) => {
  const query = lookupValue.toLowerCase();
  return countryOptions.filter(
    (country) =>
      country.label.toLowerCase().includes(query) || country.id.toLowerCase().includes(query)
  );
};

const formatFounded = (founded: string) => {
  const [year, month, day] = founded.split('-');
  const iso = `${year.padStart(4, '0')}-${month}-${day}T00:00:00Z`;
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/** Search name and Country share the Name column. The other columns stay narrower. */
const SEARCH_NAME_FLEX = 2.4;
const COUNTRY_FLEX = 2;
const REGION_FLEX = 1.5;
const FOUNDED_FLEX = 1.25;
const TERRITORY_FLEX = 1;

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: SEARCH_NAME_FLEX + COUNTRY_FLEX, minWidth: 280 },
  { field: 'region', headerName: 'Region', flex: REGION_FLEX, minWidth: 130 },
  {
    field: 'founded',
    headerName: 'Last subordination',
    flex: FOUNDED_FLEX,
    minWidth: 120,
    valueFormatter: (value) => formatFounded(String(value)),
  },
  {
    field: 'isTerritory',
    headerName: 'Territory',
    flex: TERRITORY_FLEX,
    minWidth: 100,
    valueFormatter: (value) => (value ? 'Yes' : 'No'),
  },
];

export default function SearchBarDemo() {
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);
  const [search, setSearch] = useState<StateSearch>(emptyStateSearch);
  const [draft, setDraft] = useState<StateSearch>(emptyStateSearch);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

  const rows = useMemo(() => filterSovereignStates(sovereignStates, search), [search]);

  const setLive = (patch: Partial<StateSearch>) =>
    setSearch((current) => ({ ...current, ...patch }));
  const setDraftField = (patch: Partial<StateSearch>) =>
    setDraft((current) => ({ ...current, ...patch }));

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: '8px' }}>
        AgTableSearchBar Demo
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
        Data from Wikipedia&apos;s{' '}
        <Link
          href="https://en.wikipedia.org/wiki/List_of_modern_sovereign_states_by_date_of_formation"
          target="_blank"
          rel="noreferrer"
        >
          List of modern sovereign states by date of formation
        </Link>
        . (Honduras is given only as May 1924, so that row uses 1 May). Territory dates come from
        the{' '}
        <Link
          href="https://en.wikipedia.org/wiki/Dependent_territory"
          target="_blank"
          rel="noreferrer"
        >
          Dependent territory
        </Link>{' '}
        page; when dates are supplied as bare years, they have been &quot;normalised&quot; to 1
        January.
      </Typography>
      <AgTableSearchBar
        dialogTitle="Filter countries"
        resetFlex={1.1}
        onReset={() => setSearch(emptyStateSearch)}
        onDialogOpen={() => setDraft(search)}
        onApply={() =>
          setSearch((current) => ({
            ...current,
            region: draft.region,
            country: draft.country,
            fromDate: draft.fromDate,
            territoriesOnly: draft.territoriesOnly,
          }))
        }
        fields={[
          {
            id: 'name',
            flex: SEARCH_NAME_FLEX,
            primary: true,
            render: () => (
              <TextField
                label="Search name"
                value={search.name}
                onChange={(event) => setLive({ name: event.target.value })}
                fullWidth
              />
            ),
          },
          {
            id: 'country',
            flex: COUNTRY_FLEX,
            render: (mode) => {
              const selectedName = mode === 'draft' ? draft.country : search.country;
              const value =
                countryOptions.find((country) => country.label === selectedName) ?? null;
              return (
                <SingleAutocomplete
                  label="Country"
                  value={value}
                  lookup={lookupCountry}
                  minLength={1}
                  sx={{ width: '100%' }}
                  onChange={(
                    _event: SyntheticEvent<Element, Event>,
                    newValue: CountryOption | null
                  ) => {
                    const country = newValue?.label ?? null;
                    if (mode === 'draft') setDraftField({ country });
                    else setLive({ country });
                  }}
                />
              );
            },
          },
          {
            id: 'region',
            flex: REGION_FLEX,
            render: (mode) => {
              const value = mode === 'draft' ? draft.region : search.region;
              return (
                <FormControl fullWidth>
                  <InputLabel id="demo-region-label">Region</InputLabel>
                  <Select
                    labelId="demo-region-label"
                    label="Region"
                    value={value}
                    onChange={(event) => {
                      const region = event.target.value as '' | Region;
                      if (mode === 'draft') setDraftField({ region });
                      else setLive({ region });
                    }}
                  >
                    <MenuItem value="">&nbsp;</MenuItem>
                    {REGIONS.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            },
          },
          {
            id: 'from-date',
            flex: FOUNDED_FLEX,
            render: (mode) => (
              <TextField
                label="Since"
                type="date"
                value={mode === 'draft' ? draft.fromDate : search.fromDate}
                onChange={(event) => {
                  const fromDate = event.target.value;
                  if (mode === 'draft') setDraftField({ fromDate });
                  else setLive({ fromDate });
                }}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            ),
          },
          {
            id: 'territory',
            flex: TERRITORY_FLEX,
            minWidth: 'max-content',
            render: (mode) => (
              <FormControlLabel
                sx={{ marginTop: '8px', marginLeft: 0, marginRight: 0 }}
                control={
                  <Checkbox
                    checked={mode === 'draft' ? draft.territoriesOnly : search.territoriesOnly}
                    onChange={(event) => {
                      const territoriesOnly = event.target.checked;
                      if (mode === 'draft') setDraftField({ territoriesOnly });
                      else setLive({ territoriesOnly });
                    }}
                  />
                }
                label="Territory?"
              />
            ),
          },
        ]}
      />

      <Box
        sx={{
          /* Leave room for the search bar's padding, field gaps, and Reset button. */
          boxSizing: 'border-box',
          width: 'calc(100% - 10.5rem)',
          paddingLeft: '12px',
        }}
      >
        <AgDataGrid
          layout="fixed"
          footer="standard"
          rows={rows}
          columns={columns}
          pageSizeOptions={[25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableColumnFilter
          aria-label="Countries and territories"
        />
      </Box>
    </>
  );
}
