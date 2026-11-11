import { describe, expect, it } from 'vitest';

import { matchesDateFilter } from './matchesDateFilter';

describe('matchesDateFilter', () => {
  const row = '1990-06-15';

  it('matches every row when no filter date is set', () => {
    expect(matchesDateFilter(row, 'is', null)).toBe(true);
    expect(matchesDateFilter(row, 'onOrAfter', '')).toBe(true);
  });

  it('compares calendar days for each operator', () => {
    expect(matchesDateFilter(row, 'is', '1990-06-15')).toBe(true);
    expect(matchesDateFilter(row, 'is', '1990-06-16')).toBe(false);
    expect(matchesDateFilter(row, 'isNot', '1990-06-16')).toBe(true);
    expect(matchesDateFilter(row, 'isAfter', '1990-06-14')).toBe(true);
    expect(matchesDateFilter(row, 'isAfter', '1990-06-15')).toBe(false);
    expect(matchesDateFilter(row, 'isBefore', '1990-06-16')).toBe(true);
    expect(matchesDateFilter(row, 'isBefore', '1990-06-15')).toBe(false);
    expect(matchesDateFilter(row, 'onOrAfter', '1990-06-15')).toBe(true);
    expect(matchesDateFilter(row, 'onOrAfter', '1990-06-16')).toBe(false);
    expect(matchesDateFilter(row, 'onOrBefore', '1990-06-15')).toBe(true);
    expect(matchesDateFilter(row, 'onOrBefore', '1990-06-14')).toBe(false);
  });
});
