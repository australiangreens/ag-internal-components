# AgTableSearchBar

LIST-1019. One table search bar for Events Manager and List Manager, taken from the Events Manager events-list behaviour: fields share the row and shrink with it, and below the `sm` breakpoint only the primary field stays visible. The other fields open in a dialog.

## Problem

Four table search bars duplicate the same layout with different fields:

| App | Bar | Fields |
|---|---|---|
| Events Manager | Events list | Search event name (primary), Created by, Type, Campaign, Coordinator, Status |
| Events Manager | RSVP list | Search name (primary), Participant status, plus an Edit Status action on wide screens |
| List Manager | Search Library, Saved Searches | Search name (primary), Type, Created by, Description |
| List Manager | Search Library, Templates | Template name (primary), Created by, Description |

The events list resizes its fields and collapses to the primary field plus a filter icon. The RSVP list collapses, with a fixed `18rem` cap per field. Both Search Library bars use fixed pixel widths and have no small-screen collapse. The Lists page DataGrid column filters are a different control and are not part of this.

## Design

Add `AgTableSearchBar` to `ag-internal-components` at `src/components/AgTableSearchBar/`, exported from the components barrel.

The component renders the row, decides what is visible, and opens the filter dialog. It does not store field values, run lookups, or filter rows. Each page keeps **live** values (what the table filters on) and **draft** values (what the dialog edits).

### API

```ts
type AgTableSearchField = {
  id: string;
  /** Share of the wide-screen row. The events list uses 324 for the name and 204 for the rest. */
  flex: number;
  /** Stays in the bar at every width. The component only calls this field with 'live'. */
  primary?: boolean;
  /** Caps the field on a wide row. The RSVP list sets this; the events list does not. */
  maxWidth?: number | string;
  render: (mode: 'live' | 'draft') => ReactNode;
};

type AgTableSearchBarProps = {
  fields: AgTableSearchField[];
  onReset: () => void;
  resetLabel?: string; // default 'Reset Filter'
  dialogTitle?: string; // default 'Filter'
  /** Copy live secondary values into the draft. Runs before the dialog is shown. */
  onDialogOpen?: () => void;
  /** Commit the draft. The dialog closes only after this resolves. */
  onApply?: () => void | Promise<void>;
  /** Drop the draft. Cancel, backdrop, and escape all use this. */
  onCancel?: () => void | Promise<void>;
  /** Rendered after Reset on a wide screen, and omitted while the bar is collapsed. */
  actions?: ReactNode;
  /** Collapse when the viewport is below this MUI breakpoint. Default 'sm'. */
  collapseBelow?: Breakpoint;
};
```

The first field with `primary: true` is the primary field. If none is marked, the first field is primary. Further `primary: true` flags are ignored and those fields are secondary.

### Layout

On a wide screen every field renders with `'live'`, in order, in a flex row. Each field wrapper uses its `flex` weight and `minWidth: 0`, so the fields can shrink. An optional `maxWidth` is set on that wrapper. The row has 12px horizontal padding, 12px between fields, and 16px margin below. Reset sits at the end with `flexShrink: 0`. `actions` follows Reset.

Below `collapseBelow`, the bar shows the primary field with `'live'`, a filter icon button when any secondary field exists, and Reset. `actions` is omitted. The icon's accessible name is `Filter`. A bar with only a primary field never shows the icon. An empty `fields` array renders Reset alone.

### Dialog

The icon calls `onDialogOpen`, then opens an `AgDialog`. Secondary fields render with `'draft'`, full width, stacked. The primary field is not in the dialog; it keeps editing the live value while the dialog is open.

The primary button label is `Apply filter`. Apply runs `onApply` and closes the dialog only after it resolves. Cancel, backdrop click, and escape run `onCancel` and close only after that resolves. MUI moves focus into the dialog on open and back to the Filter button on close.

`onDialogOpen` overwrites the draft from the live secondary values, so a leftover draft cannot leak back in. `onCancel` may be omitted. Reset clears live values. The dialog is modal, so Reset cannot be clicked while it is open.

### Failure and resize

- If `onDialogOpen` throws, the dialog stays closed.
- If `onApply` or `onCancel` rejects, the dialog stays open. The bar does not change any field values itself. It catches the rejection, logs it, and does not rethrow into `AgDialog`, because that leaves the dialog buttons disabled.
- When secondary fields exist and `onDialogOpen` or `onApply` is missing, the bar still renders. In development it warns once per mounted bar.
- If the viewport crosses back above the collapse breakpoint while the dialog is open, the bar calls `onCancel` and closes the dialog when that resolves. A rejection leaves the dialog open. A collapsed bar with the dialog already closed has nothing to discard.

Field errors (lookup failure, validation, empty autocomplete results) stay inside the field components.

### Call sites

| Bar | Live values | Draft |
|---|---|---|
| Events list | Existing Jotai atoms | Existing local draft state. `onDialogOpen` replaces the effect that copies atoms into the draft when the screen becomes small. |
| RSVP list | The live map in `useFilters` | A second map, seeded on open. Apply writes it back. The extra `useFilters` inside `FilterDialog` is removed. |
| Saved searches | Existing Jotai atoms | New local draft for type, created by, and description. Name stays live only. |
| Templates | Existing Jotai atoms | New local draft for created by and description. Name stays live only. |

Search Library flex weights follow the current pixel widths. Saved Searches uses name 260, type 120, created by 220, description 220. Templates uses name 260, created by 220, description 220. Those fields then shrink with the row instead of staying fixed widths.

Row filtering stays in the page: `eventRowsFilter`, the Search Library "at least 3 characters" checks, and `useFilters`.

After the four bars use `AgTableSearchBar`, delete `FilterEventTableDialog` and the RSVP `TableFilters` row. `useFilters` stays for RSVP row filtering.

### Tests

`AgTableSearchBar.comp.test.tsx` in the library, with Vitest and Testing Library. Tests set `matchMedia` so the bar is wide or collapsed.

- Wide: every field renders `'live'`; Reset calls `onReset`; `actions` is shown; the Filter button is absent.
- Collapsed: only the primary field renders, with `'live'`; secondary fields and `actions` are absent; the Filter button is shown only when a secondary field exists; an empty `fields` array renders Reset alone.
- Dialog: Filter calls `onDialogOpen`, then shows secondary fields with `'draft'`. A throwing `onDialogOpen` leaves the dialog closed. Apply and cancel close the dialog only after the callback resolves, and a rejection leaves it open. Crossing back above the breakpoint while open calls `onCancel` and closes the dialog when that resolves.

Page tests keep covering real fields and filtering. Update the Filter button's accessible name to `Filter` where those tests look for `filter-list-button`.

- Events list integration tests keep covering the name field, reset, and filtering.
- RSVP coverage of the search row moves onto `AgTableSearchBar`. The old `TableFilters` component tests go away with that component.
- Saved searches integration tests keep covering both tabs on a wide layout, and gain one collapsed case where a secondary field does not change the table until Apply.

## Out of scope

- Lists page DataGrid column filters.
- Changing what each page filters on, or the "at least 3 characters" rules.
- Moving `SingleAutocomplete` or other field widgets into the search bar.
