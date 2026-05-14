// @component: AlertBanner
// @category: feedback
// @description: Inline alert banner with variant (info/success/warning/error), icon, title, description, optional action button, optional dismiss button.
// @keywords: alert, banner, callout, notice, warning, info, error, inline
// @complexity: medium

import type { ReactNode } from "react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertBannerProps {
  variant?: AlertVariant;
  title?: ReactNode;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  className?: string;
}

const ICONS: Record<AlertVariant, ReactNode> = {
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

export function AlertBanner({
  variant = "info",
  title,
  description,
  action,
  onDismiss,
  className,
}: AlertBannerProps) {
  const accentClass =
    variant === "error" ? "text-destructive border-l-destructive" : "text-foreground border-l-accent";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-md border border-border border-l-4 bg-card p-4 ${accentClass} ${className ?? ""}`}
    >
      <span className="flex-shrink-0">{ICONS[variant]}</span>

      <div className="flex-1 text-card-foreground">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && (
          <p className={`text-sm text-muted-foreground ${title ? "mt-1" : ""}`}>{description}</p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {action.label}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export const demos: Record<string, AlertBannerProps> = {
  info: {
    variant: "info",
    title: "Heads up",
    description: "We're rolling out new dashboards next week.",
    onDismiss: () => {},
  },
  success: {
    variant: "success",
    title: "Saved",
    description: "Your settings were updated successfully.",
  },
  warning: {
    variant: "warning",
    title: "Storage running low",
    description: "You have 5% of your storage quota remaining.",
    action: { label: "Upgrade plan", onClick: () => {} },
  },
  error: {
    variant: "error",
    title: "Couldn't connect",
    description: "Check your connection and try again.",
    action: { label: "Retry", onClick: () => {} },
  },
};
