import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Editorial",
  description: "Serif headlines, generous typography, content-first, warm restrained palette with a terra accent.",

  colors: {
    background:            { light: "40 22% 97%",     dark: "30 7% 9%" },
    foreground:            { light: "215 28% 17%",    dark: "40 17% 93%" },
    primary:               { light: "215 30% 23%",    dark: "40 17% 93%" },
    primaryForeground:     { light: "40 22% 97%",     dark: "30 7% 9%" },
    secondary:             { light: "35 12% 88%",     dark: "30 7% 16%" },
    secondaryForeground:   { light: "215 28% 17%",    dark: "40 17% 93%" },
    muted:                 { light: "35 12% 92%",     dark: "30 7% 14%" },
    mutedForeground:       { light: "215 14% 45%",    dark: "40 8% 65%" },
    accent:                { light: "24 70% 50%",     dark: "24 75% 58%" },
    accentForeground:      { light: "40 22% 97%",     dark: "30 7% 9%" },
    border:                { light: "35 14% 86%",     dark: "30 7% 18%" },
    input:                 { light: "35 14% 86%",     dark: "30 7% 18%" },
    ring:                  { light: "24 70% 50%",     dark: "24 75% 58%" },
    destructive:           { light: "0 72% 45%",      dark: "0 65% 55%" },
    destructiveForeground: { light: "40 22% 97%",     dark: "40 22% 97%" },
  },

  typography: {
    fontFamily: {
      sans:  '"Inter", ui-sans-serif, system-ui, sans-serif',
      serif: '"Source Serif Pro", "Source Serif 4", ui-serif, Georgia, serif',
      mono:  '"JetBrains Mono", ui-monospace, monospace',
    },
    scale: {
      xs:   { size: 13, lineHeight: 18 },
      sm:   { size: 15, lineHeight: 22 },
      base: { size: 17, lineHeight: 28 },
      lg:   { size: 20, lineHeight: 32 },
      xl:   { size: 24, lineHeight: 36 },
      "2xl":{ size: 30, lineHeight: 40 },
      "3xl":{ size: 38, lineHeight: 48 },
      "4xl":{ size: 48, lineHeight: 56 },
      "5xl":{ size: 64, lineHeight: 72 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  spacing: { scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 192] },

  radius:  { none: 0, sm: 2, md: 4, lg: 6, full: 9999 },

  shadows: {
    none: "none",
    sm:   "0 1px 2px 0 rgb(30 18 10 / 0.04)",
    md:   "0 2px 4px 0 rgb(30 18 10 / 0.05)",
    lg:   "0 4px 12px 0 rgb(30 18 10 / 0.06)",
  },

  density: "spacious",

  animation: {
    duration: { fast: 150, normal: 260, slow: 380 },
    easing:   "cubic-bezier(0.32, 0.72, 0, 1)",
  },

  iconography: { library: "lucide", strokeWidth: 1.5, defaultSize: 18 },
};
