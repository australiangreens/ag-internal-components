# AgTableSearchBar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `AgTableSearchBar` to the shared component library and use it for the Events Manager events list, the Events Manager RSVP list, and both List Manager Search Library bars.

**Architecture:** The library component is a layout shell. It flexes fields on a wide screen, and below the collapse breakpoint it keeps the primary field plus a Filter button that opens an `AgDialog` for the other fields. Callers own live values and a draft copy. The bar tells them when to copy live onto the draft, when to commit, and when to leave the live values alone.

**Tech Stack:** React 19, TypeScript, MUI, Vitest, Testing Library, pnpm. Library package `@australiangreens/ag-internal-components` (currently 0.7.4).

## Global Constraints

- Component path: `src/components/AgTableSearchBar/` in `ag-internal-components`, exported from the components barrel.
- The bar does not store field values, run lookups, or filter rows.
- `resetLabel` default is `Reset Filter`. `dialogTitle` default is `Filter`. The dialog primary button label is `Apply filter`.
- The filter icon's accessible name is `Filter`.
- `collapseBelow` default is the MUI breakpoint `sm`.
- Wide row: 12px horizontal padding, 12px gap, 16px margin below. Field wrappers use the field `flex` and `minWidth: 0`. Reset has `flexShrink: 0`.
- The first field with `primary: true` is primary. If none is marked, the first field is primary. The primary field is only rendered with `'live'`.
- `onDialogOpen` runs before the dialog is shown. A throw leaves the dialog closed.
- The dialog closes only after `onApply` or `onCancel` resolves. A rejection leaves it open. The bar catches the rejection, logs it with `console.error`, and does not rethrow into `AgDialog`.
- If the viewport crosses back above the collapse breakpoint while the dialog is open, call `onCancel` and close when that resolves. A rejection leaves the dialog open.
- When secondary fields exist and `onDialogOpen` or `onApply` is missing, still render, and in development warn once per mounted bar.
- An empty `fields` array renders Reset alone. Several `primary: true` flags: the first one wins.
- Search Library flex weights: Saved Searches name 260, type 120, created by 220, description 220. Templates name 260, created by 220, description 220.
- Events list flex weights: name 324, every other field 204.
- RSVP fields keep `maxWidth: '18rem'`.
- Row filtering stays in the page. Lists page DataGrid column filters are out of scope.
- Source files excluding tests stay at or under 400 lines for `.tsx` and 300 lines for `.ts`.
- Test files use a `unit`, `comp`, or `int` suffix before `.test.` / `.spec.`.
- Do not run `pnpm release`. That script pushes a git tag. App tasks start only after a released library version exports `AgTableSearchBar`.

---

## File structure

| File | Responsibility |
|---|---|
| `ag-internal-components/src/components/AgTableSearchBar/AgTableSearchBar.tsx` | Layout, collapse, dialog open/apply/cancel, resize |
| `ag-internal-components/src/components/AgTableSearchBar/AgTableSearchBar.comp.test.tsx` | Shell behaviour with fake fields |
| `ag-internal-components/src/components/AgTableSearchBar/index.ts` | Public exports |
| `ag-internal-components/src/components/index.ts` | Barrel re-export |
| `eventsmanager-frontend/src/pages/EventsList/EventsListSearchBar.tsx` | Events-list fields, lookups, live atoms, draft |
| `eventsmanager-frontend/src/pages/EventsList/EventsList.tsx` | Renders the search bar; keeps table filtering |
| `eventsmanager-frontend/src/components/FilterEventTableDialog/` | Deleted |
| `eventsmanager-frontend/src/components/ParticipantTable/index.tsx` | RSVP bar wired to `useFilters` |
| `eventsmanager-frontend/src/components/ParticipantTable/TableFilters.tsx` | `useFilters` only; row UI removed |
| `listmanager-frontend/src/pages/SavedSearchesPage/SavedSearchesTab.tsx` | Saved-searches bar and its draft |
| `listmanager-frontend/src/pages/SavedSearchesPage/TemplatesTab.tsx` | Templates bar and its draft |
| `listmanager-frontend/src/pages/SavedSearchesPage/useSavedSearchesPage.ts` | Expose the live setters the bars commit with |

Tasks 2–4 are blocked until the library is published and installed. Confirm with `pnpm view @australiangreens/ag-internal-components version` that the published version exports `AgTableSearchBar`. A local `pnpm link` must not be committed.

---

### Task 1: AgTableSearchBar

**Files:**
- Create: `ag-internal-components/src/components/AgTableSearchBar/AgTableSearchBar.tsx`
- Create: `ag-internal-components/src/components/AgTableSearchBar/AgTableSearchBar.comp.test.tsx`
- Create: `ag-internal-components/src/components/AgTableSearchBar/index.ts`
- Modify: `ag-internal-components/src/components/index.ts`
- Test: `ag-internal-components/src/components/AgTableSearchBar/AgTableSearchBar.comp.test.tsx`

**Interfaces:**
- Consumes: `AgDialog` from `src/components/AgDialog` (`isOpen`, `dialogTitle`, `onClose`, `primaryButton`, `secondaryButton`, `children`).
- Produces:
  - `AgTableSearchField`: `{ id: string; flex: number; primary?: boolean; maxWidth?: number | string; render: (mode: 'live' | 'draft') => ReactNode }`
  - `AgTableSearchBarProps`: `{ fields: AgTableSearchField[]; onReset: () => void; resetLabel?: string; dialogTitle?: string; onDialogOpen?: () => void; onApply?: () => void | Promise<void>; onCancel?: () => void | Promise<void>; actions?: ReactNode; collapseBelow?: Breakpoint }`
  - Default export `AgTableSearchBar`
  - Named exports `AgTableSearchBar`, `AgTableSearchField`, `AgTableSearchBarProps`

