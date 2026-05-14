// @component: HeroWithForm
// @category: hero
// @description: Centered hero with title, subtitle, and an inline email signup form. Newsletter / waitlist style with success state.
// @keywords: hero, form, signup, email, waitlist, newsletter, subscribe
// @complexity: medium

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

export interface HeroWithFormProps {
  title: ReactNode;
  subtitle?: ReactNode;
  placeholder?: string;
  ctaLabel: string;
  successMessage?: ReactNode;
  /** Called with the email when the user submits. Return a promise to show a pending state. */
  onSubmit: (email: string) => void | Promise<void>;
  className?: string;
}

export function HeroWithForm({
  title,
  subtitle,
  placeholder = "you@example.com",
  ctaLabel,
  successMessage = "Thanks — you're on the list.",
  onSubmit,
  className,
}: HeroWithFormProps) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setPending(true);
    setError(null);
    try {
      await onSubmit(email.trim());
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      aria-labelledby="hero-title"
      className={`flex flex-col items-center justify-center bg-background px-4 py-16 text-center sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      <div className="w-full max-w-xl">
        <h1
          id="hero-title"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        )}

        {done ? (
          <p
            role="status"
            className="mt-8 text-sm font-medium text-foreground"
          >
            {successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:gap-2"
            noValidate
          >
            <label htmlFor="hero-email" className="sr-only">
              Email address
            </label>
            <input
              id="hero-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "hero-email-error" : undefined}
              className="h-11 flex-1 rounded-md border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {pending ? "Submitting..." : ctaLabel}
            </button>
          </form>
        )}

        {error && (
          <p
            id="hero-email-error"
            role="alert"
            className="mt-3 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export const demos: Record<string, HeroWithFormProps> = {
  default: {
    title: "Join the waitlist",
    subtitle: "Be the first to know when kezreux-frontend v1.0 ships.",
    placeholder: "you@company.com",
    ctaLabel: "Subscribe",
    onSubmit: async () => {},
  },
};
