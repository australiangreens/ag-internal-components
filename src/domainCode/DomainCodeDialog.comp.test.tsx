import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';
import { withSaladBarProvider } from '../providers';
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
        /Unable to retrieve your active organisations. Try logging in again./i
      )
    ).toBeInTheDocument();
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
