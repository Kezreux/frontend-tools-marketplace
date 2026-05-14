import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Rustic",
  description: "Warm earthy palette, serif body, organic spacing, low-contrast borders, hand-crafted feel.",

  colors: {
    background:            { light: "38 38% 95%",     dark: "25 18% 10%" },
    foreground:            { light: "25 30% 20%",     dark: "38 25% 90%" },
    primary:               { light: "15 55% 45%",     dark: "15 60% 55%" },
    primaryForeground:     { light: "38 38% 95%",     dark: "25 18% 10%" },
    secondary:             { light: "30 25% 85%",     dark: "25 15% 18%" },
    secondaryForeground:   { light: "25 30% 20%",     dark: "38 25% 90%" },
    muted:                 { light: "35 22% 90%",     dark: "25 12% 14%" },
    mutedForeground:       { light: "25 18% 40%",     dark: "38 12% 65%" },
    accent:                { light: "135 30% 32%",    dark: "135 25% 55%" },
    accentForeground:      { light: "38 38% 95%",     dark: "25 18% 10%" },
    border:                { light: "30 22% 82%",     dark: "25 12% 22%" },
    input:                 { light: "30 22% 82%",     dark: "25 12% 22%" },
    ring:                  { light: "15 55% 45%",     dark: "15 60% 55%" },
    destructive:           { light: "5 65% 45%",      dark: "5 70% 47%" },
    destructiveForeground: { light: "38 38% 95%",     dark: "38 38% 95%" },
  },

  typography: {
    fontFamily: {
      sans:  '"Inter", ui-sans-serif, system-ui, sans-serif',
      serif: '"Lora", "Bitter", ui-serif, Georgia, serif',
      mono:  '"IBM Plex Mono", ui-monospace, monospace',
    },
    scale: {
      xs:   { size: 13, lineHeight: 18 },
      sm:   { size: 15, lineHeight: 24 },
      base: { size: 17, lineHeight: 28 },
      lg:   { size: 19, lineHeight: 30 },
      xl:   { size: 22, lineHeight: 34 },
      "2xl":{ size: 28, lineHeight: 40 },
      "3xl":{ size: 36, lineHeight: 46 },
      "4xl":{ size: 46, lineHeight: 56 },
      "5xl":{ size: 60, lineHeight: 70 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  spacing: { scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128] },

  radius:  { none: 0, sm: 4, md: 8, lg: 12, full: 9999 },

  shadows: {
    none: "none",
    sm:   "0 1px 3px 0 rgb(80 50 30 / 0.06)",
    md:   "0 4px 8px 0 rgb(80 50 30 / 0.08)",
    lg:   "0 12px 24px -4px rgb(80 50 30 / 0.12)",
  },

  density: "spacious",

  animation: {
    duration: { fast: 200, normal: 320, slow: 480 },
    easing:   "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  iconography: { library: "lucide", strokeWidth: 1.5, defaultSize: 18 },
};
