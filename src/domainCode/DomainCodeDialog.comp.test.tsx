import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';
import { withSaladBarProvider } from '../testing';
import { withAtomProvider, withOverrideDefaults } from '../testing/wrappers';
import DomainCodeDialog from './DomainCodeDialog';

describe('domaincodedialog', () => {
  it('renders', async () => {
    render(
      <DomainCodeDialog
        isLoading={false}
        isOpen={true}
        onClose={vitest.fn()}
        domainOptions={['act', 'ag']}
        applicationName={'Test Application'}
        handleLogout={vitest.fn()}
      />,
      {
        wrapper: wrap(
          withSaladBarProvider(),
          withOverrideDefaults({ domainCode: 'ag' })
        ) as React.FC,
      }
    );
    expect(
      screen.getByText(
        'Select the default organisation that you want to use with the Test Application.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Select organisation' })).toHaveValue('AG');
    expect(screen.getByRole('combobox', { name: 'Select organisation' })).not.toHaveValue('');
  });

  it('should show logout button and error message if they do not have any domains', async () => {
    render(
      <DomainCodeDialog
        isLoading={false}
        isOpen={true}
        onClose={() => {}}
        domainOptions={[]}
        applicationName={''}
        handleLogout={() => {}}
      />,
      {
        wrapper: wrap(
          withOverrideDefaults({ domainCode: 'qld' }),
          withSaladBarProvider()
        ) as React.FC,
      }
    );
    expect(await screen.findByText(/logout/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /You have no roles assigned that are suitable for use with this application\. If you think you should, try logging in again\./i
      )
    ).toBeInTheDocument();
  });

  it('should show retrieve error when domain options failed to load', async () => {
    render(
      <DomainCodeDialog
        isLoading={false}
        isError={true}
        isOpen={true}
        onClose={() => {}}
        domainOptions={[]}
        applicationName={''}
        handleLogout={() => {}}
      />,
      {
        wrapper: wrap(
          withOverrideDefaults({ domainCode: 'qld' }),
          withSaladBarProvider()
        ) as React.FC,
      }
    );
    expect(
      await screen.findByText(
        /Unable to retrieve your active organisations\. Try logging in again\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/You have no roles assigned that are suitable for use with this application/i)
    ).not.toBeInTheDocument();
  });

  it('should not show empty-roles error while loading', async () => {
    render(
      <DomainCodeDialog
        isLoading={true}
        isOpen={true}
        onClose={() => {}}
        domainOptions={[]}
        applicationName={''}
        handleLogout={() => {}}
      />,
      {
        wrapper: wrap(
          withOverrideDefaults({ domainCode: 'qld' }),
          withSaladBarProvider()
        ) as React.FC,
      }
    );
    expect(await screen.findByText(/logout/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/You have no roles assigned that are suitable for use with this application/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Unable to retrieve your active organisations/i)
    ).not.toBeInTheDocument();
  });

  it('should show logout button and blank dialog on first log on', async () => {
    render(
      <DomainCodeDialog
        isLoading={false}
        isOpen={true}
        onClose={() => {}}
        domainOptions={[]}
        applicationName={''}
        handleLogout={() => {}}
      />,
      {
        wrapper: wrap(withSaladBarProvider(), withAtomProvider()) as React.FC,
      }
    );
    expect(await screen.findByText(/logout/i)).toBeInTheDocument();
    expect(await screen.findByRole('combobox')).toHaveDisplayValue(['']);
  });
});
