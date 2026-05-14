---
description: Scaffold a new component following the project's conventions (file casing, test/story patterns, component library).
argument-hint: <ComponentName> [target-dir] [-- short description]
---

Run the `component-scaffold` skill.

- **Component name:** `$1` (required, PascalCase).
- **Target directory:** `$2` (optional).
- **Description:** everything after a `--` separator in `$ARGUMENTS`
  (optional).

If `$1` is empty or not a valid PascalCase identifier, ask the user once
for the component name before proceeding.

Return the skill's documented report format verbatim.
