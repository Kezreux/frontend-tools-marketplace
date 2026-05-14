import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Brutalist",
  description: "Hard 0px edges, monospace accents, pure black/white + signal red, no decoration, dense layout.",

  colors: {
    background:            { light: "0 0% 100%",      dark: "0 0% 0%" },
    foreground:            { light: "0 0% 0%",        dark: "0 0% 100%" },
    card:                  { light: "0 0% 100%",      dark: "0 0% 0%" },
    cardForeground:        { light: "0 0% 0%",        dark: "0 0% 100%" },
    popover:               { light: "0 0% 100%",      dark: "0 0% 0%" },
    popoverForeground:     { light: "0 0% 0%",        dark: "0 0% 100%" },
    primary:               { light: "0 0% 0%",        dark: "0 0% 100%" },
    primaryForeground:     { light: "0 0% 100%",      dark: "0 0% 0%" },
    secondary:             { light: "0 0% 95%",       dark: "0 0% 12%" },
    secondaryForeground:   { light: "0 0% 0%",        dark: "0 0% 100%" },
    muted:                 { light: "0 0% 95%",       dark: "0 0% 8%" },
    mutedForeground:       { light: "0 0% 30%",       dark: "0 0% 70%" },
    accent:                { light: "0 95% 42%",      dark: "0 100% 55%" },
    accentForeground:      { light: "0 0% 100%",      dark: "0 0% 0%" },
    border:                { light: "0 0% 0%",        dark: "0 0% 100%" },
    input:                 { light: "0 0% 0%",        dark: "0 0% 100%" },
    ring:                  { light: "0 100% 50%",     dark: "0 100% 55%" },
    destructive:           { light: "0 100% 45%",     dark: "0 95% 48%" },
    destructiveForeground: { light: "0 0% 100%",      dark: "0 0% 0%" },
  },

  typography: {
    fontFamily: {
      sans:  '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
      serif: '"IBM Plex Serif", ui-serif, Georgia, serif',
      mono:  '"IBM Plex Mono", ui-monospace, "Courier New", monospace',
    },
    scale: {
      xs:   { size: 11, lineHeight: 14 },
      sm:   { size: 13, lineHeight: 18 },
      base: { size: 15, lineHeight: 22 },
      lg:   { size: 17, lineHeight: 24 },
      xl:   { size: 20, lineHeight: 28 },
      "2xl":{ size: 28, lineHeight: 32 },
      "3xl":{ size: 40, lineHeight: 44 },
      "4xl":{ size: 56, lineHeight: 60 },
      "5xl":{ size: 80, lineHeight: 84 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  spacing: { scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96] },

  radius:  { none: 0, sm: 0, md: 0, lg: 0, full: 0 },

  shadows: { none: "none", sm: "none", md: "none", lg: "none" },

  density: "compact",

  animation: {
    duration: { fast: 50, normal: 100, slow: 150 },
    easing:   "linear",
  },

  iconography: { library: "lucide", strokeWidth: 2, defaultSize: 16 },
};
