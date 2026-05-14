---
name: frontend-designer
description: Run the full frontend-design loop on a user-stated intent. Generates the implementation under the active theme + rules, auto-reviews for token, a11y, and design-system violations, fixes Blocker- and Major-severity findings, returns the final code. Invoked explicitly via `/build`. Does NOT auto-trigger on creation verbs in user prompts.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Write
  - Edit
---

# Frontend designer

A one-shot generator that produces clean, on-theme, accessible
React + TypeScript code from a natural-language intent. The user describes
what they want; this skill plans, writes, self-reviews, fixes, and returns
the result. **No manual intermediate approval.**

## Authority

Mandatory reading list, in priority order:

1. The host project's `CLAUDE.md` (deviations always win).
2. `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` (canonical opinionated rules).
3. `src/styles/theme.ts` (the active theme — the only legal token set).
4. The project's existing components (style-match anchors).

If `src/styles/theme.ts` does not exist, abort with:

> No theme installed. Run `/theme set <name>` first — the design loop
> requires a token contract to operate against.

## Inputs

- **intent** (required) — the user's natural-language description of what
  to build.
- **paths** (optional) — file or directory paths the user pointed at. If
  given, write inside those; otherwise infer from project layout.

## Termination

The loop terminates when **either**:

- (Blockers = 0) AND (Majors = 0) on the last review pass, **or**
- `MAX_ITER = 3` iterations have been executed.

If `MAX_ITER` is reached with remaining Blockers or Majors, surface them
in the final report — never silently accept broken output.

## Workflow

### 1. Preflight

Confirm preconditions:

- `src/styles/theme.ts` exists. If not → abort per Authority section above.
- `git status` is clean enough to write into (warn if there are unstaged
  changes that overlap the planned files; do not block).

### 2. Load context

Read in order:

1. `CLAUDE.md` (project overrides; "Frontend conventions", "Theme",
   "Component structure" sections).
2. `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` (full file, all 14 sections).
3. `src/styles/theme.ts` (the active theme — capture the name + all 19
   color tokens + spacing scale + radius + density).
4. **Style-match anchors:** glob for 2–3 nearby existing components
   (`src/components/**/*.tsx`). Pick ones structurally similar to what
   the intent suggests (e.g., for "settings page", grep for existing
   pages/forms). Read each to learn:
   - File casing (kebab vs PascalCase)
   - Export style (named vs default)
   - Whether `forwardRef` is used
   - Whether `cn()` / `clsx` / `tailwind-merge` is the className helper
   - Test/story sibling-file conventions
   - Imports style (absolute alias vs relative)

### 3. Plan

Before writing any code, emit a **5-line plan preamble** to the user:

```
## Plan

Intent:    <restate in your own words, one sentence>
Theme:     <active theme name from src/styles/theme.ts>
Will create:
  - src/components/<kind>/<Name>.tsx  (description)
  - src/components/<kind>/<Name>.test.tsx  (if project has a test runner)
  - <any other files>
Will modify:
  - <any wiring files>  (e.g., src/app/page.tsx to render the new component)
Constraints honored:
  - tokens from src/styles/theme.ts only
  - WCAG 2.1 AA (semantic HTML, labels, focus, keyboard)
  - mobile-first responsive
  - <density> density from the theme
```

Don't ask for confirmation — proceed to step 4. The plan is informational.

### 4. Write

Generate the planned files. Enforce these constraints on every line:

**Structure & TypeScript (RULES.md §1, §2, §7, §8)**

- Functional components only.
- Typed props: `interface <Name>Props` declared above the component, never
  inline.
- Named export of the component (default export only for framework-required
  files).
- `forwardRef` only when forwarding to a DOM node.
- One file per component; size ≤ 150 lines.
- File and component name match exactly.
- Boolean props prefixed `is` / `has` / `should`.

**Tokens & styling (RULES.md §6, §13)**

- Use ONLY tokens from `src/styles/theme.ts`. Verbatim list:
  `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`,
  `bg-popover`, `text-popover-foreground`, `bg-primary`,
  `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`,
  `bg-muted`, `text-muted-foreground`, `bg-accent`,
  `text-accent-foreground`, `bg-destructive`,
  `text-destructive-foreground`, `border-border`, `border-input`,
  `ring-ring`.
- **No** hardcoded hex / `rgb(…)` / arbitrary Tailwind `text-[#…]`.
- **No** raw px outside the theme's spacing scale (no `p-[13px]` etc.).
- **No** static inline color styles (`style={{ color: ... }}`).
- **No** literal `bg-white` / `bg-black` / `text-white` / `text-black` on
  application surfaces — use semantic tokens so dark mode works.
- Use `cn()` / `clsx` for any conditional class composition (detect
  which the project uses; fall back to template literals if neither).

**A11y baseline (RULES.md §4)**

