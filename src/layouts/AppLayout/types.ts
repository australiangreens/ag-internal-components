import { ReactNode, ComponentProps, PropsWithChildren } from 'react';

import PageContainer from './PageContainer';
import { AppLayoutContextActions, AppLayoutContextState } from './AppLayoutContext';

export interface NavBarProps {
  content?: ReactNode;
  widthOpen?: number;
  widthClosed?: number;
}

export interface BaseAppLayoutProps {
  navBar?: NavBarProps;

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
