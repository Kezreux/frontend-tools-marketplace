# frontend-tools-marketplace

A Claude Code plugin marketplace that ships **`frontend-power-tools`** — skills,
subagents, slash commands, and hooks for frontend design and development work.

> **v0.2.0-beta.1** adds a **theme system** (7 preset themes with full install
> via `/theme set <name>`) and a **canonical rules engine** that every audit
> skill enforces. The auto-loop orchestrator (`/build "intent"`) lands in
> v0.2.0 final. Install with `/plugin marketplace update`; see
> *What's new* below the install instructions.

## What it does

- **Audits your UI changes** against the project's design system (tokens,
  component library, dark mode, responsive behavior, accessibility) before
  you ship.
- **Drives a real browser** to screenshot UI changes and critique what it
  sees, so Claude isn't reviewing UI work blind.
- **Scaffolds new components** that match your project's existing
  conventions — file casing, test/story patterns, the actual component
  library you use, not whatever Claude defaults to.
- **Lints design tokens** to catch hardcoded hex colors, magic spacing
  values, and rogue z-indexes.
- **Formats and typechecks** every edit, surfacing TypeScript errors back
  to Claude so it self-corrects mid-flight.

Everything is **framework-agnostic** — the plugin reads your project's
`CLAUDE.md` for stack-specific rules. React + Tailwind + shadcn/ui is the
fallback when `CLAUDE.md` is silent.

## Install

In any project on any machine where Claude Code is configured:

```text
/plugin marketplace add Kezreux/frontend-tools-marketplace
/plugin install frontend-power-tools@frontend-tools-marketplace
/reload-plugins
```

The third command is **critical** — the marketplace registers the plugin,
but `/reload-plugins` is what actually binds the slash commands, skills,
subagents, and hooks into your session.

Verify with `/tokens` — it should print your project's design tokens (or the
Tailwind + shadcn fallback if no `CLAUDE.md` is present).

## What's new in v0.2.0-beta.1

- **Theme system** — 7 preset themes (Minimal, Editorial, Brutalist, Soft,
  Playful, Rustic, Industrial), each defined as a strict machine-readable
  spec covering colors, typography, spacing, radius, shadows, density,
  animation, and iconography. See `plugins/frontend-power-tools/themes/INDEX.md`
  for the catalog. Install one with `/theme set <name>` — the install detects
  your framework, backs up modified files, writes `src/styles/theme.ts` +
  CLAUDE.md section + tailwind config merge + CSS vars, and verifies. Revert
  any time with `/theme rollback`.
- **Canonical rules engine** — `plugins/frontend-power-tools/rules/RULES.md`
  is now the source of truth for 14 sections of opinionated rules (React+TS,
  composition, state, a11y, responsive, tokens, file structure, naming,
  imports, error handling, forms, performance, theming, comments). Every
  audit skill loads it on invocation. Your project's `CLAUDE.md` is the
  deviation layer — overrides always win.
- **Auto-loop orchestrator (`/build "intent"`)** — coming in v0.2.0 final.

## Commands

| Command | What it does |
| --- | --- |
| `/theme [list \| <name> \| set <name> \| preview [n] \| rollback]` | Manage the active theme. `/theme` alone lists; `/theme <name>` installs the named theme with backup-restore safety; `/theme preview <name>` shows sample component code; `/theme rollback` restores `.pre-theme.bak` files. |
| `/design-review` | Audits the current `git diff` against your design system. Read-only; reports findings as Blockers / Majors / Minors with `file:line` citations. Runs in the `design-reviewer` subagent so it gets its own context window. |
| `/a11y [path]` | WCAG 2.1 AA accessibility audit. Defaults to the current diff; pass a path or glob to scope. Defers to `axe-core` if your project has it; otherwise does a structured manual pass. |
| `/component-new <Name> [target-dir]` | Scaffolds a new component. Detects existing file casing, test framework, Storybook presence, and re-export patterns — generates files that match. Falls back to React + Tailwind + shadcn/ui with `forwardRef` when no conventions are detected. |
| `/tokens` | Prints your project's design tokens (colors, spacing, typography, breakpoints, z-index layers). Reads `CLAUDE.md`, then `tailwind.config.{js,ts}`, then a dedicated tokens file. |
| `/visual-check [route]` | Boots your dev server, drives a browser, screenshots the affected routes, and critiques the result. Uses Playwright MCP if connected, falls back to local Playwright. |

## Skills that fire on their own

These skills auto-trigger when their description matches what you're asking:

- **`design-review`** — when you say "review my UI" or just finished a feature.
- **`a11y-audit`** — when you ask for an accessibility check.
- **`component-scaffold`** — when you say "create a Foo component".
- **`token-lint`** — when you ask to find hardcoded colors or magic numbers.
- **`visual-check`** — when you ask to screenshot or visually verify the UI.

You don't have to use the slash commands; the skills trigger contextually.

## Hooks

Automatic actions that fire on every Claude Code edit, no opt-in needed:

