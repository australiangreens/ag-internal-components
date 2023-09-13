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

  /**
   * Used for the data-testid value of the outer most component. The underlying
   * AutoComplete component has the id of this, followed by a colon then
   * 'AutoComplete', while the text field is followed by 'TextField'.
   *
   * Currently has no default to avoid collisions. May change in future to
   * simply be 'FetchAutocomplete' if that is not an issue.
   */
  'data-testid'?: string;

  /**If true, the Popper content will be under the DOM hierarchy of the parent
   * component. Passed directly to underlying MUI Autocomplete component.*/
  disablePortal?: boolean;

  noOptionsText?: string;
  minLength?: number;
  hideButton?: boolean;
  sx?: SxProps<Theme>;
  textFieldColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  textFieldVariant?: 'filled' | 'outlined' | 'standard';
};

const SingleAutocomplete = <EntityType extends AutocompleteGenericEntity>({
  lookup,
  onChange,
  label,
  value,
  sx,
  textFieldColor,
  textFieldVariant = 'filled',
  'data-testid': dataTestId,
  noOptionsText = 'No options',
  minLength = 3,
  disablePortal = false,
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
    <div data-testid={dataTestId}>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          sx={sx}
          data-testid={dataTestId ? `${dataTestId}:Autocomplete` : undefined}
          loading={loading}
          options={options}
          onChange={(event, newValue) => {
            onChange(event, newValue);
          }}
          disablePortal={disablePortal}
          filterOptions={(option) => option}
          value={value}
          noOptionsText={noOptionsText}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              data-testid={dataTestId ? `${dataTestId}:Autocomplete:TextField` : undefined}
              {...params}
              variant={textFieldVariant}
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
                  dataTestId
                    ? `${dataTestId}:Autocomplete:option(${option.id.toString()})`
                    : undefined
                }
              >
                {option.label}
              </li>
            );
          }}
        />
      </Stack>
    </div>
  );
};

export default SingleAutocomplete;
