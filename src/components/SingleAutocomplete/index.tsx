import { Autocomplete, Stack, SxProps, TextField, Theme } from '@mui/material';
import React, { SyntheticEvent, useState } from 'react';
import { AutocompleteGenericEntity } from '../types';

type Props<EntityType extends AutocompleteGenericEntity> = {
  /**
   * Callback fired when the value changes. reason is one of "createOption",
   * "selectOption", "removeOption", "blur" or "clear". This is passed directly
   * to the underlying Autocomplete, but it is triggered by the Autocomplete's
   * own onChange.
   */
  onChange: (event: SyntheticEvent<Element, Event>, newValue: EntityType | null) => unknown;

  value: EntityType | null;

  /** A nice label for the autocomplete. */
  label: string;

  /** The lookup function, for looking up EntityType options from a remote resource. */
  lookup: (
    lookupValue: string,
    abortSignal: AbortSignal
  ) => Promise<EntityType[] | undefined | null | void>;

  dataTestidPrefix?: string;

  minLength?: number;
  hideButton?: boolean;
  sx?: SxProps<Theme>;
  textFieldColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
};

const SingleAutocomplete = <EntityType extends AutocompleteGenericEntity>({
  lookup,
  onChange,
  label,
  value,
  sx,
  textFieldColor,
  dataTestidPrefix = '',
  minLength = 3,
}: Props<EntityType>) => {
  const [options, setOptions] = useState<readonly EntityType[]>([]);
  const [loading, setLoading] = useState(false);

  let abortController: AbortController;
  const fetchAndSet = async (newInputValue: string) => {
    abortController = new AbortController();
    try {
      const entities = await lookup(newInputValue, abortController.signal);
      setOptions(entities ?? []);
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.debug('Previous lookup request was cancelled');
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          sx={sx}
          data-testid={dataTestidPrefix ? dataTestidPrefix + 'Autocomplete' : undefined}
          loading={loading}
          options={options}
          onChange={(event, newValue) => {
            onChange(event, newValue);
          }}
          filterOptions={(option) => option}
          value={value}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              data-testid={dataTestidPrefix ? dataTestidPrefix + 'TextField' : undefined}
              {...params}
              variant="filled"
              label={label}
              color={textFieldColor}
            />
          )}
          isOptionEqualToValue={(option, v) => option.id === v.id}
          onInputChange={(_event, newInputValue) => {
            if (newInputValue?.length >= minLength) {
              setLoading(true);
              fetchAndSet(newInputValue);
            }
          }}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                key={option.id}
                data-testid={
                  dataTestidPrefix ? dataTestidPrefix + 'li' + option.id.toString() : undefined
                }
              >
                {option.label}
              </li>
            );
          }}
        />
      </Stack>
    </>
  );
};

export default SingleAutocomplete;
