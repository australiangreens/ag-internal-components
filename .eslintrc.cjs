module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'eslint-plugin-tsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  rules: {
    // Core rules
    radix: ['error', 'as-needed'],
    'import/prefer-default-export': 0,
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],

    // @typescript-eslint rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        variables: true,
        functions: false,
        classes: false,
        enums: true,
        typedefs: true,
      },
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        // This matches examples on
        // https://www.typescriptlang.org/docs/handbook/2/functions.html
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          },
        },
      },
    ],

    // react rules
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'react/destructuring-assignment': ['error', 'always'],

    // eslint-plugin-tsdoc rules
    'tsdoc/syntax': 'warn',

    // It can be useful to effectively re-export the props of another component
    // for some wrappers. E.g. SaladBarProviderProps is same as SnackbarProps
    '@typescript-eslint/no-empty-interface': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false,
    tsconfigRootDir: __dirname,
  },
  settings: {
    // See https://www.npmjs.com/package/eslint-plugin-react for other settings
    // related to react eslint plugin
    react: {
      version: 'detect',
    },
  },
};
