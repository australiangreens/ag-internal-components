export type AutocompleteGenericEntityIdType = number | string;

/**
 * These are an extension of the reasons for MUI's Autocomplete. We add
 * 'delete', 'setIsTemplatePlaceholder' and 'unsetIsTemplatePlaceholder' reason.
 */
export type FetchAutocompleteChangeReason =
  | 'createOption'
  | 'selectOption'
  | 'removeOption'
  | 'blur'
  | 'clear'
  | 'delete'
  | 'setIsTemplatePlaceholder'
  | 'unsetIsTemplatePlaceholder';

export interface AutocompleteGenericEntity {
  id: AutocompleteGenericEntityIdType;
  label: string;
  /**
   * optional chip label specifically for displaying custom chip
   * eg. search by event name: show truncated label and append startDate
   */
  chipLabel?: string;
  tooltipContent?: string;
}
