import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

/** A plain container with className support. */
export function Box({ className, ...rest }: ViewProps) {
  return <View {...rest} className={cn(className)} />;
}
