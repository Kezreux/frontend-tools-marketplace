// @component: FullPageLayout
// @category: layout
// @description: Full-bleed page shell — sticky header, flexible main, sticky-or-static footer. Header and footer slots can be any ReactNode. Min-height: full screen.
// @keywords: layout, shell, header, footer, full-page, sticky
// @complexity: medium

import type { ReactNode } from "react";

export interface FullPageLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Sticky positions stick the header to the top while scrolling. */
  stickyHeader?: boolean;
  /** Adds a subtle border between header/footer and the main content. Default true. */
  showBorders?: boolean;
  className?: string;
}

export function FullPageLayout({
  header,
  children,
  footer,
  stickyHeader = false,
  showBorders = true,
  className,
}: FullPageLayoutProps) {
  return (
    <div className={`flex min-h-screen flex-col bg-background ${className ?? ""}`}>
      {header && (
        <header
          className={`${stickyHeader ? "sticky top-0 z-10" : ""} bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 ${showBorders ? "border-b border-border" : ""}`}
        >
          {header}
        </header>
      )}
      <main className="flex-1">{children}</main>
      {footer && (
        <footer
          className={`bg-background ${showBorders ? "border-t border-border" : ""}`}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}

export const demos: Record<string, FullPageLayoutProps> = {
  default: {
    stickyHeader: true,
    header: (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-base font-semibold tracking-tight text-foreground">Acme</p>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground">Features</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="#" className="text-foreground">Docs</a>
        </nav>
      </div>
    ),
    children: (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Main content
        </h1>
        <p className="mt-4 text-muted-foreground">
          Whatever fills the page sits in the main slot. Use any of the other
          presets here — heroes, feature grids, pricing tables.
        </p>
      </div>
    ),
    footer: (
      <div className="px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © 2026 Acme. All rights reserved.
      </div>
    ),
  },
};
