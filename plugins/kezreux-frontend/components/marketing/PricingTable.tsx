// @component: PricingTable
// @category: marketing
// @description: Three-tier (configurable) pricing table with featured-tier highlight, monthly/annual billing toggle slot, feature checklist per tier, and per-tier CTA.
// @keywords: marketing, pricing, plans, tiers, subscription, billing
// @complexity: complex

import type { ReactNode } from "react";

export interface PricingTier {
  name: string;
  description?: string;
  price: ReactNode;
  /** e.g. "/month", " per user", "/yr" */
  priceSuffix?: ReactNode;
  features: string[];
  cta: { label: string; href: string };
  /** Highlight this tier as the featured choice. */
  featured?: boolean;
}

export interface PricingTableProps {
  title?: ReactNode;
  description?: ReactNode;
  tiers: PricingTier[];
  /** Optional billing-period toggle rendered above the tiers. */
  billingSlot?: ReactNode;
  className?: string;
}

export function PricingTable({
  title,
  description,
  tiers,
  billingSlot,
  className,
}: PricingTableProps) {
  return (
    <section
      aria-labelledby={title ? "pricing-title" : undefined}
      className={`bg-background px-4 py-16 sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      {(title || description) && (
        <div className="mx-auto max-w-2xl text-center">
          {title && (
            <h2 id="pricing-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {billingSlot && (
        <div className="mx-auto mt-8 flex justify-center">{billingSlot}</div>
      )}

      <div
        className={`mx-auto mt-12 grid max-w-6xl gap-6 ${tiers.length === 2 ? "sm:grid-cols-2" : tiers.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8 ${
              tier.featured ? "border-primary ring-2 ring-primary/30" : "border-border"
            }`}
          >
            {tier.featured && (
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
            {tier.description && (
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
            )}
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
              {tier.priceSuffix && (
                <span className="text-sm font-medium text-muted-foreground">
                  {tier.priceSuffix}
                </span>
              )}
            </div>
            <ul className="mt-6 flex-1 space-y-2">
              {tier.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-accent" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-foreground">{feat}</span>
                </li>
              ))}
            </ul>
            <a
              href={tier.cta.href}
              className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                tier.featured
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {tier.cta.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export const demos: Record<string, PricingTableProps> = {
  default: {
    title: "Pricing built for teams of every size",
    description: "Start free, upgrade when you grow.",
    tiers: [
      {
        name: "Hobby",
        description: "For personal projects.",
        price: "$0",
        priceSuffix: "/month",
        features: ["3 projects", "Community support", "1 GB storage"],
        cta: { label: "Start free", href: "#start" },
      },
      {
        name: "Pro",
        description: "For growing teams.",
        price: "$19",
        priceSuffix: "/month",
        features: ["Unlimited projects", "Priority support", "100 GB storage", "Advanced analytics"],
        cta: { label: "Start Pro", href: "#pro" },
        featured: true,
      },
      {
        name: "Enterprise",
        description: "For organizations.",
        price: "Custom",
        features: ["SSO", "Dedicated support", "Unlimited storage", "Custom SLA"],
        cta: { label: "Contact sales", href: "#sales" },
      },
    ],
  },
};
