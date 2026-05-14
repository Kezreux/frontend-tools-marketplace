// @component: CenteredPage
// @category: layout
// @description: Max-width centered content wrapper with responsive padding. Used as a page container for marketing pages, blog posts, settings views.
// @keywords: layout, page, container, centered, max-width, wrapper
// @complexity: simple

import type { ReactNode } from "react";

export interface CenteredPageProps {
  children: ReactNode;
  /** Max content width. */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "prose";
  /** Optional content above the main slot (e.g. a page header). */
  header?: ReactNode;
  /** Optional content below the main slot. */
  footer?: ReactNode;
  className?: string;
}

const MAX_WIDTH_CLASS: Record<NonNullable<CenteredPageProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  prose: "max-w-prose",
};

export function CenteredPage({
  children,
  maxWidth = "4xl",
  header,
  footer,
  className,
}: CenteredPageProps) {
  return (
    <div className={`flex min-h-screen flex-col bg-background ${className ?? ""}`}>
      {header && (
        <header className="w-full border-b border-border">
          <div className={`mx-auto w-full px-4 sm:px-6 ${MAX_WIDTH_CLASS[maxWidth]}`}>
            {header}
          </div>
        </header>
      )}
      <main className={`mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-12 ${MAX_WIDTH_CLASS[maxWidth]}`}>
        {children}
      </main>
      {footer && (
        <footer className="w-full border-t border-border">
          <div className={`mx-auto w-full px-4 py-6 sm:px-6 ${MAX_WIDTH_CLASS[maxWidth]}`}>
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

export const demos: Record<string, CenteredPageProps> = {
  default: {
    maxWidth: "4xl",
    children: (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences, billing, and security options.
        </p>
      </div>
    ),
  },
};
