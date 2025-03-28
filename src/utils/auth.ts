import { useAuth0 } from '@auth0/auth0-react';
import { IdToken } from '@auth0/auth0-spa-js';
import { useQuery } from '@tanstack/react-query';
import { DomainCode } from 'src/domainCode';
import { T } from 'vitest/dist/chunks/environment.C5eAp3K6';

function fromKebab(string: string) {
  return string.replace(/(^|-)([a-z])/g, (_, separator, char) =>
    separator === '-' ? ' ' + char.toUpperCase() : char.toUpperCase()
  );
}

export function determineUserLevelFromClaims<T extends string>(
  claims: IdToken | undefined,
  domainCode: DomainCode,
  roleMapping: Record<T, string[]>,
  rolePriority: T[]
) {
  if (!claims) return 'None';

  const businessRoleClaimsForDomain = Object.entries(claims).filter(
    ([name, value]) => name.startsWith('https://greens.org.au/roles/') && value.includes(domainCode)
  );
  const roles = businessRoleClaimsForDomain.map(([claimName]) =>
    fromKebab(claimName.split('/').at(-1) ?? '')
  );

  return (
    rolePriority.find((userLevel) =>
      roleMapping[userLevel].some((requiredRole) => roles.includes(requiredRole))
    ) ?? 'None'
  );
}

export const useValidDomains = (appValidBusinessRoles: string[]) => {
  const { getIdTokenClaims, user } = useAuth0();
  return useQuery({
    queryKey: ['availableDomains', user?.sub],
    queryFn: async (): Promise<DomainCode[]> => {
      const claims = await getIdTokenClaims();

      if (!claims) return [];

      return Object.entries(claims).reduce((prev, [name, value]) => {
        const roleName = fromKebab(name.split('/').at(-1) ?? '');
        const domains =
          name.startsWith('https://greens.org.au/roles/') &&
          appValidBusinessRoles.includes(roleName)
            ? value
            : [];
        return [...new Set([...prev, ...domains])];
      }, [] as DomainCode[]);
    },
  });
};

export const getValidBusinessRoles = (roleMapping: Record<T, string[]>) =>
  Object.values(roleMapping).reduce(
    (prev, curr) => [...new Set([...prev, ...curr])],
    [] as string[]
  );