- [ ] **Step 1: Write the failing test**

Create `src/components/AgTableSearchBar/AgTableSearchBar.comp.test.tsx`:

```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AgTableSearchBar, { type AgTableSearchField } from './AgTableSearchBar';

const theme = createTheme();

type MediaListener = (event: { matches: boolean }) => void;

let viewportCollapsed = false;
const mediaListeners = new Set<MediaListener>();

function installMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return viewportCollapsed;
    },
    media: query,
    onchange: null,
    addListener: (listener: MediaListener) => {
      mediaListeners.add(listener);
    },
    removeListener: (listener: MediaListener) => {
      mediaListeners.delete(listener);
    },
    addEventListener: (_name: string, listener: MediaListener) => {
      mediaListeners.add(listener);
    },
    removeEventListener: (_name: string, listener: MediaListener) => {
      mediaListeners.delete(listener);
    },
    dispatchEvent: vi.fn(),
  }));
}

function setViewportCollapsed(next: boolean) {
  viewportCollapsed = next;
  mediaListeners.forEach((listener) => listener({ matches: next }));
}

function renderBar(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

const nameField = (id = 'name'): AgTableSearchField => ({
  id,
  flex: 324,
  primary: true,
  render: (mode) => <span>{`${id}-${mode}`}</span>,
});

const statusField = (id = 'status'): AgTableSearchField => ({
  id,
  flex: 204,
  render: (mode) => <span>{`${id}-${mode}`}</span>,
});

describe('AgTableSearchBar', () => {
  beforeEach(() => {
    viewportCollapsed = false;
    mediaListeners.clear();
    installMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders every field live on a wide screen, with reset and actions', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={onReset}
        actions={<button type="button">Edit Status</button>}
      />
    );

    expect(screen.getByText('name-live')).toBeInTheDocument();
    expect(screen.getByText('status-live')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Status' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Filter' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset Filter' }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('collapses to the primary field and hides actions', () => {
    viewportCollapsed = true;
    renderBar(
      <AgTableSearchBar
        fields={[statusField(), nameField()]}
        onReset={vi.fn()}
        actions={<button type="button">Edit Status</button>}
      />
    );

    expect(screen.getByText('name-live')).toBeInTheDocument();
    expect(screen.queryByText('status-live')).not.toBeInTheDocument();
    expect(screen.queryByText('status-draft')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit Status' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Filter' })).toBeInTheDocument();
  });

  it('treats the first field as primary when none is marked', () => {
    viewportCollapsed = true;
    renderBar(
      <AgTableSearchBar
        fields={[
          { id: 'a', flex: 1, render: () => <span>field-a</span> },
          { id: 'b', flex: 1, render: () => <span>field-b</span> },
        ]}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('field-a')).toBeInTheDocument();
    expect(screen.queryByText('field-b')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  it('uses the first primary flag when several fields set primary', () => {
    viewportCollapsed = true;
    renderBar(
      <AgTableSearchBar
        fields={[
          { id: 'a', flex: 1, render: () => <span>field-a</span> },
          { id: 'b', flex: 1, primary: true, render: () => <span>field-b</span> },
          { id: 'c', flex: 1, primary: true, render: () => <span>field-c</span> },
        ]}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('field-b')).toBeInTheDocument();
    expect(screen.queryByText('field-a')).not.toBeInTheDocument();
    expect(screen.queryByText('field-c')).not.toBeInTheDocument();
  });

  it('renders Reset alone when there are no fields', () => {
    renderBar(<AgTableSearchBar fields={[]} onReset={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Reset Filter' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Filter' })).not.toBeInTheDocument();
  });

  it('hides the Filter button when the only field is primary', () => {
    viewportCollapsed = true;
    renderBar(<AgTableSearchBar fields={[nameField()]} onReset={vi.fn()} />);

    expect(screen.getByText('name-live')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Filter' })).not.toBeInTheDocument();
  });

  it('opens the dialog with draft fields after onDialogOpen returns', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    const onDialogOpen = vi.fn();
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={onDialogOpen}
        onApply={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    expect(onDialogOpen).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();
    expect(screen.getByText('status-draft')).toBeInTheDocument();
    expect(screen.getByText('name-live')).toBeInTheDocument();
    expect(screen.queryByText('name-draft')).not.toBeInTheDocument();
  });

  it('leaves the dialog closed when onDialogOpen throws', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={() => {
          throw new Error('copy failed');
        }}
        onApply={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('closes the dialog only after onApply resolves', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    let resolveApply: () => void = () => {};
    const onApply = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveApply = resolve;
        })
    );
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={vi.fn()}
        onApply={onApply}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.click(screen.getByRole('button', { name: 'Apply filter' }));

    expect(onApply).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();

    await act(async () => {
      resolveApply();
    });

    expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
  });

  it('leaves the dialog open when onApply rejects', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={vi.fn()}
        onApply={() => Promise.reject(new Error('save failed'))}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.click(screen.getByRole('button', { name: 'Apply filter' }));

    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply filter' })).toBeEnabled();
    expect(console.error).toHaveBeenCalled();
  });

  it('closes the dialog only after onCancel resolves', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    let resolveCancel: () => void = () => {};
    const onCancel = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCancel = resolve;
        })
    );
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={vi.fn()}
        onApply={vi.fn()}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();

    await act(async () => {
      resolveCancel();
    });

    expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
  });

  it('leaves the dialog open when onCancel rejects', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={vi.fn()}
        onApply={vi.fn()}
        onCancel={() => Promise.reject(new Error('cancel failed'))}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('cancels and closes the dialog when the viewport expands', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={vi.fn()}
        onApply={vi.fn()}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();

    await act(async () => {
      setViewportCollapsed(false);
    });

    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
    expect(screen.getByText('status-live')).toBeInTheDocument();
  });

  it('leaves the dialog open when onCancel rejects during expand', async () => {
    viewportCollapsed = true;
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderBar(
      <AgTableSearchBar
        fields={[nameField(), statusField()]}
        onReset={vi.fn()}
        onDialogOpen={vi.fn()}
        onApply={vi.fn()}
        onCancel={() => Promise.reject(new Error('still editing'))}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    await act(async () => {
      setViewportCollapsed(false);
    });

    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('warns once per mount when secondary fields have no draft callbacks', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const view = renderBar(
      <AgTableSearchBar fields={[nameField(), statusField()]} onReset={vi.fn()} />
    );

    expect(warn).toHaveBeenCalledOnce();

    view.rerender(
      <ThemeProvider theme={theme}>
        <AgTableSearchBar fields={[nameField(), statusField()]} onReset={vi.fn()} />
      </ThemeProvider>
    );

    expect(warn).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `ag-internal-components`:

```bash
pnpm test src/components/AgTableSearchBar/AgTableSearchBar.comp.test.tsx
```

Expected: FAIL because `./AgTableSearchBar` cannot be resolved.

- [ ] **Step 3: Write the component**

Create `src/components/AgTableSearchBar/AgTableSearchBar.tsx`:

```tsx
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Breakpoint,
  Button,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';

