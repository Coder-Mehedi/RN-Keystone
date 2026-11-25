import { act, renderHook } from '@testing-library/react-native';
import * as ReactNative from 'react-native';

import { storage } from '@/shared/storage/mmkv';

import { useThemePreference } from './theme-provider';
import { useTheme } from './use-theme';

describe('useTheme', () => {
  beforeEach(() => {
    storage.clearAll();
    useThemePreference.setState({ mode: 'system' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('follows the device setting until the user chooses a theme', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());

    expect(result.current).toMatchObject({ mode: 'system', theme: 'dark', isDark: true });
  });

  it('applies the theme the user chose, whatever the device says', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());

    await act(async () => {
      result.current?.setMode('dark');
    });

    expect(result.current).toMatchObject({ mode: 'dark', theme: 'dark', isDark: true });
  });

  it('saves the choice, so the next launch opens in the same theme', async () => {
    const { result } = await renderHook(() => useTheme());

    await act(async () => {
      result.current?.setMode('dark');
    });

    expect(storage.getString('theme-preference')).toBe('{"state":{"mode":"dark"},"version":0}');
  });
});
