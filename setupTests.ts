import * as jestDomMatchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import * as jestExtendedMatchers from 'jest-extended';
import { afterEach, expect } from 'vitest';

expect.extend(jestExtendedMatchers);
expect.extend(jestDomMatchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
