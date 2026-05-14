# Component library

Curated preset components for the `frontend-power-tools` plugin. Each
preset is **theme-agnostic** — it uses only semantic tokens
(`bg-background`, `text-foreground`, `bg-primary`, etc.) so it renders
correctly in whichever theme is active.

## Install

In a project with a theme already installed (`/theme set <name>`):

```
/component <category> list        # list components in a category
/component <category> <name>      # install one
/component preview <name>         # show the source without installing
/component list                   # list every category + counts
```

## Categories

| Category | Components | What's in it |
| --- | --- | --- |
| `navbar` | 5 | Top navs (simple, with auth, with search), vertical sidebar, mobile menu drawer |
| `hero`   | 5 | Simple, minimal, split (with visual), with-form (email signup), with-stats |

More categories ship as v0.3 expands: **forms**, **data**, **feedback**,
**marketing**, **layout**.

## Authoring conventions

Adding a new preset is just dropping a `.tsx` into the right category
directory. Every file follows this shape:

```tsx
// @component: <PascalCaseName>
// @category: <lowercase-category>
// @description: <one-line summary>
// @keywords: comma, separated, intent, terms
// @complexity: simple | medium | complex

import { useState } from "react";

export interface <Name>Props { ... }

export function <Name>(props: <Name>Props) {
  return ( ... );
}
```

The `/component` command discovers presets by globbing the directories —
no registry to update.

## Token-only contract

Every preset must use semantic tokens. The five things to never do:

1. No hardcoded hex (`#fff`) — use `bg-background`, `text-foreground`.
2. No literal `bg-white` / `bg-black` — breaks dark mode.
3. No Tailwind arbitrary px (`p-[13px]`) — use the spacing scale.
4. No inline color styles — use Tailwind classes.
5. No external imports outside `react`. Optional internal `cn()` is fine
   but components also work with raw template-literal classNames.
