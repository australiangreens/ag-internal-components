import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationError } from '@auth0/auth0-spa-js';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe } from 'vitest';

import { buildAuth0ContextInterface } from '../../testHelpers/testBuilders';
import AuthGuard, { AuthGuardProps } from './AuthGuard';

vi.mock('@auth0/auth0-react');
const mockedUseAuth0 = vi.mocked(useAuth0);

const SomeComponent = () => {
  return <div>This is the child component</div>;
};

const commonRender = () => {
  return render(
    <AuthGuard disableConsoleLogging>
      <SomeComponent />
    </AuthGuard>
  );
};

const generateOAuthError = (errorName: string, errorDescription: string) =>
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
      error: generateOAuthError('something', 'Some description'),
    });
    commonRender();

    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
    expect(screen.queryByText('Auth error')).toBeInTheDocument();
    expect(screen.queryByText('An unknown Auth0 error occurred.')).toBeInTheDocument();
  });

  it('renders appropriate message in case of auth0 error indicating user is not authorised', async () => {
    mockUseAuth0Hook({
      error: generateOAuthError(
        'access_denied',
        'You do not have the required authorization to access The Application Name'
      ),
    });
    render(
      <AuthGuard appName="The Name of the Application" disableConsoleLogging>
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
      error: generateOAuthError('access_denied', 'User did not authorize the request'),
    });
    render(
      <AuthGuard appName="The Name of the Application" disableConsoleLogging>
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

  it('renders appropriate message in case script execution time being exceeded', async () => {
    mockUseAuth0Hook({
      error: generateOAuthError('access_denied', 'Script execution time exceeded'),
    });
    render(
      <AuthGuard appName="The Name of the Application" disableConsoleLogging>
        <SomeComponent />
      </AuthGuard>
    );

    expect(screen.queryByText('This is the child component')).not.toBeInTheDocument();
    expect(screen.queryByText('Auth0 script execution time exceeded')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'The Auth0 login flow exceeded the time limit (20s). Try again in a minute by clicking the RELOAD button below.'
      )
    ).toBeInTheDocument();
  });

  it('logout button on error returns to origin', async () => {
    const user = userEvent.setup();

    const mockLogout = vi.fn();
    mockUseAuth0Hook({
      error: generateOAuthError('access_denied', 'User did not authorize the request'),
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

  it('Calls onError()', async () => {
    const mockError = generateOAuthError('access_denied', 'User did not authorize the request');
    const mockOnError = vi.fn();

    mockUseAuth0Hook({
      error: mockError,
    });

    render(
      <AuthGuard appName="The Name of the Application" disableConsoleLogging onError={mockOnError}>
        <SomeComponent />
      </AuthGuard>
    );

    expect(mockOnError).toHaveBeenCalledExactlyOnceWith(mockError);
  });

  it(`throws an error if throwErrors='all' if OAuthError`, async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = generateOAuthError('access_denied', 'User did not authorize the request');

    mockUseAuth0Hook({
      error: mockError,
    });
    expect(() =>
      render(
        <AuthGuard appName="The Name of the Application" disableConsoleLogging throwErrors="all">
          <SomeComponent />
        </AuthGuard>
      )
    ).toThrowError();
    vi.restoreAllMocks();
  });

  it(`does not throw error if throwErrors='unknown' and error is a known OAuthError`, async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = generateOAuthError('access_denied', 'User did not authorize the request');
    mockUseAuth0Hook({
      error: mockError,
    });
    expect(() =>
      render(
        <AuthGuard
          appName="The Name of the Application"
          disableConsoleLogging
          throwErrors="unknown"
        >
          <SomeComponent />
        </AuthGuard>
      )
    ).not.toThrowError();
    vi.restoreAllMocks();
  });

  // This is to detect some bad logic that previously existed where it was only
  // re-throwing if it was first detected as an OAuthError
  it.each([['all'], ['unknown']])(
    `throws an error if throwErrors='%s' and error is not an OAuthError`,
    async (throwErrors) => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Some random error');
      mockUseAuth0Hook({
        error: mockError,
      });
      expect(() =>
        render(
          <AuthGuard
            appName="The Name of the Application"
            disableConsoleLogging
            throwErrors={throwErrors as AuthGuardProps['throwErrors']}
          >
            <SomeComponent />
          </AuthGuard>
        )
      ).toThrowError();
      vi.restoreAllMocks();
    }
  );
  // Ditto
  it(`throws an error if throwErrors='none' and error is not an OAuthError`, async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Some random error');
    mockUseAuth0Hook({
      error: mockError,
    });
    expect(() =>
      render(
        <AuthGuard appName="The Name of the Application" disableConsoleLogging throwErrors="none">
          <SomeComponent />
        </AuthGuard>
      )
    ).not.toThrowError();
    vi.restoreAllMocks();
  });
});
