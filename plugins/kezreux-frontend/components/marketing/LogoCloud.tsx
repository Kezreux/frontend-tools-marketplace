// @component: LogoCloud
// @category: marketing
// @description: Grid of customer/partner logos with optional heading. Each slot is a ReactNode — pass img tags, SVGs, or styled text wordmarks.
// @keywords: marketing, logos, customers, partners, trust, social-proof, brands
// @complexity: simple

import type { ReactNode } from "react";

export interface LogoItem {
  /** Slot for the logo — usually an <img>, inline SVG, or styled text. */
  logo: ReactNode;
  /** Used as the visually-hidden label for screen readers. */
  name: string;
}

export interface LogoCloudProps {
  title?: ReactNode;
  logos: LogoItem[];
  /** Columns on desktop. Mobile always uses 2 columns. */
  columns?: 4 | 5 | 6;
  className?: string;
}

export function LogoCloud({
  title,
  logos,
  columns = 5,
  className,
}: LogoCloudProps) {
  const colClass = {
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  }[columns];

  return (
    <section
      aria-labelledby={title ? "logos-title" : undefined}
      className={`bg-background px-4 py-12 sm:px-6 sm:py-16 ${className ?? ""}`}
    >
      {title && (
        <h2
          id="logos-title"
          className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground"
        >
          {title}
        </h2>
      )}
      <ul
        className={`mx-auto mt-8 grid max-w-5xl grid-cols-2 items-center gap-8 sm:grid-cols-3 ${colClass}`}
      >
        {logos.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="sr-only">{item.name}</span>
            <span aria-hidden="true" className="flex h-8 items-center text-lg font-semibold tracking-tight">
              {item.logo}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const demos: Record<string, LogoCloudProps> = {
  default: {
    title: "Trusted by teams at",
    logos: [
      { name: "Acme", logo: "Acme" },
      { name: "Globex", logo: "Globex" },
      { name: "Initech", logo: "Initech" },
      { name: "Umbrella", logo: "Umbrella" },
      { name: "Stark", logo: "Stark Industries" },
    ],
  },
};
