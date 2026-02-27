import { useAuth0 } from '@auth0/auth0-react';
import { IdToken } from '@auth0/auth0-spa-js';
import { useQuery } from '@tanstack/react-query';
import { DomainCode } from 'src/domainCode';

function fromKebab(string: string) {
  return string.replace(/(^|-)([a-z])/g, (_, separator, char) =>
    separator === '-' ? ' ' + char.toUpperCase() : char.toUpperCase()
  );
}

export function determineUserLevelFromClaims<T extends string>(
  claims: IdToken | undefined,
  domainCode: DomainCode,
  roleMapping: Record<T, readonly string[]>,
  rolePriority: readonly T[]
) {
  if (!claims) return 'None';

  const rolesClaim = claims['https://greens.org.au/roles'] as
    | Record<string, string[]>
    | undefined;
  if (!rolesClaim) return 'None';

  const roles = Object.entries(rolesClaim)
    .filter(([, domains]) => domains.includes(domainCode))
    .map(([roleName]) => fromKebab(roleName));

  return (
    rolePriority.find((userLevel) =>
      roleMapping[userLevel].some((requiredRole) => roles.includes(requiredRole)),
    ) ?? 'None'
  );
}

export function getDomainsFromRolesClaim(
  rolesClaim: Record<string, string[]>,
  appValidBusinessRoles: string[],
): DomainCode[] {
  return Object.entries(rolesClaim).reduce((prev, [roleName, domains]) => {
    const roleTitle = fromKebab(roleName);
    const validDomains = appValidBusinessRoles.includes(roleTitle)
      ? (domains as DomainCode[])
      : [];
    return [...new Set([...prev, ...validDomains])];
  }, [] as DomainCode[]);
}

export const useValidDomains = (appValidBusinessRoles: string[]) => {
  const { getIdTokenClaims, user } = useAuth0();
  return useQuery({
    queryKey: ['availableDomains', user?.sub],
    queryFn: async (): Promise<DomainCode[]> => {
      const claims = await getIdTokenClaims();
      if (!claims) return [];

      const rolesClaim = claims['https://greens.org.au/roles'] as
        | Record<string, string[]>
        | undefined;
      if (!rolesClaim) return [];

      return getDomainsFromRolesClaim(rolesClaim, appValidBusinessRoles);
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValidBusinessRoles = (roleMapping: Record<any, string[]>) =>
  Object.values(roleMapping).reduce(
    (prev, curr) => [...new Set([...prev, ...curr])],
    [] as string[]
  );
