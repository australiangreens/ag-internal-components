export const DATE_FILTER_OPERATORS = [
  { value: 'is', label: 'is' },
  { value: 'isNot', label: 'is not' },
  { value: 'isAfter', label: 'is after' },
  { value: 'isBefore', label: 'is before' },
  { value: 'onOrAfter', label: 'on or after' },
  { value: 'onOrBefore', label: 'on or before' },
] as const;

export type DateFilterOperator = (typeof DATE_FILTER_OPERATORS)[number]['value'];

export type DateFilterOperatorOption = {
  value: DateFilterOperator;
  label: string;
};

export const DEFAULT_DATE_FILTER_OPERATOR: DateFilterOperator = 'onOrAfter';
