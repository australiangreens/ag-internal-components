import { IdToken } from '@auth0/auth0-spa-js';
import { DomainCode } from 'src/domainCode';

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
