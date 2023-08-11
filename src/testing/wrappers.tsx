/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Provider, WritableAtom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { PropsWithChildren } from 'react';
import { createHelper } from 'souvlaki';
import { domainCodeAtom } from '../domainCode';
import {
  navBarOpenAtom,
  navBarWidthOpenAtom,
  navBarWidthClosedAtom,
  titleTextAtom,
  topBarHeightAtom,
  navBarTopAtom,
} from '../layouts/AppLayout';

/**
 * When you need to want to set an initial value for an atom, you can use either:
 * - withOverrideDefaults (first add your atom to the atomsToOverride with your choice of key)
 * - your own custom wrapper that extends HydrateAtoms, like withDomainCode.
 *   You'll need to pass it:
 *     -- an array of tuples of atoms and their values.
 *     -- i.e. [[your_atom, value], [another_atom, value2]]
 */

const atomsToOverride = {
  domainCode: domainCodeAtom,
  navBarOpen: navBarOpenAtom,
  navBarWidthOpen: navBarWidthOpenAtom,
  navBarWidthClosed: navBarWidthClosedAtom,
  titleText: titleTextAtom,
  topBarHeight: topBarHeightAtom,
  navBarTop: navBarTopAtom,
};

type OverrideValues<T> = [WritableAtom<T, T[], void>, T][];

type AtomConfigOption = keyof typeof atomsToOverride;

type AtomConfigValue<T extends AtomConfigOption> = ReturnType<
  typeof useAtomValue<(typeof atomsToOverride)[T]>
>;

type AtomConfig = { [K in AtomConfigOption]: AtomConfigValue<K> };

export const withAtomProvider = createHelper(() => ({ children }) => (
  <Provider>{children}</Provider>
));

export const HydrateAtoms = <T,>({
  initialValues,
  children,
}: PropsWithChildren<{ initialValues: OverrideValues<T> }>) => {
  useHydrateAtoms<OverrideValues<T>>(initialValues);
  return <>{children}</>;
};

export const withOverrideDefaults = createHelper(
  (overrides: Partial<AtomConfig>) =>
    ({ children }) =>
      (
        <HydrateAtoms
          // Typescript doesn't type Object.entries well yet
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialValues={(Object.entries(overrides) as any).map(
            <T extends AtomConfigOption>([key, value]: [T, AtomConfigValue<T>]) => [
              atomsToOverride[key],
              value,
            ]
          )}
        >
          {children}
        </HydrateAtoms>
      )
);
