import type { Theme } from "../_theme";

export const theme: Theme = {
  name: "Playful",
  description: "Vivid hues, expressive typography, lively motion with bounce, gradients allowed.",

  colors: {
    background:            { light: "0 0% 100%",      dark: "250 25% 7%" },
    foreground:            { light: "250 15% 12%",    dark: "0 0% 95%" },
    primary:               { light: "262 83% 58%",    dark: "262 83% 65%" },
    primaryForeground:     { light: "0 0% 100%",      dark: "0 0% 100%" },
    secondary:             { light: "30 100% 60%",    dark: "30 95% 60%" },
    secondaryForeground:   { light: "0 0% 100%",      dark: "0 0% 100%" },
    muted:                 { light: "262 30% 96%",    dark: "250 20% 14%" },
    mutedForeground:       { light: "250 8% 45%",     dark: "250 8% 65%" },
    accent:                { light: "185 84% 49%",    dark: "185 84% 55%" },
    accentForeground:      { light: "0 0% 100%",      dark: "0 0% 100%" },
    border:                { light: "262 20% 90%",    dark: "250 15% 20%" },
    input:                 { light: "262 20% 90%",    dark: "250 15% 20%" },
    ring:                  { light: "262 83% 58%",    dark: "262 83% 65%" },
    destructive:           { light: "340 90% 55%",    dark: "340 90% 60%" },
    destructiveForeground: { light: "0 0% 100%",      dark: "0 0% 100%" },
  },

  typography: {
    fontFamily: {
      sans:  '"Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono:  '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    },
    scale: {
      xs:   { size: 12, lineHeight: 16 },
      sm:   { size: 14, lineHeight: 20 },
      base: { size: 16, lineHeight: 24 },
      lg:   { size: 18, lineHeight: 28 },
      xl:   { size: 22, lineHeight: 30 },
      "2xl":{ size: 28, lineHeight: 36 },
      "3xl":{ size: 36, lineHeight: 42 },
      "4xl":{ size: 48, lineHeight: 54 },
      "5xl":{ size: 64, lineHeight: 70 },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 800 },
  },

  spacing: { scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128] },

  radius:  { none: 0, sm: 8, md: 12, lg: 16, full: 9999 },

  shadows: {
    none: "none",
    sm:   "0 4px 8px -2px rgb(124 58 237 / 0.10)",
    md:   "0 10px 20px -4px rgb(124 58 237 / 0.18), 0 4px 8px -4px rgb(6 182 212 / 0.10)",
    lg:   "0 24px 40px -8px rgb(124 58 237 / 0.25), 0 8px 16px -8px rgb(6 182 212 / 0.15)",
  },

  density: "comfortable",

  animation: {
    duration: { fast: 150, normal: 240, slow: 360 },
    easing:   "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  iconography: { library: "lucide", strokeWidth: 2, defaultSize: 18 },
};
