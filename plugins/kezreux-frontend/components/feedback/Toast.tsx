// @component: Toast
// @category: feedback
// @description: Slide-in notification with variant (info/success/warning/error), optional title + description, auto-dismiss timer, close button. Single controlled instance — pair with a ToastProvider in your app for queueing.
// @keywords: toast, notification, snackbar, alert, popup, message
// @complexity: medium

import { useEffect } from "react";
import type { ReactNode } from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms. Set to 0 to keep open until manually closed. Default 5000. */
  duration?: number;
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
  className?: string;
}

export function Toast({
  open,
  onClose,
  message,
  description,
  variant = "info",
  duration = 5000,
  position = "bottom-right",
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open || duration === 0) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const positionClass = {
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  }[position];

  const accentClass = {
    info: "border-l-accent",
    success: "border-l-accent",
    warning: "border-l-accent",
    error: "border-l-destructive",
  }[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`fixed z-50 w-full max-w-sm rounded-md border border-border border-l-4 bg-popover text-popover-foreground shadow-lg ${positionClass} ${accentClass} ${className ?? ""}`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export const demos: Record<string, ToastProps> = {
  success: {
    open: true,
    onClose: () => {},
    message: "Profile updated",
    description: "Your changes are live.",
    variant: "success",
    duration: 0,
  },
  error: {
    open: true,
    onClose: () => {},
    message: "Couldn't save",
    description: "Check your connection and try again.",
    variant: "error",
    duration: 0,
  },
};
