---
description: Boot the dev server, screenshot the UI changes via Playwright, and critique the rendered result. Delegates to the visual-reviewer subagent.
argument-hint: [route-or-routes]
---

Invoke the `visual-reviewer` subagent using the Task tool with
`subagent_type: visual-reviewer`.

Prompt to send the subagent:

> Run a visual check on the current change.
>
> Routes: if the user passed arguments, treat them as the route(s) to
> screenshot (comma- or space-separated). Otherwise, infer the routes from
> the current diff.
> Arguments received: `$ARGUMENTS`.
>
> Follow the workflow documented in the `visual-check` skill (Playwright MCP
> preferred, local Playwright fallback) and return its documented report
> format verbatim. Tear down the dev server before returning.

Surface the subagent's output to the user without modification.
