// src/utils/auth.unit.test.ts
import { describe, expect, it } from 'vitest';
import { determineUserLevelFromClaims, getDomainsFromRolesClaim } from './auth';

// A minimal role mapping for test purposes.
// Structure mirrors BUSINESS_ROLE_MAPPING in listmanager-frontend.
const ROLE_MAPPING = {
  Admin:     ['Administrator', 'National Officer'],
  Organiser: ['Local Organiser'],
  Caller:    ['Campaign Volunteer'],
  None:      [],
} as const;

const ROLE_PRIORITY = ['Admin', 'Organiser', 'Caller', 'None'] as const;

// Helper: build a mock IdToken with single-claim format (new format)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const singleClaim = (roleTodomains: Record<string, string[]>): any =>
  ({ 'https://greens.org.au/roles': roleTodomains });

describe('determineUserLevelFromClaims', () => {
  it('returns None when the roles claim is absent', () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      determineUserLevelFromClaims({} as any, 'nsw', ROLE_MAPPING, ROLE_PRIORITY),
    ).toBe('None');
  });

  it('returns the highest-priority matching role for the given domain', () => {
    const claims = singleClaim({ administrator: ['nsw', 'vic'] });
    expect(
      determineUserLevelFromClaims(claims, 'nsw', ROLE_MAPPING, ROLE_PRIORITY),
    ).toBe('Admin');
  });

  it('returns a lower-priority role when a higher-priority one does not match the domain', () => {
    const claims = singleClaim({
      administrator:     ['vic'],
      'local-organiser': ['nsw'],
    });
    expect(
      determineUserLevelFromClaims(claims, 'nsw', ROLE_MAPPING, ROLE_PRIORITY),
    ).toBe('Organiser');
  });

  it('returns None when the user has no roles for the given domain', () => {
    const claims = singleClaim({ administrator: ['vic'] });
    expect(
      determineUserLevelFromClaims(claims, 'nsw', ROLE_MAPPING, ROLE_PRIORITY),
    ).toBe('None');
  });
});

describe('getDomainsFromRolesClaim', () => {
  const validRoles = ['Administrator', 'Local Organiser', 'Campaign Volunteer'];

  it('returns domains where the user holds a valid role', () => {
    const rolesClaim = {
      administrator:     ['nsw', 'vic'],
      'local-organiser': ['qld'],
    };
    expect(getDomainsFromRolesClaim(rolesClaim, validRoles)).toEqual(
      expect.arrayContaining(['nsw', 'vic', 'qld']),
    );
    expect(getDomainsFromRolesClaim(rolesClaim, validRoles)).toHaveLength(3);
  });

  it('excludes domains for roles not in validRoles', () => {
    const rolesClaim = {
      administrator:  ['nsw'],
      'unknown-role': ['vic'],
    };
    expect(getDomainsFromRolesClaim(rolesClaim, validRoles)).toEqual(['nsw']);
  });

  it('deduplicates domains that appear under multiple valid roles', () => {
    const rolesClaim = {
      administrator:     ['nsw'],
      'local-organiser': ['nsw', 'vic'],
    };
    const result = getDomainsFromRolesClaim(rolesClaim, validRoles);
    expect(result).toEqual(expect.arrayContaining(['nsw', 'vic']));
    expect(result).toHaveLength(2);
  });

  it('returns an empty array when rolesClaim is empty', () => {
    expect(getDomainsFromRolesClaim({}, validRoles)).toEqual([]);
  });
});
