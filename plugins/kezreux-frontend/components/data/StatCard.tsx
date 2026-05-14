// @component: StatCard
// @category: data
// @description: Single-metric card — label, big numeric value, optional change indicator (with up/down arrow and percentage), optional period suffix.
// @keywords: data, stat, metric, kpi, number, dashboard, card
// @complexity: simple

import type { ReactNode } from "react";

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  /** e.g. "+12.3%" or "-2 since yesterday". The component picks colour from `changeType`. */
  change?: ReactNode;
  changeType?: "positive" | "negative" | "neutral";
  /** e.g. "vs last week", "this month". Shown beside the change in muted text. */
  period?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  period,
  icon,
  className,
}: StatCardProps) {
  const changeClass =
    changeType === "positive"
      ? "text-accent"
      : changeType === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  const Arrow =
    changeType === "positive" ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ) : changeType === "negative" ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ) : null;

  return (
    <div
      className={`rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <span className="flex-shrink-0 text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {(change || period) && (
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          {change && (
            <span className={`inline-flex items-center gap-1 font-medium ${changeClass}`}>
              {Arrow}
              {change}
            </span>
          )}
          {period && <span className="text-xs text-muted-foreground">{period}</span>}
        </div>
      )}
    </div>
  );
}

export const demos: Record<string, StatCardProps> = {
  positive: {
    label: "Monthly active users",
    value: "12,481",
    change: "12.3%",
    changeType: "positive",
    period: "vs last month",
  },
  negative: {
    label: "Bounce rate",
    value: "34.2%",
    change: "2.1%",
    changeType: "negative",
    period: "vs last week",
  },
  neutral: {
    label: "Total revenue",
    value: "$48,210",
  },
};
