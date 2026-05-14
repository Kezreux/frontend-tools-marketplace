import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Soft",
  description: "Rounded 12–20px, pastel desaturated palette, friendly type, prominent gentle shadows.",

  colors: {
    background:            { light: "30 30% 98%",     dark: "260 15% 11%" },
    foreground:            { light: "260 15% 20%",    dark: "30 20% 94%" },
    primary:               { light: "260 55% 60%",    dark: "260 55% 70%" },
    primaryForeground:     { light: "30 30% 98%",     dark: "260 15% 11%" },
    secondary:             { light: "280 35% 94%",    dark: "260 12% 18%" },
    secondaryForeground:   { light: "260 30% 25%",    dark: "30 20% 94%" },
    muted:                 { light: "30 25% 95%",     dark: "260 10% 16%" },
    mutedForeground:       { light: "260 8% 50%",     dark: "260 8% 65%" },
    accent:                { light: "20 85% 75%",     dark: "20 70% 65%" },
    accentForeground:      { light: "20 50% 20%",     dark: "20 30% 95%" },
    border:                { light: "30 25% 90%",     dark: "260 10% 22%" },
    input:                 { light: "30 25% 90%",     dark: "260 10% 22%" },
    ring:                  { light: "260 55% 60%",    dark: "260 55% 70%" },
    destructive:           { light: "5 70% 60%",      dark: "5 65% 60%" },
    destructiveForeground: { light: "30 30% 98%",     dark: "30 30% 98%" },
  },

  typography: {
    fontFamily: {
      sans:  '"DM Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
      serif: '"DM Serif Display", ui-serif, Georgia, serif',
      mono:  '"DM Mono", ui-monospace, monospace',
    },
    scale: {
      xs:   { size: 12, lineHeight: 18 },
      sm:   { size: 14, lineHeight: 22 },
      base: { size: 16, lineHeight: 26 },
      lg:   { size: 18, lineHeight: 30 },
      xl:   { size: 22, lineHeight: 32 },
      "2xl":{ size: 26, lineHeight: 36 },
      "3xl":{ size: 32, lineHeight: 42 },
      "4xl":{ size: 40, lineHeight: 48 },
      "5xl":{ size: 56, lineHeight: 64 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  spacing: { scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128] },

  radius:  { none: 0, sm: 8, md: 12, lg: 16, full: 9999 },

  shadows: {
    none: "none",
    sm:   "0 2px 4px 0 rgb(120 80 160 / 0.06)",
    md:   "0 8px 16px -4px rgb(120 80 160 / 0.10), 0 4px 8px -4px rgb(120 80 160 / 0.06)",
    lg:   "0 20px 32px -8px rgb(120 80 160 / 0.14), 0 8px 16px -8px rgb(120 80 160 / 0.08)",
  },

  density: "spacious",

  animation: {
    duration: { fast: 180, normal: 280, slow: 420 },
    easing:   "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  iconography: { library: "lucide", strokeWidth: 1.75, defaultSize: 18 },
};
