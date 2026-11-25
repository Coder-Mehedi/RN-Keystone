import { type ConfigContext, type ExpoConfig } from 'expo/config';

/**
 * The identity of the app. These three values are the only thing that has to change to reuse
 * this skeleton for a new app.
 */
const APP_NAME = 'App';
const APP_SLUG = 'app';
const BUNDLE_ID = 'com.example.app';

/**
 * The environments a binary can be built for. Set `APP_VARIANT` when building or starting:
 *   APP_VARIANT=preview bunx expo run:ios
 * The EAS build profiles in eas.json set it for cloud builds.
 * Mirrors `AppVariant` in src/shared/config/env.ts.
 */
type AppVariant = 'development' | 'preview' | 'production';

function resolveAppVariant(): AppVariant {
  const value = process.env.APP_VARIANT;
  return value === 'preview' || value === 'production' ? value : 'development';
}

const APP_VARIANT = resolveAppVariant();

// Variants install side by side: different names, identifiers and URL schemes.
const NAME_SUFFIX = { development: ' (Dev)', preview: ' (Preview)', production: '' }[APP_VARIANT];
const IDENTIFIER_SUFFIX = { development: '.dev', preview: '.preview', production: '' }[APP_VARIANT];
const SCHEME = {
  development: `${APP_SLUG}-dev`,
  preview: `${APP_SLUG}-preview`,
  production: APP_SLUG,
}[APP_VARIANT];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: `${APP_NAME}${NAME_SUFFIX}`,
  slug: APP_SLUG,
  version: '1.0.0',
  scheme: SCHEME,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',

  ios: {
    bundleIdentifier: `${BUNDLE_ID}${IDENTIFIER_SUFFIX}`,
    icon: './assets/expo.icon',
    supportsTablet: false,
  },

  android: {
    package: `${BUNDLE_ID}${IDENTIFIER_SUFFIX}`,
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      backgroundImage: './assets/images/android-icon-background.png',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },

  web: {
    output: 'server',
    favicon: './assets/images/favicon.png',
  },

  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#FFFFFF',
        dark: { backgroundColor: '#09090B' },
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ],
    'expo-secure-store',
    '@sentry/react-native',
  ],

  // An over-the-air update may only reach a binary whose native side is identical.
  runtimeVersion: { policy: 'fingerprint' },

  extra: {
    appVariant: APP_VARIANT,
  },

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
