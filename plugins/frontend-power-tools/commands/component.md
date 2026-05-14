---
description: List, preview, or install preset components from the curated library. Components are theme-agnostic — they render in whichever theme is active.
argument-hint: "[list | <category> [<subcategory>] [<name>] | preview <name>]"
---

Dispatch on the arguments. Components live under:

```
${CLAUDE_PLUGIN_ROOT}/components/<category>/<Name>.tsx              # flat
${CLAUDE_PLUGIN_ROOT}/components/<category>/<subcategory>/<Name>.tsx  # nested
```

Discovery is by globbing the directory tree — adding a new component,
subcategory, or category is just dropping a file or folder in the right
place.

## Building the lookup

Before dispatching, build three lists by walking
`${CLAUDE_PLUGIN_ROOT}/components/`:

- **Categories** — top-level directory names.
- **Subcategories per category** — second-level directory names (if any).
- **Components** — every `.tsx` (excluding files starting with `_`), with
  their `(category, subcategory|null, name)` tuple.

If `${CLAUDE_PLUGIN_ROOT}/components/catalog.json` exists, you can read
it instead of globbing — it has the same data in structured form.

## Argument routing

Let `$1`, `$2`, `$3` be the positional args.

### `$1` is empty OR equals "list"

Show the full catalog, grouped by category and (where present) by
subcategory. Format:

```markdown
## Component library

**Active theme:** <name>  (or "no theme installed — run `/theme set <name>`")

### navbar (5)

- **TopNavSimple** *(simple)* — Clean horizontal top nav with logo and links.
- **TopNavWithAuth** *(medium)* — Top nav with logo, links, and right-aligned auth state.
- … etc

### form (10)

#### auth (4)
- **LoginForm** *(medium)* — …
- **SignupForm** *(medium)* — …
- **PasswordResetForm** *(simple)* — …
- **TwoFactorForm** *(medium)* — …

#### feedback (2)
- …

#### settings (2)
- …

#### search (2)
- …

Install: `/component <category> <Name>` (or `/component <category> <subcategory> <Name>`).
```

### `$1` equals "preview" AND `$2` is a component name

Show the source of the component without installing it. Glob
`${CLAUDE_PLUGIN_ROOT}/components/**/$2.tsx` (matches both
`<category>/<Name>.tsx` and `<category>/<subcategory>/<Name>.tsx`).
Print inside a fenced ```tsx block. Do **not** write to disk.

### `$1` matches a category name

Branch on `$2`:

**`$2` is empty or "list"** — list components in that category. If the
category has subcategories, group output by subcategory:

```markdown
## form (10)

### auth (4)
- ...
### feedback (2)
- ...
```

**`$2` matches a subcategory name in `$1`** — branch on `$3`:

- **`$3` is empty or "list"** → list components in that subcategory.
- **`$3` is a component name in that subcategory** → install it.

**`$2` matches a component name in `$1`** (top-level OR inside any
subcategory of `$1`) — install it. This is the shorthand:
`/component form LoginForm` works because `LoginForm` is unambiguously in
`form/auth/`.

### `$1` is a globally unique component name

Install it. The full path is inferred from the catalog.

### `$1` doesn't match any of the above

Print usage + the discovered categories/subcategories + a hint that
component names are case-sensitive PascalCase.

## Install workflow

When the resolved action is "install":

1. **Preflight.**
   - If no theme is installed in the host project (no `src/styles/theme.ts`),
     warn but proceed: "No theme detected — the component will fall back
     to default Tailwind colors. Run `/theme set <name>` first for proper
     theming."
   - Confirm the source file exists.

2. **Determine target directory.**
   - Read `CLAUDE.md` for a `## Component structure` section. Use what it
     specifies.
   - Else glob the project for existing components matching the same
     `<category>` (and `<subcategory>` if present), e.g.
     `src/components/<category>/<subcategory>/*.tsx`. Mirror that
     location.
   - **Subcategory mirroring rule:** if the plugin source has a
     subcategory (e.g., `form/auth/LoginForm.tsx`), the install target
     preserves it (`src/components/form/auth/LoginForm.tsx`). Don't
     flatten subcategories during install — the structure is part of the
     value.
   - Default fallback: `src/components/<category>/<subcategory>/`
     (or `src/components/<category>/` for flat components).
   - Create directories as needed.

3. **Adapt file casing if needed.**
   - Read 1–2 existing components in the project to detect casing
     (PascalCase vs kebab-case).
   - If kebab, the filename adapts (`TopNavSimple.tsx` →
     `top-nav-simple.tsx`). The exported component name stays
     PascalCase.

4. **Write the file.**
   - Read the source `.tsx`.
   - Strip the leading `// @component:` / `// @category:` / etc. metadata
     header lines. These are catalog-only.
   - Write to the target path.

5. **Print the next steps:**

```
✓ Installed <Name> to <path>

Usage:

  import { <Name> } from "@/components/<category>/<subcategory>/<Name>";
  // (or "@/components/<category>/<Name>" if no subcategory)

  <<Name> ... />

See the file for the full props interface (every preset documents its
props inline).
```

6. **Do NOT modify any other files.** No automatic wiring into a layout,
   no `index.ts` updates, no route registration.

## Boundaries

- Discovery is directory-based or catalog-based — never hardcode the
  component / category / subcategory list.
- Never overwrite a file that already exists in the target — ask before
  overwriting, or write alongside with a suffix
  (`TopNavSimple.alt.tsx`).
- Never install anything outside the project's component directory tree.
- Never run `npm install` — components must work with React + the active
  theme's Tailwind setup alone.
- Subcategory dispatch is **strictly hierarchical**. Don't accept
  `/component auth LoginForm` (no category) — `auth` is a subcategory,
  not a top-level category. Require the user to write
  `/component form auth LoginForm` or use the shorthand
  `/component form LoginForm`.
