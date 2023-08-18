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
  },
});