import AgDialog from '../AgDialog';

export type AgTableSearchField = {
  id: string;
  /** Share of the wide-screen row. The events list uses 324 for the name and 204 for the rest. */
  flex: number;
  /** Stays in the bar at every width. The component only calls this field with 'live'. */
  primary?: boolean;
  /** Caps the field on a wide row. The RSVP list sets this; the events list does not. */
  maxWidth?: number | string;
  render: (mode: 'live' | 'draft') => ReactNode;
};

export type AgTableSearchBarProps = {
  fields: AgTableSearchField[];
  onReset: () => void;
  resetLabel?: string;
  dialogTitle?: string;
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

const AgTableSearchBar = ({
  fields,
  onReset,
  resetLabel = 'Reset Filter',
  dialogTitle = 'Filter',
  onDialogOpen,
  onApply,
  onCancel,
  actions,
  collapseBelow = 'sm',
}: AgTableSearchBarProps) => {
  const theme = useTheme();
  const collapsed = useMediaQuery(theme.breakpoints.down(collapseBelow));
  const [dialogOpen, setDialogOpen] = useState(false);
  const warnedRef = useRef(false);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  const primaryIndex = fields.findIndex((field) => field.primary);
  const resolvedPrimaryIndex = primaryIndex === -1 ? 0 : primaryIndex;
  const primary = fields[resolvedPrimaryIndex];
  const secondary = fields.filter((_, index) => index !== resolvedPrimaryIndex);
  const visibleFields = collapsed ? fields.filter((field) => field === primary) : fields;

  useEffect(() => {
    if (!import.meta.env.DEV || warnedRef.current) return;
    if (secondary.length > 0 && (onDialogOpen === undefined || onApply === undefined)) {
      warnedRef.current = true;
      console.warn(
        'AgTableSearchBar: pass onDialogOpen and onApply when there are secondary fields so the draft stays in sync.'
      );
    }
  }, [secondary.length, onDialogOpen, onApply]);

  useEffect(() => {
    if (collapsed || !dialogOpen) return undefined;
    let cancelled = false;
    void (async () => {
      try {
        await onCancelRef.current?.();
        if (!cancelled) setDialogOpen(false);
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collapsed, dialogOpen]);

  const handleOpen = () => {
    try {
      onDialogOpen?.();
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async () => {
    try {
      await onApply?.();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async () => {
    try {
      await onCancelRef.current?.();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingLeft: '12px',
          paddingRight: '12px',
          marginBottom: '16px',
          gap: '12px',
        }}
      >
        {visibleFields.map((field) => (
          <Box key={field.id} sx={{ flex: field.flex, minWidth: 0, maxWidth: field.maxWidth }}>
            {field.render('live')}
          </Box>
        ))}
        {collapsed && secondary.length > 0 && (
          <IconButton aria-label="Filter" onClick={handleOpen} sx={{ paddingTop: '18px' }}>
            <FilterListIcon />
          </IconButton>
        )}
        <Button
          onClick={onReset}
          color="primary"
          sx={{ flexShrink: 0, marginTop: '12px', paddingTop: '6px', paddingBottom: '6px' }}
        >
          {resetLabel}
        </Button>
        {!collapsed && actions}
      </Box>
      <AgDialog
        isOpen={dialogOpen}
        dialogTitle={dialogTitle}
        onClose={handleCancel}
        secondaryButton={{ text: 'Cancel', onClick: handleCancel }}
        primaryButton={{ text: 'Apply filter', onClick: handleApply }}
      >
        {dialogOpen && (
          <Stack spacing={2} sx={{ paddingTop: '8px' }}>
            {secondary.map((field) => (
              <Box key={field.id} sx={{ width: '100%' }}>
                {field.render('draft')}
              </Box>
            ))}
          </Stack>
        )}
      </AgDialog>
    </>
  );
};

export default AgTableSearchBar;
```

Create `src/components/AgTableSearchBar/index.ts`:

```ts
export { default } from './AgTableSearchBar';
export { default as AgTableSearchBar } from './AgTableSearchBar';
export type { AgTableSearchBarProps, AgTableSearchField } from './AgTableSearchBar';
```

Add these two lines to `src/components/index.ts`, after the `AgDataGrid` exports:

```ts
export * from './AgTableSearchBar';
export { default as AgTableSearchBar } from './AgTableSearchBar';
```

- [ ] **Step 4: Run the test to verify it passes**

Run from `ag-internal-components`:

```bash
pnpm test src/components/AgTableSearchBar/AgTableSearchBar.comp.test.tsx
```

Expected: PASS, 14 tests.

If the expand test does not see the dialog close, MUI's `useMediaQuery` subscribed with a different listener shape. Update `installMatchMedia` so the method MUI actually calls adds to `mediaListeners`, then rerun. Do not weaken the assertion.

- [ ] **Step 5: Commit**

```bash
git add src/components/AgTableSearchBar src/components/index.ts
git commit -m "$(cat <<'EOF'
Add a responsive table search bar shell.

Events and list pages can share one row that collapses secondary fields into a dialog.
EOF
)"
```

---

### Task 2: Events list

**Files:**
- Create: `eventsmanager-frontend/src/pages/EventsList/EventsListSearchBar.tsx`
- Modify: `eventsmanager-frontend/src/pages/EventsList/EventsList.tsx`
- Modify: `eventsmanager-frontend/src/pages/EventsList/EventsList.int.test.tsx`
- Modify: `eventsmanager-frontend/package.json` (dependency bump only)
- Delete: `eventsmanager-frontend/src/components/FilterEventTableDialog/index.tsx`
- Delete: `eventsmanager-frontend/src/components/FilterEventTableDialog/index.unit.test.tsx`
- Test: `eventsmanager-frontend/src/pages/EventsList/EventsList.int.test.tsx`

**Interfaces:**
- Consumes: `AgTableSearchBar`, `AgTableSearchField`, and `SingleAutocomplete` from `@australiangreens/ag-internal-components`. Live atoms `eventNameAtom`, `statusAtom`, `eventTypeValueAtom`, `eventCreatedByAtom`, `campaignAtom`, `coordinatorAtom` from `@/globals`.
- Produces: `EventsListSearchBar` default export. No new props. It reads and writes those atoms itself.

`EventsList.tsx` is already over the 400-line limit. Move the search UI out so that file shrinks. Do not add the field list back into `EventsList.tsx`.

- [ ] **Step 1: Install the released library**

In `eventsmanager-frontend`, set `@australiangreens/ag-internal-components` to the released version that contains `AgTableSearchBar`, keeping the existing caret range style (`"^x.y.z"`). Run `pnpm install`.

- [ ] **Step 2: Add the events-list search bar**

Create `src/pages/EventsList/EventsListSearchBar.tsx`:

```tsx
import { getEventTypes } from '@/apis/eventTypes';
import { Auth0Snapshot, getUsersContaining } from '@/apis/users';
import {
  campaignAtom,
  coordinatorAtom,
  eventCreatedByAtom,
  eventNameAtom,
  eventTypeValueAtom,
  statusAtom,
} from '@/globals';
import { useAccessToken } from '@/hooks/useAccessToken';
import { EventTypeRecord } from '@/types';
import { labelSorting } from '@/utils';
import { AgTableSearchBar, SingleAutocomplete } from '@australiangreens/ag-internal-components';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useAtom } from 'jotai';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

const STATUS_OPTIONS = ['Published', 'Unpublished', 'Draft', 'Past', 'Private'] as const;

const fieldSx = { width: '100%' };

export default function EventsListSearchBar() {
  const getAccessToken = useAccessToken();
  const [eventName, setEventName] = useAtom(eventNameAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [eventTypeValue, setEventTypeValue] = useAtom(eventTypeValueAtom);
  const [eventCreatedBy, setEventCreatedBy] = useAtom(eventCreatedByAtom);
  const [campaign, setCampaign] = useAtom(campaignAtom);
  const [coordinator, setCoordinator] = useAtom(coordinatorAtom);

  const [draftStatus, setDraftStatus] = useState('');
  const [draftEventTypeValue, setDraftEventTypeValue] = useState<EventTypeRecord | null>(null);
  const [draftEventCreatedBy, setDraftEventCreatedBy] = useState<Auth0Snapshot | null>(null);
  const [draftCampaign, setDraftCampaign] = useState('');
  const [draftCoordinator, setDraftCoordinator] = useState('');

  const lookupByEventTypes = async (lookupValue: string) => {
    const token = await getAccessToken();
    const returnData = await getEventTypes(token);
    return returnData
      .map(({ id, label }) => ({ id, label }))
      .filter((item) => item.label.toUpperCase().includes(lookupValue.toUpperCase()))
      .sort(labelSorting);
  };

  const lookupUsers = async (lookupValue: string) => {
    const token = await getAccessToken();
    return (await getUsersContaining(token, lookupValue))
      .map(({ id, name }) => ({ id, label: name }))
      .sort(labelSorting);
  };

  const copyLiveToDraft = () => {
    setDraftStatus(status);
    setDraftEventTypeValue(eventTypeValue);
    setDraftEventCreatedBy(eventCreatedBy);
    setDraftCampaign(campaign);
    setDraftCoordinator(coordinator);
  };

  const commitDraft = () => {
    setStatus(draftStatus);
    setEventTypeValue(draftEventTypeValue);
    setEventCreatedBy(draftEventCreatedBy);
    setCampaign(draftCampaign);
    setCoordinator(draftCoordinator);
  };

  const handleResetFilter = () => {
    setStatus('');
    setEventName('');
    setCampaign('');
    setCoordinator('');
    setEventTypeValue(null);
    setEventCreatedBy(null);
  };

  return (
    <AgTableSearchBar
      dialogTitle="Search events filters"
      onReset={handleResetFilter}
      onDialogOpen={copyLiveToDraft}
      onApply={commitDraft}
      fields={[
        {
          id: 'event-name',
          flex: 324,
          primary: true,
          render: () => (
            <TextField
              id="event-textfield-name"
              label="Search event name"
              type="text"
              fullWidth
              variant="outlined"
              value={eventName}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setEventName(event.target.value);
              }}
              color="primary"
            />
          ),
        },
        {
          id: 'created-by',
          flex: 204,
          render: (mode) => (
            <SingleAutocomplete
              data-testid="selectCreatedBy"
              onChange={(
                _event: SyntheticEvent<Element, Event>,
                newValue: Auth0Snapshot | null
              ) => {
                if (mode === 'draft') setDraftEventCreatedBy(newValue);
                else setEventCreatedBy(newValue);
              }}
              value={mode === 'draft' ? draftEventCreatedBy : eventCreatedBy}
              label="Created by"
              lookup={lookupUsers}
              noOptionsText="No users found"
              minLength={3}
              sx={fieldSx}
              textFieldColor="primary"
              textFieldVariant="outlined"
            />
          ),
        },
        {
          id: 'type',
          flex: 204,
          render: (mode) => (
            <SingleAutocomplete
              data-testid="selectType"
              onChange={(
                _event: SyntheticEvent<Element, Event>,
                newValue: EventTypeRecord | null
              ) => {
                if (mode === 'draft') setDraftEventTypeValue(newValue);
                else setEventTypeValue(newValue);
              }}
              value={mode === 'draft' ? draftEventTypeValue : eventTypeValue}
              label="Type"
              lookup={lookupByEventTypes}
              noOptionsText="No options found"
              minLength={0}
              sx={fieldSx}
              textFieldColor="primary"
              textFieldVariant="outlined"
            />
          ),
        },
        {
          id: 'campaign',
          flex: 204,
          render: (mode) => (
            <TextField
              id={mode === 'draft' ? 'event-select-campaign' : 'event-textfield-campaign'}
              label="Campaign"
              type="text"
              fullWidth
              variant="outlined"
              value={mode === 'draft' ? draftCampaign : campaign}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (mode === 'draft') setDraftCampaign(event.target.value);
                else setCampaign(event.target.value);
              }}
              color="primary"
            />
          ),
        },
        {
          id: 'coordinator',
          flex: 204,
          render: (mode) => (
            <TextField
              id={mode === 'draft' ? 'event-select-coordinator' : 'event-textfield-coordinator'}
              label="Coordinator"
              type="text"
              fullWidth
              variant="outlined"
              value={mode === 'draft' ? draftCoordinator : coordinator}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (mode === 'draft') setDraftCoordinator(event.target.value);
                else setCoordinator(event.target.value);
              }}
              color="primary"
            />
          ),
        },
        {
          id: 'status',
          flex: 204,
          render: (mode) => (
            <FormControl sx={fieldSx}>
              <InputLabel id="event-select-status-label" color="primary">
                Status
              </InputLabel>
              <Select
                labelId="event-select-status-label"
                id="event-select-status"
                value={mode === 'draft' ? draftStatus : status}
                label="Status"
                onChange={(event: SelectChangeEvent) => {
                  if (mode === 'draft') setDraftStatus(event.target.value);
                  else setStatus(event.target.value);
                }}
                color="primary"
              >
                <MenuItem value="">&nbsp;</MenuItem>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        },
      ]}
    />
  );
}
```

- [ ] **Step 3: Use it from EventsList and delete the old dialog**

In `EventsList.tsx`:

- Add `import EventsListSearchBar from './EventsListSearchBar';`
- Remove the `FilterEventTableDialog` import, `FilterListIcon`, `SingleAutocomplete`, and any MUI imports that become unused (`TextField`, `Select`, `MenuItem`, `FormControl`, `InputLabel`, `IconButton`, `Button`, `SelectChangeEvent`).
- Remove draft `useState` values (`filterStatus`, `filterEventTypeValue`, `filterEventCreatedBy`, `filterCampaign`, `filterCoordinator`, `showFilterEventTableDialog`) and the handlers that only served the old bar (`handleStatusChange`, `handleEventTypeValueChange`, `handleEventCreatedByChange`, `handleCampaignChange`, `handleCoordinatorChange`, `handleEventNameChange`, `handleResetFilter`, `handleOpenFilterDialog`, `handleSaveFilter`, `handleCancelFilter`, `lookupByEventTypes`, `lookupUsers`).
- Remove the effect that copies live filters into the draft when `isSmallScreen` changes. Keep the sort-model effect.
- Keep reading the filter atoms. The table still filters with them.
- Replace the search-bar `<div>` (the flex row that starts with `Search event name` and ends with `Reset Filter`) with `<EventsListSearchBar />`.
- Remove the `<FilterEventTableDialog ... />` element.

Delete both files in `src/components/FilterEventTableDialog/`.

- [ ] **Step 4: Teach the mobile integration test about the bar's own breakpoint**

`renders on mobile` mocks `useSmallScreen`, which the grid still uses. `AgTableSearchBar` calls MUI `useMediaQuery` directly, so that mock does not collapse the bar.

In `EventsList.int.test.tsx`, add this helper next to the other test setup. Do not import it from the library test.

```tsx
type MediaListener = (event: { matches: boolean }) => void;

let viewportCollapsed = false;
const mediaListeners = new Set<MediaListener>();

function installMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return viewportCollapsed;
    },
    media: query,
    onchange: null,
    addListener: (listener: MediaListener) => {
      mediaListeners.add(listener);
    },
    removeListener: (listener: MediaListener) => {
      mediaListeners.delete(listener);
    },
    addEventListener: (_name: string, listener: MediaListener) => {
      mediaListeners.add(listener);
    },
    removeEventListener: (_name: string, listener: MediaListener) => {
      mediaListeners.delete(listener);
    },
    dispatchEvent: vi.fn(),
  }));
}

