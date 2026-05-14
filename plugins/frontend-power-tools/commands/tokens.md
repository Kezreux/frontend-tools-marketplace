---
description: Print the project's design tokens — colors, spacing, typography, breakpoints, z-index layers — read from CLAUDE.md or the project's token sources.
---

Read and print the project's design tokens in a scannable format.

## Sources (in order)

1. **`CLAUDE.md`** at the repo root — look for `## Design tokens`,
   `## Frontend conventions`, or `## Component library` sections.
2. **Tailwind config** (`tailwind.config.{js,ts,mjs,cjs}`) — extract
   `theme.colors`, `theme.spacing`, `theme.fontSize`, `theme.screens`,
   `theme.zIndex`, plus `theme.extend.*`.
3. **A dedicated tokens file** if `CLAUDE.md` points to one or if a
   conventional path exists (`src/tokens.*`, `src/styles/tokens.*`,
   `app/globals.css` CSS variables in `:root`).
4. **Fallback:** Tailwind defaults + shadcn semantic tokens
   (`background`, `foreground`, `primary`, `muted`, `accent`,
   `destructive`, `border`, `input`, `ring`). Note the fallback in the
   output's preamble.

Don't run the `token-lint` skill — this command only **displays** tokens,
it doesn't scan for violations.

## Output format

```markdown
## Design tokens — <project name from package.json or directory>

**Source:** <file path>

### Colors
- `primary` — #hex / oklch(...)
- ...

### Spacing scale
- `0` → 0px, `1` → 4px, `2` → 8px, ...

### Typography
- Sizes: `xs`, `sm`, `base`, ...
- Families: `sans`, `mono`, ...

### Breakpoints
- `sm` ≥ 640px, `md` ≥ 768px, ...

### Z-index layers
- `dropdown` 1000, `modal` 1300, ...   *(or "none documented")*
```

Keep it scannable — bulleted lists, not prose. If a category is undefined in
all sources, write "—" rather than guessing.
