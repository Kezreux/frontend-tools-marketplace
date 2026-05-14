# hero

Five hero sections covering the simple-to-advanced range. Each renders
in any active theme — colors, spacing, typography, radius all flow
from `src/styles/theme.ts`.

| Preset | Best for | Complexity |
| --- | --- | --- |
| `HeroSimple` | Marketing landing pages — title + subtitle + 1–2 CTAs | Simple |
| `HeroMinimal` | Editorial / Linear-style sites — one bold headline + one CTA, lots of whitespace | Simple |
| `HeroSplit` | SaaS landing pages — text + CTA on left, visual (image/illustration) slot on right | Medium |
| `HeroWithForm` | Newsletter / waitlist sites — title + subtitle + inline email signup with success state | Medium |
| `HeroWithStats` | Product / conversion sites — title + CTA + row of 3–4 social-proof stats below | Medium |

All five:

- Use only the active theme's semantic tokens.
- Are accessible: `<section aria-labelledby>`, single `<h1>`, labeled
  inputs, focus rings, error announcements via `aria-invalid` +
  `role="alert"` (HeroWithForm).
- Are mobile-first: stack on small screens, lay out on `sm:`/`lg:`
  breakpoints.
- Have no external imports beyond `react` itself.

## Install

```
/component hero HeroSimple
/component hero HeroSplit
/component hero HeroWithStats
```

## Usage examples

### HeroSimple

```tsx
import { HeroSimple } from "@/components/hero/HeroSimple";

<HeroSimple
  title="Build faster with kezreux-frontend"
  subtitle="A complete design system in one Claude Code plugin."
  ctaPrimary={{ label: "Get started", href: "/install" }}
  ctaSecondary={{ label: "View docs", href: "/docs" }}
/>
```

### HeroSplit

```tsx
import { HeroSplit } from "@/components/hero/HeroSplit";

<HeroSplit
  title="Ship a complete frontend in minutes"
  subtitle="Themes, components, audit loop — all in one plugin."
  ctaPrimary={{ label: "Start free", href: "/start" }}
  visual={
    <img
      src="/screenshot.png"
      alt="Product screenshot"
      className="w-full h-auto"
    />
  }
/>
```

### HeroWithForm

```tsx
import { HeroWithForm } from "@/components/hero/HeroWithForm";

<HeroWithForm
  title="Join the waitlist"
  subtitle="Be the first to know when v1.0 launches."
  ctaLabel="Subscribe"
  onSubmit={async (email) => {
    await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) });
  }}
/>
```

### HeroWithStats

```tsx
import { HeroWithStats } from "@/components/hero/HeroWithStats";

<HeroWithStats
  title="Trusted by builders"
  subtitle="Real numbers, real people."
  ctaPrimary={{ label: "See the docs", href: "/docs" }}
  stats={[
    { value: "10k+",  label: "Components installed" },
    { value: "7",     label: "Themes" },
    { value: "98%",   label: "Pass WCAG AA" },
    { value: "<1s",   label: "Time to first paint" },
  ]}
/>
```