function setViewportCollapsed(next: boolean) {
  viewportCollapsed = next;
  mediaListeners.forEach((listener) => listener({ matches: next }));
}
```

In `beforeEach`, call `installMatchMedia()` and `setViewportCollapsed(false)`. In `renders on mobile`, call `setViewportCollapsed(true)` next to `mockedUseScreen.mockReturnValue(true)`.

The Filter button's accessible name is `Filter`. This test does not need to click it. `queryByText('Created by')`, `queryByText('Type')`, and `queryByText('Status')` stay null on that screen.

- [ ] **Step 5: Run the events list tests**

Run from `eventsmanager-frontend`:

```bash
pnpm test src/pages/EventsList/EventsList.int.test.tsx
```

Expected: PASS. The wide tests still find `Search event name` and `Reset Filter`. The mobile test still hides Created by, Type, and Status.

Confirm `EventsList.tsx` and `EventsListSearchBar.tsx` are each 400 lines or fewer.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/pages/EventsList src/components/FilterEventTableDialog
git commit -m "$(cat <<'EOF'
Use the shared search bar on the events list.

Secondary filters now collapse into the dialog the same way on a narrow window.
EOF
)"
```

---

### Task 3: RSVP list

**Files:**
- Modify: `eventsmanager-frontend/src/components/ParticipantTable/index.tsx`
- Modify: `eventsmanager-frontend/src/components/ParticipantTable/TableFilters.tsx`
- Modify: `eventsmanager-frontend/src/components/ParticipantTable/TableFilters.unit.test.tsx`
- Test: `eventsmanager-frontend/src/components/ParticipantTable/TableFilters.unit.test.tsx`

