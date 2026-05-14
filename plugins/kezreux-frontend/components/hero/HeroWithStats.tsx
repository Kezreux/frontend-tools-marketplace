// @component: HeroWithStats
// @category: hero
// @description: Centered hero with headline, CTA, and a row of 3–4 social-proof stat blocks below. Conversion-focused.
// @keywords: hero, stats, metrics, social proof, conversion, numbers, marketing
// @complexity: medium

import type { ReactNode } from "react";

export interface HeroStat {
  value: ReactNode;
  label: ReactNode;
  /** Optional small description below the label. */
  detail?: ReactNode;
}

export interface HeroWithStatsProps {
  title: ReactNode;
  subtitle?: ReactNode;
  ctaPrimary?: { label: string; href: string };
  stats: HeroStat[];
  className?: string;
}

export function HeroWithStats({
  title,
  subtitle,
  ctaPrimary,
  stats,
  className,
}: HeroWithStatsProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={`bg-background px-4 py-16 sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-4xl text-center">
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

        {ctaPrimary && (
          <div className="mt-8">
            <a
              href={ctaPrimary.href}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {ctaPrimary.label}
            </a>
          </div>
        )}
      </div>

      <dl
        className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4"
        aria-label="Key statistics"
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <dt className="order-2 mt-2 text-sm font-medium text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="order-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {stat.value}
            </dd>
            {stat.detail && (
              <p className="order-3 mt-1 text-xs text-muted-foreground">
                {stat.detail}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

export const demos: Record<string, HeroWithStatsProps> = {
  default: {
    title: "Built by makers, for makers",
    subtitle: "Real numbers from production projects using kezreux-frontend.",
    ctaPrimary: { label: "See the docs", href: "#docs" },
    stats: [
      { value: "10k+", label: "Components installed" },
      { value: "7", label: "Preset themes" },
      { value: "100%", label: "WCAG AA pass" },
      { value: "<1s", label: "Time to first paint" },
    ],
  },
};
