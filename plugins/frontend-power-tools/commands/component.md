---
description: List, preview, or install preset components from the curated library. Components are theme-agnostic — they render in whichever theme is active.
argument-hint: "[list | <category> | <category> <name> | preview <name>]"
---

Dispatch on the arguments. The plugin's components live under
`${CLAUDE_PLUGIN_ROOT}/components/<category>/<Name>.tsx` and are discovered
by globbing — adding a new component or category is just dropping a file
or directory in the right place.

## Argument routing

Resolve `$1` and `$2` against three categories of input:
1. **Action verbs:** `list`, `preview`, `install`
2. **Category names:** the directory names under `${CLAUDE_PLUGIN_ROOT}/components/`
   (excluding `INDEX.md`)
3. **Component names:** the PascalCase basenames of `*.tsx` files under
   any category

Build the category list and component-name list first by globbing, then
match `$1` / `$2` against them.

## Cases

### `$1` is empty OR equals "list"

Print the catalog. Walk every category directory; for each, parse its
`.tsx` files for the `@component` / `@description` / `@complexity`
header comments. Output:

```markdown
## Component library

| Category | Components |
| --- | --- |
| navbar  | 5         |
| (more)  | (more)    |

### navbar
- **TopNavSimple** *(simple)* — Clean horizontal top nav with logo and links.
- **TopNavWithAuth** *(medium)* — Top nav with logo, links, and right-aligned auth state.
- **TopNavWithSearch** *(medium)* — Top nav with logo, center search input, and action icons.
- **SidebarVertical** *(medium)* — Full-height left sidebar with sections.
- **MobileMenuDrawer** *(complex)* — Mobile-first hamburger with slide-in drawer.

Install one with `/component <category> <Name>` (e.g. `/component navbar TopNavSimple`).
Preview source with `/component preview <Name>`.
```

If the active theme is detected from `CLAUDE.md`, mention it in a line
above the table: `**Active theme:** Minimal — all components render using
its tokens.`

### `$1` matches a category name AND `$2` is empty or equals "list"

List that category only. Same format as above but scoped.

### `$1` matches a category name AND `$2` is a component name in that category

Install the component (`<category>/<$2>.tsx`).

### `$1` is a component name (globally unique across categories)

Install it. (Shorthand — only works when the name is unambiguous.)

### `$1` equals "preview" AND `$2` is a component name (with optional `$3`)

Show the source of the component without installing it. Find the file by
globbing `${CLAUDE_PLUGIN_ROOT}/components/**/$2.tsx`. Print it inside a
fenced ```tsx block in your response. Do **not** write to disk.

### `$1` is unrecognized

Print usage + the list of available categories with component counts.

## Install workflow

When the action resolves to "install":

1. **Preflight.**
   - If no theme is installed (no `src/styles/theme.ts` in the host
     project), warn but proceed: "No theme detected — the component will
     fall back to default Tailwind colors. Run `/theme set <name>` first
     for proper theming."
   - Confirm the source file exists at
     `${CLAUDE_PLUGIN_ROOT}/components/<category>/<Name>.tsx`.

2. **Determine target directory.**
   - Read `CLAUDE.md` for a `## Component structure` section. If it
     names a path (e.g., `src/components/navbar/`), use that.
   - Otherwise, glob for existing components matching the category
     (`src/components/<category>/*.tsx`, `app/components/<category>/*.tsx`,
     `components/<category>/*.tsx`). If found, install next to them.
   - Default fallback: `src/components/<category>/`.
   - Create the directory if it doesn't exist.

3. **Adapt file casing if needed.**
   - Read 1–2 existing components in the project to detect casing
     (`Button.tsx` PascalCase vs `button.tsx` kebab).
   - If kebab is used, the target filename is the kebab-case version
     (e.g., `TopNavSimple.tsx` → `top-nav-simple.tsx`). Otherwise keep
     PascalCase.
   - Do **not** modify the contents — only the filename. The exported
     component name stays PascalCase.

4. **Write the file.**
   - Read the source `.tsx`.
   - Strip the leading `// @component:` metadata header (lines starting
     with `// @`). These are for the catalog only, not for the user's
     project.
   - Write to the target path.

5. **Print the next steps:**

```
✓ Installed <Name> to <path>

Usage:

  import { <Name> } from "@/components/<category>/<Name>";

  <<Name>
    brand="..."
    links={...}
  />

See the file for the full props interface (each is documented inline).
```

6. **Do NOT modify any other files.** No automatic wiring into a layout,
   no `index.ts` updates, no route registration. The user does that
   themselves.

## Boundaries

- Discovery is directory-based — never hardcode the component or category
  list. Glob `${CLAUDE_PLUGIN_ROOT}/components/` every time.
- Never overwrite a file that already exists in the target — if the user
  already has a `TopNavSimple.tsx`, ask them whether to overwrite, write
  alongside with a suffix (`TopNavSimple.alt.tsx`), or abort.
- Never install anything outside the project's component directory tree.
- Never run `npm install` — components must work with React + the active
  theme's Tailwind setup alone.
