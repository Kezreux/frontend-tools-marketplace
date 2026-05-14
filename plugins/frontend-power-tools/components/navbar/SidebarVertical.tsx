// @component: SidebarVertical
// @category: navbar
// @description: Full-height left sidebar with sections, icons, and optional bottom user block. App / dashboard layout.
// @keywords: sidebar, vertical, navigation, dashboard, app, sections, side menu
// @complexity: medium

import type { ReactNode } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  badge?: string | number;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarVerticalProps {
  brand: ReactNode;
  sections: SidebarSection[];
  bottomSlot?: ReactNode;
  className?: string;
}

export function SidebarVertical({
  brand,
  sections,
  bottomSlot,
  className,
}: SidebarVerticalProps) {
  return (
    <nav
      aria-label="Primary"
      className={`flex h-full w-60 flex-col border-r border-border bg-background ${className ?? ""}`}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <a
          href="/"
          className="text-base font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          {brand}
        </a>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section, idx) => (
          <div key={idx} className={idx > 0 ? "mt-4" : ""}>
            {section.label && (
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      item.active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    {item.icon && (
                      <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {bottomSlot && (
        <div className="border-t border-border px-3 py-3">{bottomSlot}</div>
      )}
    </nav>
  );
}

export const demos: Record<string, SidebarVerticalProps> = {
  default: {
    brand: "Acme",
    sections: [
      {
        label: "Main",
        items: [
          { label: "Dashboard", href: "#dashboard", active: true },
          { label: "Projects", href: "#projects", badge: 3 },
          { label: "Reports", href: "#reports" },
        ],
      },
      {
        label: "Settings",
        items: [
          { label: "Profile", href: "#profile" },
          { label: "Billing", href: "#billing" },
          { label: "Team", href: "#team", badge: "Pro" },
        ],
      },
    ],
    bottomSlot: (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted" aria-hidden="true" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-foreground">Nicholas</p>
          <p className="text-xs text-muted-foreground">Free plan</p>
        </div>
      </div>
    ),
  },
};
