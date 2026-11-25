import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

import { useThemeColor } from '@/shared/theme';

export interface SpinnerProps extends ActivityIndicatorProps {
  /** What is being waited for, read out by screen readers. */
  label?: string;
}

/** Shows that something is in progress and how long is unknown. */
export function Spinner({ label, color, ...rest }: SpinnerProps) {
  const [primary] = useThemeColor('primary');

  return (
    <ActivityIndicator
      {...rest}
      color={color ?? primary}
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityState={{ busy: true }}
    />
  );
}
