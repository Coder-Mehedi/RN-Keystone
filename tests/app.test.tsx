// Boots the real route tree: the cheapest signal that the app still navigates, renders and recovers.
import { fireEvent, renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';

// The router renders into its own in-memory tree, so query through what `renderRouter` returns.
// Testing Library's global `screen` is not connected to it.

describe('the app', () => {
  it('opens on the home screen', async () => {
    const screen = await renderRouter('./src/app');

    expect(await screen.findByText('This is the starting point of the app.')).toBeOnTheScreen();
    expect(screen).toHavePathname('/');
  });

  it('opens a tab directly, as from a deep link', async () => {
    const screen = await renderRouter('./src/app', { initialUrl: '/settings' });

    expect(await screen.findByText('Appearance')).toBeOnTheScreen();
    expect(screen).toHavePathname('/settings');
  });

  it('shows the not-found page for an address that matches no screen', async () => {
    const screen = await renderRouter('./src/app', { initialUrl: '/this-page-does-not-exist' });

    expect(await screen.findByText('Page not found')).toBeOnTheScreen();
    expect(screen.getByText('Go to the start')).toBeOnTheScreen();
  });

  it('opens the developer tools, which only development builds can reach', async () => {
    const screen = await renderRouter('./src/app', { initialUrl: '/menu' });

    expect(await screen.findByText('Only available in development builds.')).toBeOnTheScreen();
    expect(screen).toHavePathname('/menu');
  });

  it('shows an error screen instead of crashing when a screen throws, and retries', async () => {
    // Cleared by the test once the error screen is up. A screen may render more than once
    // while it fails, so the switch must not live inside the component.
    let shouldThrow = true;
    function FlakyScreen() {
      if (shouldThrow) {
        throw new Error('Deliberate error, thrown by a test screen.');
      }
      return <Text>Recovered</Text>;
    }

    const screen = await renderRouter(
      { appDir: './src/app', overrides: { '(dev)/dependency-check': FlakyScreen } },
      { initialUrl: '/dependency-check' },
    );

    expect(await screen.findByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.getByText('Deliberate error, thrown by a test screen.')).toBeOnTheScreen();

    shouldThrow = false;
    fireEvent.press(screen.getByText('Try again'));

    expect(await screen.findByText('Recovered')).toBeOnTheScreen();
    expect(screen).toHavePathname('/dependency-check');
  });
});
