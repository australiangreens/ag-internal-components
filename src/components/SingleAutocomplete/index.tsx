import {
  Autocomplete,
  AutocompleteChangeReason,
  Stack,
  SxProps,
  TextField,
  Theme,
} from '@mui/material';
import { ReactNode, SyntheticEvent, useState } from 'react';
import { useAutocompleteOptions } from '../FetchAutocomplete';
import { MOUSE_EVENT_BUTTONS } from '../FetchAutocomplete/const';
import { AutocompleteGenericEntity } from '../types';

/**
 * MUI Autocomplete has a harmless warning when the available options do not
 * include the old selected value of the auto complete (its skipped in
 * production). This regex can be used as as suppressConsole('warn',
 * MUI_AUTOCOMPLETE_VALUE_WARNING_REGEX) to avoid it in development
 * environments.
 */
export const MUI_AUTOCOMPLETE_VALUE_WARNING_REGEX = /MUI: The value provided to.*is invalid/i;

type Props<EntityType extends AutocompleteGenericEntity> = {
  /**
   * Callback fired when the value changes. reason is one of "createOption",
   * "selectOption", "removeOption", "blur" or "clear". This is passed directly
   * to the underlying Autocomplete, but it is triggered by the Autocomplete's
   * own onChange.
   */
  onChange: (
    event: SyntheticEvent<Element, Event>,
    newValue: EntityType | null,
    reason: AutocompleteChangeReason
  ) => unknown;
  value: EntityType | null;

  /**
   * A minimum length of characters in the Autocomplete before the lookup is called. If not set,
   * then the lookup is called every time.
   */
  minLength?: number;

  /** A nice label for the autocomplete. */
  label: string;

  /** The lookup function, for looking up EntityType options from a remote resource. */
  lookup?: (lookupValue: string) => Promise<EntityType[] | undefined | null | void>;

  preLoadedOptions?: EntityType[] | undefined;

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

  hideButton?: boolean;
  noOptionsText?: string;
  sx?: SxProps<Theme>;
  textFieldColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  textFieldVariant?: 'filled' | 'outlined' | 'standard';
  error?: boolean;
  helperText?: ReactNode;
  disabled?: boolean;
  popupIcon?: ReactNode;
  disableIconFlip?: boolean;
  isPlaceholder?: boolean;
  placeHolderText?: string;

  /**
   * Called when a right click is detected.
   */
  onRightClick?: (event: SyntheticEvent<Element, Event>) => void;

  /**
   * If set to true, the default right click behaviour will be overridden: the
   * dropdown/prompt will not appear and neither will the browser context menu.
   *
   * Use in combination with onRightClick to override the behaviour.
   *
   * Note: This can't just be done by passing through onRightClick having it
   * prevent the event default, because there are two events that need to be
   * listened for.
   */
  disableDefaultRightClickBehaviour?: boolean;
};

const SingleAutocomplete = <EntityType extends AutocompleteGenericEntity>({
  lookup = async () => {},
  onChange,
  label,
  value,
  sx,
  textFieldColor,
  textFieldVariant = 'filled',
  error = false,
  'data-testid': dataTestId,
  noOptionsText = 'No options',
  minLength = 3,
  disablePortal = false,
  preLoadedOptions,
  helperText = '',
  disabled,
  popupIcon,
  disableIconFlip,
  isPlaceholder = false,
  placeHolderText = undefined,
  onRightClick = () => {},
  disableDefaultRightClickBehaviour = false,
}: Props<EntityType>) => {
  const [inputValue, setInputValue] = useState('');

  const { data: options, isLoading } = useAutocompleteOptions({
    inputValue,
    label,
    lookup,
    minLength: minLength ?? 0,
    preLoadedOptions,
  });

  const isInputMinimumLength = inputValue.length >= minLength;

  const placeholderStyle = isPlaceholder
    ? {
        sx: {
          '& .MuiFilledInput-root.Mui-focused': {
            backgroundColor: 'hsla(201, 98%, 41%, 0.08)',
          },
        },
        focused: true,
      }
    : {};

  return (
    <div data-testid={dataTestId}>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          sx={{
            ...sx,
            ...(disableIconFlip
              ? { '.MuiAutocomplete-popupIndicatorOpen': { transform: 'rotate(0deg)' } }
              : {}),
          }}
          data-testid={dataTestId ? `${dataTestId}:Autocomplete` : undefined}
          loading={isInputMinimumLength ? isLoading : false}
          options={options ?? []}
          onChange={(event, newValue, reason) => {
            onChange(event, newValue, reason);
          }}
          disablePortal={disablePortal}
          filterOptions={(option) => option}
          value={value}
          noOptionsText={isInputMinimumLength ? noOptionsText : 'Start typing to search'}
          getOptionLabel={(option) => option.label}
          popupIcon={popupIcon}
          renderInput={(params) => (
            <TextField
              data-testid={dataTestId ? `${dataTestId}:Autocomplete:TextField` : undefined}
              {...params}
              variant={textFieldVariant}
              label={label}
              color={textFieldColor}
              error={error}
              helperText={helperText}
              placeholder={placeHolderText}
              {...placeholderStyle}
            />
          )}
          isOptionEqualToValue={(option, v) => option.id === v.id}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderOption={(props, option) => (
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
          )}
          disabled={disabled}
          // If we want to capture right click, we need to listen for two events
          onMouseDownCapture={(event) => {
            if (event.button === MOUSE_EVENT_BUTTONS.right) {
              if (disableDefaultRightClickBehaviour) {
                event.preventDefault();
                event.stopPropagation();
              }
              onRightClick(event);
            }
          }}
          onContextMenuCapture={(event) => {
            if (disableDefaultRightClickBehaviour) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        />
      </Stack>
    </div>
  );
};

export default SingleAutocomplete;
