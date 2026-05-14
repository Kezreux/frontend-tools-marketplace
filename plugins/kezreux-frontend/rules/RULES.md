# kezreux-frontend — Rules

The opinionated ruleset every audit skill (`design-review`, `a11y-audit`,
`token-lint`, `component-scaffold`) and the `/build` orchestrator enforces.

**Source priority** when generating or auditing:

1. The host project's `CLAUDE.md` — explicit project overrides (always win).
2. **This file** — the plugin's canonical defaults.
3. The active theme at `src/styles/theme.ts` for token values.
4. Tailwind config for legal class names.

If `CLAUDE.md` says "we use default exports here", that overrides the
relevant rule below. Otherwise, every rule here is mandatory.

---

## 1. React + TypeScript

- **Functional components only.** No class components.
- **Typed props.** Every component declares a named
  `interface <Name>Props` or `type <Name>Props` — never inline,
  never `any`.
- **Named exports** for components. Default exports allowed only for
  framework-required files (Next.js `page.tsx`, `layout.tsx`,
  `loading.tsx`, `error.tsx`).
- **No `any`.** Use `unknown` at boundaries (`JSON.parse`, fetch
  responses, event payloads with unknown shape), then narrow.
- **`strict: true` in `tsconfig.json`.** If the project disables strict,
  flag it as a Blocker.
- **No `enum`.** Use string unions: `type Status = "idle" | "ok" | "fail"`.
- **No `React.FC`.** Type components as `function Foo(props: FooProps)`.
- **`forwardRef` only when forwarding to a DOM node** for imperative
  APIs. Otherwise prop-drill `ref` normally.

## 2. Component composition

- **One component per file**, named `<Name>.tsx`. Subcomponents stay
  in-file only if trivial (< 30 lines) and used by the parent alone.
- **Size limit:** ≤ 150 lines per component file. Above that, split.
- **Prop count ≤ 7.** More than 7 props is a smell — extract
  subcomponents, accept `children`, or take a config object.
- **No prop drilling beyond 2 levels.** At 3+ levels, lift to context.
- **Slots over boolean flags.** `<Card><CardHeader>…</CardHeader></Card>`
  beats `<Card showHeader headerText="…">`.
- **`children` over render props.**

## 3. State management

- **`useState` for local state** — the default.
- **`useReducer` for ≥ 3 related fields** or when transitions matter
  (form state with submit/error/success, multi-step wizards).
- **Lift state only when actually shared.** Premature lifting is a
  code smell.
- **React Context** for cross-tree concerns (theme, auth, user). One
  context per concern; never merge unrelated state.
- **No Redux / Zustand / Jotai / Recoil** unless the host project
  already uses them. Stick to React primitives.
- **No module-scope mutable state.** `let counter = 0` outside a
  function is a Blocker.

## 4. Accessibility (WCAG 2.1 AA, minimum)

- **Semantic HTML always.** `<button>` for actions, `<a>` for navigation,
  `<input>` + `<label>` for forms, `<nav>` / `<main>` / `<header>` /
  `<footer>` / `<aside>` for landmarks.
- **`<div onClick>` is a Blocker** unless it has `role="button"`,
  `tabIndex={0}`, AND a paired `onKeyDown` checking Enter/Space.
- **`alt` on every `<img>`.** Empty `alt=""` only for decoration when
  it's contextually obvious.
- **Inputs are labeled** via `<label htmlFor>` (preferred), wrapping
  `<label>`, `aria-label`, or `aria-labelledby`.
- **Icon-only buttons have an accessible name** (`aria-label` or
  visually-hidden text).
- **Modals trap focus & restore it on close.** Use Radix or shadcn
  `Dialog` — never hand-roll a focus trap.
- **`Esc` closes modals/menus.**
- **Focus is visible** — no `outline: none` without a replacement
  focus ring (e.g. `focus-visible:ring-2`).
- **Heading outline is sensible.** No `<h3>` before `<h2>`; one `<h1>`
  per page/route.
- **Color is never the only signal** for state — pair with an icon
  or text.
- **Color contrast meets AA**: 4.5:1 for body text, 3:1 for large
  text (≥ 18pt or 14pt bold).

## 5. Responsive behavior

- **Mobile-first.** Base styles target mobile; breakpoint modifiers
  (`sm:`, `md:`, `lg:`) layer larger-screen behavior.
- **Every full-width surface has at least one breakpoint modifier.**
  A page wrapper with zero `sm:`/`md:` is a Blocker.
- **No fixed widths** (`w-[420px]`, `width: 420px`) on top-level
  containers. Use `max-w-*` + responsive padding.
- **Hero text scales** (`text-3xl md:text-5xl lg:text-6xl`-style
  ladder); body text uses one base size across breakpoints.
- **Tap targets ≥ 44 × 44 px** on mobile. Height OR vertical padding
  must produce this.

## 6. Design tokens

The active theme's tokens (`src/styles/theme.ts` after `/theme set`)
are the **only legal design values**. Specifically:

