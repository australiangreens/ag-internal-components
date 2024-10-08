import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';
import tsConfigPaths from 'vite-tsconfig-paths';

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
      exclude: ['node_modules/**', 'src/DevApp.tsx', 'src/devMain.tsx', 'src/DevDemo/**'],
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
      output: {
        // [LIST-461]
        interop: 'auto',
      },
    },
    minify: true,
  },
}));

function determineFileName(format: 'es' | 'esm' | 'cjs', entryName: string) {
  const moduleTypeDir = format === 'es' ? 'esm' : format;
  if (entryName === 'index') {
    return `${moduleTypeDir}/index.${format === 'cjs' ? 'c' : ''}js`;
  } else {
    return `${moduleTypeDir}/${entryName}/index.js`;
  }
}
