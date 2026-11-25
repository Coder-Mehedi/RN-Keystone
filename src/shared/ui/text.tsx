import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/shared/lib/cn';

/** The type scale. Sizes come from Tailwind's defaults, so `text-base` is 16 with 24 line height. */
type TextVariant =
  'body' | 'bodyStrong' | 'bodyMuted' | 'caption' | 'label' | 'heading' | 'title' | 'display';

const variantClassName: Record<TextVariant, string> = {
  body: 'text-base text-foreground',
  bodyStrong: 'text-base font-semibold text-foreground',
  bodyMuted: 'text-base text-muted-foreground',
  caption: 'text-sm text-muted-foreground',
  label: 'text-sm font-medium text-foreground',
  heading: 'text-lg font-semibold text-foreground',
  title: 'text-2xl font-semibold text-foreground',
  display: 'text-4xl font-bold tracking-tight text-foreground',
};

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

export function Text({ variant = 'body', className, ...rest }: TextProps) {
  return <RNText {...rest} className={cn(variantClassName[variant], className)} />;
}