**Interfaces:**
- Consumes: `AgTableSearchBar` from `@australiangreens/ag-internal-components`. `useFilters` return value `{ filterFunction, filtersIndiv, resetFilters, setFilters, filters }` from `./TableFilters`.
- Produces: no new exports. `TableFilters` the component is removed. `useFilters`, `FilterConfig`, and `Filter` stay exported.

The library dependency bump from Task 2 is already in this repo. Do not bump it again.

- [ ] **Step 1: Replace the RSVP row**

In `ParticipantTable/index.tsx`, remove the `TableFilters` import and render. Keep `useFilters`. Add local draft state for the status field:

```tsx
const [draftStatus, setDraftStatus] = useState('');
const nameFilter = filtersIndiv[0];
const statusFilter = filtersIndiv[1];
```

`filtersIndiv[0]` is Search name (`attribute: 'name'`). `filtersIndiv[1]` is Participant status. `nameFilter.setValue` and `statusFilter.setValue` already reset the page through `onChange`. `setFilters` does not, which matches the old dialog's Apply path.

Replace the `<TableFilters>...</TableFilters>` block with:

```tsx
<AgTableSearchBar
  dialogTitle="Search participants filter"
  onReset={resetFilters}
  onDialogOpen={() => {
    setDraftStatus(filters.status);
  }}
  onApply={() => {
    setFilters((prev) => ({ ...prev, status: draftStatus }));
  }}
  actions={
    showEditStatus ? (
      <Button
        variant="outlined"
        sx={{ flexShrink: 0 }}
        onClick={handleEditStatus}
        disabled={editStatusDisabled}
      >
        Edit Status
      </Button>
    ) : undefined
  }
  fields={[
    {
      id: 'name',
      flex: 1,
      primary: true,
      maxWidth: '18rem',
      render: () => (
        <TextField
          label={nameFilter.label}
          value={nameFilter.value}
          onChange={({ target: { value } }) => nameFilter.setValue(value)}
          fullWidth
        />
      ),
    },
    {
      id: 'status',
      flex: 1,
      maxWidth: '18rem',
      render: (mode) => (
        <TextField
          label={statusFilter.label}
          value={mode === 'draft' ? draftStatus : statusFilter.value}
          onChange={({ target: { value } }) => {
            if (mode === 'draft') setDraftStatus(value);
            else statusFilter.setValue(value);
          }}
          select
          fullWidth
        >
          <MenuItem value="">&nbsp;</MenuItem>
          {statusFilter.type === 'Select' &&
            statusFilter.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
      ),
    },
  ]}
/>
```

