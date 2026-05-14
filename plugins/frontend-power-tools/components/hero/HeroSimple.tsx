// @component: HeroSimple
// @category: hero
// @description: Centered hero with title, subtitle, primary CTA, and optional secondary CTA. The marketing default.
// @keywords: hero, landing, marketing, cta, centered, headline
// @complexity: simple

import type { ReactNode } from "react";

export interface HeroSimpleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  className?: string;
}

export function HeroSimple({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  className,
}: HeroSimpleProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={`flex flex-col items-center justify-center bg-background px-4 py-16 text-center sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      <div className="max-w-3xl">
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

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={ctaPrimary.href}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            {ctaPrimary.label}
          </a>

          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              {ctaSecondary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
