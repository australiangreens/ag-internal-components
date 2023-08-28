import { useState, useEffect, useMemo, SyntheticEvent } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  FilterOptionsState,
  Theme,
  SxProps,
} from '@mui/material';
import { Cancel as CancelIcon, ArrowDropDown as DefaultPopupIcon } from '@mui/icons-material';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import {
  AutocompleteGenericEntity,
  AutocompleteGenericEntityIdType,
  FetchAutocompleteChangeReason,
} from '../types';

export interface FetchAutocompleteProps<EntityType extends AutocompleteGenericEntity> {
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
  lookup?: (
    lookupValue: string,
    abortSignal: AbortSignal
  ) => Promise<EntityType[] | undefined | null | void>;

  /** If you have your EntityType options at hand, preload them instead, and save the
   * user's time. They should all be available when the user clicks on the drop down
   * menu, without even a single keystroke provided. This is the property you want.
   */
  preLoadedOptions?: EntityType[] | undefined;

  /** The popup icon */
  popupIcon?: React.ReactNode;

  /**
   * When testing, it is useful to give data-testid attributes to parts inside
   * the component. This prefix is useful to distinguish one FetchAutocomplete
   * instance from others.
   */
  dataTestidPrefix?: string;
  loadingText?: string;
  noOptionsText?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  enableHighlighting?: boolean;
  sx?: SxProps<Theme>;
  textFieldColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

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
  dataTestidPrefix,
  sx,
  textFieldColor,
  loadingText = 'Loading...',
  noOptionsText = 'No options',
  popupIcon = <DefaultPopupIcon />,
  error = false,
  helperText = '',
  preLoadedOptions = undefined,
}: FetchAutocompleteProps<EntityType>) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly EntityType[]>(preLoadedOptions || []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = (
    e: SyntheticEvent<Element, Event>,
    deleteValue: AutocompleteGenericEntityIdType
  ) => {
    const newInternalValue = value.filter((x) => x.id !== deleteValue);
    onChange(newInternalValue, 'delete', e);
  };

  useEffect(() => {
    let abortController: AbortController;

    const fetchAndSet = async () => {
      abortController = new AbortController();
      try {
        const entities = await lookup(inputValue, abortController.signal);
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

    if (inputValue === '') {
      return undefined;
    }

    if ((!minLength || inputValue.length >= minLength) && !preLoadedOptions) {
      setLoading(true);
      fetchAndSet();
    } else {
      setLoading(false);
    }

    return function cleanup() {
      if (abortController) abortController.abort();
    };
  }, [inputValue, lookup, minLength, preLoadedOptions]);

  useEffect(() => {
    if (!open && !preLoadedOptions) setOptions([]);
    if (!open && preLoadedOptions) setOptions(preLoadedOptions);
  }, [open, preLoadedOptions]);

  const filterOptions = useMemo(() => {
    if (preLoadedOptions) {
      // If there are preloaded options, currentOptions will never be updated,
      // so we need to filter it so only the matches for the current inputValue
      // are shown. Otherwise we'll just highlights that aren't always visible.
      return (currentOptions: EntityType[], state: FilterOptionsState<EntityType>) =>
        currentOptions.filter((x) =>
          x.label.toLowerCase().includes(state.inputValue.toLowerCase())
        );
    } else {
      // When there are no preloaded options, then the currentOptions were just
      // fetched based on the inputValue and will already be filtered to the
      // ones matching/containing the input - there is no need further filtering
      // needed.
      return (currentOptions: EntityType[]) => currentOptions;
    }
  }, [preLoadedOptions]);

  return (
    <>
      <Autocomplete
        sx={sx}
        data-testid={dataTestidPrefix ? dataTestidPrefix + 'Autocomplete' : undefined}
        disablePortal
        multiple
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        filterOptions={filterOptions}
        loading={loading}
        // See https://github.com/mui/material-ui/issues/18514
        // TODO: Is this still relevant?
        options={[...value, ...options]}
        // However we hide the selected ones from the dropdown, since most of
        // the time they won't contain what the user typed next
        filterSelectedOptions
        // autoComplete// This doesn't work at time of writing https://github.com/mui-org/material-ui/issues/22648
        includeInputInList
        value={value}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(event, newValue, reason) => {
          onChange(newValue, reason, event);
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
            variant="filled"
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            data-testid={dataTestidPrefix ? dataTestidPrefix + 'TextField' : undefined}
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
                  dataTestidPrefix ? dataTestidPrefix + 'li' + option.id.toString() : undefined
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
                  dataTestidPrefix ? dataTestidPrefix + 'li' + option.id.toString() : undefined
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
                data-testid={
                  dataTestidPrefix ? dataTestidPrefix + 'Chip' + val.id.toString() : undefined
                }
                onDelete={(e) => handleDelete(e, val.id)}
                deleteIcon={
                  <CancelIcon
                    data-testid={
                      dataTestidPrefix
                        ? dataTestidPrefix + 'ChipDelete' + val.id.toString()
                        : 'CancelIcon'
                    }
                  />
                }
              />
            );
          })}
        </Box>
      )}
    </>
  );
}