Import `AgTableSearchBar` from `@australiangreens/ag-internal-components`, and `MenuItem` and `TextField` from `@mui/material`. Pass `actions` whenever `showEditStatus` is true. The bar hides `actions` while collapsed, so delete the `!isSmallScreen &&` check around Edit Status.

- [ ] **Step 2: Remove the old row UI**

In `TableFilters.tsx`, delete `FilterTextField`, `FilterSelectField`, `FilterAutocompleteField`, `FilterField`, `FilterDialog`, `TableFilters`, `VISIBLE_FILTERS_COUNT_MOBILE`, `filterFieldSx`, and the imports they alone used (`AgDialog`, `FilterListIcon`, `Autocomplete`, `Box`, `Button`, `IconButton`, `Theme`, `SetStateAction`, `Dispatch`, `PropsWithChildren`, `useSmallScreen`).

Keep `useFilters`, `FilterConfig`, `Filter`, and the text/select/autocomplete config types. `filtersIndiv` still carries `type` and `options` so the RSVP select can read them.

- [ ] **Step 3: Update the unit test**

Delete the `describe('TableFilters ')` block from `TableFilters.unit.test.tsx`, and drop the `TableFilters` import. Leave the `useFilters` tests as they are.

- [ ] **Step 4: Run the participant filter tests**

