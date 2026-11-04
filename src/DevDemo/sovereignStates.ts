import rawRows from './sovereignStates.data.json';

export const REGIONS = ['Eurasia', 'North America', 'South America', 'Africa', 'Oceania'] as const;

export type Region = (typeof REGIONS)[number];

export type SovereignStateRow = {
  id: number;
  name: string;
  region: Region;
  /** ISO date with a four-digit year. A year-only source date is 1 January of that year. */
  founded: string;
  isTerritory: boolean;
};

export const sovereignStates = rawRows as SovereignStateRow[];

export type StateSearch = {
  name: string;
  region: '' | Region;
  country: string | null;
  fromDate: string;
  territoriesOnly: boolean;
};

export const emptyStateSearch: StateSearch = {
  name: '',
  region: '',
  country: null,
  fromDate: '',
  territoriesOnly: false,
};

export const filterSovereignStates = (rows: SovereignStateRow[], search: StateSearch) => {
  const nameQuery = search.name.trim().toLowerCase();
  return rows.filter((row) => {
    if (nameQuery && !row.name.toLowerCase().includes(nameQuery)) return false;
    if (search.region && row.region !== search.region) return false;
    if (search.country && row.name !== search.country) return false;
    if (search.fromDate && row.founded < search.fromDate) return false;
    if (search.territoriesOnly && !row.isTerritory) return false;
    return true;
  });
};
