/**
 * Every colour token, with one class that uses it.
 *
 * Tailwind only generates a class that appears somewhere in the source, and Uniwind can only
 * read a token's value for JavaScript (`useThemeColor`) once its class has been generated.
 * Because every token has a class here, `useThemeColor` works for all of them, whatever the
 * screens happen to use.
 *
 * Keep in sync with the variables in src/global.css.
 */
export const COLOR_TOKEN_CLASS = {
  background: 'bg-background',
  foreground: 'bg-foreground',
  card: 'bg-card',
  'card-foreground': 'bg-card-foreground',
  primary: 'bg-primary',
  'primary-foreground': 'bg-primary-foreground',
  secondary: 'bg-secondary',
  'secondary-foreground': 'bg-secondary-foreground',
  accent: 'bg-accent',
  'accent-foreground': 'bg-accent-foreground',
  muted: 'bg-muted',
  'muted-foreground': 'bg-muted-foreground',
  destructive: 'bg-destructive',
  'destructive-foreground': 'bg-destructive-foreground',
  success: 'bg-success',
  'success-foreground': 'bg-success-foreground',
  border: 'bg-border',
  input: 'bg-input',
  ring: 'bg-ring',
} as const;

/** A colour of the design system. Each is readable as `useThemeColor('name')`. */
export type ThemeColorToken = keyof typeof COLOR_TOKEN_CLASS;

/** Every colour token, to iterate over. */
export const THEME_COLOR_TOKENS = Object.keys(COLOR_TOKEN_CLASS) as ThemeColorToken[];
