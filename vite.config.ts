import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type LibraryFormats } from 'vite';
import dts from 'vite-plugin-dts';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    linterPlugin({
      include: ['./src/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
    dts({
      entryRoot: path.join(import.meta.dirname, 'src'),
      include: ['src'],
      exclude: [
        'node_modules/**',
        'src/DevApp.tsx',
        'src/devMain.tsx',
        'src/DevDemo/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.comp.test.ts',
        '**/*.comp.test.tsx',
        '**/*.unit.test.ts',
        '**/*.unit.test.tsx',
        '**/*.int.test.ts',
        '**/*.int.test.tsx',
        '**/testHelpers/**',
        'src/testing/**',
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es6',
    lib: {
      entry: {
        index: './src/index.ts',
        // Self-contained (React and MUI only), so apps without Auth0 or the data grid can
        // import the install hint from '@australiangreens/ag-internal-components/pwa'
        // without bundling the rest of the library. See src/pwa/isolation.unit.test.ts.
        pwa: './src/pwa/index.ts',
      },
      name: 'AgInternalComponents',
      formats: ['es', 'cjs'] satisfies LibraryFormats[],
      fileName: determineFileName,
    },
    rollupOptions: {
      // We want to make external anything that is not part of our project, so
      // it doesn't get included in the bundle.
      //
      // If we only specified the entries in devDependencies, we'll still
      // include all their transitive dependencies.
      //
      // If we use /node_modules/, we won't include these but rollup will
      // convert all the imports to local paths, absolute on this machine.
      //
      // So, we use the functional form to ensure we only make external the
      // actual imports that aren't local.
      external: (id: string) => {
        return !id.startsWith('/') && !id.startsWith('.');
      },
    },
    minify: true,
  },
}));

function determineFileName(format: string, entryName: string) {
  const moduleTypeDir = format === 'es' ? 'esm' : format;
  const extension = format === 'cjs' ? 'cjs' : 'js';
  if (entryName === 'index') {
    return `${moduleTypeDir}/index.${extension}`;
  } else {
    return `${moduleTypeDir}/${entryName}/index.${extension}`;
  }
}
