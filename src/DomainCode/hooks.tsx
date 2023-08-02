import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET, atomWithStorage } from 'jotai/utils';
import { DomainCode } from './DomainCodeDialog';

const domainCodeAtom = atomWithStorage<DomainCode>('domainCode', 'ag');

export const useDomainCode = () => {
  const [domainCode, setDomainCode] = useAtom(domainCodeAtom);
  return [domainCode, setDomainCode, () => setDomainCode(RESET)] as const;
};

export const useDomainCodeValue = () => {
  return useAtomValue(domainCodeAtom);
};

export const useSetDomainCode = () => {
  return useSetAtom(domainCodeAtom);
};
