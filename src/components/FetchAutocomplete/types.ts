export type GenericAutocompleteEntityIdType = number | string;

export interface GenericAutocompleteEntity {
  id: GenericAutocompleteEntityIdType;
  label: string;
  /**
   * optional chip label specifically for displaying custom chip
   * eg. search by event name: show truncated label and append startDate
   */
  chipLabel?: string;
  tooltipContent?: string;
}