- **Zero hardcoded colors.** No `#fff`, `rgb(...)`, `hsl(...)`, or
  arbitrary Tailwind `text-[#fff]` / `bg-[rgb(...)]`. Use semantic
  tokens: `bg-background`, `text-foreground`,
  `bg-primary text-primary-foreground`, etc.
- **No raw px outside the spacing scale.** Tailwind arbitrary values
  (`p-[13px]`, `mt-[7px]`) are violations.
- **No magic `z-index`.** Use a documented z-layer scale (in the
  theme or CLAUDE.md).
- **No static inline styles** (`style={{ color: "red" }}`). Dynamic
  styles (`style={{ width: computedW }}`) are fine.
- **`cn()` (or `clsx` + `tailwind-merge`)** for any conditional
  className composition.

## 7. File & folder structure

```
src/
├── components/
│   ├── ui/                 # primitives (Button, Input, Card)
│   ├── forms/              # composite form components
│   └── layouts/            # page-level layouts
├── hooks/                  # custom hooks
├── lib/                    # utilities, cn(), formatters
├── styles/
│   ├── theme.ts            # installed by /theme set
│   └── globals.css         # tailwind + CSS vars
└── app/  or  pages/        # framework routes
```

- **One file per component**, `<Name>.tsx`.
- **Tests sibling-named**, `<Name>.test.tsx`.
- **Stories sibling-named**, `<Name>.stories.tsx`.
- **No barrel files** (`index.ts` re-exports) unless `CLAUDE.md`
  explicitly requests them — they hurt tree-shaking and go-to-def.

## 8. Naming conventions

- **PascalCase** for components and their files: `UserCard.tsx`
  exports `UserCard`.
- **camelCase** for variables, functions, hooks (`useUserCard`).
- **kebab-case** for non-component assets (`logo-dark.svg`).
- **Boolean props** start with `is` / `has` / `should`: `isLoading`,
  `hasError`, `shouldSubmit`. Not `loading` / `error` — those are
  data, not toggles.
- **Event props** start with `on`: `onClick`, `onChange`, `onSubmit`.
- **Handler functions** start with `handle`: `handleClick`,
  `handleSubmit`.
- **No abbreviations** in component names. `UserSettings`, not `UsrSet`.

## 9. Imports & module structure

- **Absolute imports** via path alias (`@/components/...`) when the
  project supports them. Otherwise relative.
- **Import order:**
  1. React + framework (`react`, `next/*`)
  2. External packages (alphabetized)
  3. Internal absolute (alphabetized)
  4. Internal relative (alphabetized)
  5. CSS / asset imports
- **`import type`** for type-only imports.
- **No circular imports.** A cycle is a Blocker.

## 10. Error handling

- **Async functions: return typed Result OR throw — never both.**
  Pick one pattern per file and stick to it.
- **API responses validated at the boundary** (Zod / Valibot if
  available; manual narrowing of `unknown` otherwise).
- **No swallowed errors.** Empty `catch {}` is a Blocker. Log,
  rethrow, or convert to a typed result.
- **Error boundaries wrap route-level components.** No silent
  fallbacks that paper over bugs.

## 11. Forms

- **Controlled inputs by default.** Uncontrolled only for one-shot
  submissions where the value is read once on submit.
- **Validate on blur, surface errors on submit.** Don't validate
  per-keystroke unless the user explicitly asks.
- **Disable submit while pending.** Prevent double-submit.
- **Errors are accessible:** `aria-invalid="true"` on the input plus
  `aria-describedby` pointing at the error text element.
- **Use the host project's form library** if one is installed
  (React Hook Form, Formik, TanStack Form). Don't add a new one.

## 12. Performance defaults

- **No premature `useMemo` / `useCallback`.** Add only when profiling
  shows a real cost.
- **`key={index}` is a smell.** Use stable IDs.
- **Virtualize lists at > 100 items** (TanStack Virtual / react-window).
- **Lazy-load route components** (`lazy(() => import(...))`).
- **No `useEffect` for derived state** — compute inline or with
  `useMemo` if profiling justifies it.
- **Server Components by default** in Next App Router. Mark
  `"use client"` only when interactivity is required.

## 13. Theming & dark mode

- **Every component must work in both light and dark modes.** Use
  semantic tokens (`bg-background`, `text-foreground`), not literal
  shadcn colors. Components that only work in light mode are a Blocker
  unless `CLAUDE.md` says "no dark mode".
- **No `bg-white` / `bg-black` / etc.** on application surfaces. Use
  `bg-background` / `bg-card`.
- **Dark-mode toggle uses the project's existing strategy** (`.dark`
  class on root, `data-theme="dark"`, etc.). Don't introduce a new
  strategy in a single component.

## 14. Comments & docstrings

- **Default to no comments.** Code is read more than written; clean
  names beat comments.
- **Comment only the non-obvious WHY** — a constraint, a workaround,
  a subtle invariant. Never comment what the code does.
- **No JSDoc on internal components.** TypeScript types are the doc.
- **Top-of-file comments only for installation-managed files**
  (`theme.ts` after `/theme set`, generated barrel files).
