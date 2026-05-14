# navbar

Five navigation presets covering the most common patterns. Pick one
based on the surface you're building.

| Preset | Best for | Key features |
| --- | --- | --- |
| `TopNavSimple` | Landing pages, marketing sites | Logo + horizontal links + optional CTA |
| `TopNavWithAuth` | Authenticated apps | Logo + links + avatar dropdown / sign-in CTA |
| `TopNavWithSearch` | Tools, dashboards | Logo + center search + action icons |
| `SidebarVertical` | Full-screen apps | Left vertical sidebar with sections + bottom user info |
| `MobileMenuDrawer` | Mobile-first sites | Hamburger button + slide-in overlay, focus trap, ESC closes |

All five:

- Use **only** the active theme's semantic tokens — no hardcoded colors,
  no `bg-white`, no arbitrary px.
- Are **accessible**: semantic `<nav>`, `<a>`, `<button>` elements;
  `aria-label` on landmarks and icon-only controls; visible focus rings
  (`focus-visible:ring-2`); keyboard handlers paired with click handlers.
- Are **mobile-first**: collapse, stack, or transform on `sm:`/`md:`
  breakpoints.
- Have **no external dependencies** beyond `react` itself — use template
  literals for conditional classNames so they drop into any project.

## Install

```
/component navbar <PresetName>
```

The command copies the preset to `src/components/navbar/<Name>.tsx`
(or your project's convention if detected from existing components).
After install, import and use:

```tsx
import { TopNavSimple } from "@/components/navbar/TopNavSimple";

<TopNavSimple
  brand="Acme"
  links={[
    { label: "Features", href: "/features" },
    { label: "Pricing",  href: "/pricing", active: true },
    { label: "Docs",     href: "/docs" },
  ]}
/>
```

Each preset has its own props interface documented at the top of the file.
