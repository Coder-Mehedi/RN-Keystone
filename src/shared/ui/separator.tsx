import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

export interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

/** A line between neighbouring content. It is decoration, so screen readers skip it. */
export function Separator({ orientation = 'horizontal', className, ...rest }: SeparatorProps) {
  return (
    <View
      {...rest}
      accessible={false}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
