import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';
import { withSaladBarProvider } from 'src/providers';
import { withOverrideDefaults } from 'src/testing/wrappers';
import DomainCodeDialog from './DomainCodeDialog';

describe('domaincodedialog', () => {
  it('renders', () => {
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
        wrapper: wrap(withSaladBarProvider(), withOverrideDefaults({ domainCode: 'ag' })),
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
});
