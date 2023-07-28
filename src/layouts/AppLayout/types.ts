import { ComponentProps, PropsWithChildren } from 'react';

import PageContainer from './PageContainer';
import { AppLayoutContextActions, AppLayoutContextState } from './AppLayoutContext';
import { NavBarProps } from './NavBar';

export interface BaseAppLayoutProps {
  /** Either an array of objects used to automatically generate the content of
   * the navbar, or a node to render directly.*/
  navBarMiddle: NavBarProps['contents'];

  /** Props applied to the PageContainer component, which is a styled MUI Container */
  pageContainerProps?: ComponentProps<typeof PageContainer>;

  topBarDataTestId?: string;

  pageContentDataTestId?: string;

  /** Allow overriding the context state (navBarOpen etc) for tests,
   * particularly with souvlaki */
  overrideContextState?: Partial<AppLayoutContextState>;

  /** Allow overriding the context actions (setNavBarOpen etc) for tests,
   * particularly with souvlaki */
  overrideContextActions?: Partial<AppLayoutContextActions>;
}

export type AppLayoutProps = PropsWithChildren<BaseAppLayoutProps>;