Run from `eventsmanager-frontend`:

```bash
pnpm test src/components/ParticipantTable/TableFilters.unit.test.tsx
```

Expected: PASS. Every remaining test is a `useFilters` test.

- [ ] **Step 5: Commit**

```bash
git add src/components/ParticipantTable
git commit -m "$(cat <<'EOF'
Use the shared search bar on the RSVP list.

The participant status field collapses into the filter dialog on a narrow window.
EOF
)"
```

---

### Task 4: Search Library

**Files:**
- Modify: `listmanager-frontend/package.json` (dependency bump only)
- Modify: `listmanager-frontend/src/pages/SavedSearchesPage/useSavedSearchesPage.ts`
- Modify: `listmanager-frontend/src/pages/SavedSearchesPage/SavedSearchesTab.tsx`
- Modify: `listmanager-frontend/src/pages/SavedSearchesPage/TemplatesTab.tsx`
- Modify: `listmanager-frontend/src/pages/SavedSearchesPage/index.int.test.tsx`
- Test: `listmanager-frontend/src/pages/SavedSearchesPage/index.int.test.tsx`

**Interfaces:**
- Consumes: `AgTableSearchBar` and `SingleAutocomplete` from `@australiangreens/ag-internal-components`. Existing live atoms via `useSavedSearchesPage`.
- Produces: `useSavedSearchesPage` also returns `setSearchType`, `setSearchCreatedBy`, `setSearchDescription`, `setSearchTemplateCreatedBy`, and `setSearchTemplateDescription`. The tabs keep their current props and add those setters.

- [ ] **Step 1: Install the released library**

In `listmanager-frontend`, set `@australiangreens/ag-internal-components` to the same released version as Task 2, caret range included. Run `pnpm install`.

- [ ] **Step 2: Expose the live setters**

`useSavedSearchesPage` already has `setSearchType`, `setSearchCreatedBy`, `setSearchDescription`, `setSearchTemplateCreatedBy`, and `setSearchTemplateDescription` from `useAtom`. Add those five functions to the object it returns. Do not add draft state here. Draft stays in the tab components.

- [ ] **Step 3: Replace the Saved Searches row**

Add the five new fields to `SavedSearchesTabProps` and the function parameters.

Inside `SavedSearchesTab`, above the `return`:

```tsx
const [draftType, setDraftType] = useState(searchType);
const [draftCreatedBy, setDraftCreatedBy] = useState(searchCreatedBy);
const [draftDescription, setDraftDescription] = useState(searchDescription);
```

Import `useState` from `react`. `searchCreatedBy`'s type is inferred from the prop.

Replace the filter `<div>` (the flex row from `search-textfield-name` through `Reset Filter`) with:

```tsx
<AgTableSearchBar
  dialogTitle="Filter saved searches"
  onReset={handleResetFilter}
  onDialogOpen={() => {
    setDraftType(searchType);
    setDraftCreatedBy(searchCreatedBy);
    setDraftDescription(searchDescription);
  }}
  onApply={() => {
    setSearchType(draftType);
    setSearchCreatedBy(draftCreatedBy);
    setSearchDescription(draftDescription);
  }}
  fields={[
    {
      id: 'search-name',
      flex: 260,
      primary: true,
      render: () => (
        <TextField
          id="search-textfield-name"
          label="Search name"
          type="text"
          variant="outlined"
          value={searchName}
          onChange={handleSearchNameChange}
          color="primary"
          fullWidth
          autoComplete="off"
        />
      ),
    },
    {
      id: 'search-type',
      flex: 120,
      render: (mode) => (
        <FormControl fullWidth>
          <InputLabel id="search-select-type-label" color="primary">
            Type
          </InputLabel>
          <Select
            labelId="search-select-type-label"
            id="search-select-type"
            value={mode === 'draft' ? draftType : searchType}
            label="Type"
            onChange={(event) => {
              if (mode === 'draft') setDraftType(event.target.value);
              else handleSearchTypeChange(event);
            }}
            color="primary"
          >
            <MenuItem value="">&nbsp;</MenuItem>
            <MenuItem value="Quick">Quick</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      id: 'search-created-by',
      flex: 220,
      render: (mode) => (
        <SingleAutocomplete
          data-testid="selectCreatedBy"
          onChange={(event, newValue) => {
            if (mode === 'draft') setDraftCreatedBy(newValue);
            else handleSearchCreatedByChange(event, newValue);
          }}
          value={mode === 'draft' ? draftCreatedBy : searchCreatedBy}
          label="Created by"
          lookup={lookupUsers}
          noOptionsText="No users found"
          minLength={3}
          sx={{ width: '100%' }}
          textFieldColor="primary"
          textFieldVariant="outlined"
        />
      ),
    },
    {
      id: 'search-description',
      flex: 220,
      render: (mode) => (
        <TextField
          id="search-textfield-description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={mode === 'draft' ? draftDescription : searchDescription}
          onChange={(event) => {
            if (mode === 'draft') setDraftDescription(event.target.value);
            else handleSearchDescriptionChange(event);
          }}
          color="primary"
          autoComplete="off"
        />
      ),
    },
  ]}
/>
```

