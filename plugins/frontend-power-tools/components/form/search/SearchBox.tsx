// @component: SearchBox
// @category: form
// @description: Controlled search input with magnifying-glass icon, clear button when filled, optional submit-on-Enter, and a tiny keyboard-hint slot.
// @keywords: form, search, input, query, find, filter
// @complexity: simple

import type { ChangeEvent, FormEvent, ReactNode } from "react";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  hint?: ReactNode;
  className?: string;
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  autoFocus,
  hint,
  className,
}: SearchBoxProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`relative flex w-full items-center ${className ?? ""}`}
    >
      <label htmlFor="search-box-input" className="sr-only">
        Search
      </label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-3 text-muted-foreground"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        id="search-box-input"
        type="search"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      {hint && !value && (
        <span className="pointer-events-none absolute right-3 hidden text-xs text-muted-foreground sm:inline">
          {hint}
        </span>
      )}
    </form>
  );
}

export const demos: Record<string, SearchBoxProps> = {
  empty: {
    value: "",
    onChange: () => {},
    onSubmit: () => {},
    placeholder: "Search docs, projects, files...",
    hint: "⌘K",
  },
  "with query": {
    value: "frontend-power-tools",
    onChange: () => {},
    onSubmit: () => {},
    placeholder: "Search docs, projects, files...",
  },
};
