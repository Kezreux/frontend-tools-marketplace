/**
 * Canonical Theme spec for the frontend-power-tools plugin.
 *
 * Every preset theme conforms to this interface. The /build orchestrator
 * and every audit skill treats the selected theme as a non-negotiable
 * constraint: components must use only the tokens defined here.
 *
 * Colors are HSL triplets (e.g. "0 0% 100%") so they drop directly into
 * shadcn-style CSS variables — `--background: 0 0% 100%;` becomes
 * `hsl(var(--background))` at the call site.
 */

export interface HSLPair {
  light: string;
  dark: string;
}

export interface ColorPalette {
  background: HSLPair;
  foreground: HSLPair;
  primary: HSLPair;
  primaryForeground: HSLPair;
  secondary: HSLPair;
  secondaryForeground: HSLPair;
  muted: HSLPair;
  mutedForeground: HSLPair;
  accent: HSLPair;
  accentForeground: HSLPair;
  border: HSLPair;
  input: HSLPair;
  ring: HSLPair;
  destructive: HSLPair;
  destructiveForeground: HSLPair;
}

export interface TypeStep {
  size: number;       // px
  lineHeight: number; // px
}

export interface TypographySpec {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  scale: {
    xs: TypeStep;
    sm: TypeStep;
    base: TypeStep;
    lg: TypeStep;
    xl: TypeStep;
    "2xl": TypeStep;
    "3xl": TypeStep;
    "4xl": TypeStep;
    "5xl": TypeStep;
  };
  weights: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface SpacingSpec {
  /** Legal px values for padding/margin/gap/dimensions. Anything else is a violation. */
  scale: readonly number[];
}

export interface RadiusSpec {
  none: number;
  sm: number;
  md: number;
  lg: number;
  full: number;
}

export interface ShadowSpec {
  none: string;
  sm: string;
  md: string;
  lg: string;
}

export type Density = "compact" | "comfortable" | "spacious";

export interface AnimationSpec {
  duration: { fast: number; normal: number; slow: number };
  easing: string;
}

export interface IconographySpec {
  library: "lucide" | "heroicons" | "tabler";
  strokeWidth: number;
  defaultSize: number;
}

export interface Theme {
  /** Display name shown in /theme list. */
  name: string;
  /** One-line summary used by /theme list and the rules engine. */
  description: string;
  colors: ColorPalette;
  typography: TypographySpec;
  spacing: SpacingSpec;
  radius: RadiusSpec;
  shadows: ShadowSpec;
  density: Density;
  animation: AnimationSpec;
  iconography: IconographySpec;
}
