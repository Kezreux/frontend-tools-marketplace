# form

Five form presets covering the universal patterns: authentication
(login, signup, password reset), communication (contact), and user
management (profile).

| Preset | Best for | Complexity |
| --- | --- | --- |
| `LoginForm` | Auth — email + password sign-in, remember-me, forgot-password and sign-up links | Medium |
| `SignupForm` | Auth — email + password + confirm + terms-acceptance with min-length + match checks | Medium |
| `PasswordResetForm` | Auth recovery — single-email request with success state and back-to-login link | Simple |
| `ContactForm` | Communication — name + email + message (optional subject) with success state | Medium |
| `ProfileForm` | Settings — pre-filled name + email + bio (+ optional avatar URL) with dirty-state Save / Cancel | Medium |

All five follow the same patterns:

- **Controlled inputs** with `useState` per field.
- **Submit-time validation** (no per-keystroke noise). Failed fields get
  `aria-invalid="true"` + `aria-describedby` pointing at the error text.
- **Pending state** disables the submit button and shows a loading label
  ("Sending...", "Signing in..."). Prevents double-submits.
- **Success/done state** for one-shot forms (PasswordReset, Contact).
- **Form-level error** for failures from `onSubmit` (network errors, etc.)
  — rendered with `role="alert"`.
- **A11y**: every input labeled via `htmlFor`/`id`, `<form noValidate>`
  with custom JS validation, errors announced via `role="alert"`.
- **Token-only** styling: `bg-card`, `border-input`, `text-foreground`,
  `text-muted-foreground`, `text-destructive`, `ring-ring`, etc.

## Install

```
/component form LoginForm
/component form SignupForm
/component form ProfileForm
```

## Usage examples

### LoginForm

```tsx
import { LoginForm } from "@/components/form/LoginForm";

<LoginForm
  onSubmit={async ({ email, password, remember }) => {
    await api.signIn({ email, password, remember });
  }}
  onForgotPassword={() => router.push("/reset-password")}
  onSignUp={() => router.push("/signup")}
/>
```

### SignupForm

```tsx
import { SignupForm } from "@/components/form/SignupForm";

<SignupForm
  onSubmit={async ({ email, password }) => {
    await api.signUp({ email, password });
  }}
  onSignIn={() => router.push("/login")}
  termsHref="/terms"
  privacyHref="/privacy"
/>
```

### PasswordResetForm

```tsx
import { PasswordResetForm } from "@/components/form/PasswordResetForm";

<PasswordResetForm
  onSubmit={async (email) => {
    await api.requestPasswordReset(email);
  }}
  onBackToLogin={() => router.push("/login")}
/>
```

### ContactForm

```tsx
import { ContactForm } from "@/components/form/ContactForm";

<ContactForm
  onSubmit={async ({ name, email, subject, message }) => {
    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, subject, message }),
    });
  }}
  showSubject
/>
```

### ProfileForm

```tsx
import { ProfileForm } from "@/components/form/ProfileForm";

<ProfileForm
  initialValues={{
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  }}
  onSubmit={async (values) => {
    await api.updateProfile(values);
  }}
  onCancel={() => router.back()}
/>
```

## Validation policy

These presets **only** validate on submit. The rationale (from
`RULES.md` §11):

> Validate on blur, surface errors on submit. Don't validate per-keystroke
> unless the user explicitly asks.

If you need per-keystroke validation (e.g., "password strength meter"),
fork the component and lift the validation into an `onChange` handler.
