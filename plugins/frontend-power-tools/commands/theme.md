---
description: Manage the active design theme — list, install, preview, or rollback. `/theme` alone lists; `/theme <name>` installs.
argument-hint: "[list | <name> | set <name> | preview [name] | rollback]"
---

Dispatch on the first argument `$1`.

## `$1` empty or "list"

Show all available themes:

1. Glob `${CLAUDE_PLUGIN_ROOT}/themes/*/theme.ts` (excluding `_theme.ts`).
2. For each, read the file and extract `name` and `description` from the
   `theme` object (the values are plain string literals — parse with a
   simple regex or just read the lines).
3. Check the host project's `CLAUDE.md` for a `## Theme` section to find
   the currently active theme (look for `**Active:** <Name>`).
4. Emit the catalog:

```markdown
## Available themes

| Theme       | Description                                                | Active |
| ---         | ---                                                        | ---    |
| Minimal     | <description>                                              | ←      |
| Editorial   | <description>                                              |        |
| ...         | ...                                                        |        |

Install: `/theme set <name>` (or just `/theme <name>`)
Preview: `/theme preview <name>`
Catalog: see `${CLAUDE_PLUGIN_ROOT}/themes/INDEX.md` for details.
```

The `Active` column only shows ← on the active row (or no marker at all
if no theme is active in this project).

## `$1` = "set" with `$2` matching a theme name

Resolve the theme name from `$2`, then invoke the `theme-install` skill
with that name. The skill does the full install workflow
(detect → dry-run → confirm → backup → write → verify → report). Surface
its output verbatim.

## `$1` matches a theme name directly (shorthand for `set <name>`)

Same as the `set` case, treating `$1` as the theme name. This is the
common path — `/theme minimal` installs Minimal.

Valid theme names are discovered from the directory list under
`${CLAUDE_PLUGIN_ROOT}/themes/`, not hardcoded.

## `$1` = "preview" with optional `$2`

Show a sample component using the theme's tokens. The user does not run
this code; it's a visual reference rendered as code blocks in this
response.

1. Resolve the theme name:
   - If `$2` is given → that theme
   - Else read the active theme from `CLAUDE.md`'s `## Theme` section
   - If still none → list available themes and ask which to preview
2. Load `${CLAUDE_PLUGIN_ROOT}/themes/<name>/theme.ts`.
3. Emit a single self-contained React + TypeScript component using
   Tailwind-style classNames (`bg-background`, `text-foreground`,
   `bg-primary text-primary-foreground`, etc.). The component exercises:
   - A card with `bg-card text-card-foreground border rounded-lg shadow-md`
   - Primary, secondary, and ghost buttons
   - A labeled input
   - An error message using `text-destructive`
   - A code block with `font-mono bg-muted`
   - Typography ladder: xs → 2xl
   - A border-only divider
   - Three boxes demonstrating `shadow-sm` / `shadow-md` / `shadow-lg`
4. Wrap the component twice — once at the top level (light), once inside
   a `<div className="dark">` (or whichever dark selector the project
   uses) — so the user sees both modes.
5. Show the code in your response inside a fenced code block. Do **NOT**
   write the preview file to disk.

End with the theme summary:

```
Theme: <Name>
Density: <density>  ·  Radius: <md>px  ·  Easing: <easing>
Sans: <font.sans>
Mono: <font.mono>
```

## `$1` = "rollback"

Restore files modified by `/theme set` from their `.pre-theme.bak`
copies.

1. Glob `**/*.pre-theme.bak` in the working tree (exclude `.git/` etc.).
2. If zero backups found, print "no rollback to perform — no
   `.pre-theme.bak` files exist" and stop.
3. List what will be restored:
   ```
   Will restore:
     tailwind.config.ts    ← tailwind.config.ts.pre-theme.bak
     app/globals.css       ← app/globals.css.pre-theme.bak
   Will also:
     - Remove `## Theme` section from CLAUDE.md (if present)
     - Delete src/styles/theme.ts (if marker comment confirms plugin authorship)
   Reply "apply" to proceed.
   ```
4. Wait for an explicit "apply". On confirm:
   - For each `.bak`, move it back over the live file.
   - Remove the `## Theme` section from CLAUDE.md (leave the rest of
     the file untouched).
   - Delete `src/styles/theme.ts` only if its first comment block
     contains "Installed by frontend-power-tools".
5. Report:
   ```
   ✓ Rolled back theme install.
   Files restored: N
   theme.ts removed: yes/no
   CLAUDE.md theme section removed: yes/no
   ```

## `$1` unrecognized

Print usage + the list of available theme directory names, then stop.

```
Unknown theme or action: $1

Usage:
  /theme                  list available themes
  /theme list             list available themes
  /theme <name>           install <name>
  /theme set <name>       install <name>
  /theme preview [name]   show a sample component using <name> (or active)
  /theme rollback         restore files from .pre-theme.bak

Available themes (discovered from ${CLAUDE_PLUGIN_ROOT}/themes/):
  <comma-separated list from the directory>
```
