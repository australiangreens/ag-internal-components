import { default as jestDomMatchers } from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { default as jestExtendedMatchers } from 'jest-extended';
import { afterEach, expect } from 'vitest';

// This added extra matchers. It works with vitest as well as jest
import '@australiangreens/ag-error-jest';

expect.extend(jestExtendedMatchers);
expect.extend(jestDomMatchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
