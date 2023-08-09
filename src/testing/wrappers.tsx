/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Provider, WritableAtom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { PropsWithChildren } from 'react';
import { createHelper } from 'souvlaki';
import { domainCodeAtomWithPersistence } from '../domainCode';

/**
 * When you need to want to set an initial value for an atom, you can use either:
 * - withDefaultValue (first add your atom to the atomsToInitialize)
 * - your own custom wrapper that extends HydrateAtoms, like withDomainCode.
 *   You'll need to pass it:
 *     -- an array of tuples of atoms and their values.
 *     -- i.e. [[your_atom, value], [another_atom, value2]]
 */

const atomsToInitialize = {
  domainCode: domainCodeAtomWithPersistence,
};

export const withAtomProvider = createHelper(() => ({ children }) => (
  <Provider>{children}</Provider>
));

export const HydrateAtoms = <T,>({
  initialValues,
  children,
}: PropsWithChildren<{ initialValues: [WritableAtom<T, T[], void>, T][] }>) => {
  useHydrateAtoms<[WritableAtom<T, T[], void>, T][]>(initialValues);
  return children;
};

type AtomConfigOption = keyof typeof atomsToInitialize;

type AtomConfigValue<T extends AtomConfigOption> = ReturnType<
  typeof useAtomValue<(typeof atomsToInitialize)[T]>
>;

type AtomConfig = { [K in AtomConfigOption]: AtomConfigValue<K> };

export const withDefaultValue = createHelper((overrides: Partial<AtomConfig>) => ({ children }) => (
  <HydrateAtoms
    // Typescript doesn't type Object.entries well yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialValues={(Object.entries(overrides) as any).map(
      <T extends AtomConfigOption>([key, value]: [T, AtomConfigValue<T>]) => [
        atomsToInitialize[key],
        value,
      ]
    )}
  >
    {children}
  </HydrateAtoms>
));
