// @component: PasswordResetForm
// @category: form
// @description: Single-email password reset request with inline validation, pending state, and a success message.
// @keywords: form, password, reset, forgot, recovery, auth, email
// @complexity: simple

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

export interface PasswordResetFormProps {
  onSubmit: (email: string) => void | Promise<void>;
  onBackToLogin?: () => void;
  title?: string;
  description?: ReactNode;
  successMessage?: ReactNode;
  className?: string;
}

export function PasswordResetForm({
  onSubmit,
  onBackToLogin,
  title = "Reset your password",
  description = "Enter your email and we'll send you a link to reset your password.",
  successMessage = "Check your inbox — we just sent you a reset link.",
  className,
}: PasswordResetFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onSubmit(email.trim());
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className={`mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      {done ? (
        <div className="mt-6 space-y-4">
          <p role="status" className="text-sm text-foreground">
            {successMessage}
          </p>
          {onBackToLogin && (
            <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Back to sign in
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "reset-email-error" : undefined}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && (
              <p id="reset-email-error" role="alert" className="text-xs font-medium text-destructive">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {pending ? "Sending..." : "Send reset link"}
          </button>

          {onBackToLogin && (
            <button
              type="button"
              onClick={onBackToLogin}
              className="block w-full rounded-sm text-center text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Back to sign in
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export const demos: Record<string, PasswordResetFormProps> = {
  default: {
    onSubmit: async () => {},
    onBackToLogin: () => {},
  },
};