Import `AgTableSearchBar` from `@australiangreens/ag-internal-components`. `SingleAutocomplete` is already imported from there. Remove the fixed `260px` / `120px` / `220px` widths.

- [ ] **Step 4: Replace the Templates row**

Add `setSearchTemplateCreatedBy` and `setSearchTemplateDescription` to `TemplatesTabProps` and the function parameters.

Inside `TemplatesTab`:

```tsx
const [draftCreatedBy, setDraftCreatedBy] = useState(searchTemplateCreatedBy);
const [draftDescription, setDraftDescription] = useState(searchTemplateDescription);
```

Replace the filter `<div>` with:

```tsx
<AgTableSearchBar
  dialogTitle="Filter templates"
  onReset={handleResetSearchTemplateFilter}
  onDialogOpen={() => {
    setDraftCreatedBy(searchTemplateCreatedBy);
    setDraftDescription(searchTemplateDescription);
  }}
  onApply={() => {
    setSearchTemplateCreatedBy(draftCreatedBy);
    setSearchTemplateDescription(draftDescription);
  }}
  fields={[
    {
      id: 'template-name',
      flex: 260,
      primary: true,
      render: () => (
        <TextField
          id="search-template-textfield-name"
          label="Template name"
          type="text"
          variant="outlined"
          value={searchTemplateName}
          onChange={handleSearchTemplateNameChange}
          color="primary"
          fullWidth
          autoComplete="off"
        />
      ),
    },
    {
      id: 'template-created-by',
      flex: 220,
      render: (mode) => (
        <SingleAutocomplete
          data-testid="selectTemplateCreatedBy"
          onChange={(event, newValue) => {
            if (mode === 'draft') setDraftCreatedBy(newValue);
            else handleSearchTemplateCreatedByChange(event, newValue);
          }}
          value={mode === 'draft' ? draftCreatedBy : searchTemplateCreatedBy}
          label="Created by"
          lookup={lookupUsers}
          noOptionsText="No users found"
          minLength={3}
          sx={{ width: '100%' }}
          textFieldColor="primary"
          textFieldVariant="outlined"
        />
      ),
    },
    {
      id: 'template-description',
      flex: 220,
      render: (mode) => (
        <TextField
          id="search-Template-textfield-description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={mode === 'draft' ? draftDescription : searchTemplateDescription}
          onChange={(event) => {
            if (mode === 'draft') setDraftDescription(event.target.value);
            else handleSearchTemplateDescriptionChange(event);
          }}
          color="primary"
          autoComplete="off"
        />
      ),
    },
  ]}
/>
```

Wire `setSearchTemplateCreatedBy` and `setSearchTemplateDescription` through from `SavedSearchesPage` the same way the existing template handlers are passed.

- [ ] **Step 5: Add the collapsed Apply test**

Add this helper to `index.int.test.tsx`:

```tsx
type MediaListener = (event: { matches: boolean }) => void;

let viewportCollapsed = false;
const mediaListeners = new Set<MediaListener>();

function installMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return viewportCollapsed;
    },
    media: query,
    onchange: null,
    addListener: (listener: MediaListener) => {
      mediaListeners.add(listener);
    },
    removeListener: (listener: MediaListener) => {
      mediaListeners.delete(listener);
    },
    addEventListener: (_name: string, listener: MediaListener) => {
      mediaListeners.add(listener);
    },
    removeEventListener: (_name: string, listener: MediaListener) => {
      mediaListeners.delete(listener);
    },
    dispatchEvent: vi.fn(),
  }));
}

function setViewportCollapsed(next: boolean) {
  viewportCollapsed = next;
  mediaListeners.forEach((listener) => listener({ matches: next }));
}
```

Call `installMatchMedia()` and `setViewportCollapsed(false)` in the existing `beforeEach`, so the current wide-layout assertions still see Type, Created by, and Description. Their `getAllByText` counts stay at 3.

Add this test inside `describe('when the saved searches tab is displayed')`:

```tsx
it('does not filter on a secondary field until Apply', async () => {
  const user = userEvent.setup();
  mockedSearches.mockResolvedValue(mockGetSearchesResponse);
  const mockedUseUserDetails = vi.mocked(useUserDetails);
  mockedUseUserDetails.mockReturnValue({
    data: buildDetailedUserDetails({
      domainToUserLevels: { ag: 'Principal Coordinator' },
    }),
  } as ReturnType<typeof useUserDetails>);
  setViewportCollapsed(true);
  commonRender();

  expect(await screen.findByText('Test Search 1')).toBeInTheDocument();
  expect(screen.getByText('Test Search 2')).toBeInTheDocument();
  expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Filter' }));
  await user.type(screen.getByRole('textbox', { name: 'Description' }), 'nope');

  expect(screen.getByText('Test Search 1')).toBeInTheDocument();
  expect(screen.getByText('Test Search 2')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Apply filter' }));

  expect(screen.queryByText('Test Search 1')).not.toBeInTheDocument();
  expect(screen.queryByText('Test Search 2')).not.toBeInTheDocument();
});
```

`nope` is four characters and is in neither `Test Description 1` nor `Test Description 2`, so the existing "at least 3 characters" description check hides both rows only after Apply.

- [ ] **Step 6: Run the Search Library tests**

Run from `listmanager-frontend`. Do not put `--` before the path.

```bash
pnpm test src/pages/SavedSearchesPage/index.int.test.tsx
```

Expected: PASS, including the existing wide-layout filter test and the new collapsed Apply test.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/pages/SavedSearchesPage
git commit -m "$(cat <<'EOF'
Use the shared search bar in the Search Library.

Saved searches and templates shrink with the window and hide secondary fields on a narrow screen.
EOF
)"
```
