import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
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
  },
});
