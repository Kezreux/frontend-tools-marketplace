# form

Ten form presets organized into four subcategories. Pick by subcategory
when browsing, or install by name directly (the shorthand
`/component form LoginForm` works because names are globally unique).

## auth — authentication flows

| Preset | Complexity | Best for |
| --- | --- | --- |
| `LoginForm` | medium | Email + password sign-in, remember-me, forgot-password and sign-up links |
| `SignupForm` | medium | Email + password + confirm + terms with min-length + match validation |
| `PasswordResetForm` | simple | Single-email request → success state → back-to-login |
| `TwoFactorForm` | medium | 6-digit (configurable) OTP entry, auto-submit on full code, resend link |

## feedback — user input you collect

| Preset | Complexity | Best for |
| --- | --- | --- |
| `ContactForm` | medium | Name + email + (optional subject) + message → success state |
| `FeedbackSurvey` | medium | Star rating + optional comment → success state |

## settings — account management

| Preset | Complexity | Best for |
| --- | --- | --- |
| `ProfileForm` | medium | Editable name / email / bio / avatar URL with dirty-state Save/Cancel |
| `AccountSettings` | complex | Change-password + danger-zone delete with typed confirmation |

## search — finding and filtering

| Preset | Complexity | Best for |
| --- | --- | --- |
| `SearchBox` | simple | Controlled search input with icon, clear button, optional submit-on-Enter |
| `FilterPanel` | medium | Side-panel filter with status checkboxes + sort radios + reset/apply |

## Patterns shared across all 10

- **Controlled inputs** with `useState` per field.
- **Submit-time validation** only — no per-keystroke noise (per RULES.md §11).
- Failed fields get `aria-invalid="true"` + `aria-describedby` pointing at
  error text rendered with `role="alert"`.
- **Pending state** disables the submit button and changes its label
  ("Saving...", "Signing in...").
- **Success / done state** for one-shot forms (`PasswordResetForm`,
  `ContactForm`, `FeedbackSurvey`).
- **Form-level error** for `onSubmit` failures (network etc.), surfaced
  with `role="alert"`.
- **Token-only styling**: `bg-card`, `border-input`, `text-foreground`,
  `text-muted-foreground`, `text-destructive`, `ring-ring`, etc.
- **No external imports beyond `react`** — components drop into any
  React + Tailwind project as-is.

## Install

```text
/component form auth LoginForm           # explicit subcategory
/component form LoginForm                # shorthand — name is unique
/component form auth list                # list just the auth subcategory
/component preview FilterPanel           # show source without installing
```

The install command preserves the subcategory in the target path —
`form/auth/LoginForm.tsx` installs to `src/components/form/auth/LoginForm.tsx`
(or your project's detected convention).

## Usage examples

### LoginForm

```tsx
import { LoginForm } from "@/components/form/auth/LoginForm";

<LoginForm
  onSubmit={async ({ email, password, remember }) => {
    await api.signIn({ email, password, remember });
  }}
  onForgotPassword={() => router.push("/reset-password")}
  onSignUp={() => router.push("/signup")}
/>
```

### TwoFactorForm

```tsx
import { TwoFactorForm } from "@/components/form/auth/TwoFactorForm";

<TwoFactorForm
  onSubmit={async (code) => {
    await api.verify2FA(code);
  }}
  onResend={async () => {
    await api.resend2FA();
  }}
/>
```

### FeedbackSurvey

```tsx
import { FeedbackSurvey } from "@/components/form/feedback/FeedbackSurvey";

<FeedbackSurvey
  onSubmit={async ({ rating, comment }) => {
    await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
  }}
  description="Your feedback helps us improve."
/>
```

### AccountSettings

```tsx
import { AccountSettings } from "@/components/form/settings/AccountSettings";

<AccountSettings
  onChangePassword={async ({ currentPassword, newPassword }) => {
    await api.changePassword({ currentPassword, newPassword });
  }}
  onDeleteAccount={async () => {
    await api.deleteAccount();
    router.push("/goodbye");
  }}
  deleteConfirmationText="DELETE"
/>
```

### SearchBox

```tsx
import { useState } from "react";
import { SearchBox } from "@/components/form/search/SearchBox";

const [q, setQ] = useState("");

<SearchBox
  value={q}
  onChange={setQ}
  onSubmit={(value) => router.push(`/search?q=${encodeURIComponent(value)}`)}
  placeholder="Search docs..."
  hint="⌘K"
/>
```

### FilterPanel

```tsx
import { useState } from "react";
import { FilterPanel } from "@/components/form/search/FilterPanel";

const [filters, setFilters] = useState({ status: ["active"], sortBy: "newest" });

<FilterPanel
  filters={filters}
  onApply={(next) => {
    setFilters(next);
    refetch({ ...query, ...next });
  }}
/>
```
