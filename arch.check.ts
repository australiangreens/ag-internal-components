import {
  agFrontendPreset,
  DEFAULT_TEST_FILE_GLOBS,
  defineArchConfig,
  runArchRules,
} from '@australiangreens/ag-arch-rules';

runArchRules(
  defineArchConfig({
    root: './src',
    testFiles: [...DEFAULT_TEST_FILE_GLOBS, 'src/**/__tests__/**/*.{ts,tsx}'],
    mode: 'report',
    rules: {
      ...agFrontendPreset.rules,
      'require-error-hierarchy': 'off',
      'errors-extend-ag-error': 'off',
      'require-path-alias': 'off',
      // 'no-circular-dependencies': 'warn',
    },
  })
);
