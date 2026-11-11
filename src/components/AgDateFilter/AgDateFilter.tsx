import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enAU } from 'date-fns/locale';
import { useState } from 'react';

import {
  DATE_FILTER_OPERATORS,
  DEFAULT_DATE_FILTER_OPERATOR,
  type DateFilterOperator,
} from './operators';

export type AgDateFilterProps = {
  /** Label on the date picker. The operator dropdown is labelled "Operator". */
  label?: string;
  id?: string;
  /** Controlled operator. Omit it to let the control keep the operator itself. */
  operator?: DateFilterOperator;
  /** Starting operator when `operator` is omitted. Defaults to on or after. */
  defaultOperator?: DateFilterOperator;
  onOperatorChange?: (operator: DateFilterOperator) => void;
  value: Date | null;
  onChange: (value: Date | null) => void;
};

const AgDateFilter = ({
  label = 'Date',
  id,
  operator: operatorProp,
  defaultOperator = DEFAULT_DATE_FILTER_OPERATOR,
  onOperatorChange,
  value,
  onChange,
}: AgDateFilterProps) => {
  const [uncontrolledOperator, setUncontrolledOperator] =
    useState<DateFilterOperator>(defaultOperator);
  const operator = operatorProp ?? uncontrolledOperator;
  const operatorLabelId = `${id ?? 'date-filter'}-operator-label`;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <FormControl sx={{ minWidth: 148, flex: '0 0 auto' }}>
          <InputLabel id={operatorLabelId}>Operator</InputLabel>
          <Select
            labelId={operatorLabelId}
            id={id ? `${id}-operator` : undefined}
            label="Operator"
            value={operator}
            onChange={(event) => {
              const next = event.target.value as DateFilterOperator;
              setUncontrolledOperator(next);
              onOperatorChange?.(next);
            }}
          >
            {DATE_FILTER_OPERATORS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          format="dd/MM/yyyy"
          sx={{ flex: 1, minWidth: 0 }}
          slotProps={{
            field: { clearable: true },
            textField: { fullWidth: true, id },
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default AgDateFilter;
