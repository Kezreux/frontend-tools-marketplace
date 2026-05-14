# frontend-tools-marketplace

A private Claude Code plugin marketplace housing **`frontend-power-tools`** — a
bundle of skills, subagents, slash commands, and hooks that turn Claude Code
into a stronger collaborator for frontend design and development work.

## Install

In any project on any machine where Claude Code is set up:

```text
/plugin marketplace add Kezreux/frontend-tools-marketplace
/plugin install frontend-power-tools@frontend-tools-marketplace
```

To test changes locally before pushing to GitHub, point the marketplace at the
checkout instead:

```text
/plugin marketplace add /absolute/path/to/frontend-tools-marketplace
/plugin install frontend-power-tools@frontend-tools-marketplace
```

## What's inside

See `plugins/frontend-power-tools/README.md` for the full feature list and
per-component docs.

| Component | Highlights |
| --- | --- |
| Skills | `design-review`, `a11y-audit`, `component-scaffold`, `visual-check`, `token-lint` |
| Subagents | `design-reviewer` (read-only), `visual-reviewer` (browser-driving) |
| Commands | `/design-review`, `/a11y`, `/component-new`, `/tokens`, `/visual-check` |
| Hooks | Auto-format & typecheck on save, CLAUDE.md reminder on session start |

## Design philosophy

The plugin is opinionated but **framework-agnostic**: skills read the host
project's `CLAUDE.md` as the source of truth for design tokens, component
library, and conventions. When `CLAUDE.md` is silent, the defaults assume
React + Tailwind + shadcn/ui.

## Local development

Iterate on the plugin without publishing to GitHub by pointing the
marketplace at this directory:

```text
/plugin marketplace add /absolute/path/to/frontend-tools-marketplace
/plugin install frontend-power-tools@frontend-tools-marketplace
```

After editing a skill, subagent, command, or hook, refresh:

```text
/plugin marketplace update frontend-tools-marketplace
```

To uninstall and start clean:

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
    skills/<name>/SKILL.md   # one directory per skill
    agents/<name>.md         # subagent definitions
    commands/<name>.md       # slash commands (/<name>)
    hooks/
      hooks.json             # hook bindings
      scripts/*.sh           # hook wrapper scripts
```

### Releasing

1. Bump `plugins/frontend-power-tools/.claude-plugin/plugin.json` `version`.
2. Bump `.claude-plugin/marketplace.json` `metadata.version`.
3. Commit, tag, push. Consumers pick up the change on their next
   `/plugin marketplace update`.

## License

Private — not yet published for external use.