- Semantic HTML always (`<button>`, `<a>`, `<input>` + `<label>`).
- Every image has `alt`. Every input has a label association.
- Icon-only buttons get `aria-label`.
- Focus ring visible (`focus-visible:ring-2 ring-ring`).
- Heading outline is sensible.
- Keyboard handlers paired with click handlers on non-button interactives.

**Responsive (RULES.md §5)**

- Mobile-first. Every full-width surface has at least one `sm:` or `md:`
  breakpoint modifier.
- No fixed widths on top-level wrappers (`max-w-*` instead).
- Tap targets ≥ 44px (`h-11` or `py-3`).

**Prefer existing primitives.** If the project has `src/components/ui/`
populated (shadcn-style), use those over hand-rolled markup. Check
which exist via Glob before writing.

### 5. Self-review (inline; do NOT dispatch subagents)

Apply three audit workflows IN ORDER on the files just written/modified.
Use the skill *logic* — do not invoke design-reviewer / visual-reviewer
subagents (that would recurse).

#### a. token-lint pass

For each new/modified file:

- Grep for hardcoded color patterns: `#[0-9a-fA-F]{3,8}`, `rgb(`, `rgba(`,
  `hsl(` (exclude comments).
- Grep for Tailwind arbitrary px: `\b(p|m|gap|w|h|top|right|bottom|left|inset)-\[\d+px\]`.
- Grep for literal color classes on app surfaces: `bg-white`, `bg-black`,
  `text-white`, `text-black`.
- Grep for static inline styles: `style=\{\{[^{}]*"[^"]*"`.
- Check Tailwind arbitrary z-index: `z-\[\d+\]`.

Categorize hits:
- **Blocker**: literal color on app surface (dark-mode breaker), hardcoded hex.
- **Major**: arbitrary px, magic z-index, static inline style.
- **Minor**: anything else borderline.

#### b. design-review pass

Apply the `design-review` workflow on the new files:

- Token usage (every color/spacing/radius/shadow must match the theme).
- Component-library compliance (existing `src/components/ui/*` primitives
  used where applicable).
- Naming (PascalCase files, named exports, boolean prop prefixes).
- Responsive behavior (sm/md breakpoints, no fixed widths).
- Dark-mode coverage (uses semantic tokens, no light-only colors).

#### c. a11y-audit pass

Apply the `a11y-audit` workflow on the new UI files:

- Semantic HTML (no `<div onClick>` without role+tabIndex+keyboard).
- Labels on inputs.
- Names on icon-only buttons.
- Focus visibility.
- Heading outline.
- Color-not-sole-signal.

Aggregate all findings into one list keyed by `file:line` with severity
(Blocker / Major / Minor).

### 6. Auto-fix

For each finding at **Blocker or Major** severity:

- Apply a targeted `Edit` to the offending file.
- Track in a fix log (file, line, before/after).

**Minor** findings: list but do not modify. They become a "remaining
minors" section in the final report so the user can triage them.

### 7. Loop

Increment `iter`. If `iter < MAX_ITER` (3) AND there were Blockers/Majors
fixed in step 6 → return to step 5 and re-review only the files
modified in step 6.

If `iter == MAX_ITER` OR no Blockers/Majors remained → fall through to
step 8.

### 8. Report

Emit exactly this structure:

```markdown
## Built: <one-line intent restatement>

**Theme:** <Name>  ·  **Iterations:** <iter>

**Files written:**
- `<path>` (<lines> lines, new)
- `<path>` (<lines> lines, modified)

**Auto-fixed during the loop:**
- 🔴 <count> Blockers
- 🟡 <count> Majors

**Remaining minors (user to triage):**
- `<file>:<line>` — <description>
- ...

**Next:**
- Open the new files and skim them.
- Run `/design-review` for an independent audit (read-only subagent).
- Run `/a11y` for an independent a11y check.
- Run `/visual-check` to screenshot the result and critique visually.
```

If `MAX_ITER` was reached with remaining Blockers or Majors, add a
prominent warning block above the report:

```markdown
> ⚠️ MAX_ITER (3) reached with remaining higher-severity findings.
> The output is the best the loop could produce; review carefully
> before shipping.
>
> Remaining Blockers: <list>
> Remaining Majors:   <list>
```

## Boundaries

- **Do not introduce new dependencies.** No `npm install`. If a primitive
  isn't in the project, hand-roll it; do not pull in shadcn / Radix /
  Headless UI on the fly.
- **Do not modify files outside the planned set.** If wiring is needed
  (e.g., adding a route to a layout), include it in the plan preamble.
- **Do not invoke `design-reviewer` or `visual-reviewer` subagents.**
  The design-review and a11y-audit *logic* applies inline. Nesting
  subagents would recurse contexts and slow the loop.
- **Do not run the dev server.** Visual verification is `/visual-check`'s
  job, run separately after `/build` completes.
- **Do not commit.** This is a code generator, not a release tool.
- **Cap iterations at 3.** Never loop forever — surfacing remaining
  issues is better than infinite churn.
- **Never silently accept broken output.** If MAX_ITER reached with
  Blockers, the warning block above must appear.
