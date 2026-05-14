// @component: KeyValueList
// @category: data
// @description: Definition-list pattern (dt/dd) for metadata display — label on the left, value on the right. Works well for invoice details, settings summaries, "About" panels.
// @keywords: data, key-value, definition, metadata, details, dl, summary
// @complexity: simple

import type { ReactNode } from "react";

export interface KeyValueItem {
  label: ReactNode;
  value: ReactNode;
  /** Optional helper text shown under the value in muted colour. */
  hint?: ReactNode;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  /** Title rendered above the list. */
  title?: ReactNode;
  /** "Stacked" puts labels above values (better on mobile); "inline" is two-column. Default "inline". */
  layout?: "inline" | "stacked";
  className?: string;
}

export function KeyValueList({
  items,
  title,
  layout = "inline",
  className,
}: KeyValueListProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground ${className ?? ""}`}
    >
      {title && (
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        </div>
      )}
      <dl className="divide-y divide-border">
        {items.map((item, i) => (
          <div
            key={i}
            className={
              layout === "inline"
                ? "grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-[1fr_2fr] sm:items-baseline sm:gap-4"
                : "px-5 py-3"
            }
          >
            <dt className="text-sm font-medium text-muted-foreground">{item.label}</dt>
            <dd className="text-sm text-foreground">
              {item.value}
              {item.hint && (
                <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export const demos: Record<string, KeyValueListProps> = {
  default: {
    title: "Invoice details",
    items: [
      { label: "Invoice number", value: "INV-2024-0142" },
      { label: "Billing date", value: "May 14, 2026" },
      { label: "Plan", value: "Pro (annual)", hint: "Renews automatically" },
      { label: "Amount", value: "$190.00 USD" },
      { label: "Status", value: "Paid" },
    ],
  },
  stacked: {
    title: "Project info",
    layout: "stacked",
    items: [
      { label: "Repository", value: "Kezreux/kezreux-frontend" },
      { label: "Default branch", value: "main" },
      { label: "Visibility", value: "Public" },
    ],
  },
};
