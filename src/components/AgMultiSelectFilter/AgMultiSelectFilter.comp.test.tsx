import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AgMultiSelectFilter from './AgMultiSelectFilter';

const theme = createTheme();
const options = ['Not started', 'In progress', 'Complete'] as const;

const renderFilter = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AgMultiSelectFilter', () => {
  it('shows every selected option', () => {
    renderFilter(
      <AgMultiSelectFilter
        label="Status"
        options={options}
        value={['In progress', 'Not started']}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'In progress, Not started'
    );
  });

  it('adds another option to the selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderFilter(
      <AgMultiSelectFilter
        label="Status"
        options={options}
        value={['In progress', 'Not started']}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(screen.getByRole('option', { name: 'Complete' }));

    expect(onChange).toHaveBeenCalledWith(['In progress', 'Not started', 'Complete']);
  });

  it('clears the selection from the field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderFilter(
      <AgMultiSelectFilter
        label="Status"
        options={options}
        value={['Complete']}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Clear Status' }));

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
