# Component catalog convention

This document defines the contract every component in the library must
follow so the generator can produce `catalog.json` and downstream consumers
(galleries, the plugin itself, docs sites) can render them.

## 1. Metadata header

Every `<Name>.tsx` starts with five `// @...` tags. The generator fails
loud if any are missing.

```tsx
// @component: TopNavSimple
// @category: navbar
// @description: Clean horizontal top nav with logo and links.
// @keywords: navbar, top nav, header, navigation, marketing, landing
// @complexity: simple
```

Allowed values:
- `@component` — PascalCase, must match the exported function name.
- `@category` — lowercase, matches the directory name.
- `@description` — one line, used in gallery cards.
- `@keywords` — comma-separated, used for search.
- `@complexity` — one of `simple` | `medium` | `complex`.

## 2. Component export

Functional React + TS. Typed props with a named interface, named export
of the component:

```tsx
export interface <Name>Props { ... }

export function <Name>(props: <Name>Props) {
  return ( ... );
}
```

## 3. `demos` export — required

Every component must export a `demos` const, typed as
`Record<string, <Name>Props>`. The generator fails if it's missing.

### Single demo

When the component has one canonical state, use `default`:

```tsx
export const demos: Record<string, TopNavSimpleProps> = {
  default: {
    brand: "Acme",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing", active: true },
    ],
    cta: { label: "Get started", href: "#cta" },
  },
};
```

### Multiple demos (for components with meaningful states)

```tsx
export const demos: Record<string, TopNavWithAuthProps> = {
  "signed in": {
    brand: "Acme",
    user: { name: "Nicholas", email: "nicholas@example.com" },
    onSignOut: () => {},
    links: [/* ... */],
  },
  "signed out": {
    brand: "Acme",
    user: null,
    onSignIn: () => {},
    onSignUp: () => {},
    links: [/* ... */],
  },
};
```

Keys are human-readable labels used as captions in galleries. Quote them
when they contain spaces.

### Rules for demos values

- **Self-contained.** No functions reading external state, no closures
  over file-scope variables that would break when rendered in a gallery.
- **No-op handlers.** Event handlers (`onClick`, `onSubmit`, `onSignIn`)
  use `() => {}` (or `async () => {}` if the type requires a Promise).
- **JSX is allowed** for slots that require it (`icon: <svg ...>...</svg>`,
  `bottomSlot: <div>...</div>`), but the JSX must only use `react` —
  no imports beyond what the component file already pulls in.

## 4. Authoring workflow

1. Add the file with metadata header.
2. Export the component and its `Props` type.
3. Export `demos: Record<string, Props>` with at least a `default` entry.
4. Run `npm run build:catalog`.
5. Commit `catalog.json` alongside your component.

The generator script is at
`plugins/frontend-power-tools/scripts/build-catalog.mjs`. Run it via
`npm run build:catalog` at the marketplace root.

## 5. What lives in `catalog.json`

The script writes a flat array of:

```json
{
  "name": "TopNavSimple",
  "category": "navbar",
  "description": "...",
  "keywords": ["navbar", "top nav", "header"],
  "complexity": "simple",
  "filePath": "plugins/frontend-power-tools/components/navbar/TopNavSimple.tsx",
  "sourceUrl": "https://raw.githubusercontent.com/Kezreux/frontend-tools-marketplace/main/plugins/...",
  "lines": 61,
  "demos": ["default"]
}
```

The `sourceUrl` lets a gallery website fetch the raw component source over
HTTPS without cloning the repo. The `demos` array tells the gallery which
demo states exist (the values themselves come from importing the
component module directly).

## 6. Environment variables

The generator's `sourceUrl` field defaults to
`Kezreux/frontend-tools-marketplace` on `main`. To override (for a fork or
a different branch):

```bash
CATALOG_REPO=other-org/other-repo CATALOG_BRANCH=dev npm run build:catalog
```
