---
name: design-review
description: Use when the user asks to "review my UI", "design review", "audit my changes", or after a frontend feature has just been built. Audits a git diff (or specified files) against the project's design system — checking token usage, component-library compliance, naming, responsive behavior, and dark-mode coverage. Returns a structured findings list, does not make edits.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Design review

A read-only audit of frontend changes against the host project's design system.
Produce a structured, prioritized list of findings. Do **not** make edits — the
caller decides what to fix.

## Authority

Load the canonical rules from `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` on every
invocation. The host project's `CLAUDE.md` is the deviation layer — where it
explicitly overrides a rule, the project wins; otherwise RULES.md is mandatory.
The active theme at `src/styles/theme.ts` defines legal token values.

## Inputs

- **Default:** `git diff` from the working tree against the merge-base with the
  default branch (or `HEAD~1` if there is no upstream).
- **Override:** if the user passed file paths or a glob, audit those instead.
- **Single file:** if the user names one file, audit that file only.

## Workflow

### 1. Scope the review

```bash
# Pick the right diff base; in order of preference:
#   1. tracking upstream  →  git merge-base @ @{u}
#   2. origin/main / origin/master if present
#   3. HEAD~1 as a last-resort fallback
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
git diff --name-only <base>...HEAD
git diff --name-only            # also include unstaged changes
```

Filter to frontend files only: extensions `.tsx`, `.ts`, `.jsx`, `.js`, `.vue`,
`.svelte`, `.css`, `.scss`, `.module.css`, plus Tailwind config and theme files.
Skip generated code, lockfiles, snapshots.

If the scope is empty, report "No frontend changes detected" and stop.

### 2. Load the design system

In this order:

1. **`CLAUDE.md`** at the repo root — look for a `## Frontend conventions`,
   `## Design tokens`, `## Component library`, or `## Design system` section.
   This is the source of truth.
2. **Tailwind config** (`tailwind.config.{js,ts,mjs,cjs}`) — extract `theme`
   and `theme.extend` for the live token set.
3. **A dedicated tokens file** if `CLAUDE.md` points to one (e.g.
   `src/tokens.{ts,json,css}`, `src/styles/theme.{ts,css}`,
   `app/globals.css`).
4. **Fallback** (when none of the above exist): assume **React + Tailwind +
   shadcn/ui** and note this assumption in the report's preamble.

Capture: color tokens, spacing scale, radii, typography scale, breakpoints,
component-library name, naming conventions (file casing, prop naming),
dark-mode strategy (`dark:` variant, CSS variables, data-attribute).

### 3. Audit each file

For every in-scope file, check these five dimensions. Always cite findings as
`file:line` so the user can jump to them.

#### a) Token usage

- **Hardcoded colors:** any `#[0-9a-fA-F]{3,8}`, `rgb(`, `rgba(`, `hsl(`,
  `hsla(` that isn't inside a comment or the tokens file itself.
- **Raw px outside the spacing scale:** numeric px values for `padding`,
  `margin`, `gap`, `width`, `height`, `top|right|bottom|left` that don't map
  to a token in the spacing scale. (Tailwind: any arbitrary value like
  `p-[13px]`, `mt-[7px]`.)
- **Magic z-index:** any `z-index: <number>` or `z-[<n>]` not in the
  documented z-layer scale.
- **Inline `style={{ … }}`:** generally a smell unless the value is dynamic
  (computed from props/state). Flag static inline styles as MAJOR.

#### b) Component-library compliance

- Are primitives that already exist in the library being reimplemented?
  Detect by grepping the library's package (e.g., `@/components/ui/*` for
  shadcn) for `Button`, `Input`, `Dialog`, `Select`, etc., then check if the
  diff uses the primitive or a bare `<button>`/`<div role="button">`.
- Are component imports coming from the right path per `CLAUDE.md`?
- Are className lists following the project's ordering (cn() / clsx /
  tailwind-merge as configured)?

#### c) Naming & file structure

- File and component name match (`Button.tsx` exports `Button`, not `MyButton`).
- File-casing matches CLAUDE.md (e.g., kebab-case folders, PascalCase files).
- Prop naming follows convention (boolean flags as `isX`/`hasX` only if that
  matches CLAUDE.md; otherwise just `disabled`, `loading`).

#### d) Responsive behavior

- Components/pages that render at full width have at least one breakpoint
  modifier (`sm:`, `md:`, `lg:`) or a media query.
- Fixed widths (`w-[420px]`, `width: 420px`) on top-level wrappers are
  flagged as MAJOR.
- Text sizes scale across breakpoints when used on hero/marketing surfaces.

#### e) Dark-mode coverage

- New components use semantic color tokens (`bg-background`,
  `text-foreground`) or paired light/dark utilities (`bg-white dark:bg-zinc-900`),
  not just light-mode values.
- If the project uses CSS variables for theming, raw color tokens that bypass
  the variable layer are flagged.
- Skip this check entirely if `CLAUDE.md` explicitly says "no dark mode".

### 4. Report

Output exactly this structure, in this order:

```markdown
## Design review — <N> file(s) audited

**Scope:** <one line: diff base + file count>
**Design system source:** <CLAUDE.md | tailwind.config | fallback assumed>

### Findings

#### 🔴 Blockers (<count>)
- `path/to/file.tsx:42` — <one-line description>. Suggested: <fix>.

#### 🟡 Major (<count>)
- `path/to/file.tsx:88` — <description>. Suggested: <fix>.

#### 🟢 Minor (<count>)
- `path/to/file.css:12` — <description>. Suggested: <fix>.

### Summary

<2–3 sentences: overall verdict, top theme to address, anything notable that
went well.>
```

If a dimension has zero findings, omit that bullet entirely — don't write
"No issues found in token usage."

### Severity guide

- **🔴 Blocker** — Breaks accessibility, breaks dark mode entirely, or directly
  contradicts a rule stated in `CLAUDE.md`.
- **🟡 Major** — Hardcoded colors, missing breakpoints on full-width surfaces,
  reimplementing an existing primitive, static inline styles.
- **🟢 Minor** — Naming nits, ordering of class names, one-off magic numbers
  that are easy to swap for tokens.

## Boundaries

- **Never edit files.** This is an audit, not a fix.
- **Never run the dev server or build.** That's `visual-check`'s job.
- **Never run a11y checks.** That's `a11y-audit`'s job — but you may flag a
  glaringly obvious a11y issue you stumble on (missing `alt`, button without
  accessible name) as a Blocker and recommend running `a11y-audit`.
- If `CLAUDE.md` is absent and no Tailwind config is detected, still produce a
  review using the React + Tailwind + shadcn fallback, but say so explicitly
  in the preamble so the user knows the standard you're holding them to.
