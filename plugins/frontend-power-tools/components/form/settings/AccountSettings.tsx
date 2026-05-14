// @component: AccountSettings
// @category: form
// @description: Two-section settings card — change password (current/new/confirm with min-length + match) plus a danger zone for account deletion (requires typing confirmation text).
// @keywords: form, settings, account, password, change, delete, danger zone
// @complexity: complex

import { useState } from "react";
import type { FormEvent } from "react";

export interface AccountSettingsProps {
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => void | Promise<void>;
  onDeleteAccount?: () => void | Promise<void>;
  /** The text the user must type to confirm deletion. Defaults to "DELETE". */
  deleteConfirmationText?: string;
  className?: string;
}

export function AccountSettings({
  onChangePassword,
  onDeleteAccount,
  deleteConfirmationText = "DELETE",
  className,
}: AccountSettingsProps) {
  // Change-password state
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwErrors, setPwErrors] = useState<{ current?: string; next?: string; confirm?: string; form?: string }>({});
  const [pwPending, setPwPending] = useState(false);
  const [pwDone, setPwDone] = useState(false);

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: typeof pwErrors = {};
    if (!current) errs.current = "Current password is required.";
    if (!next) errs.next = "Pick a new password.";
    else if (next.length < 8) errs.next = "Use at least 8 characters.";
    if (next !== confirm) errs.confirm = "Passwords don't match.";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setPwPending(true);
    setPwDone(false);
    try {
      await onChangePassword({ currentPassword: current, newPassword: next });
      setPwDone(true);
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      setPwErrors({ form: err instanceof Error ? err.message : "Couldn't update password." });
    } finally {
      setPwPending(false);
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== deleteConfirmationText) {
      setDeleteError(`Type "${deleteConfirmationText}" to confirm.`);
      return;
    }
    setDeleteError(null);
    setDeletePending(true);
    try {
      await onDeleteAccount?.();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete account.");
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <div className={`mx-auto w-full max-w-2xl space-y-6 ${className ?? ""}`}>
      {/* Change password */}
      <section className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Change password</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password. You'll need to sign in again on your other devices.
        </p>

        <form onSubmit={handlePasswordSubmit} noValidate className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="acc-current" className="block text-sm font-medium">
              Current password
            </label>
            <input
              id="acc-current"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              aria-invalid={pwErrors.current ? true : undefined}
              aria-describedby={pwErrors.current ? "acc-current-error" : undefined}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {pwErrors.current && (
              <p id="acc-current-error" role="alert" className="text-xs font-medium text-destructive">
                {pwErrors.current}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="acc-new" className="block text-sm font-medium">
              New password
            </label>
            <input
              id="acc-new"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              aria-invalid={pwErrors.next ? true : undefined}
              aria-describedby={pwErrors.next ? "acc-new-error" : "acc-new-hint"}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {pwErrors.next ? (
              <p id="acc-new-error" role="alert" className="text-xs font-medium text-destructive">
                {pwErrors.next}
              </p>
            ) : (
              <p id="acc-new-hint" className="text-xs text-muted-foreground">
                At least 8 characters.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="acc-confirm" className="block text-sm font-medium">
              Confirm new password
            </label>
            <input
              id="acc-confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={pwErrors.confirm ? true : undefined}
              aria-describedby={pwErrors.confirm ? "acc-confirm-error" : undefined}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {pwErrors.confirm && (
              <p id="acc-confirm-error" role="alert" className="text-xs font-medium text-destructive">
                {pwErrors.confirm}
              </p>
            )}
          </div>

          {pwErrors.form && (
            <p role="alert" className="text-sm font-medium text-destructive">{pwErrors.form}</p>
          )}
          {pwDone && (
            <p role="status" className="text-sm font-medium text-foreground">Password updated.</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pwPending}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {pwPending ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </section>

      {/* Danger zone */}
      {onDeleteAccount && (
        <section className="rounded-lg border border-destructive/30 bg-card p-6 text-card-foreground shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-destructive">Danger zone</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Deleting your account is permanent. All data will be removed and cannot be recovered.
          </p>

          {!deleteOpen ? (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-destructive bg-background px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Delete account
            </button>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="acc-delete-confirm" className="block text-sm font-medium">
                  Type <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{deleteConfirmationText}</code> to confirm
                </label>
                <input
                  id="acc-delete-confirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  aria-invalid={deleteError ? true : undefined}
                  aria-describedby={deleteError ? "acc-delete-error" : undefined}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {deleteError && (
                  <p id="acc-delete-error" role="alert" className="text-xs font-medium text-destructive">
                    {deleteError}
                  </p>
                )}
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setDeleteOpen(false); setDeleteConfirm(""); setDeleteError(null); }}
                  disabled={deletePending}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deletePending || deleteConfirm !== deleteConfirmationText}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {deletePending ? "Deleting..." : "Delete my account"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export const demos: Record<string, AccountSettingsProps> = {
  default: {
    onChangePassword: async () => {},
    onDeleteAccount: async () => {},
  },
};
