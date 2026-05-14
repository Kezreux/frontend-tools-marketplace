// @component: SidebarLayout
// @category: layout
// @description: Sidebar + main content shell. Sidebar is fixed-width on desktop, hidden on mobile (drawer handled separately). Supports left or right placement.
// @keywords: layout, sidebar, shell, app, dashboard, two-column
// @complexity: medium

import type { ReactNode } from "react";

export interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  /** Which side the sidebar sits on. Default "left". */
  side?: "left" | "right";
  /** Sidebar width (Tailwind sizing units). Default 60 = 240px. */
  sidebarWidth?: "56" | "60" | "64" | "72" | "80";
  /** Optional sticky header above the main content. */
  header?: ReactNode;
  className?: string;
}

export function SidebarLayout({
  sidebar,
  children,
  side = "left",
  sidebarWidth = "60",
  header,
  className,
}: SidebarLayoutProps) {
  const widthClass = {
    "56": "lg:w-56",
    "60": "lg:w-60",
    "64": "lg:w-64",
    "72": "lg:w-72",
    "80": "lg:w-80",
  }[sidebarWidth];

  const sidebarOrderClass = side === "right" ? "lg:order-2" : "lg:order-1";
  const mainOrderClass = side === "right" ? "lg:order-1" : "lg:order-2";

  return (
    <div className={`flex min-h-screen flex-col lg:flex-row ${className ?? ""}`}>
      <aside
        aria-label="Sidebar"
        className={`hidden flex-shrink-0 border-border bg-background lg:flex lg:flex-col ${widthClass} ${sidebarOrderClass} ${side === "right" ? "lg:border-l" : "lg:border-r"}`}
      >
        {sidebar}
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col ${mainOrderClass}`}>
        {header && (
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            {header}
          </header>
        )}
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}

export const demos: Record<string, SidebarLayoutProps> = {
  default: {
    sidebar: (
      <div className="flex h-full flex-col p-4">
        <p className="text-base font-semibold tracking-tight text-foreground">Acme</p>
        <nav className="mt-6 space-y-1">
          {["Dashboard", "Projects", "Reports", "Settings"].map((label, i) => (
            <a
              key={label}
              href="#"
              className={`block rounded-md px-3 py-2 text-sm font-medium ${i === 0 ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    ),
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Main content area.</p>
      </div>
    ),
  },
};
