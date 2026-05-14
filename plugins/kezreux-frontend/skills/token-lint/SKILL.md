---
name: token-lint
description: Use when the user asks to "lint tokens", "find hardcoded colors", "check for magic numbers", or invokes `/tokens` for a sweep. Scans a file or directory for hardcoded design values that should be tokens — hex/rgb colors, raw px outside the spacing scale, magic z-indexes, static inline styles. Returns a structured violations list with suggested token replacements when possible. Read-only.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Token lint

Static scan for hardcoded design values — the kind of drift that erodes a
design system over time. Read-only; reports violations with suggested
replacements.

## Authority

Load the canonical rules from `${CLAUDE_PLUGIN_ROOT}/rules/RULES.md` on every
invocation — especially section 6 (Design tokens). The active theme at
`src/styles/theme.ts` defines the legal value set; anything outside that set
is a violation.

## Inputs

- **Default:** all frontend source under `src/` (or the project's source
  root if different). Skip `node_modules`, build output, the tokens file
  itself, and generated code.
- **Override:** a path, glob, or `git diff` scope if the user specifies.

## Workflow

### 1. Load the legal token set

Read in this order:

1. **`CLAUDE.md`** for a tokens section.
2. **Tailwind config** (`tailwind.config.{js,ts,mjs,cjs}`) — extract
   `theme.colors`, `theme.spacing`, `theme.zIndex`, `theme.extend.*`.
3. **A dedicated tokens file** if `CLAUDE.md` points to one or if a
   conventional path exists (`src/tokens.*`, `src/styles/tokens.*`,
   `app/globals.css` CSS variables).
4. **Fallback** (when none of the above): assume Tailwind's default scale
   plus the shadcn semantic tokens (`background`, `foreground`, `primary`,
   `muted`, `accent`, `destructive`, `border`, `input`, `ring`). Note the
   fallback in the report's preamble.

Cache the legal set in memory: list of color names/values, list of
spacing-scale step px values, list of allowed z-index layers.

### 2. Scan for violations

For each in-scope file, grep then read context lines:

#### a) Hardcoded colors

Pattern: `#[0-9a-fA-F]{3,8}` or `rgb(`, `rgba(`, `hsl(`, `hsla(`.

Exemptions:
- Comments (`//`, `/* */`).
- The tokens file itself.
- SVG / data URIs.
- Files explicitly excluded in `CLAUDE.md`.

For each hit, attempt to **suggest the nearest matching token** by hex
proximity to the legal palette. If no match is within ~10% delta, suggest
"add to tokens" instead.

#### b) Raw px outside the spacing scale

Patterns:
- CSS / inline: `(padding|margin|gap|top|right|bottom|left|width|height|min-\w+|max-\w+):\s*\d+px`
- Tailwind arbitrary values: `\b(p|m|gap|w|h|top|right|bottom|left|inset)-\[\d+px\]`

For each hit, check if the px value is in the legal spacing scale. If not,
suggest the nearest scale step.

Exemptions:
- `1px` borders (idiomatic).
- Hairlines / pixel-perfect alignment with a code comment explaining why.

#### c) Magic z-index

Patterns: `z-index:\s*\d+` or `\bz-\[\d+\]`.

Flag any value not in the legal z-layer scale. If the project has no
documented z-scale, flag every raw z-index as "no documented z-scale —
consider adding one to CLAUDE.md".

#### d) Static inline styles

Pattern: `style={{[^}]+}}` in JSX.

A finding is **only** raised if the style object contains string/number
literals (no variable references). Dynamic styles (`style={{ width: w }}`)
are fine and skipped.

#### e) Inline color in className (Tailwind arbitrary)

Patterns: `(bg|text|border|fill|stroke|from|via|to)-\[#[0-9a-fA-F]+\]`,
or with rgb()/hsl() inside brackets.

Always flag — these bypass the token layer entirely.

### 3. Report

```markdown
## Token lint — <N> file(s) scanned

**Token source:** <CLAUDE.md | tailwind.config | fallback>
**Files scanned:** <N>
**Violations:** <total count>

### By category

#### Hardcoded colors (<count>)
- `path/to/file.tsx:42` — `#3b82f6` → suggested `text-primary` (closest legal token).
- ...

#### Raw px outside spacing scale (<count>)
- `path/to/file.css:88` — `padding: 13px` → suggested `padding: 12px` (closest step).
- ...

#### Magic z-index (<count>)
- ...

#### Static inline styles (<count>)
- ...

#### Inline color in className (<count>)
- ...

### Summary

<1–2 sentences: scale of drift, hottest file(s), recommended cleanup
order.>
```

Omit a category if it has zero findings.

### Severity guide

`token-lint` doesn't use severity buckets — every violation is at the same
priority because the cumulative effect is what matters. Just report counts.

## Boundaries

- **Read-only.** Suggest replacements; never apply them.
- **Don't run as a hook on every save** — too noisy. It's an on-demand
  sweep, intended for periodic cleanup or before a design-system release.
- **Don't flag values inside test files or stories** unless the user asks —
  those are often intentionally hardcoded.
- If the legal token set is empty (no CLAUDE.md, no Tailwind config, no
  tokens file), still run with the fallback set but lead the report with
  a one-line note: "No project token source detected; held against
  Tailwind defaults + shadcn semantics."
