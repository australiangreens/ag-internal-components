import { ThemeProvider, createTheme } from '@mui/material/styles';
import { act, render, screen, waitFor } from '@testing-library/react';
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

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
    });
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
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument();
    });
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
