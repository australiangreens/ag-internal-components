import { describe, expect, it } from 'vitest';

import { REGIONS, filterSovereignStates, sovereignStates } from './sovereignStates';

describe('sovereignStates demo data', () => {
  it('uses the five regions and an ISO date on every row', () => {
    expect(sovereignStates.length).toBeGreaterThan(200);
    for (const row of sovereignStates) {
      expect(REGIONS).toContain(row.region);
      expect(row.founded).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(`${row.founded}T00:00:00Z`).getTime())).toBe(false);
    }
  });

  it('maps sample states and territories', () => {
    expect(sovereignStates.find((row) => row.name === 'Hungary')).toMatchObject({
      region: 'Eurasia',
      founded: '1989-10-23',
      isTerritory: false,
    });
    expect(sovereignStates.find((row) => row.name === 'United States')).toMatchObject({
      region: 'North America',
      founded: '1781-10-19',
      isTerritory: false,
    });
    expect(sovereignStates.find((row) => row.name === 'Brazil')).toMatchObject({
      region: 'South America',
      isTerritory: false,
    });
    expect(sovereignStates.find((row) => row.name === 'Egypt')).toMatchObject({
      region: 'Africa',
      isTerritory: false,
    });
    expect(sovereignStates.find((row) => row.name === 'Greenland')).toMatchObject({
      region: 'North America',
      founded: '1979-01-01',
      isTerritory: true,
    });
  });

  it('filters name, region, country, date, and territory together', () => {
    const territories = filterSovereignStates(sovereignStates, {
      name: '',
      region: 'Oceania',
      country: null,
      fromDate: '1990-01-01',
      territoriesOnly: true,
    });

    expect(territories.map((row) => row.name).sort()).toEqual([
      'French Polynesia',
      'New Caledonia',
    ]);
  });
});
