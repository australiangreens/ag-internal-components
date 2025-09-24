import { Auth0ContextInterface } from '@auth0/auth0-react';
import { User } from '@auth0/auth0-spa-js';

import { Auth0UserRecord } from '../types';

export type Builder<T> = (overrides?: Partial<T>) => T;

export const buildAuth0User: Builder<User> = (overrides = {}) => ({
  email: 'johndoe@me.com',
  email_verified: true,
  sub: 'auth0|testUser',
  given_name: 'User',
  ...overrides,
});

export const buildAuth0UserRecord: Builder<Auth0UserRecord> = (overrides = {}) => ({
  email: 'bugdudat@vuk.my',
  id: 'auth0|testUser',
  name: 'Norman Phelps',
  picture: 'http://por.ee/zah',
  ...overrides,
});

export const buildAuth0ContextInterface: Builder<Auth0ContextInterface<User>> = (
  overrides = {}
) => ({
  isAuthenticated: true,
  user: buildAuth0User(),
  logout: async () => {},
  loginWithRedirect: async () => {},
  getAccessTokenWithPopup: async () => '',
  getAccessTokenSilently: vitest.fn().mockReturnValue('mocktoken'),
  getIdTokenClaims: async () => undefined,
  loginWithPopup: async () => {},
  isLoading: false,
  buildAuthorizeUrl: async () => '',
  buildLogoutUrl: () => '',
  handleRedirectCallback: vitest.fn(),
  error: undefined,
  getDpopNonce: async (id?: string) => {
    return id;
  },
  setDpopNonce: async () => {},
  generateDpopProof: async () => '',
  createFetcher: vitest.fn(),
  ...overrides,
});
