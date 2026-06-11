import { ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import { internalAgSystemsTheme } from '../../themes';
import AgDataGrid from './AgDataGrid';

const columns = [{ field: 'name', headerName: 'Name', width: 150 }];

const renderGrid = (ui: ReactElement) =>
  render(<ThemeProvider theme={internalAgSystemsTheme}>{ui}</ThemeProvider>);

describe('AgDataGrid', () => {
  it('renders row data with List Manager defaults', () => {
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

  it('supports auto layout with a hidden footer', () => {
    renderGrid(
      <AgDataGrid
        layout="auto"
        footer="hidden"
        loadingVariant="none"
        rows={[{ id: 1, name: 'Auto row' }]}
        columns={columns}
      />
    );

    expect(screen.getByText('Auto row')).toBeInTheDocument();
  });

  it('uses a custom loading overlay when loadingVariant is custom', () => {
    renderGrid(
      <AgDataGrid
        layout="auto"
        footer="hidden"
        loadingVariant="custom"
        loading
        rows={[]}
        columns={columns}
        slots={{
          loadingOverlay: () => <div>Custom loading overlay</div>,
        }}
      />
    );

    expect(screen.getByText('Custom loading overlay')).toBeInTheDocument();
  });

  it('scrolls inside the grid when maxHeight is set', () => {
    renderGrid(
      <AgDataGrid
        layout="auto"
        maxHeight={400}
        footer="hidden"
        loadingVariant="none"
        rows={Array.from({ length: 50 }, (_, index) => ({
          id: index + 1,
          name: `Row ${index + 1}`,
        }))}
        columns={columns}
      />
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 50')).toBeInTheDocument();
  });
});
