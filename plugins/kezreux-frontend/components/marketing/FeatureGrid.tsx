// @component: FeatureGrid
// @category: marketing
// @description: Responsive grid of feature blocks — icon, title, description. Configurable column count, optional section heading.
// @keywords: marketing, features, grid, benefits, capabilities
// @complexity: medium

import type { ReactNode } from "react";

export interface FeatureItem {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

export interface FeatureGridProps {
  title?: ReactNode;
  description?: ReactNode;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({
  title,
  description,
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <section
      aria-labelledby={title ? "features-title" : undefined}
      className={`bg-background px-4 py-16 sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      {(title || description) && (
        <div className="mx-auto max-w-2xl text-center">
          {title && (
            <h2 id="features-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <ul className={`mx-auto mt-12 grid max-w-6xl gap-8 ${colClass}`}>
        {features.map((f, i) => (
          <li key={i} className="flex flex-col items-start">
            {f.icon && (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground">
                {f.icon}
              </div>
            )}
            <h3 className="text-base font-semibold tracking-tight text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const Zap = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const Shield = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const Users = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const demos: Record<string, FeatureGridProps> = {
  default: {
    title: "Everything you need",
    description: "Built for teams that move fast and ship often.",
    features: [
      { icon: Zap, title: "Lightning fast", description: "Sub-100ms response times globally." },
      { icon: Shield, title: "Secure by default", description: "SOC 2 compliant. End-to-end encryption." },
      { icon: Users, title: "Built for teams", description: "Real-time collaboration with no setup." },
    ],
  },
};
