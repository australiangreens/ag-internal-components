import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import EsLint from 'vite-plugin-linter';
import tsConfigPaths from 'vite-tsconfig-paths';
const { EsLinter, linterPlugin } = EsLint;
import * as packageJson from './package.json';

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
      external: [...Object.keys(packageJson.peerDependencies)],
    },
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
