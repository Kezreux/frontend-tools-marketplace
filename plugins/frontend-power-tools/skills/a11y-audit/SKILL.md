---
name: a11y-audit
description: Use when the user asks for an accessibility check, "a11y audit", WCAG review, or after a UI change is built. Audits frontend files for WCAG 2.1 AA compliance — semantic HTML, ARIA correctness, focus management, color contrast, keyboard navigation. Uses axe-core via Bash if the project has it; otherwise runs a structured manual pass. Returns a prioritized findings list, does not make edits.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Accessibility audit

A read-only WCAG 2.1 AA audit of frontend changes. Produce a prioritized findings
list. Do **not** make edits — the caller decides what to fix.

## Authority

Load the canonical rules from `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` on every
invocation — especially section 4 (Accessibility). The host project's
`CLAUDE.md` is the deviation layer; where it overrides a rule, the project
wins, otherwise RULES.md is mandatory.

## Inputs

- **Default:** `git diff` against the merge-base with the default branch.
- **Override:** if the user passed file paths, a directory, or a route, audit
  that scope instead.

## Workflow

### 1. Scope the audit

Same diff logic as `design-review`:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
git diff --name-only <base>...HEAD
git diff --name-only
```

Filter to UI-bearing extensions: `.tsx`, `.jsx`, `.vue`, `.svelte`, `.html`,
plus the `.css` / `.scss` files that style them. Skip generated code,
snapshots, fixtures.

If empty, report "No UI changes to audit" and stop.

### 2. Detect the toolchain

Probe in this order, choose the first that succeeds:

1. **axe-core in the project** — look for `@axe-core/react`, `@axe-core/playwright`,
   `axe-core`, or `jest-axe` in `package.json`. If found, suggest the user run
   the project's a11y test command and note the command in the report. Do not
   run tests yourself unless the user explicitly asks.
2. **Storybook with a11y addon** — if `.storybook/main.{ts,js}` lists
   `@storybook/addon-a11y`, mention that running `storybook` and clicking the
   "Accessibility" tab will surface violations.
3. **No tooling** — proceed with the manual audit below.

### 3. Manual audit pass

For each in-scope file, check these dimensions. Cite findings as `file:line`.

#### a) Semantic HTML

- Interactive elements use the right tag: `<button>` for actions, `<a>` for
  navigation, `<input>`/`<label>` for forms. Flag `<div onClick>` or
  `<span onClick>` as **Blocker** unless it has `role="button"` plus a
  keyboard handler.
- Headings form a sensible outline: no `<h3>` before an `<h2>`, exactly one
  `<h1>` per page/route.
- Landmarks present where appropriate: `<main>`, `<nav>`, `<header>`,
  `<footer>`, `<aside>`.
- Lists use `<ul>` / `<ol>` / `<li>`, not styled divs.

#### b) Names & labels

- All `<img>` have `alt` (empty `alt=""` is fine for decorative images, but
  decorative-ness must be obvious from context).
- All form inputs have an associated `<label>` (via `htmlFor`/`id` or by
  wrapping), or `aria-label` / `aria-labelledby`.
- Icon-only buttons have an accessible name (`aria-label`, visually-hidden
  text, or `title` as last resort).
- `aria-label` is not redundant with visible text.

#### c) ARIA correctness

- Don't combine `role` with native semantics (`<button role="button">` is
  wrong but harmless; `<a role="button">` without keyboard handling is a
  Blocker).
- `aria-*` attributes reference IDs that exist.
- `aria-hidden="true"` is not on focusable elements.
- Live regions (`aria-live`) are used sparingly and on stable containers.

#### d) Focus management

- Custom interactive components are reachable by Tab (`tabIndex={0}` where
  needed, never positive `tabIndex` values).
- Modals/dialogs trap focus and restore it on close. If the project uses
  Radix or shadcn's `Dialog`, that's handled; flag bespoke modals.
- Focus is visible: components don't `outline: none` without a replacement
  focus ring.
- Route changes move focus to the new page's heading or main landmark.

#### e) Color contrast

- Static text classes/colors meet WCAG AA: 4.5:1 for body, 3:1 for large
  text (18pt+ or 14pt+ bold). Spot-check the diff's color combinations
  against the project's token palette.
- Don't rely on color alone: error states pair color with an icon or text.
- Note that you can't compute exact contrast from code alone — flag
  suspicious combos and suggest the user run a contrast checker or the
  Storybook a11y addon.

#### f) Keyboard navigation

- All interactive behavior reachable without a mouse: keyboard handlers
  alongside any `onClick` on non-button elements.
- `Esc` closes modals/menus; arrow keys navigate menus/tabs/listboxes per
  the WAI-ARIA Authoring Practices.
- Skip-to-content link present on multi-section pages.

### 4. Report

```markdown
## A11y audit — <N> file(s) reviewed

**Scope:** <one line>
**Tooling detected:** <axe-core | storybook a11y addon | none — manual pass>
**Suggested next step:** <run "npm test:a11y" | open Storybook a11y tab | none>

### Findings

#### 🔴 Blockers (<count>)
- `path/to/file.tsx:42` — <issue + WCAG criterion, e.g. "div used as button (2.1.1 Keyboard)">. Suggested: <fix>.

#### 🟡 Major (<count>)
- ...

#### 🟢 Minor (<count>)
- ...

### Summary

<2–3 sentences: overall verdict, the highest-leverage fix, anything notable
that went well.>
```

If a dimension has zero findings, omit it from the bullets.

### Severity guide

- **🔴 Blocker** — Violates WCAG 2.1 AA on a critical path: keyboard
  inaccessibility, missing names on form inputs, divs used as buttons, focus
  traps that don't release.
- **🟡 Major** — Probable a11y bug that needs hands-on verification: suspect
  contrast, missing landmark, ARIA misuse that won't crash but degrades AT
  experience.
- **🟢 Minor** — Defensive improvements: redundant `aria-label`, missing
  `lang` attribute, heading-level nits.

## Boundaries

- **Never edit files.** Audit only.
- **Never run the project's test suite** unless the user explicitly asks.
- **Don't claim contrast pass/fail** with certainty from code alone — flag
  suspects and recommend a real check.
- If the project has axe-core wired up, recommend running it rather than
  duplicating its work; focus the manual pass on things axe can't catch
  (focus management on route change, keyboard semantics on custom widgets).
