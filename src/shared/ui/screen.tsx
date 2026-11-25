import { HeaderShownContext } from 'expo-router/react-navigation';
import { useContext } from 'react';
import { Platform, ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';

export interface ScreenProps extends ViewProps {
  /**
   * Lets the content scroll and keeps it clear of the status bar. On iOS the content scrolls
   * under the status bar, as it does in native apps.
   */
  scroll?: boolean;
}

/**
 * The container for a page: the page background, page padding, and the space the status bar,
 * the home indicator and the tab bar need at the edges.
 */
export function Screen({ scroll = false, className, children, ...rest }: ScreenProps) {
  const insets = useSafeAreaInsets();
  // A native header above the page already keeps the content clear of the status bar.
  const isUnderHeader = useContext(HeaderShownContext);
  const isAndroid = Platform.OS === 'android';

  if (scroll) {
    return (
      <ScrollView
        {...rest}
        className="flex-1 bg-background"
        // iOS insets a scroll view for whatever covers its edges: the status bar, a header, a
        // tab bar. Android does not, so there the space for the status bar and the navigation
        // bar is added by hand.
        style={[isAndroid && !isUnderHeader ? { paddingTop: insets.top } : null, rest.style]}
        contentContainerStyle={isAndroid ? { paddingBottom: insets.bottom } : undefined}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={cn('gap-4 px-4 pt-2 pb-6', className)}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <View {...rest} className={cn('flex-1 gap-4 bg-background px-4 pb-4', className)}>
        {children}
      </View>
    </SafeAreaView>
  );
}
