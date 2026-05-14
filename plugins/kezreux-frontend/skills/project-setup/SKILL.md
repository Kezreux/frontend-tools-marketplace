---
name: project-setup
description: Use when initializing a fresh React + TS project for `kezreux-frontend`. Installs Tailwind v4, wires it into Vite, sets up the `@/` path alias, creates `src/components/` and `src/styles/`, and writes a starter `CLAUDE.md`. Detects what's already there to avoid clobbering existing setup. Invoked via `/setup`.
allowed-tools:
  - Read
  - Glob
  - Bash
  - Write
  - Edit
---

# Project setup

Bootstraps a blank Vite + React + TypeScript project so the rest of
`kezreux-frontend` works out of the box. After `/setup`, the user can
immediately run `/theme set <name>` then `/component navbar <Name>` and
have a rendering page.

## Inputs

None. Operates on the current working directory.

## Preflight

1. Find `package.json` in the current directory. If absent:
   ```
   No package.json found. Create a Vite project first:
     npm create vite@latest -- --template react-ts
   Then cd into it and run /setup again.
   ```
2. Read `package.json` and confirm `react` is a dependency. If not, abort
   with the same hint (the plugin assumes React).

## Detect the existing setup

Probe in order; populate a setup descriptor:

| Signal | Inference |
| --- | --- |
| `vite.config.{ts,js,mjs}` exists | framework: **vite** |
| `next.config.*` exists | framework: **next** (v0.3 supports vite only; abort with a note) |
| `react-scripts` in deps | framework: **cra** (v0.3 supports vite only; abort with a note) |
| `tailwindcss` in deps | tailwind: **already installed** |
| `package.json` deps has `tailwindcss@^4` or `tailwindcss@latest` | tailwind: **v4** |
| `package.json` deps has `tailwindcss@^3` | tailwind: **v3 (legacy)** |
| `tailwind.config.{ts,js,mjs,cjs}` exists | tailwind: **configured** |
| `src/index.css` or `src/main.css` contains `@import "tailwindcss"` or `@tailwind base` | tailwind CSS: **set up** |
| `tsconfig.json` has `"paths": { "@/*": [...] }` | path alias: **set up** |
| `src/components/` exists | components dir: **present** |
| `CLAUDE.md` exists | claude.md: **present** |

If framework isn't `vite`, abort with:
```
v0.3 /setup currently supports Vite only. For Next.js or CRA, install
Tailwind manually and re-run /theme set. Next.js + CRA support coming
in a later release.
```

## Plan the changes

Build a concrete TODO list based on the detection. Print it as a
dry-run:

```
Project setup plan
==================
Detected: Vite + React + TS
Tailwind:    <not installed | v3 installed | v4 installed>
Path alias:  <missing | configured>
Components:  <missing | present>
CLAUDE.md:   <missing | present>

Will INSTALL:
  - tailwindcss@latest
  - @tailwindcss/vite

Will CREATE:
  - src/styles/globals.css         (with `@import "tailwindcss";`)
  - src/components/                (empty directory)
  - CLAUDE.md                      (starter — see below)

Will MODIFY (backed up to .pre-setup.bak first):
  - vite.config.ts                 (add Tailwind plugin + @/ alias)
  - tsconfig.json                  (add @/ path alias)
  - src/main.tsx                   (import ./styles/globals.css if not already)

Reply "apply" to proceed, "abort" to stop.
```

Skip any row that's already in place — if Tailwind v4 is already
installed, drop the install row. If the `@/` alias is already in
`tsconfig.json`, drop that modification.

Wait for an explicit "apply" before proceeding.

## Apply (in order, with backups)

### 1. Backup files about to be modified

For each file in the MODIFY list, copy `<path>` → `<path>.pre-setup.bak`
if no backup already exists.

### 2. Install dependencies

Run via Bash:

```bash
npm install -D tailwindcss@latest @tailwindcss/vite
```

If the project uses pnpm (`pnpm-lock.yaml` present) or yarn, use that
instead. Detect by lockfile.

### 3. Update vite.config.ts

Add the Tailwind plugin and the `@/` resolve alias. Preserve all
existing config:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Logic:
- If `tailwindcss` import already exists, skip adding it.
- If `@tailwindcss/vite` plugin is already in `plugins`, skip adding it.
- If `resolve.alias` already contains `@`, skip adding it.
- Read the current config as text, parse intent, splice in the missing
  pieces. Never blindly overwrite.

### 4. Update tsconfig.json

Merge into `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

If a separate `tsconfig.app.json` exists (newer Vite templates), merge
into THAT one instead — `tsconfig.json` may just reference it.

### 5. Create src/styles/globals.css

```css
@import "tailwindcss";
```

If `src/index.css` already exists with `@tailwind base` directives (v3
style), warn and offer to convert (do not auto-convert; leave it to
the user).

### 6. Update src/main.tsx

Ensure the new CSS is imported. The Vite default already imports
`./index.css` — if so, leave it alone (we'll have written
`src/styles/globals.css` separately; the user can decide which to use).

If neither `./index.css` nor `./styles/globals.css` is imported, add:

```ts
import "./styles/globals.css";
```

at the top of `main.tsx`.

### 7. Create src/components/

```bash
mkdir -p src/components
```

### 8. Write starter CLAUDE.md (only if absent)

```markdown
# <project name from package.json>

## Frontend conventions

- Framework: React + TypeScript + Vite
- Styling: Tailwind v4
- File casing: PascalCase (`Button.tsx`)
- Export style: named only
- Component library: kezreux-frontend presets — see `/component list`

## Component structure

Components live in `src/components/<category>/<Name>.tsx`.
Use the @/ import alias (e.g. `import { TopNavSimple } from "@/components/navbar/TopNavSimple"`).

Run `/theme set <name>` to pick a theme.
```

## Verify

After applying:

1. Run `npx vite build` (or the project's `build` script if defined).
2. If it fails, surface the error and restore from `.pre-setup.bak`.
3. If it succeeds, the project is ready.

For Vite specifically, a build failure is rare unless there's a real
TypeScript or syntax issue.

## Report

```
✓ Setup complete

Installed: tailwindcss, @tailwindcss/vite
Created:   src/styles/globals.css, src/components/, CLAUDE.md
Modified:  vite.config.ts, tsconfig.json, src/main.tsx
           (backups at *.pre-setup.bak)

Next:
  /theme set <minimal | editorial | brutalist | soft | playful | rustic | industrial>
  /component                       # list available presets
  /component navbar TopNavSimple   # install your first component

Restart `npm run dev` if it's already running.
```

## Boundaries

- **Vite only in v0.3.** Abort with a clear message for Next.js / CRA /
  Remix / unknown.
- **Never overwrite a .pre-setup.bak.** It represents the original state.
- **Never run `npm install` of anything other than `tailwindcss` and
  `@tailwindcss/vite`.** No surprise dependencies.
- **Never modify code outside the project root.** Read-only outside cwd.
- **If `verify` fails (build error), always restore from .bak** before
  reporting.
- **Detect already-set-up state.** Running `/setup` twice on the same
  project should be a no-op (or report "already set up").
