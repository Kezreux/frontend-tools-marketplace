// @component: FilterPanel
// @category: form
// @description: Side-panel filter UI — status checkboxes, sort radio group, reset + apply buttons. Controlled by parent via filters + onChange.
// @keywords: form, filter, panel, sidebar, status, sort, refine
// @complexity: medium

import { useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterValues {
  status: string[];
  sortBy: string;
}

export interface FilterPanelProps {
  /** Currently applied filters. */
  filters: FilterValues;
  /** Called with the new filters when the user clicks Apply. */
  onApply: (filters: FilterValues) => void;
  /** Optional reset handler — called when Reset is clicked. Default clears the filters. */
  onReset?: () => void;
  /** Status options shown as checkboxes. */
  statusOptions?: FilterOption[];
  /** Sort options shown as radios. */
  sortOptions?: FilterOption[];
  title?: string;
  className?: string;
}

const DEFAULT_STATUS_OPTIONS: FilterOption[] = [
  { value: "active",  label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "closed",  label: "Closed" },
];

const DEFAULT_SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az",     label: "A → Z" },
  { value: "za",     label: "Z → A" },
];

export function FilterPanel({
  filters,
  onApply,
  onReset,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  sortOptions = DEFAULT_SORT_OPTIONS,
  title = "Filters",
  className,
}: FilterPanelProps) {
  const [draftStatus, setDraftStatus] = useState<string[]>(filters.status);
  const [draftSort, setDraftSort] = useState<string>(filters.sortBy);

  function toggleStatus(value: string) {
    setDraftStatus((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  function handleReset() {
    setDraftStatus([]);
    setDraftSort(sortOptions[0]?.value ?? "");
    onReset?.();
  }

  function handleApply() {
    onApply({ status: draftStatus, sortBy: draftSort });
  }

  return (
    <aside
      aria-label={title}
      className={`w-full max-w-xs rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5 px-4 py-4">
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </legend>
          <ul className="mt-2 space-y-2">
            {statusOptions.map((opt) => (
              <li key={opt.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draftStatus.includes(opt.value)}
                    onChange={() => toggleStatus(opt.value)}
                    className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sort by
          </legend>
          <ul className="mt-2 space-y-2">
            {sortOptions.map((opt) => (
              <li key={opt.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sort-by"
                    value={opt.value}
                    checked={draftSort === opt.value}
                    onChange={() => setDraftSort(opt.value)}
                    className="h-4 w-4 border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <div className="border-t border-border px-4 py-3">
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Apply filters
        </button>
      </div>
    </aside>
  );
}

export const demos: Record<string, FilterPanelProps> = {
  default: {
    filters: { status: ["active"], sortBy: "newest" },
    onApply: () => {},
    onReset: () => {},
  },
};
