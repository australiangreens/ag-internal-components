/// <reference types="vitest" />

import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          // [EVNT-105] Can remove this once some upstream PRs are done.
          // TL;DR it avoids the 'MUI: useResizeContainer' errors in tests
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          navigator: {
            userAgent: 'Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/22.1.0',
          },
        },
      },
    },
    setupFiles: './setupTests.ts',
    deps: {
      // Originally for [LIST-461].
      // Now causing warnings, see [EVNT-51]
      registerNodeLoader: true,
    },
  },
});
