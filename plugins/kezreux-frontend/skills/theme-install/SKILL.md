---
name: theme-install
description: Use when installing a preset theme into the host project via `/theme set` or `/theme <name>`. Detects the project layout (Next App / Next Pages / Vite / CRA / Remix), prints a dry-run plan, backs up files about to be modified, writes the theme to CLAUDE.md / src/styles/theme.ts / tailwind.config / globals.css, verifies the result, and restores from backup on any failure.
allowed-tools:
  - Read
  - Glob
  - Bash
  - Write
  - Edit
---

# Theme install

Install a preset theme from `${CLAUDE_PLUGIN_ROOT}/themes/<name>/theme.ts`
into the host project. Always go through the dry-run + confirm step, always
back up modified files, always verify the result.

## Input

A theme name (e.g. `minimal`, `editorial`, ...). Must match a directory
under `${CLAUDE_PLUGIN_ROOT}/themes/<name>/`. Theme discovery is
directory-based — adding a new theme is just dropping a `<name>/theme.ts`
file with the right shape.

## Workflow

### 1. Validate the theme exists

Glob `${CLAUDE_PLUGIN_ROOT}/themes/<name>/theme.ts`. If absent, list every
directory under `${CLAUDE_PLUGIN_ROOT}/themes/` (excluding `_theme.ts`) and
abort with "unknown theme: <name>. Available: ...".

### 2. Read the chosen theme

Read `${CLAUDE_PLUGIN_ROOT}/themes/<name>/theme.ts`. The file is a plain
object literal — no execution needed. Extract:

- `name`, `description`
- 19 color tokens (light/dark HSL triplets): background, foreground, card, cardForeground, popover, popoverForeground, primary, primaryForeground, secondary, secondaryForeground, muted, mutedForeground, accent, accentForeground, border, input, ring, destructive, destructiveForeground
- `typography.fontFamily.{sans,serif,mono}` font stacks
- `typography.scale` (9 steps with size + lineHeight)
- `typography.weights`
- `spacing.scale` (legal px values)
- `radius.{none,sm,md,lg,full}`
- `shadows.{none,sm,md,lg}`
- `density`, `animation`, `iconography`

### 3. Detect host project layout

Probe the host project root (`pwd` of the Claude Code session):

| Signal | Inference |
| --- | --- |
| `app/layout.tsx` exists | framework: **next-app** |
| `pages/_app.{tsx,jsx}` exists | framework: **next-pages** |
| `vite.config.{ts,js,mjs}` exists | framework: **vite** |
| `react-scripts` in `package.json` deps | framework: **cra** |
| `remix.config.{ts,js}` exists | framework: **remix** |
| none of the above | framework: **unknown** |
| `tailwind.config.{ts,js,mjs,cjs}` | tailwind config path |
| `app/globals.css` / `styles/globals.css` / `src/index.css` / `src/App.css` | main CSS file (first found wins) |
| `darkMode:` value in tailwind config OR `.dark { ... }` in main CSS | dark-mode selector |

If `framework: unknown` AND no main CSS file is detected, ask the user
ONCE: "Couldn't auto-detect — please paste the path to your main CSS file
(or 'skip' to write theme.ts + CLAUDE.md only)."

### 4. Dry-run plan + confirm

Print exactly what will happen. Format:

```
Theme to install: <Name>
Project framework: <framework>
Tailwind config: <path or "(none)">
Main CSS: <path or "(none)">
Dark mode strategy: <class / media / selector / "(none)">

Will CREATE:
  • src/styles/theme.ts          (canonical Theme object, self-contained)
  • CLAUDE.md ## Theme section   (or full file if absent)

Will MODIFY (backed up to <path>.pre-theme.bak first):
  • <tailwind config path>        merge into theme.extend.{colors, fontFamily, fontSize, spacing, borderRadius, boxShadow, transitionDuration}
  • <main CSS path>               write 15 CSS vars into :root + dark selector

Reply "apply" to proceed, "abort" to stop.
```

Drop the MODIFY rows for any file that wasn't detected. Wait for an
explicit "apply" — do not interpret silence as consent.

### 5. Backup

For every file in the MODIFY list, check whether `<path>.pre-theme.bak`
already exists.

