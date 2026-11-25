const boundaries = require('eslint-plugin-boundaries');
const prettierConfig = require('eslint-config-prettier');
const expoConfig = require('eslint-config-expo/flat');
const reactNativeA11y = require('eslint-plugin-react-native-a11y');
const { defineConfig } = require('eslint/config');
const globals = require('globals');

const baseExtensions = ['.cjs', '.mjs', '.js', '.jsx', '.ts', '.tsx'];
// Same order Metro resolves them in: platform-specific files win over generic ones.
const platformExtensions = ['.android', '.ios', '.web', '.native', ''];
const allExtensions = platformExtensions.flatMap((platform) =>
  baseExtensions.map((extension) => `${platform}${extension}`),
);

const nodeFiles = ['*.config.js', 'scripts/**/*.{js,cjs,mjs,ts}', 'tests/**/*.{js,ts}'];
const testFiles = ['**/*.test.{ts,tsx}', 'tests/**/*.{ts,tsx}'];

module.exports = defineConfig([
  {
    ignores: [
      'node_modules/**',
      'ios/**',
      'android/**',
      'dist/**',
      'coverage/**',
      '.expo/**',
      'expo-env.d.ts',
      'src/uniwind-types.d.ts',
    ],
  },

  expoConfig,
  // Prettier owns formatting; turn off the lint rules that disagree with it.
  prettierConfig,

  {
    files: nodeFiles,
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    files: testFiles,
    languageOptions: {
      globals: globals.jest,
    },
  },

  {
    // Jest runs mock factories before imports exist, so they load modules with require().
    files: ['tests/setup.ts', 'tests/**/mocks/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],

    settings: {
      // `@/` aliases come from tsconfig paths, so the TypeScript resolver has to go first.
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: { extensions: allExtensions },
      },
      'import/internal-regex': '^@/',

      // The layers of the app. Keep in sync with docs/PLAN.md section 6.2.
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        { type: 'screen', pattern: 'src/screens/*', partialMatch: false, capture: ['name'] },
        { type: 'feature', pattern: 'src/features/*', partialMatch: false, capture: ['name'] },
        { type: 'entity', pattern: 'src/entities/*', partialMatch: false, capture: ['name'] },
        { type: 'shared', pattern: 'src/shared', partialMatch: false },
      ],
      'boundaries/files': [
        { pattern: 'src/**/*.test.{ts,tsx}', category: 'test' },
        { pattern: 'src/**/*.css', category: 'style' },
        { pattern: 'assets/**/*', category: 'asset' },
      ],
    },

    plugins: {
      boundaries,
      'react-native-a11y': reactNativeA11y,
    },

    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          // Without this the plugin skips every import between files of the same element, so
          // route files could import each other and source files could import test files.
          checkInternals: true,
          policies: [
            // `shared` is the bottom layer and knows nothing about the app around it.
            {
              from: { element: { type: 'shared' } },
              disallow: { to: { element: { types: ['app', 'screen', 'feature', 'entity'] } } },
            },

            // Entities are shared building blocks: no features, screens or routes.
            {
              from: { element: { type: 'entity' } },
              disallow: { to: { element: { types: ['app', 'screen', 'feature'] } } },
            },

            // Features never reach into screens or routes.
            {
              from: { element: { type: 'feature' } },
              disallow: { to: { element: { types: ['app', 'screen'] } } },
            },

            // A screen is composed from features; it never imports another screen.
            {
              from: { element: { type: 'screen' } },
              disallow: { to: { element: { types: ['screen', 'app'] } } },
            },

            // Route files never import each other.
            {
              from: { element: { type: 'app' } },
              disallow: { to: { element: { type: 'app' } } },
            },

            // From the outside, a feature or an entity is only its index file.
            {
              to: { element: { type: ['feature', 'entity'] } },
              disallow: { to: { element: { fileInternalPath: '!index.{ts,tsx}' } } },
              message:
                'Import "{{to.element.captured.name}}" only through its index.ts, its public API',
            },

            // Files inside one element may import each other freely. Route files are the
            // exception: they all share one element, and the rule above must still apply.
            {
              from: { element: { type: '!app' } },
              allow: { dependency: { relationship: { to: 'internal' } } },
            },

            // Test files are never imported, not even by their own element.
            // Must stay last: the last matching policy decides.
            {
              disallow: { to: { file: { categories: 'test' } } },
            },
          ],
        },
      ],

      // Catch stray files that belong to no layer.
      'boundaries/no-unknown-dependencies': 'error',

      // The import plugin checks named exports against compiled JavaScript, so it reports
      // TypeScript type exports (such as `z.infer`) as missing. TypeScript already checks these.
      'import/named': 'off',
      'import/namespace': 'off',

      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['react', 'react-native'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'expo/fetch',
              message: 'Use the HTTP client in shared/api instead of calling fetch directly.',
            },
          ],
          patterns: [
            {
              group: ['@react-navigation/*'],
              message:
                'Expo Router owns navigation. React Navigation packages cannot be used next to it.',
            },
            {
              group: ['react-native/Libraries/*'],
              message:
                'Deep imports are not public API and are type errors since React Native 0.87.',
            },
          ],
        },
      ],

      'react-native-a11y/has-accessibility-props': 'error',
      'react-native-a11y/has-valid-accessibility-actions': 'error',
      'react-native-a11y/has-valid-accessibility-component-type': 'error',
      'react-native-a11y/has-valid-accessibility-descriptors': 'error',
      'react-native-a11y/has-valid-accessibility-ignores-invert-colors': 'error',
      'react-native-a11y/has-valid-accessibility-live-region': 'error',
      'react-native-a11y/has-valid-accessibility-role': 'error',
      'react-native-a11y/has-valid-accessibility-state': 'error',
      'react-native-a11y/has-valid-accessibility-states': 'error',
      'react-native-a11y/has-valid-accessibility-traits': 'error',
      'react-native-a11y/has-valid-accessibility-value': 'error',
      'react-native-a11y/has-valid-important-for-accessibility': 'error',
      'react-native-a11y/no-nested-touchables': 'error',
    },
  },
]);
