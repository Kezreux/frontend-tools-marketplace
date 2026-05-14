import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Minimal",
  description: "System fonts, generous whitespace, monochrome + 1 blue accent, near-flat shadows.",

  colors: {
    background:            { light: "0 0% 100%",      dark: "220 14% 6%" },
    foreground:            { light: "220 14% 11%",    dark: "220 14% 91%" },
    card:                  { light: "0 0% 100%",      dark: "220 14% 6%" },
    cardForeground:        { light: "220 14% 11%",    dark: "220 14% 91%" },
    popover:               { light: "0 0% 100%",      dark: "220 14% 6%" },
    popoverForeground:     { light: "220 14% 11%",    dark: "220 14% 91%" },
    primary:               { light: "220 14% 11%",    dark: "220 14% 91%" },
    primaryForeground:     { light: "0 0% 100%",      dark: "220 14% 6%" },
    secondary:             { light: "220 13% 96%",    dark: "220 13% 14%" },
    secondaryForeground:   { light: "220 14% 11%",    dark: "220 14% 91%" },
    muted:                 { light: "220 13% 96%",    dark: "220 13% 12%" },
    mutedForeground:       { light: "220 9% 38%",     dark: "220 9% 60%" },
    accent:                { light: "221 83% 48%",    dark: "213 100% 60%" },
    accentForeground:      { light: "0 0% 100%",      dark: "220 14% 6%" },
    border:                { light: "220 13% 91%",    dark: "220 13% 18%" },
    input:                 { light: "220 13% 91%",    dark: "220 13% 18%" },
    ring:                  { light: "220 14% 11%",    dark: "220 14% 91%" },
    destructive:           { light: "0 84% 48%",      dark: "0 75% 50%" },
    destructiveForeground: { light: "0 0% 100%",      dark: "0 0% 100%" },
  },

  typography: {
    fontFamily: {
      sans:  '"Inter", ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono:  '"JetBrains Mono", ui-monospace, monospace',
    },
    scale: {
      xs:   { size: 12, lineHeight: 16 },
      sm:   { size: 14, lineHeight: 20 },
      base: { size: 16, lineHeight: 24 },
      lg:   { size: 18, lineHeight: 28 },
      xl:   { size: 20, lineHeight: 28 },
      "2xl":{ size: 24, lineHeight: 32 },
      "3xl":{ size: 30, lineHeight: 36 },
      "4xl":{ size: 36, lineHeight: 40 },
      "5xl":{ size: 48, lineHeight: 52 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  spacing: { scale: [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128] },

  radius:  { none: 0, sm: 4, md: 6, lg: 8, full: 9999 },

  shadows: {
    none: "none",
    sm:   "0 1px 2px 0 rgb(0 0 0 / 0.04)",
    md:   "0 2px 4px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
    lg:   "0 4px 8px 0 rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
  },

  density: "comfortable",

  animation: {
    duration: { fast: 100, normal: 180, slow: 280 },
    easing:   "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  iconography: { library: "lucide", strokeWidth: 1.5, defaultSize: 16 },
};
