import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AgDateFilter from './AgDateFilter';

const theme = createTheme();

const renderFilter = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AgDateFilter', () => {
  it('shows the date as day/month/year', () => {
    renderFilter(
      <AgDateFilter label="Date created" value={new Date(2020, 0, 15)} onChange={vi.fn()} />
    );

    expect(screen.getByRole('group', { name: 'Date created' })).toHaveTextContent('15/01/2020');
  });

  it('starts on "on or after"', () => {
    renderFilter(<AgDateFilter label="Date created" value={null} onChange={vi.fn()} />);

    expect(screen.getByRole('combobox', { name: 'Operator' })).toHaveTextContent('on or after');
  });

  it('reports a newly chosen operator', async () => {
    const user = userEvent.setup();
    const onOperatorChange = vi.fn();
    renderFilter(
      <AgDateFilter
        label="Date created"
        value={null}
        onChange={vi.fn()}
        onOperatorChange={onOperatorChange}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Operator' }));
    await user.click(screen.getByRole('option', { name: 'is before' }));

    expect(onOperatorChange).toHaveBeenCalledWith('isBefore');
  });

  it('reports a date chosen from the calendar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderFilter(
      <AgDateFilter label="Date created" value={new Date(2020, 0, 1)} onChange={onChange} />
    );

    await user.click(screen.getByRole('button', { name: /Choose date/ }));
    await user.click(screen.getByRole('gridcell', { name: '15' }));

    expect(onChange).toHaveBeenCalled();
    const chosen = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(chosen.getDate()).toBe(15);
  });
});
