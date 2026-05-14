// @component: SignupForm
// @category: form
// @description: Email + password + confirm + terms-acceptance with strength check, inline errors, and pending state.
// @keywords: form, signup, register, account, auth, password, email, terms
// @complexity: medium

import { useState } from "react";
import type { FormEvent } from "react";

export interface SignupFormProps {
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;
  onSignIn?: () => void;
  termsHref?: string;
  privacyHref?: string;
  title?: string;
  className?: string;
}

export function SignupForm({
  onSubmit,
  onSignIn,
  termsHref,
  privacyHref,
  title = "Create your account",
  className,
}: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    accepted?: string;
    form?: string;
  }>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Use at least 8 characters.";
    if (!confirm) next.confirm = "Confirm your password.";
    else if (confirm !== password) next.confirm = "Passwords don't match.";
    if (!accepted) next.accepted = "You must accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPending(true);
    try {
      await onSubmit({ email: email.trim(), password });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Sign-up failed." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && (
            <p id="signup-email-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "signup-password-error" : "signup-password-hint"}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.password ? (
            <p id="signup-password-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.password}
            </p>
          ) : (
            <p id="signup-password-hint" className="text-xs text-muted-foreground">
              At least 8 characters.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-confirm" className="block text-sm font-medium">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={errors.confirm ? true : undefined}
            aria-describedby={errors.confirm ? "signup-confirm-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.confirm && (
            <p id="signup-confirm-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.confirm}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              aria-invalid={errors.accepted ? true : undefined}
              aria-describedby={errors.accepted ? "signup-accepted-error" : undefined}
              className="mt-0.5 h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
            />
            <span className="text-muted-foreground">
              I agree to the
              {termsHref && (
                <>
                  {" "}
                  <a
                    href={termsHref}
                    className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
                  >
                    Terms
                  </a>
                </>
              )}
              {termsHref && privacyHref && " and "}
              {privacyHref && (
                <a
                  href={privacyHref}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
                >
                  Privacy Policy
                </a>
              )}
              .
            </span>
          </label>
          {errors.accepted && (
            <p id="signup-accepted-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.accepted}
            </p>
          )}
        </div>

        {errors.form && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </div>

      {onSignIn && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignIn}
            className="rounded-sm font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
}

export const demos: Record<string, SignupFormProps> = {
  default: {
    onSubmit: async () => {},
    onSignIn: () => {},
    termsHref: "#terms",
    privacyHref: "#privacy",
  },
};
