// @component: LoginForm
// @category: form
// @description: Email + password sign-in with inline validation, remember-me, forgot-password and sign-up links. Pending state on submit.
// @keywords: form, login, signin, auth, password, email, remember
// @complexity: medium

import { useState } from "react";
import type { FormEvent } from "react";

export interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; remember: boolean }) => void | Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  title?: string;
  showRemember?: boolean;
  className?: string;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  title = "Sign in",
  showRemember = true,
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPending(true);
    try {
      await onSubmit({ email: email.trim(), password, remember });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Sign-in failed." });
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
          <label htmlFor="login-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && (
            <p id="login-email-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-medium">
              Password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Forgot password?
              </button>
            )}
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.password && (
            <p id="login-password-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        {showRemember && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
            />
            <span>Remember me</span>
          </label>
        )}

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
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </div>

      {onSignUp && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="rounded-sm font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );
}

export const demos: Record<string, LoginFormProps> = {
  default: {
    onSubmit: async () => {},
    onForgotPassword: () => {},
    onSignUp: () => {},
  },
};
