import { atom } from 'jotai';

export const DOMAIN_CODE_LABELS = {
  act: 'ACT',
  nsw: 'NSW',
  nt: 'NT',
  qld: 'QLD',
  sa: 'SA',
  tas: 'TAS',
  vic: 'VIC',
  wa: 'WA',
  ag: 'AG',
  fedmps: 'FedMPs',
  '': '',
} as const;

export type DomainCode = keyof typeof DOMAIN_CODE_LABELS;

const DOMAIN_CODE_KEY = 'domainCode';

const baseDomainCodeAtom = atom<DomainCode>(
  JSON.parse(localStorage.getItem(DOMAIN_CODE_KEY) ?? '{"domainCode": ""}').domainCode as DomainCode
);

export const domainCodeAtom = atom(
  (get) => get(baseDomainCodeAtom),
  (_, set, newValue: DomainCode) => {
    set(baseDomainCodeAtom, newValue);
    localStorage.setItem(DOMAIN_CODE_KEY, JSON.stringify({ domainCode: newValue }));
  }
);
