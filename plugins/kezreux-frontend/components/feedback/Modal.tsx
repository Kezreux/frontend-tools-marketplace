// @component: Modal
// @category: feedback
// @description: Centered dialog with backdrop, focus on open, ESC + click-outside close, scrollable body, optional primary/secondary actions. Body scroll locked while open.
// @keywords: modal, dialog, overlay, popup, backdrop, alertdialog
// @complexity: complex

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "destructive";
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  closeOnBackdrop?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  closeOnBackdrop = true,
  className,
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      if (previousActiveRef.current instanceof HTMLElement) {
        previousActiveRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const variantClass = (v: ModalAction["variant"]) => {
    if (v === "destructive")
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    if (v === "secondary")
      return "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground";
    return "bg-primary text-primary-foreground hover:bg-primary/90";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center ${className ?? ""}`}
    >
      <button
        type="button"
        aria-label="Close modal"
        tabIndex={-1}
        onClick={() => closeOnBackdrop && onClose()}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-lg border border-border bg-popover text-popover-foreground shadow-lg sm:rounded-lg">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="flex-1">
            <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {children && <div className="max-h-[60vh] overflow-y-auto px-6 py-4">{children}</div>}

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${variantClass(secondaryAction.variant ?? "secondary")}`}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${variantClass(primaryAction.variant ?? "primary")}`}
              >
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const demos: Record<string, ModalProps> = {
  default: {
    open: true,
    onClose: () => {},
    title: "Delete project?",
    description: "This action is permanent. All data associated with this project will be removed.",
    primaryAction: { label: "Delete", variant: "destructive", onClick: () => {} },
    secondaryAction: { label: "Cancel", variant: "secondary", onClick: () => {} },
  },
};
