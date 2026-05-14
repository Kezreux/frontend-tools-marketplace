// @component: DashboardGrid
// @category: layout
// @description: Responsive CSS-grid container for dashboard widgets. Defaults to 1 column on mobile, 2 on tablet, 3 on desktop (configurable). Children apply col-span-* / row-span-* classes manually for wider/taller cells.
// @keywords: layout, dashboard, grid, widgets, responsive
// @complexity: simple

import type { ReactNode } from "react";

export interface DashboardGridProps {
  children: ReactNode;
  /** Columns on desktop (lg+). Mobile is always 1 column; tablet (sm+) is half the desktop count. */
  columns?: 2 | 3 | 4 | 6;
  /** Gap between cells, in Tailwind spacing units. Default 4 (16px). */
  gap?: 3 | 4 | 5 | 6 | 8;
  className?: string;
}

export function DashboardGrid({
  children,
  columns = 3,
  gap = 4,
  className,
}: DashboardGridProps) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    6: "sm:grid-cols-3 lg:grid-cols-6",
  }[columns];

  const gapClass = {
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  }[gap];

  return (
    <div className={`grid grid-cols-1 ${gapClass} ${colClass} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export const demos: Record<string, DashboardGridProps> = {
  default: {
    columns: 3,
    children: (
      <>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="rounded-md border border-border bg-card p-4 text-card-foreground"
          >
            <p className="text-sm font-medium text-muted-foreground">Widget {n}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">--</p>
          </div>
        ))}
      </>
    ),
  },
};
