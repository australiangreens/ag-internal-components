import { ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import { internalAgSystemsTheme } from '../../themes';
import AgDataGrid from './AgDataGrid';

const columns = [{ field: 'name', headerName: 'Name', width: 150 }];

const renderGrid = (ui: ReactElement) =>
  render(<ThemeProvider theme={internalAgSystemsTheme}>{ui}</ThemeProvider>);

describe('AgDataGrid', () => {
  it('renders row data', () => {
    renderGrid(
      <AgDataGrid
        loading={false}
        skeletonColumnWidths={[10]}
        paginationModel={{ page: 0, pageSize: 10 }}
        rows={[{ id: 1, name: 'Test row' }]}
        columns={columns}
      />
    );

    expect(screen.getByText('Test row')).toBeInTheDocument();
  });

  it('shows the no rows message when empty', () => {
    renderGrid(
      <AgDataGrid
        loading={false}
        skeletonColumnWidths={[10]}
        paginationModel={{ page: 0, pageSize: 10 }}
        rows={[]}
        columns={columns}
        noRowsMessage="No rows here"
      />
    );

    expect(screen.getByText('No rows here')).toBeInTheDocument();
  });
});