| Event | Trigger | Effect |
| --- | --- | --- |
| `PostToolUse` | Write/Edit/MultiEdit on `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.css`, `.scss`, `.json`, `.md`, `.html`, `.vue`, `.svelte` | Runs `prettier --write` and `eslint --fix` on the changed file. Silently no-ops if neither is installed. |
| `PostToolUse` | Write/Edit/MultiEdit on `.ts`, `.tsx` | Runs `tsc --noEmit --incremental` (30s timeout). If any errors mention the file just edited, surfaces them back to Claude as feedback so it can fix them in the same turn. |
| `SessionStart` | Once per session | If no `CLAUDE.md` exists in `./`, `./.claude/`, or `./docs/`, prints a one-line reminder for Claude to suggest the user create one. |

Hooks find `prettier` / `eslint` / `tsc` by probing `node_modules/.bin/` first,
then `npx --no-install`. They never install missing tools.

## Best results: configure your `CLAUDE.md`

The plugin reads your project's `CLAUDE.md` to learn what's idiomatic. The
more you put there, the sharper the reviews. A minimal but useful template:

```markdown
## Frontend conventions

- Framework: React 19
- Styling: Tailwind 4
- Component library: shadcn/ui
- File casing: PascalCase (`Button.tsx`)
- Export style: named only
- Test framework: vitest + @testing-library/react
- Storybook: yes

## Design tokens

- Colors: CSS variables in `app/globals.css` (`--primary`, `--background`, ...)
- Spacing scale: Tailwind default + custom `18` → 72px
- Z-layers: `dropdown` 1000 · `modal` 1300 · `toast` 1500
- Dark mode: `.dark` class on `<html>`, CSS-variable-driven

## Component structure

Components live in `src/components/ui/` (atoms) and `src/components/forms/`
(composites). Use `cn()` from `@/lib/utils` for className composition.
Use `forwardRef` for all primitive components.
```

The plugin will defer to whatever you specify. When `CLAUDE.md` is silent
or absent, it falls back to React + Tailwind + shadcn/ui defaults — the
reviews still work, but they're less project-aware.

## Example workflows

### Review after a feature

```text
You:    Build a settings page with a profile form and a dark-mode toggle.
Claude: <writes the code>
You:    /design-review
Claude: <delegates to design-reviewer subagent; returns 1 Blocker, 3 Majors, 2 Minors>
```

### Scaffold then audit

```text
You:    /component-new ProfileCard
Claude: <writes ProfileCard.tsx + .test.tsx + .stories.tsx matching your conventions>
You:    /a11y
Claude: <audits the new file against WCAG 2.1 AA>
```

### Token sweep

```text
You:    I think we've drifted from the design system. Lint the tokens.
Claude: <auto-triggers token-lint on src/; reports 14 hardcoded hex colors,
         6 raw px violations, 2 magic z-indexes — with suggested replacements>
```

### Visual feedback loop

```text
You:    I updated the dashboard layout. /visual-check
Claude: <starts dev server, screenshots /dashboard at desktop + mobile,
         light + dark; flags an overflow on mobile and a contrast issue
         in dark mode>
```

## Troubleshooting

**"Commands don't work" after install.** You skipped `/reload-plugins`. The
install registers the plugin in the marketplace cache; the reload binds it
into your session. Always run all three install commands.

**`Agent type '...' not found`.** Your local copy is on a plugin version
before the namespace fix. Run `/plugin marketplace update frontend-tools-marketplace`
then `/reload-plugins`.

**`/visual-check` says no browser backend is available.** Install one:

- Playwright MCP (recommended): `claude mcp add playwright`
- Local Playwright: `npm i -D playwright && npx playwright install chromium`

**Hooks fire but my files aren't reformatted.** Prettier or ESLint isn't
installed in the project. The hooks deliberately don't auto-install — add
them to your project (`npm i -D prettier eslint`) and the hooks will pick
them up on the next edit.

**TypeScript errors don't surface to Claude.** `typecheck-on-write.sh`
requires both `package.json` and `tsconfig.json` at the project root, plus
`tsc` reachable in `node_modules/.bin/` or via `npx --no-install`. Verify
with `npx tsc --version` in your project.

**SessionStart reminder fires in a monorepo subdir.** Known limitation —
the hook checks `./`, `./.claude/`, and `./docs/` only. Either add a
`CLAUDE.md` at the package root or open Claude Code from the monorepo root.

## Local development

Iterate on the plugin without publishing by pointing the marketplace at
this directory:

```text
/plugin marketplace add /absolute/path/to/frontend-tools-marketplace
/plugin install frontend-power-tools@frontend-tools-marketplace
/reload-plugins
```

After editing a skill, subagent, command, or hook:

```text
/plugin marketplace update frontend-tools-marketplace
/reload-plugins
```

To uninstall cleanly:

```text
/plugin uninstall frontend-power-tools@frontend-tools-marketplace
/plugin marketplace remove frontend-tools-marketplace
```

### Project layout

```
.claude-plugin/
  marketplace.json           # marketplace manifest
plugins/
  frontend-power-tools/
    .claude-plugin/
      plugin.json            # plugin manifest
    skills/<name>/SKILL.md   # one dir per skill
    agents/<name>.md         # subagent definitions
    commands/<name>.md       # slash commands (/<name>)
    hooks/
      hooks.json             # hook bindings
      scripts/*.sh           # hook wrapper scripts
```

### Releasing

1. Bump `plugins/frontend-power-tools/.claude-plugin/plugin.json` `version`.
2. Bump `.claude-plugin/marketplace.json` `metadata.version`.
3. Commit, tag, push. Consumers pick up the change with
   `/plugin marketplace update`.

## License

Private — not yet published for external use.
