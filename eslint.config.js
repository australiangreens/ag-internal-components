import agLintPlugin from '@australiangreens/eslint-plugin-ag-internal';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist', '**/coverage']),
  agLintPlugin.configs.recommendedReact,
  {
    files: ['**/*.ts', '**/*.tsx'],
  },

  {
    rules: {
      // [LIST-974] Disabled for now until we fix the issues it raises
      'react-refresh/only-export-components': 'off',
    },
  },
]);
