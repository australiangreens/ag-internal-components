import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

// This added extra matchers. It works with vitest as well as jest
import '@australiangreens/ag-error-jest';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Make it possible to change the userAgent
// https://vincent-benoit.medium.com/how-to-test-useragent-with-jest-inside-a-react-application-cfd87648843a
// https://github.com/jestjs/jest/issues/717
Object.defineProperty(
  window.navigator,
  'userAgent',
  ((value) => ({
    get() {
      return value;
    },

    set(v) {
      value = v;
    },
  }))(window.navigator.userAgent)
);

// Using writable and configurable in above didn't solve typescript issue for me
// so just do this instead
interface CustomNavigator extends Navigator {
  userAgent: string; // Not readonly
}

// [EVNT-84] MUI's datagrid component checks if 'jsdom' is in the userAgent and
// if so supresses warnings like "MUI: useResizeContainer - The parent DOM
// element of the data grid has an empty width" etc. We use happy-dom, which
// does not add such information to the userAgent, so we override it ourselves
// to look like jsdom's. At time of writing we don't actually use the datagrid
// here, but its likely we'll add in in the future.
(window.navigator as CustomNavigator).userAgent =
  'Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/22.1.0';
