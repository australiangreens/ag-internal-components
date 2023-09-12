/// <reference types="vitest" />

import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './setupTests.ts',
    deps: {
      // Originally for [LIST-461].
      // Now causing warnings, see [EVNT-51]
      registerNodeLoader: true,
    },
    // [EVNT-84]
    onConsoleLog: (log) => {
      if (log.includes('Download the React DevTools for a better development experience')) {
        return false;
      }
    },
  },
});
