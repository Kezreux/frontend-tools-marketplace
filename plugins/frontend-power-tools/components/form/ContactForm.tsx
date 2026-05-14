// @component: ContactForm
// @category: form
// @description: Name + email + message (optional subject) with inline validation, pending state, and success confirmation.
// @keywords: form, contact, message, support, inquiry, email, name
// @complexity: medium

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

export interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; subject?: string; message: string }) => void | Promise<void>;
  showSubject?: boolean;
  title?: string;
  description?: ReactNode;
  successMessage?: ReactNode;
  className?: string;
}

export function ContactForm({
  onSubmit,
  showSubject = false,
  title = "Get in touch",
  description = "We'll get back to you within one business day.",
  successMessage = "Thanks — we got your message and will reply shortly.",
  className,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; form?: string }>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (!message.trim()) next.message = "Message is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPending(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        subject: showSubject ? subject.trim() : undefined,
        message: message.trim(),
      });
      setDone(true);
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Send failed. Try again." });
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className={`mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
      >
        <h2 className="text-xl font-semibold tracking-tight">Message sent</h2>
        <p className="mt-3 text-sm text-muted-foreground">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        {showSubject && (
          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="block text-sm font-medium">
              Subject
              <span className="ml-1 text-muted-foreground">(optional)</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.message && (
            <p id="contact-message-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.message}
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
          {pending ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}

export const demos: Record<string, ContactFormProps> = {
  default: {
    onSubmit: async () => {},
    showSubject: true,
  },
};
