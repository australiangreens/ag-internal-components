import { ArrowBack } from '@mui/icons-material';
import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';
import NavBarLink from './NavBarLink';
import { withBrowserRouter } from './testWrappers';

describe('NavBarLink', () => {
  it('renders', () => {
    render(<NavBarLink icon={<ArrowBack />} label="Close" />, {
      wrapper: wrap(withBrowserRouter()),
    });
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
