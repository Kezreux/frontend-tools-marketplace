---
description: Audit the current git diff against the project's design system. Delegates to the design-reviewer subagent (read-only — no edits).
argument-hint: [path-or-glob]
---

Invoke the `design-reviewer` subagent using the Task tool with
`subagent_type: design-reviewer`.

Prompt to send the subagent:

> Run a design review on the current change.
>
> Scope: if the user passed arguments, audit those paths instead of the diff.
> Arguments received: `$ARGUMENTS`.
>
> Follow the workflow documented in the `design-review` skill and return its
> documented report format verbatim.

Then surface the subagent's output to the user without modification — do not
add a preamble or summary.
