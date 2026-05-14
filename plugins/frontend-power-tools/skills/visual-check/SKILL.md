---
name: visual-check
description: Use when the user asks to "screenshot the UI", "visually check", "look at the page", or after a UI change is built and visual verification is needed. Boots the project's dev server, drives a browser via Playwright MCP (preferred) or local Playwright (fallback), screenshots the affected routes, and critiques the result against the design intent. Returns a written critique with screenshot references and suggested fixes.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Visual check

Orchestrates a screenshot → critique loop. Drives a real browser, captures the
UI under review, and compares it to the design intent inferred from the diff
and `CLAUDE.md`. Returns a structured critique.

## Inputs

- **Default:** the routes affected by `git diff` (inferred from changed
  files).
- **Override:** explicit route(s) the user names (e.g., `/dashboard`,
  `/settings/profile`).
- **Optional:** viewport(s) — default is `1280x800` desktop + `390x844`
  mobile. Override on user request.
- **Optional:** theme — default is "both" (light + dark) if the project
  supports dark mode; otherwise light only.

## Workflow

### 1. Detect the browser backend

Probe in this order:

1. **Playwright MCP** — try a Playwright MCP tool call (e.g.,
   `mcp__playwright__browser_navigate`). If it succeeds, use MCP for the
   whole session.
2. **Local Playwright** — check `package.json` for `playwright` or
   `@playwright/test`. If present, drive it via `Bash` with a small inline
   script.
3. **Neither** — stop and print:
   ```
   visual-check needs a browser backend. Install one of:
     • Playwright MCP:   claude mcp add playwright
     • Local Playwright: npm i -D playwright && npx playwright install chromium
   ```
   Do not attempt to install anything yourself.

### 2. Start the dev server

Detect the dev command from `package.json` `scripts`:

- Prefer `dev`, then `start`, then `serve`.
- Note any port hints in the script (`--port 3001`, `PORT=3001`).
- If no script matches, ask the user once for the command.

Run the dev server **in the background** (`run_in_background: true` on
Bash), capture its stdout, and poll the expected URL with `curl --silent
--fail` until it responds (max ~30s). If it never responds, abort with a
clear error.

Always **stop the dev server** at the end of the run (`KillShell` the
background id, or kill the PID you stored).

### 3. Identify routes to check

From the diff:

- For Next.js: changed files under `app/**/page.tsx` or `pages/**/*.tsx` →
  the corresponding routes.
- For React Router / TanStack Router: grep for the route definitions that
  import the changed components.
- For Vite/CRA SPAs without routing: use the home page.
- If a `# Routes affected` section is in the user's prompt, use those.

If no routes can be inferred, ask the user once which route(s) to check.

### 4. Capture & critique

For each `(route, viewport, theme)` combination:

1. Navigate to the URL.
2. Wait for network idle / a sensible selector (`document.body` or a known
   layout element).
3. Take a full-page screenshot. Save to `/tmp/visual-check/<timestamp>/<route-slug>-<viewport>-<theme>.png`.
4. **View the screenshot** (Read the PNG — it's a multimodal read) and
   critique against:
   - Diff intent: does the change look like what the code suggests it
     should look like?
   - Alignment, spacing rhythm against the project's spacing scale.
   - Color and contrast (light + dark).
   - Responsive behavior: does the mobile viewport collapse cleanly?
   - Visible bugs: layout overflow, clipped text, broken images, z-index
     stacking issues.
5. Note specific coordinates / regions where issues appear (e.g., "header,
   right edge").

### 5. Report

```markdown
## Visual check — <N> screenshot(s)

**Backend:** <Playwright MCP | local Playwright>
**Dev server:** <command + URL>
**Routes:** <list>
**Viewports:** <list>
**Theme(s):** <light | dark | both>

### Per-route findings

#### `<route>` — `<viewport>` — `<theme>`
*Screenshot: `/tmp/visual-check/.../route-vp-theme.png`*

- 🔴 <Blocker observation>
- 🟡 <Major observation>
- 🟢 <Minor observation>

(repeat per combo)

### Summary

<2–3 sentences: overall verdict, the most striking issue, recommended next
move (e.g., "fix X then re-run visual-check").>
```

Skip "no findings" sections rather than printing empty bullets.

## Boundaries

- **Never commit or modify project files** during a visual check. This is
  a read-only inspection.
- **Always tear down** the background dev server before returning.
- **Don't fabricate observations** — every critique line must be tied to
  something you actually saw in a screenshot.
- **Don't reinstall dependencies** or change the project's package.json to
  enable Playwright. If the backend isn't available, instruct and stop.
- If the dev server fails to start (port conflict, build error, missing
  env vars), surface the server's stderr verbatim and stop — don't
  guess-and-retry.
