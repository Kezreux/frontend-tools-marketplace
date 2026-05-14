// @component: TopNavWithSearch
// @category: navbar
// @description: Top nav with logo, center search input, and action icons on the right. App / dashboard feel.
// @keywords: navbar, top nav, search, command palette, header, dashboard, app
// @complexity: medium

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

export interface NavAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

export interface TopNavWithSearchProps {
  brand: ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: NavAction[];
  className?: string;
}

export function TopNavWithSearch({
  brand,
  searchPlaceholder = "Search...",
  onSearch,
  actions = [],
  className,
}: TopNavWithSearchProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <nav
      aria-label="Primary"
      className={`flex items-center gap-4 border-b border-border bg-background px-4 py-3 sm:px-6 sm:py-3 ${className ?? ""}`}
    >
      <a
        href="/"
        className="flex-shrink-0 text-base font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        {brand}
      </a>

      <form
        role="search"
        onSubmit={handleSubmit}
        className="ml-auto flex max-w-md flex-1 sm:ml-0 sm:flex-1"
      >
        <label htmlFor="primary-search" className="sr-only">
          Search
        </label>
        <input
          id="primary-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
        />
      </form>

      {actions.length > 0 && (
        <div className="flex items-center gap-1">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              aria-label={action.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
