/**
 * Countries and territories by population density.
 * Source: Wikipedia — List of countries and dependencies by population density
 * https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density
 * Retrieved June 2026. UN/FAO 2025 figures as cited on that page.
 */
import rawCountries from './countriesByPopulationDensity.data.json';

export type CountryDensityRow = {
  id: number;
  name: string;
  areaKm2: number;
  population: number;
  densityPerKm2: number;
};

export const countriesByPopulationDensity = rawCountries as CountryDensityRow[];
