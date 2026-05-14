// @component: ProfileForm
// @category: form
// @description: Pre-filled profile editor — name, email, bio (textarea), optional avatar URL. Dirty-state tracking, Save / Cancel actions, pending state.
// @keywords: form, profile, settings, account, user, update, edit
// @complexity: medium

import { useState } from "react";
import type { FormEvent } from "react";

export interface ProfileFormValues {
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string;
}

export interface ProfileFormProps {
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  onCancel?: () => void;
  showAvatar?: boolean;
  title?: string;
  className?: string;
}

export function ProfileForm({
  initialValues,
  onSubmit,
  onCancel,
  showAvatar = true,
  title = "Profile",
  className,
}: ProfileFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [bio, setBio] = useState(initialValues.bio);
  const [avatarUrl, setAvatarUrl] = useState(initialValues.avatarUrl ?? "");
  const [errors, setErrors] = useState<{ name?: string; email?: string; form?: string }>({});
  const [pending, setPending] = useState(false);

  const dirty =
    name !== initialValues.name ||
    email !== initialValues.email ||
    bio !== initialValues.bio ||
    avatarUrl !== (initialValues.avatarUrl ?? "");

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPending(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        avatarUrl: showAvatar ? avatarUrl.trim() : undefined,
      });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-2xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8 ${className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Update your account information. Changes save when you click Save.
      </p>

      <div className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.name && (
            <p id="profile-name-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "profile-email-error" : undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && (
            <p id="profile-email-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-bio" className="block text-sm font-medium">
            Bio
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="profile-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            A short bio shown on your public profile.
          </p>
        </div>

        {showAvatar && (
          <div className="space-y-1.5">
            <label htmlFor="profile-avatar" className="block text-sm font-medium">
              Avatar URL
              <span className="ml-1 text-muted-foreground">(optional)</span>
            </label>
            <input
              id="profile-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {errors.form && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {errors.form}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={pending || !dirty}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export const demos: Record<string, ProfileFormProps> = {
  default: {
    initialValues: {
      name: "Nicholas",
      email: "nicholas@example.com",
      bio: "Building things for the web. Coffee enthusiast.",
      avatarUrl: "",
    },
    onSubmit: async () => {},
    onCancel: () => {},
  },
};
