// @component: TopNavSimple
// @category: navbar
// @description: Clean horizontal top nav with logo and links. Optional CTA button on the right.
// @keywords: navbar, top nav, header, navigation, marketing, landing
// @complexity: simple

import type { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface TopNavSimpleProps {
  brand: ReactNode;
  links: NavLink[];
  cta?: { label: string; href: string };
  className?: string;
}

export function TopNavSimple({ brand, links, cta, className }: TopNavSimpleProps) {
  return (
    <nav
      aria-label="Primary"
      className={`flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-6 sm:py-4 ${className ?? ""}`}
    >
      <a
        href="/"
        className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        {brand}
      </a>

      <ul className="hidden items-center gap-6 sm:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm ${
                link.active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {cta && (
        <a
          href={cta.href}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {cta.label}
        </a>
      )}
    </nav>
  );
}

export const demos: Record<string, TopNavSimpleProps> = {
  default: {
    brand: "Acme",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing", active: true },
      { label: "Docs", href: "#docs" },
    ],
    cta: { label: "Get started", href: "#cta" },
  },
};
