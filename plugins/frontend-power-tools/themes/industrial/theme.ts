import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Industrial",
  description: "Sharp 2–4px radius, dense layout, monochrome + electric signal blue, mono for data.",

  colors: {
    background:            { light: "0 0% 100%",      dark: "220 12% 11%" },
    foreground:            { light: "220 14% 15%",    dark: "220 8% 92%" },
    primary:               { light: "220 14% 15%",    dark: "220 8% 92%" },
    primaryForeground:     { light: "0 0% 100%",      dark: "220 12% 11%" },
    secondary:             { light: "220 14% 96%",    dark: "220 10% 16%" },
    secondaryForeground:   { light: "220 14% 15%",    dark: "220 8% 92%" },
    muted:                 { light: "220 14% 94%",    dark: "220 10% 14%" },
    mutedForeground:       { light: "220 9% 40%",     dark: "220 8% 60%" },
    accent:                { light: "208 100% 38%",   dark: "208 100% 60%" },
    accentForeground:      { light: "0 0% 100%",      dark: "220 14% 8%" },
    border:                { light: "220 13% 88%",    dark: "220 10% 22%" },
    input:                 { light: "220 13% 88%",    dark: "220 10% 22%" },
    ring:                  { light: "208 100% 50%",   dark: "208 100% 60%" },
    destructive:           { light: "358 84% 45%",    dark: "358 75% 52%" },
    destructiveForeground: { light: "0 0% 100%",      dark: "0 0% 100%" },
  },

  typography: {
    fontFamily: {
      sans:  '"Inter", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono:  '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    },
    scale: {
      xs:   { size: 11, lineHeight: 14 },
      sm:   { size: 12, lineHeight: 16 },
      base: { size: 13, lineHeight: 18 },
      lg:   { size: 15, lineHeight: 22 },
      xl:   { size: 18, lineHeight: 26 },
      "2xl":{ size: 22, lineHeight: 30 },
      "3xl":{ size: 28, lineHeight: 34 },
      "4xl":{ size: 36, lineHeight: 42 },
      "5xl":{ size: 48, lineHeight: 54 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  spacing: { scale: [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] },

  radius:  { none: 0, sm: 2, md: 3, lg: 4, full: 9999 },

  shadows: {
    none: "none",
    sm:   "0 1px 1px 0 rgb(0 0 0 / 0.03)",
    md:   "0 1px 3px 0 rgb(0 0 0 / 0.05)",
    lg:   "0 2px 8px 0 rgb(0 0 0 / 0.06)",
  },

  density: "compact",

  animation: {
    duration: { fast: 80, normal: 140, slow: 220 },
    easing:   "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  iconography: { library: "lucide", strokeWidth: 1.75, defaultSize: 14 },
};
