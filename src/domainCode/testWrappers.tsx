/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';
import { HydrateAtoms } from '../testing';
import { DomainCode } from './DomainCodeDialog';
import { domainCodeAtomWithPersistence } from './hooks';

export const withDomainCode = createHelper((override: DomainCode = '') => ({ children }) => (
  <HydrateAtoms initialValues={[[domainCodeAtomWithPersistence, override]]}>
    {children}
  </HydrateAtoms>
));
