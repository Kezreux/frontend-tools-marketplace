// @component: DataTable
// @category: data
// @description: Sortable, responsive data table — declarative column schema, sortable headers (click to cycle asc/desc), striped rows, optional row click handler, empty-state slot.
// @keywords: data, table, grid, sortable, rows, columns, list
// @complexity: complex

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface DataTableColumn {
  /** Key used to look up the cell value in each row. */
  key: string;
  label: ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  /** Optional renderer — falls back to row[key] verbatim. */
  render?: (row: Record<string, ReactNode>) => ReactNode;
  /** Override the value used for sorting (defaults to row[key]). */
  sortValue?: (row: Record<string, ReactNode>) => string | number;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: Array<Record<string, ReactNode>>;
  /** Click handler invoked with the clicked row. Makes rows interactive. */
  onRowClick?: (row: Record<string, ReactNode>) => void;
  /** Shown when `rows` is empty. */
  emptyState?: ReactNode;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable({
  columns,
  rows,
  onRowClick,
  emptyState = "No data.",
  className,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function cycleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortDir) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return rows;
    const getValue = col.sortValue ?? ((r: Record<string, ReactNode>) => {
      const v = r[sortKey];
      return typeof v === "number" ? v : String(v ?? "");
    });
    return [...rows].sort((a, b) => {
      const av = getValue(a);
      const bv = getValue(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir, columns]);

  const alignClass = (a?: "left" | "right" | "center") =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  if (rows.length === 0) {
    return (
      <div className={`rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground ${className ?? ""}`}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-md border border-border ${className ?? ""}`}>
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {columns.map((col) => {
              const isActive = sortKey === col.key;
              const ariaSort = !isActive ? "none" : sortDir === "asc" ? "ascending" : "descending";
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? ariaSort : undefined}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${alignClass(col.align)}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => cycleSort(col.key)}
                      className="inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span>{col.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={isActive ? "text-foreground" : "opacity-40"}
                      >
                        {isActive && sortDir === "desc" ? (
                          <polyline points="6 9 12 15 18 9" />
                        ) : (
                          <polyline points="18 15 12 9 6 15" />
                        )}
                      </svg>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card text-card-foreground">
          {sortedRows.map((row, i) => (
            <tr
              key={i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? "cursor-pointer transition-colors hover:bg-accent/40" : ""}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${alignClass(col.align)}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const demos: Record<string, DataTableProps> = {
  default: {
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "role", label: "Role", sortable: true },
      { key: "joined", label: "Joined", sortable: true, align: "right" },
    ],
    rows: [
      { name: "Ada Lovelace", role: "Founder", joined: "Jan 2024" },
      { name: "Alan Turing", role: "Engineer", joined: "Mar 2024" },
      { name: "Grace Hopper", role: "Architect", joined: "Feb 2024" },
      { name: "Linus Torvalds", role: "Engineer", joined: "Apr 2024" },
    ],
  },
};
