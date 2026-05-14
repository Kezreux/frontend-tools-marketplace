# marketing

Five conversion-focused presets for landing pages, marketing sites, and
in-app upsell surfaces.

| Preset | Best for | Complexity |
| --- | --- | --- |
| `PricingTable` | 3-tier pricing with featured-tier highlight + per-tier CTA | complex |
| `FeatureGrid` | Responsive feature grid with icons (2/3/4 columns) | medium |
| `CTABanner` | Mid-page call-to-action; default + primary-tinted variants | simple |
| `FAQAccordion` | Disclosure-pattern FAQ — single-open or multi-open | medium |
| `LogoCloud` | Customer/partner logo grid with optional "Trusted by" heading | simple |

All five:

- Token-only styling. The featured-tier highlight uses `ring-primary/30`
  + `border-primary`; the primary CTA variants use `bg-primary` +
  `text-primary-foreground` paired correctly.
- Semantic markup: `<section>` with `aria-labelledby`, `<dl>` for the FAQ,
  `<ul>` for logo grid, focus rings via `focus-visible:ring-2 ring-ring`.
- Mobile-first responsive — every preset stacks cleanly on small
  viewports.

## Install

```
/component marketing PricingTable
/component marketing FeatureGrid
/component marketing CTABanner
/component marketing FAQAccordion
/component marketing LogoCloud
```

## Composition for a full landing page

These pair with the existing `hero` and `navbar` categories. A typical
landing-page stack:

```tsx
<TopNavSimple ... />
<HeroSplit ... />
<FeatureGrid ... />
<LogoCloud ... />
<PricingTable ... />
<FAQAccordion ... />
<CTABanner variant="primary" ... />
```

## PricingTable — the centerpiece

Supports any number of tiers (2, 3, or 4) with auto-responsive column
counts. The `featured` flag on a tier adds a "Most popular" badge,
primary-color ring, and primary-colored CTA. Useful both for marketing
sites and in-product upgrade surfaces.

```tsx
<PricingTable
  title="Pricing"
  tiers={[
    { name: "Hobby",      price: "$0",      features: [...], cta: { ... } },
    { name: "Pro",        price: "$19",     features: [...], cta: { ... }, featured: true },
    { name: "Enterprise", price: "Custom",  features: [...], cta: { ... } },
  ]}
/>
```

## FAQAccordion — disclosure semantics

Uses native `<button aria-expanded aria-controls>` with proper `<dl>` /
`<dt>` / `<dd>` semantics. Both keyboard and screen-reader friendly out
of the box. `allowMultiple` defaults to false (only one item open at a
time); `defaultOpen` controls the initially-expanded index.
