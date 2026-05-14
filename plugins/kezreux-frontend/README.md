# kezreux-frontend

Claude Code plugin that adds frontend-design tooling: design reviews, a11y
audits, component scaffolding, visual checks, design-token linting, plus
formatting and typecheck hooks.

## How it adapts to your project

The plugin treats your project's `CLAUDE.md` as the source of truth for:

- **Design tokens** (colors, spacing scale, typography, radii, z-index layers)
- **Component library** (shadcn, Radix, MUI, custom)
- **Conventions** (file layout, naming, story/test patterns)

If `CLAUDE.md` doesn't specify these, the plugin assumes **React + Tailwind +
shadcn/ui** as defaults. You can override per-skill behavior by adding a
`## Frontend conventions` section to your `CLAUDE.md`.

## Components

### Skills

- **`design-review`** — Audits a diff or set of files against the project's
  design system: token usage, component-library compliance, naming, responsive
  behavior, dark-mode coverage.
- **`a11y-audit`** — Runs accessibility checks. Uses axe-core if the project
  has it; otherwise performs a WCAG 2.1 AA manual review.
- **`component-scaffold`** — Creates a new component following the project's
  conventions inferred from `CLAUDE.md` and surrounding code.
- **`visual-check`** — Boots the dev server, drives the browser via Playwright
  MCP (fallback: local Playwright), screenshots the affected routes, and
  critiques the result against design intent.
- **`token-lint`** — Scans for hardcoded design values: hex colors, raw px
  outside the spacing scale, magic z-indexes, inline styles.

### Subagents

- **`design-reviewer`** — Read-only context (`Read`, `Grep`, `Glob`, `Bash` for
  `git diff`). Invokes `design-review`. Returns a structured review without
  making edits.
- **`visual-reviewer`** — Has `Bash` + browser MCP. Invokes `visual-check`.
  Returns a written critique with suggested fixes.

### Slash commands

| Command | Behavior |
| --- | --- |
| `/design-review` | Delegates to `design-reviewer` subagent on the current `git diff` |
| `/a11y [path]` | Invokes `a11y-audit` on the diff or a path |
| `/component-new <name>` | Invokes `component-scaffold` |
| `/tokens` | Prints the project's tokens (from `CLAUDE.md` or detected sources) |
| `/visual-check` | Delegates to `visual-reviewer` subagent |

### Hooks

- **PostToolUse on Write/Edit** — Runs `prettier --write` + `eslint --fix` on
  changed `.ts`, `.tsx`, `.js`, `.jsx`, `.css` files. Skips cleanly if tools
  aren't installed.
- **PostToolUse on Write/Edit** — Runs `tsc --noEmit` on changed `.ts`/`.tsx`
  and surfaces errors back to Claude.
- **SessionStart** — If `CLAUDE.md` is missing, prints a one-line reminder to
  create one with design tokens and component-library info.

## Configuration

No configuration required. The plugin reads `CLAUDE.md` and detects the
project structure on every invocation.

## Versioning

This plugin follows semver. Breaking changes to skill behavior or hook
contracts will bump the major version.
