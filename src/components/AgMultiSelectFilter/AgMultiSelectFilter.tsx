import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';

export type AgMultiSelectFilterProps<T extends string> = {
  label: string;
  id?: string;
  options: readonly T[];
  value: readonly T[];
  onChange: (value: T[]) => void;
};

const AgMultiSelectFilter = <T extends string>({
  label,
  id,
  options,
  value,
  onChange,
}: AgMultiSelectFilterProps<T>) => {
  const labelId = `${id ?? label}-label`;

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        label={label}
        multiple
        value={[...value]}
        renderValue={(selected) => (selected as T[]).join(', ')}
        onChange={(event) => {
          const next = event.target.value;
          onChange((typeof next === 'string' ? next.split(',') : next) as T[]);
        }}
        endAdornment={
          value.length > 0 ? (
            <IconButton
              aria-label={`Clear ${label}`}
              size="small"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onChange([]);
              }}
              sx={{ marginRight: '18px' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ) : undefined
        }
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AgMultiSelectFilter;
