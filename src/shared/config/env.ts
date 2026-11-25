import Constants from 'expo-constants';
import { z } from 'zod';

type AppVariant = 'development' | 'preview' | 'production';
const APP_VARIANTS = [
  'development',
  'preview',
  'production',
] as const satisfies readonly AppVariant[];

const clientEnvSchema = z.object({
  /** Base URL of the API. Empty until it is configured; the HTTP client refuses to run without it. */
  EXPO_PUBLIC_API_URL: z.url({ protocol: /^https?$/ }).optional(),
  /**
   * When true, the API layer answers from an in-app mock instead of the network.
   * A bundle that does not say gets the network: the mock must never reach users by accident.
   */
  EXPO_PUBLIC_API_MOCK: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .default(false),
});

/** What the app was configured with when it was built. */
export interface ClientEnv extends z.infer<typeof clientEnvSchema> {
  /** Which binary this is. Mirrors `AppVariant` in app.config.ts. */
  appVariant: AppVariant;
  /** True only in a development binary. */
  isDevelopmentVariant: boolean;
}

/**
 * Validates raw configuration and turns it into the app's environment.
 * Throws when a value is malformed: a broken build stops here instead of failing later.
 */
export function parseClientEnv(source: {
  /** The environment variables, as they were written into the bundle. */
  clientEnv: Record<string, string | undefined>;
  /** The variant, as the app manifest names it. */
  appVariant: unknown;
}): ClientEnv {
  const parsedClientEnv = clientEnvSchema.safeParse(source.clientEnv);

  if (!parsedClientEnv.success) {
    throw new Error(`Invalid client environment:\n${z.prettifyError(parsedClientEnv.error)}`);
  }

  // If the variant is missing, assume production: a broken build must not expose development tooling.
  const parsedVariant = z.enum(APP_VARIANTS).safeParse(source.appVariant);
  const appVariant: AppVariant = parsedVariant.success ? parsedVariant.data : 'production';

  return {
    ...parsedClientEnv.data,
    appVariant,
    isDevelopmentVariant: appVariant === 'development',
  };
}

// Expo writes EXPO_PUBLIC_* values into the bundle when it is built, and only when they are
// referenced exactly like this: as `process.env.NAME`. Do not copy, loop over or destructure them.
// The variant is written into the app manifest by app.config.ts and read back from it at runtime.

/** Read once at start-up. Invalid configuration stops the app instead of failing later. */
export const env: ClientEnv = parseClientEnv({
  clientEnv: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_API_MOCK: process.env.EXPO_PUBLIC_API_MOCK,
  },
  appVariant: Constants.expoConfig?.extra?.appVariant,
});
