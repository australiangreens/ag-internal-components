import { ReactNode } from 'react';

export interface NavBarLink {
  label: string;
  destPathname: string;
  icon?: ReactNode;
  // links?: NavBarLink[];
}
