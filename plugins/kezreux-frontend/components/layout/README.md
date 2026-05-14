# layout

Four page-level structural presets. Composable with everything else —
drop a hero or pricing table inside any of these.

| Preset | Best for | Complexity |
| --- | --- | --- |
| `CenteredPage` | Settings pages, blog posts, marketing pages with bounded width | simple |
| `SidebarLayout` | App shells with left/right sidebar (dashboards, admin) | medium |
| `DashboardGrid` | Responsive grid of widget cards (1 col mobile → N on desktop) | simple |
| `FullPageLayout` | Marketing/landing pages with sticky-or-static header + footer | medium |

All four:

- Token-only — backgrounds use `bg-background`, borders use
  `border-border`, no hardcoded colors.
- Responsive: stack on mobile, side-by-side on `lg:` viewports.
- Min-height fills the viewport (`min-h-screen`).
- Sticky header variants use `backdrop-blur` + 95% opacity (`bg-background/95`)
  for the frosted-glass effect, gated by `supports-[backdrop-filter]:` for
  graceful fallback.

## Install

```
/component layout CenteredPage
/component layout SidebarLayout
/component layout DashboardGrid
/component layout FullPageLayout
```

## Composition examples

### Marketing landing page

```tsx
import { FullPageLayout } from "@/components/layout/FullPageLayout";
import { TopNavWithAuth } from "@/components/navbar/TopNavWithAuth";
import { HeroSplit } from "@/components/hero/HeroSplit";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { CTABanner } from "@/components/marketing/CTABanner";

<FullPageLayout
  stickyHeader
  header={<TopNavWithAuth ... />}
  footer={<div className="px-6 py-6 text-center text-xs text-muted-foreground">© 2026</div>}
>
  <HeroSplit ... />
  <FeatureGrid ... />
  <CTABanner variant="primary" ... />
</FullPageLayout>
```

### App dashboard

```tsx
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { SidebarVertical } from "@/components/navbar/SidebarVertical";
import { DashboardGrid } from "@/components/layout/DashboardGrid";
import { StatCard } from "@/components/data/StatCard";

<SidebarLayout
  sidebar={<SidebarVertical ... />}
  header={<div className="flex items-center justify-between px-6 py-3">...</div>}
>
  <div className="p-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <DashboardGrid columns={4} className="mt-6">
      <StatCard label="MAU" value="12,481" change="12.3%" changeType="positive" />
      <StatCard label="Revenue" value="$48,210" />
      ...
    </DashboardGrid>
  </div>
</SidebarLayout>
```

### Settings page

```tsx
import { CenteredPage } from "@/components/layout/CenteredPage";
import { ProfileForm } from "@/components/form/settings/ProfileForm";

<CenteredPage
  maxWidth="2xl"
  header={<h1 className="py-4 text-2xl font-bold">Settings</h1>}
>
  <ProfileForm ... />
</CenteredPage>
```

## DashboardGrid + col-span

For widgets that span multiple cells, apply Tailwind's `col-span-*`
classes directly on the child:

```tsx
<DashboardGrid columns={4}>
  <div className="col-span-2 rounded-md border bg-card p-4">Wide widget</div>
  <div className="rounded-md border bg-card p-4">Stat</div>
  <div className="rounded-md border bg-card p-4">Stat</div>
</DashboardGrid>
```
