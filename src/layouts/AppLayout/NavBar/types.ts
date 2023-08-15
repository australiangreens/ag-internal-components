import { ReactNode } from 'react';

export interface NavBarLink {
  label: string;
  destPathname: string;
  icon?: ReactNode;
  // links?: NavBarLink[];
}

export interface User {
  name?: string;

  /** URL of user's avatar image*/
  picture?: string;
}
