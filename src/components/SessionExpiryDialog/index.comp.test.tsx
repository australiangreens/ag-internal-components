import { render, screen } from '@testing-library/react';
import SessionExpiryDialog from '.';
import { buildAuth0ContextInterface, buildAuth0User } from '../../testHelpers/testBuilders';

vi.doMock('@auth0/auth0-react', async () => {
  const ourUseAuth0 = vi.fn().mockReturnValue(
    buildAuth0ContextInterface({
      user: buildAuth0User({ name: 'Someone Something' }),
      logout: async () => {},
    })
  );

  return {
    useAuth0: ourUseAuth0,
  };
});

describe('SessionExpiryDialog', () => {
  it('should show the title, the text bar label and both buttons by default', async () => {
    render(
      <SessionExpiryDialog open={true} closeHandler={() => {}} setAuth0ExpiryTime={() => {}} />,
      {}
    );
    expect(screen.getByText('Session expiry')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your session is about to time out due to inactivity. Do you want to continue?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeEnabled();
    expect(screen.getByText('Continue')).toBeEnabled();
  });
});
