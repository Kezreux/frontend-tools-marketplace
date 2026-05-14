// @component: TwoFactorForm
// @category: form
// @description: Six-digit (configurable) 2FA code input with monospace centered field, auto-submit on full code, resend link, and pending state.
// @keywords: form, 2fa, two factor, mfa, code, otp, verification, auth
// @complexity: medium

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

export interface TwoFactorFormProps {
  onSubmit: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  codeLength?: number;
  title?: string;
  description?: ReactNode;
  className?: string;
  /** Submit automatically once the code reaches `codeLength` digits. */
  autoSubmitOnComplete?: boolean;
}

export function TwoFactorForm({
  onSubmit,
  onResend,
  codeLength = 6,
  title = "Verify your account",
  description = "Enter the code we sent to your phone.",
  className,
  autoSubmitOnComplete = true,
}: TwoFactorFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const submittedRef = useRef(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value.replace(/\D/g, "").slice(0, codeLength);
    setCode(next);
    setError(null);
    if (autoSubmitOnComplete && next.length === codeLength && !submittedRef.current) {
      submittedRef.current = true;
      void submit(next);
    }
  }

  async function submit(value: string) {
    if (value.length !== codeLength) {
      setError(`Enter all ${codeLength} digits.`);
      submittedRef.current = false;
      return;
    }
    setPending(true);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code didn't match. Try again.");
      submittedRef.current = false;
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(code);
  }

  async function handleResend() {
    if (!onResend) return;
    setResending(true);
    setError(null);
    try {
      await onResend();
      setCode("");
      submittedRef.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't resend. Try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="tf-code" className="block text-sm font-medium">
            Verification code
          </label>
          <input
            id="tf-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={codeLength}
            required
            value={code}
            onChange={handleChange}
            disabled={pending}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "tf-code-error" : undefined}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-center font-mono text-2xl tracking-[0.5em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
          {error && (
            <p id="tf-code-error" role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending || code.length !== codeLength}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Verifying..." : "Verify"}
        </button>

        {onResend && (
          <p className="text-center text-sm text-muted-foreground">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="rounded-sm font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {resending ? "Resending..." : "Resend"}
            </button>
          </p>
        )}
      </div>
    </form>
  );
}

export const demos: Record<string, TwoFactorFormProps> = {
  default: {
    onSubmit: async () => {},
    onResend: async () => {},
  },
};
