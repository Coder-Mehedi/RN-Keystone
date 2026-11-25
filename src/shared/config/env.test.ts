import { parseClientEnv } from './env';

const VALID_SOURCE = {
  clientEnv: { EXPO_PUBLIC_API_URL: 'https://api.example.com', EXPO_PUBLIC_API_MOCK: 'true' },
  appVariant: 'development',
};

describe('parseClientEnv', () => {
  it('reads the API settings and the variant', () => {
    expect(parseClientEnv(VALID_SOURCE)).toEqual({
      EXPO_PUBLIC_API_URL: 'https://api.example.com',
      EXPO_PUBLIC_API_MOCK: true,
      appVariant: 'development',
      isDevelopmentVariant: true,
    });
  });

  it('reads the mock flag as false only when it says so', () => {
    expect(
      parseClientEnv({ ...VALID_SOURCE, clientEnv: { EXPO_PUBLIC_API_MOCK: 'false' } }),
    ).toHaveProperty('EXPO_PUBLIC_API_MOCK', false);
  });

  it('leaves the API out and the mock off when the bundle configures neither', () => {
    expect(parseClientEnv({ ...VALID_SOURCE, clientEnv: {} })).toEqual({
      EXPO_PUBLIC_API_MOCK: false,
      appVariant: 'development',
      isDevelopmentVariant: true,
    });
  });

  it.each(['maybe', 'TRUE', ''])('stops the app for a mock flag of %p', (mockFlag) => {
    expect(() =>
      parseClientEnv({ ...VALID_SOURCE, clientEnv: { EXPO_PUBLIC_API_MOCK: mockFlag } }),
    ).toThrow(/EXPO_PUBLIC_API_MOCK/);
  });

  it.each(['api.example.com', 'ftp://api.example.com', 'not a url'])(
    'stops the app for an API address of %p',
    (apiUrl) => {
      expect(() =>
        parseClientEnv({ ...VALID_SOURCE, clientEnv: { EXPO_PUBLIC_API_URL: apiUrl } }),
      ).toThrow(/EXPO_PUBLIC_API_URL/);
    },
  );

  it('assumes the production variant when the manifest names none', () => {
    expect(parseClientEnv({ ...VALID_SOURCE, appVariant: undefined })).toMatchObject({
      appVariant: 'production',
      isDevelopmentVariant: false,
    });
  });

  it('assumes the production variant when the manifest names an unknown one', () => {
    expect(parseClientEnv({ ...VALID_SOURCE, appVariant: 'staging' })).toMatchObject({
      appVariant: 'production',
      isDevelopmentVariant: false,
    });
  });
});
