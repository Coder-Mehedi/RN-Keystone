const expoPreset = require('jest-expo/jest-preset');

// Packages used in this project that ship ESM, so Jest has to compile them before it can load
// them. jest-expo's own allow list is taken from its preset further down, so it stays in sync
// across SDK upgrades.
const compiledPackages = [
  '.bun', // Bun's isolated install layout
  '@shopify/flash-list',
  '@tanstack',
  'lucide-react-native',
  'uniwind',
];

/** jest-expo's first pattern, with `compiledPackages` added to its allow list. */
function extendExpoTransformPattern() {
  // The preset declares its patterns as strings whose leading "/" is a literal path separator.
  const [first, ...rest] = expoPreset.transformIgnorePatterns;
  const source = typeof first === 'string' ? first : first.source;
  // The pattern is `/node_modules/(?((a|b|c)))`: a negative lookahead with one group of
  // alternatives. Insert our names at the front of that group.
  const extended = source.replace('(?!(', `(?!(${compiledPackages.join('|')}|`);
  if (extended === source) {
    throw new Error(
      'jest-expo changed the shape of transformIgnorePatterns. Update jest.config.js to match.',
    );
  }
  return [extended, ...rest];
}

/** The preset compiles `.js/.jsx/.ts/.tsx` only. Some packages resolve to `.mjs` builds. */
function withMjsTransform() {
  const entry = Object.entries(expoPreset.transform).find(([pattern]) =>
    pattern.includes('[jt]sx'),
  );
  if (!entry) {
    throw new Error('jest-expo changed the shape of transform. Update jest.config.js to match.');
  }
  return { ...expoPreset.transform, '\\.mjs$': entry[1] };
}

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // Rendering a React Native tree is slower than Jest's 5 s default allows for.
  testTimeout: 15000,
  transform: withMjsTransform(),
  transformIgnorePatterns: extendExpoTransformPattern(),
  moduleNameMapper: {
    // Stylesheets have no meaning under Jest. The preset already maps the `@/` alias from tsconfig.
    '\\.css$': '<rootDir>/tests/mocks/style-mock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/ios/', '/android/', '/dist/'],
};
