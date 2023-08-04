import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { DomainCode } from './DomainCodeDialog';

const DOMAIN_CODE_KEY = 'domainCode';

const domainCodeAtom = atom<DomainCode>(
  (localStorage.getItem(DOMAIN_CODE_KEY) as DomainCode) ?? ''
);
const domainCodeAtomWithPersistence = atom(
  (get) => get(domainCodeAtom),
  (get, set, newValue: DomainCode) => {
    set(domainCodeAtom, newValue);
    localStorage.setItem(DOMAIN_CODE_KEY, newValue);
  }
);

export const useDomainCode = () => {
  const [domainCode, setDomainCode] = useAtom(domainCodeAtomWithPersistence);
  return [domainCode, setDomainCode, () => setDomainCode('')] as const;
};

export const useDomainCodeValue = () => {
  return useAtomValue(domainCodeAtomWithPersistence);
};

export const useSetDomainCode = () => {
  return useSetAtom(domainCodeAtomWithPersistence);
};
