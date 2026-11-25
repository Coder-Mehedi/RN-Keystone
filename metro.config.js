const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  // The location of this file also defines the root that Tailwind scans for class names.
  cssEntryFile: './src/global.css',
  // Generated typings for themes and `className`. Add to .gitignore; regenerate with
  // `bunx uniwind generate-artifacts` when it is missing.
  dtsFile: './src/uniwind-types.d.ts',
});
