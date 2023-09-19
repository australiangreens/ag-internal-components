import { Cancel as CancelIcon, ArrowDropDown as DefaultPopupIcon } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  SxProps,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { ReactNode, SyntheticEvent, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  AutocompleteGenericEntity,
  AutocompleteGenericEntityIdType,
  FetchAutocompleteChangeReason,
} from '../types';

export const useAutocompleteOptions = <EntityType extends AutocompleteGenericEntity>({
  minLength,
  preLoadedOptions,
  lookup,
  label,
  inputValue,
}: {
  minLength: number;
  preLoadedOptions: EntityType[] | undefined;
  lookup: (lookupValue: string) => Promise<EntityType[] | undefined | null | void>;
  label: string;
  inputValue: string;
}) => {
  return useQuery({
    queryFn: () => {
      if (minLength && inputValue.length < minLength) return preLoadedOptions ?? [];
      if (preLoadedOptions)
        return preLoadedOptions.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
      return lookup(inputValue);
    },
    queryKey: ['autocomplete', label, inputValue],
  });
};

export type FetchAutocompleteProps<EntityType extends AutocompleteGenericEntity> = {
  /**
   * Callback fired when the value changes. This is passed directly to the
   * underlying Autocomplete, but it is triggered by the Autocomplete's own
   * onChange, with the exception of the deletion of chips.
   */
  onChange: (
    newValue: EntityType[],
    reason: FetchAutocompleteChangeReason,
    event: SyntheticEvent<Element, Event>
  ) => unknown;

  /** The sequence of entity types returned. */
  value: EntityType[];

  /**
   * A minimum length of characters in the Autocomplete before the lookup is called. If not set,
   * then the lookup is called every time.
   */
  minLength?: number;

  /** A nice label for the autocomplete. */
  label: string;

  /** The lookup function, for looking up EntityType options from a remote resource. */
  lookup?: (lookupValue: string) => Promise<EntityType[] | undefined | null | void>;

  /** If you have your EntityType options at hand, preload them instead, and save the
   * user's time. They should all be available when the user clicks on the drop down
   * menu, without even a single keystroke provided. This is the property you want.
   */
  preLoadedOptions?: EntityType[] | undefined;

  /** The popup icon */
  popupIcon?: ReactNode;

  /**If true, the Popper content will be under the DOM hierarchy of the parent
   * component. Passed directly to underlying MUI Autocomplete component.*/
  disablePortal?: boolean;

  /**
   * Used for the data-testid value of the outer most component. The underlying
   * AutoComplete component has the id of this, followed by a colon then
   * 'AutoComplete', while the text field is followed by 'TextField'.
   *
   * Currently has no default to avoid collisions. May change in future to
   * simply be 'FetchAutocomplete' if that is not an issue.
   */
  'data-testid'?: string;

  loadingText?: string;
  noOptionsText?: string;
  error?: boolean;
  helperText?: ReactNode;
  enableHighlighting?: boolean;
  sx?: SxProps<Theme>;
  textFieldColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  textFieldVariant?: 'filled' | 'outlined' | 'standard';
};

/**
 * A wrapper around MUI's Autocomplete component, specifically for use with live
 * as-you-type fetching from an api and styled the way we want it across the app
 * by default.
 */
export default function FetchAutocomplete<EntityType extends AutocompleteGenericEntity>({
  lookup = async () => {},
  enableHighlighting = true,
  onChange,
  minLength,
  label,
  value,
  'data-testid': dataTestId,
  sx,
  textFieldColor,
  textFieldVariant = 'filled',
  loadingText = 'Loading...',
  noOptionsText = 'No options',
  popupIcon = <DefaultPopupIcon />,
  error = false,
  helperText = '',
  preLoadedOptions = undefined,
  disablePortal = false,
}: FetchAutocompleteProps<EntityType>) {
  const [inputValue, setInputValue] = useState('');

  const handleDelete = (
    e: SyntheticEvent<Element, Event>,
    deleteValue: AutocompleteGenericEntityIdType
  ) => {
    const newInternalValue = value.filter((x) => x.id !== deleteValue);
    onChange(newInternalValue, 'delete', e);
  };

  const { data: options, isLoading } = useAutocompleteOptions({
    inputValue,
    label,
    lookup,
    minLength: minLength ?? 0,
    preLoadedOptions,
  });

  return (
    <div data-testid={dataTestId}>
      <Autocomplete
        sx={sx}
        data-testid={dataTestId ? `${dataTestId}:Autocomplete` : undefined}
        disablePortal={disablePortal}
        multiple
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        loading={isLoading}
        // See https://github.com/mui/material-ui/issues/18514
        // TODO: Is this still relevant?
        options={[...value, ...(options ?? [])]}
        // However we hide the selected ones from the dropdown, since most of
        // the time they won't contain what the user typed next
        filterSelectedOptions
        // autoComplete// This doesn't work at time of writing https://github.com/mui-org/material-ui/issues/22648
        includeInputInList
        value={value}
        onChange={(event, newValue, reason) => {
          onChange(newValue as EntityType[], reason, event);
        }}
        onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
        noOptionsText={noOptionsText}
        loadingText={loadingText}
        popupIcon={popupIcon}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            fullWidth
            variant={textFieldVariant}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            data-testid={dataTestId ? `${dataTestId}:Autocomplete:TextField` : undefined}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === 'Backspace' || event.key === 'Delete') {
                event.stopPropagation();
              }
            }}
            color={textFieldColor}
          />
        )}
        // We render tags/chips below the component
        renderTags={() => null}
        isOptionEqualToValue={(option, v) => option.id === v.id}
        renderOption={(props, option, state) => {
          if (enableHighlighting) {
            const matches = match(option.label, state.inputValue, {
              insideWords: true,
              findAllOccurrences: true,
            });
            const parts = parse(option.label, matches);

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
                <div>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          } else {
            return (
              <li
                {...props}
                key={option.id}
                data-testid={
                  dataTestId ? `${dataTestId}:option(${option.id.toString()})` : undefined
                }
              >
                {option.label}
              </li>
            );
          }
        }}
      />
      {value.length > 0 && (
        <Box>
          {value.map((val) => {
            return (
              <Chip
                key={val.id}
                sx={{
                  marginTop: 1,
                  marginRight: 1,
                  height: 'auto',
                }}
                label={
                  <Tooltip
                    title={val.tooltipContent || ''}
                    placement="bottom-start"
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [115, -15],
                          },
                        },
                      ],
                    }}
                  >
                    <Typography style={{ whiteSpace: 'normal' }}>
                      {val.chipLabel ? val.chipLabel : val.label}
                    </Typography>
                  </Tooltip>
                }
                data-testid={dataTestId ? `${dataTestId}:Chip(${val.id.toString()})` : undefined}
                onDelete={(e) => handleDelete(e, val.id)}
                deleteIcon={
                  <CancelIcon
                    data-testid={
                      dataTestId ? `${dataTestId}:Chip(${val.id.toString()}):deleteIcon` : undefined
                    }
                  />
                }
              />
            );
          })}
        </Box>
      )}
    </div>
  );
}