- If yes: leave it alone (it represents the original pre-first-install
  ground truth; don't overwrite a real rollback target).
- If no: copy `<path>` → `<path>.pre-theme.bak`.

### 6. Apply

#### 6a. Create `src/styles/theme.ts`

Self-contained TypeScript — no imports from the plugin. The file the
user can copy / edit / version-control freely:

```ts
/**
 * Installed by kezreux-frontend v<plugin-version>.
 * Active theme: <Name>
 *
 * Edit `/theme set <name>` to switch themes.
 * The audit skills and `/build` orchestrator enforce these tokens.
 */

export const theme = {
  name: "<Name>",
  description: "<one-liner>",
  colors: { /* all 15 tokens, copied verbatim from source */ },
  typography: { /* fontFamily, scale, weights */ },
  spacing: { scale: [...] },
  radius: { none, sm, md, lg, full },
  shadows: { none, sm, md, lg },
  density: "<density>",
  animation: { duration, easing },
  iconography: { library, strokeWidth, defaultSize },
} as const;

export type Theme = typeof theme;
```

#### 6b. Update CLAUDE.md

If CLAUDE.md doesn't exist, create one with a header pointing at this
project. If a `## Theme` section exists, replace it. Otherwise append.

```markdown
## Theme

- **Active:** <Name>
- **Plugin version:** <plugin-version>
- **Reference:** `src/styles/theme.ts`
- **Rules:** `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` (loaded by every audit skill)

Components in this project must use only the tokens defined in
`src/styles/theme.ts`. Hardcoded colors, raw px outside the spacing scale,
magic z-indexes, and inline color values are violations. The
`/design-review`, `/a11y`, `/token-lint`, and `/build` flows enforce this.
```

#### 6c. Update tailwind config (if detected)

Preserve the existing file (content paths, plugins, darkMode, etc.).
Merge into `theme.extend` only. Use the shadcn-style HSL var pattern so
the CSS vars in `globals.css` flow through:

```js
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary:   { DEFAULT: "hsl(var(--secondary))",   foreground: "hsl(var(--secondary-foreground))" },
      muted:       { DEFAULT: "hsl(var(--muted))",       foreground: "hsl(var(--muted-foreground))" },
      accent:      { DEFAULT: "hsl(var(--accent))",      foreground: "hsl(var(--accent-foreground))" },
      destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
      border: "hsl(var(--border))",
      input:  "hsl(var(--input))",
      ring:   "hsl(var(--ring))",
    },
    fontFamily: {
      sans:  [/* theme.typography.fontFamily.sans split into a stack array */],
      serif: [/* sames */],
      mono:  [/* same */],
    },
    fontSize: {
      // for each of the 9 type steps:
      // <key>: ["<size>px", { lineHeight: "<lineHeight>px" }],
    },
    spacing: {
      // any px values from theme.spacing.scale that aren't in Tailwind defaults,
      // keyed by their pixel value (e.g. "18": "72px" — but only when needed)
    },
    borderRadius: {
      none: "0px",
      sm:   "<sm>px",
      md:   "<md>px",
      lg:   "<lg>px",
      full: "9999px",
    },
    boxShadow: {
      sm: "<theme.shadows.sm>",
      md: "<theme.shadows.md>",
      lg: "<theme.shadows.lg>",
    },
    transitionDuration: {
      fast:   "<fast>ms",
      normal: "<normal>ms",
      slow:   "<slow>ms",
    },
    transitionTimingFunction: {
      themed: "<theme.animation.easing>",
    },
  },
}
```

Respect the existing module syntax. `module.exports = {...}` stays
CommonJS; `export default {...}` stays ESM.

#### 6d. Update main CSS

Locate (or insert) the `:root { ... }` and dark-selector blocks. Write
all 19 color CSS vars in each, plus a `--radius` helper. Preserve other
CSS unchanged.

```css
:root {
  --background: <light bg HSL triplet>;
  --foreground: <light fg HSL triplet>;
  --card: <light card HSL>;
  --card-foreground: <light card-fg HSL>;
  --popover: <light popover HSL>;
  --popover-foreground: <light popover-fg HSL>;
  --primary: <light primary HSL>;
  --primary-foreground: <light primary-fg HSL>;
  --secondary: <light secondary HSL>;
  --secondary-foreground: <light secondary-fg HSL>;
  --muted: <light muted HSL>;
  --muted-foreground: <light muted-fg HSL>;
  --accent: <light accent HSL>;
  --accent-foreground: <light accent-fg HSL>;
  --destructive: <light destructive HSL>;
  --destructive-foreground: <light destructive-fg HSL>;
  --border: <light border HSL>;
  --input:  <light input HSL>;
  --ring:   <light ring HSL>;
  --radius: <radius.md>px;
}

.dark {
  --background: <dark bg HSL>;
  /* ... all 15 tokens, dark variants ... */
}
```

If the project's dark selector is `[data-theme='dark']` or similar, use
that instead of `.dark`. Match what's already in the file.

### 7. Verify

For each modified file:

- **tailwind config**: try `node --check <path>` (CommonJS) or read it
  back and look for balanced braces + presence of the `theme.extend`
  block. If `node` isn't available, fall back to brace balance.
- **main CSS**: count `{` and `}` characters — must be equal.
- **theme.ts**: read it back and confirm the `export const theme` token
  is present and the file parses by basic brace count.

If any check fails, restore the corresponding `.pre-theme.bak` and
abort with the failure detail. Never leave the project half-installed.

### 8. Report

```
✓ Installed theme: <Name>

Created:
  src/styles/theme.ts
  CLAUDE.md (Theme section)

Modified (backed up to .pre-theme.bak):
  <tailwind path>
  <main CSS path>

Restart your dev server to see the theme.
Switch with /theme set <other>; revert with /theme rollback.
```

## Boundaries

- **Never skip the apply/abort confirmation.** Silence is not consent.
- **Never delete keys** in the existing tailwind config or CSS that aren't
  theme-related.
- **Never overwrite `.pre-theme.bak`** — it represents the original
  pre-first-install state.
- **On verification failure, always restore from `.bak`** before reporting.
- **Do not install packages** (Lucide, fonts, etc.). Suggest them in the
  report only.
