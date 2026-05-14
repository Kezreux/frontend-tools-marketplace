// @component: HeroMinimal
// @category: hero
// @description: Maximalist whitespace, single headline, single CTA. Linear / Vercel feel.
// @keywords: hero, minimal, clean, simple, whitespace, single
// @complexity: simple

import type { ReactNode } from "react";

export interface HeroMinimalProps {
  title: ReactNode;
  cta: { label: string; href: string };
  className?: string;
}

export function HeroMinimal({ title, cta, className }: HeroMinimalProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={`flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 py-16 sm:py-32 ${className ?? ""}`}
    >
      <div className="max-w-4xl text-center">
        <h1
          id="hero-title"
          className="text-5xl font-semibold tracking-tighter text-foreground sm:text-7xl"
        >
          {title}
        </h1>

        <a
          href={cta.href}
          className="mt-12 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {cta.label}
        </a>
      </div>
    </section>
  );
}

export const demos: Record<string, HeroMinimalProps> = {
  default: {
    title: "Ship faster.",
    cta: { label: "Start free", href: "#start" },
  },
};
