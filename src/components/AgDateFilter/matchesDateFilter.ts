import { format, isValid } from 'date-fns';

import type { DateFilterOperator } from './operators';

/** Calendar day as YYYY-MM-DD, so comparisons ignore the time of day. */
export function toIsoDate(value: Date | string): string | null {
  if (typeof value === 'string') {
    return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null;
  }
  if (!isValid(value)) return null;
  return format(value, 'yyyy-MM-dd');
}

/** A missing filter date matches every row. An unreadable row date does not match. */
export function matchesDateFilter(
  rowDate: Date | string,
  operator: DateFilterOperator,
  filterDate: Date | string | null
): boolean {
  if (filterDate == null || filterDate === '') return true;
  const row = toIsoDate(rowDate);
  const filter = toIsoDate(filterDate);
  if (!filter) return true;
  if (!row) return false;
  switch (operator) {
    case 'is':
      return row === filter;
    case 'isNot':
      return row !== filter;
    case 'isAfter':
      return row > filter;
    case 'isBefore':
      return row < filter;
    case 'onOrAfter':
      return row >= filter;
    case 'onOrBefore':
      return row <= filter;
    default: {
      const unexpected: never = operator;
      return unexpected;
    }
  }
}
