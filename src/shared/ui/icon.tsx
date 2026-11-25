import type { LucideIcon, LucideProps } from 'lucide-react-native';

import { useThemeColor, type ThemeColorToken } from '@/shared/theme';

export interface IconProps extends Omit<LucideProps, 'color'> {
  icon: LucideIcon;
  /** Design token used for the icon color. */
  color?: ThemeColorToken;
}

/** Renders a Lucide icon with a theme token color. */
export function Icon({ icon: IconComponent, color = 'foreground', size = 20, ...rest }: IconProps) {
  const [resolved] = useThemeColor(color);
  return <IconComponent size={size} color={resolved} {...rest} />;
}
