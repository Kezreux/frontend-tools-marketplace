---
description: Initialize a fresh Vite + React + TS project for the plugin. Installs Tailwind v4, wires it into Vite, sets up the @/ path alias, and writes a starter CLAUDE.md. Idempotent — running twice is a no-op.
---

Invoke the `project-setup` skill. The skill handles:

1. Preflight — confirm a Vite + React project exists in the working dir.
2. Detect existing setup (Tailwind v3/v4 status, path alias, components dir).
3. Print a dry-run plan and ask for "apply / abort".
4. Backup files about to be modified to `*.pre-setup.bak`.
5. Install Tailwind v4 + the Vite plugin.
6. Wire Tailwind into `vite.config.ts`, add `@/` path alias to
   `tsconfig.json`, create `src/styles/globals.css` and `src/components/`,
   write a starter `CLAUDE.md` if absent.
7. Verify with `npx vite build`; restore from backups if it fails.
8. Report next steps (`/theme set`, `/component`).

Surface the skill's output verbatim. The "apply" prompt is the ONLY
confirmation point — everything after is automated.

## Boundaries

- Vite only in v0.3. Next.js / CRA / Remix support is a later release.
- The user should already have run `npm create vite@latest -- --template react-ts`
  and be inside the project directory.
