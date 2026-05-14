// @component: LoadingSpinner
// @category: feedback
// @description: Animated loading spinner using Tailwind's animate-spin, with size variants and optional label below.
// @keywords: loading, spinner, loader, busy, progress, indicator
// @complexity: simple

import type { ReactNode } from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: ReactNode;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-[3px]",
  }[size];

  return (
    <div
      role="status"
      aria-label={typeof label === "string" ? label : "Loading"}
      className={`flex flex-col items-center justify-center gap-3 ${className ?? ""}`}
    >
      <div
        className={`animate-spin rounded-full border-muted border-t-primary ${sizeClass}`}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export const demos: Record<string, LoadingSpinnerProps> = {
  default: { label: "Loading..." },
  small: { size: "sm" },
  large: { size: "lg", label: "Processing your request" },
};
