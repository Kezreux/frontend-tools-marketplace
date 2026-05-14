---
description: Generate frontend code from a natural-language intent. Runs the full auto-loop — load theme + rules, write code, self-review for theme/a11y/token violations, fix, return — up to 3 iterations.
argument-hint: "<intent — e.g. 'profile settings page with avatar, name, email, dark-mode toggle'>"
---

Invoke the `frontend-designer` subagent using the Task tool with
`subagent_type: frontend-power-tools:frontend-designer`.

If `$ARGUMENTS` is empty, ask the user once for the intent before
dispatching.

Prompt to send the subagent:

> Run the full frontend-designer loop. Intent: $ARGUMENTS.
>
> Follow the workflow documented in the `frontend-designer` skill:
>   1. Preflight (confirm src/styles/theme.ts exists).
>   2. Load CLAUDE.md, RULES.md, theme, and 2–3 nearby existing components.
>   3. Plan — print a 5-line preamble.
>   4. Write the files.
>   5. Self-review inline (token-lint + design-review + a11y-audit logic).
>   6. Auto-fix Blockers and Majors.
>   7. Loop 5–6 up to MAX_ITER = 3.
>   8. Return the documented report format. If MAX_ITER reached with
>      remaining Blockers/Majors, include the warning block.

Surface the subagent's output verbatim. Do not append your own summary —
the report from the subagent is the final response.
