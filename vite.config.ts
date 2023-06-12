import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import EsLint from 'vite-plugin-linter';
import tsConfigPaths from 'vite-tsconfig-paths';
import * as packageJson from './package.json';

const { EsLinter, linterPlugin } = EsLint;

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
    dts({
      include: ['src'],
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es6',
    lib: {
      entry: {
        // In the future we may want multiple entry points for different
        // components etc
        index: './src/index.ts',
      },
      name: 'AgInternalComponents',
      formats: ['es', 'cjs'],
      fileName: determineFileName,
    },
    rollupOptions: {
      external: [
        // We need to set all peerDependencies as external to prevent them being
        // included in the bundle.
        ...Object.keys(packageJson.peerDependencies),

        // We also need specify react/jsx-runtime too even thought we don't
        // import it ourselves anywhere. Because we are using the react-jsx in
        // tsconfig, it is actually imported and therefore would get bundled.
        'react/jsx-runtime',
      ],
    },
    minify: true,
  },
}));

function determineFileName(format: 'es' | 'esm', entryName: string) {
  const moduleTypeDir = format === 'es' ? 'esm' : format;
  if (entryName === 'index') {
    return `${moduleTypeDir}/index.js`;
  } else {
    return `${moduleTypeDir}/${entryName}/index.js`;
  }
}
