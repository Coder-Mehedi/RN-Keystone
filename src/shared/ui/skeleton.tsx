import { useEffect } from 'react';
import type { ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/shared/lib/cn';

/**
 * A grey block in the shape of content that is still on its way. It is decoration, so screen
 * readers skip it: mark the area that is loading with `accessibilityState={{ busy: true }}` and
 * say so in a label.
 */
export function Skeleton({ className, ...rest }: ViewProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = withRepeat(
      withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [opacity, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      {...rest}
      accessible={false}
      style={animatedStyle}
      className={cn('rounded-control bg-muted', className)}
    />
  );
}
