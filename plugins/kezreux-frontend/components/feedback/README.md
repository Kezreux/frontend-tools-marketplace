# feedback

Five system-feedback presets: things that tell the user what's happening,
went wrong, or just completed.

| Preset | Best for | Complexity |
| --- | --- | --- |
| `Modal` | Confirmations, destructive actions, multi-step flows | complex |
| `Toast` | Transient success/error notifications | medium |
| `AlertBanner` | Persistent inline alerts (warning banners, info blocks) | medium |
| `EmptyState` | Empty lists, dashboards with no data, no-results pages | simple |
| `LoadingSpinner` | In-flight async operations | simple |

All five:

- Use only semantic theme tokens (`bg-popover`, `text-destructive`,
  `border-accent`, etc.) — no hardcoded colors.
- Are accessible: `Modal` traps focus + locks body scroll + closes on
  ESC; `Toast` uses `role="status"` (or `alert` for errors) with
  appropriate `aria-live`; `AlertBanner` and `EmptyState` use semantic
  roles.
- Are self-contained — zero imports beyond `react`.

## Install

```
/component feedback Modal
/component feedback Toast
/component feedback AlertBanner
```

## Modal — focus + scroll + ESC handling

`Modal` is the heaviest preset in this category. It:

- Locks body scroll while open.
- Focuses the close button on open, restores focus to the previous
  element on close.
- Closes on `Esc` and (by default) clicking the backdrop.
- Has `role="dialog"`, `aria-modal="true"`, and labelled by the title.
- Supports two action buttons (primary + secondary, each with optional
  variant) and a flexible `children` body slot.

```tsx
import { useState } from "react";
import { Modal } from "@/components/feedback/Modal";

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Delete</button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This action is permanent."
  primaryAction={{ label: "Delete", variant: "destructive", onClick: handleDelete }}
  secondaryAction={{ label: "Cancel", variant: "secondary", onClick: () => setOpen(false) }}
/>
```

## Toast — controlled state, optional auto-dismiss

`Toast` is a single instance that you control. For a queue of toasts,
wrap multiple `Toast`s in a `ToastProvider`-style container (out of
scope for this preset).

```tsx
const [show, setShow] = useState(false);

<button onClick={() => setShow(true)}>Save</button>

<Toast
  open={show}
  onClose={() => setShow(false)}
  message="Profile updated"
  variant="success"
  duration={3000}
/>
```

## AlertBanner — persistent inline alert

Use for content that stays in the page (unlike `Toast`). 4 variants
(`info`, `success`, `warning`, `error`) with matching SVG icons. Supports
an optional inline action button and dismiss button.

## EmptyState + LoadingSpinner — placeholders

Drop-in fillers for empty/loading states. Both centered and styled to
sit comfortably in a card or page region.
