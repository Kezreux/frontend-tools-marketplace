---
name: component-scaffold
description: Use when the user asks to "scaffold a new component", "create a Foo component", or invokes `/component-new <Name>`. Reads the project's CLAUDE.md and surrounding code to infer conventions (component library, file structure, story/test patterns), then generates a new component plus its sibling files following those conventions. Defaults to React + Tailwind + shadcn/ui if the project is silent. Writes files; confirms placement with the user first if conventions are ambiguous.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Write
  - Edit
---

# Component scaffold

Generates a new component (plus the project's standard sibling files —
stories, tests, index re-exports) following the host project's existing
conventions. Don't impose a foreign style; **mirror what already exists.**

## Authority

Load the canonical rules from `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` on every
invocation — especially sections 1 (React + TS), 2 (Composition), 7 (File
structure), and 8 (Naming). The host project's `CLAUDE.md` is the deviation
layer; mirror its existing component conventions over RULES.md defaults when
they differ. The active theme at `src/styles/theme.ts` defines legal token
values for any generated styles.

## Inputs

- **Required:** component name (PascalCase). Accept from user as
  `Button`, `UserCard`, etc.
- **Optional:** target directory (`src/components/forms/` style). If omitted,
  infer from existing components.
- **Optional:** brief description of what the component does — shapes the
  initial props and JSX.

## Workflow

### 1. Read the conventions

Read in this order:

1. **`CLAUDE.md`** — look for `## Frontend conventions`, `## Component
   structure`, `## Component library` sections. Honor anything explicit.
2. **Existing components** — pick 2–3 representative ones (e.g.,
   `src/components/ui/button.tsx`, `src/components/Card.tsx`) and read them.
   Note:
   - File casing (kebab-case `button.tsx` vs PascalCase `Button.tsx`)
   - Whether index re-exports are used (`src/components/Button/index.ts`)
   - Whether props use `interface` or `type`
   - Whether `cn()` / `clsx` / `tailwind-merge` is the className helper
   - Whether `forwardRef` is used (shadcn pattern) or not
   - Whether components default-export or named-export
3. **Test/story patterns** — glob for `*.test.{ts,tsx}`, `*.stories.{ts,tsx}`,
   `*.spec.{ts,tsx}` near existing components. If found, mirror that pattern.
4. **Package.json** — confirm presence of React, the styling system, the
   testing framework, Storybook. Don't generate a story file if Storybook
   isn't installed.

### 2. Confirm placement (only if ambiguous)

If multiple plausible directories exist (e.g., `src/components/ui` and
`src/components/forms`) and the component's purpose is ambiguous, **ask the
user once** where it should go. Otherwise just pick the right spot.

Never block on this for an obvious case (`Button` clearly goes in `ui/`).

### 3. Generate the files

For the default stack (React + Tailwind + shadcn/ui), produce:

- **`<name>.tsx`** (or `<Name>.tsx` per casing convention) — the component
  itself. Use `forwardRef` if existing components do. Use `cn()` (or
  whichever helper the project uses) for className composition. Include
  the `cva` variants pattern if the project uses it.
- **`<name>.test.tsx`** — only if the project has a test runner and existing
  test files. Mirror the existing test setup (e.g., `@testing-library/react`
  with `vitest` or `jest`). Cover: renders, accepts className, forwards ref
  if applicable.
- **`<name>.stories.tsx`** — only if Storybook is installed. One Default
  story plus one variant if the component has variants.
- **`index.ts`** re-export — only if the existing directory uses index
  barrels.

For Vue/Svelte projects, generate the analogous single-file component plus
test/story following the detected pattern.

#### Default React + Tailwind + shadcn template

When using the fallback (no host conventions detected), use this shape:

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface <Name>Props extends React.HTMLAttributes<HTMLDivElement> {
  // ...
}

const <Name> = React.forwardRef<HTMLDivElement, <Name>Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      />
    )
  }
)
<Name>.displayName = "<Name>"

export { <Name> }
```

Adjust the element type, props, and base classes to fit the component's purpose.

### 4. Report

```markdown
## Scaffolded <Name>

**Conventions detected:**
- File casing: <kebab | Pascal>
- Index barrel: <yes | no>
- Test framework: <vitest | jest | none>
- Stories: <yes | no>

**Files created:**
- `path/to/<name>.tsx`
- `path/to/<name>.test.tsx` *(or "skipped — no test framework")*
- `path/to/<name>.stories.tsx` *(or "skipped — no Storybook")*
- `path/to/index.ts` *(or "skipped — no barrel pattern")*

**Next steps:**
- <e.g., "Wire into the parent layout">
- <e.g., "Add to the design system's component index">
```

## Boundaries

- **Match existing patterns over imposing best practices.** If the project
  uses default exports and no `forwardRef`, do the same. Note the deviation
  from shadcn defaults in the report but don't "fix" it unprompted.
- **Don't pull in new dependencies.** If `cn`/`clsx` isn't installed, fall
  back to template-string className composition.
- **Don't create files outside the component's directory** (no editing
  global type files, no touching the design system index unless the user
  asks).
- If the project has no detectable convention at all and no `CLAUDE.md`,
  use the React + Tailwind + shadcn fallback and say so in the report.
