// @component: HeroSplit
// @category: hero
// @description: Two-column hero — text + CTA on the left, visual slot (image, illustration, screenshot) on the right. SaaS classic.
// @keywords: hero, split, two-column, saas, image, illustration, visual
// @complexity: medium

import type { ReactNode } from "react";

export interface HeroSplitProps {
  title: ReactNode;
  subtitle?: ReactNode;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Right-side visual: <img>, an illustration, a screenshot wrapper, etc. */
  visual: ReactNode;
  /** Reverse the layout — visual on left, content on right. */
  reverse?: boolean;
  className?: string;
}

export function HeroSplit({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  visual,
  reverse,
  className,
}: HeroSplitProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={`bg-background px-4 py-16 sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 sm:gap-16 lg:grid-cols-2 ${
          reverse ? "lg:grid-cols-[1fr_1fr]" : ""
        }`}
      >
        <div className={reverse ? "lg:order-2" : ""}>
          <h1
            id="hero-title"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={ctaPrimary.href}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {ctaPrimary.label}
            </a>

            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {ctaSecondary.label}
              </a>
            )}
          </div>
        </div>

        <div
          className={`overflow-hidden rounded-lg border border-border bg-muted ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          {visual}
        </div>
      </div>
    </section>
  );
}

export const demos: Record<string, HeroSplitProps> = {
  default: {
    title: "Your design system, on autopilot",
    subtitle:
      "Pick a theme. Pick a component. Ship the page. Reviews, audits, and fixes happen automatically.",
    ctaPrimary: { label: "Try the plugin", href: "#install" },
    ctaSecondary: { label: "View source", href: "#repo" },
    visual: (
      <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20" />
    ),
  },
};
