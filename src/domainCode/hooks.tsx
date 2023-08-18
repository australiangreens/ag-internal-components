import { atom } from 'jotai';

import { DomainCode } from './DomainCodeDialog';

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
