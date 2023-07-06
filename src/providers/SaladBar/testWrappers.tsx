/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { createHelper } from 'souvlaki';

import SaladBarProvider from './SaladBarProvider';

export const withSaladBarProvider = createHelper(() => ({ children }) => (
  <SaladBarProvider>{children}</SaladBarProvider>
));
