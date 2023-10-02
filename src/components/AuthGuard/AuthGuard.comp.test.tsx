import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationError } from '@auth0/auth0-spa-js';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe } from 'vitest';

import { buildAuth0ContextInterface } from '../../testHelpers/testBuilders';
import AuthGuard from './AuthGuard';

vi.mock('@auth0/auth0-react');
const mockedUseAuth0 = vi.mocked(useAuth0);

const SomeComponent = () => {
  return <div>This is the child component</div>;
};

const commonRender = () => {
  return render(
    <AuthGuard>
      <SomeComponent />
    </AuthGuard>
  );
};

const generateAuth0Error = (errorName: string, errorDescription: string) =>
  // Our custom authorisation actions in auth0 result in an AuthenticationError
  // since there is no special AuthorisationError
  new AuthenticationError(errorName, errorDescription, 'Does not matter what this string is');

// will want to override isAuthenticated, isLoading, error, loginWithRedirect, logout
const mockUseAuth0Hook = (overrides: Parameters<typeof buildAuth0ContextInterface>[0] = {}) =>
  mockedUseAuth0.mockReturnValue(buildAuth0ContextInterface(overrides));

describe('AuthGuard', () => {
  it("renders children if useAuth0() hook's isAuthenticated value is true", async () => {
    mockUseAuth0Hook({ isAuthenticated: true });
    commonRender();
    expect(screen.getByText('This is the child component')).toBeInTheDocument();
  });

  it("does not render children if useAuth0() hook's isAuthenticated value is false", async () => {
    mockUseAuth0Hook({ isAuthenticated: false });
    commonRender();
    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
  });

  it('renders appropriate message in case of unknown auth0 error', async () => {
    mockUseAuth0Hook({
      error: generateAuth0Error('something', 'Some description'),
    });
    commonRender();

    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
    expect(screen.queryByText('Auth error')).toBeInTheDocument();
    expect(screen.queryByText('An unknown Auth0 error occurred.')).toBeInTheDocument();
  });

  it('renders appropriate message in case of unknown auth0 authentication error', async () => {
    mockUseAuth0Hook({
      error: generateAuth0Error('access_denied', 'Some description'),
    });
    commonRender();

    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
    expect(screen.queryByText('Unauthorised')).toBeInTheDocument();
    expect(
      screen.queryByText('Authorisation with auth0 failed for an unknown reason.')
    ).toBeInTheDocument();
  });

  it('renders appropriate message in case of auth0 error indicating user is not authorised', async () => {
    mockUseAuth0Hook({
      error: generateAuth0Error(
        'access_denied',
        'You do not have the required authorization to access The Application Name'
      ),
    });
    render(
      <AuthGuard appName="The Name of the Application">
        <SomeComponent />
      </AuthGuard>
    );

    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
    expect(screen.queryByText('Unauthorised')).toBeInTheDocument();
    expect(
      screen.queryByText('You are not authorised to access The Name of the Application.')
    ).toBeInTheDocument();
  });

  it('renders appropriate message in case of user not authorising app to access profile', async () => {
    mockUseAuth0Hook({
      error: generateAuth0Error('access_denied', 'User did not authorize the request'),
    });
    render(
      <AuthGuard appName="The Name of the Application">
        <SomeComponent />
      </AuthGuard>
    );

    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
    expect(screen.queryByText('App not authorised')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'You have not authorised The Name of the Application to access your user profile. This is necessary to use The Name of the Application.'
      )
    ).toBeInTheDocument();
  });

  it('logout button on error returns to origin', async () => {
    const user = userEvent.setup();

    const mockLogout = vi.fn();
    mockUseAuth0Hook({
      error: generateAuth0Error('access_denied', 'User did not authorize the request'),
      logout: mockLogout,
    });
    commonRender();

    expect(mockLogout).not.toHaveBeenCalled();
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledExactlyOnceWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });

  it('redirects to login (with return to set to current url) if user not already authed', async () => {
    const mockLoginWithRedirect = vi.fn();

    mockUseAuth0Hook({
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    commonRender();

    const currentUrl = `${window.location.pathname}${window.location.search}`;
    expect(mockLoginWithRedirect).toHaveBeenCalledExactlyOnceWith({
      appState: { returnTo: currentUrl },
    });
  });
});
