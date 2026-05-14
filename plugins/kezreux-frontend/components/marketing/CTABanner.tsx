// @component: CTABanner
// @category: marketing
// @description: In-page call-to-action section with title, optional description, primary CTA, optional secondary CTA. More compact than a hero — designed for use mid-page or above the footer.
// @keywords: marketing, cta, banner, conversion, section, signup
// @complexity: simple

import type { ReactNode } from "react";

export interface CTABannerProps {
  title: ReactNode;
  description?: ReactNode;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Light surface (default) or a primary-tinted bold variant. */
  variant?: "default" | "primary";
  className?: string;
}

export function CTABanner({
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  variant = "default",
  className,
}: CTABannerProps) {
  const surfaceClass =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-card text-card-foreground border border-border";

  const primaryBtnClass =
    variant === "primary"
      ? "bg-background text-foreground hover:bg-background/90"
      : "bg-primary text-primary-foreground hover:bg-primary/90";

  const secondaryBtnClass =
    variant === "primary"
      ? "border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
      : "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <section
      className={`mx-auto max-w-6xl rounded-lg px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16 ${surfaceClass} ${className ?? ""}`}
    >
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {description && (
        <p className={`mx-auto mt-3 max-w-2xl text-sm sm:text-base ${variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <a
          href={ctaPrimary.href}
          className={`inline-flex h-11 w-full items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto ${primaryBtnClass}`}
        >
          {ctaPrimary.label}
        </a>
        {ctaSecondary && (
          <a
            href={ctaSecondary.href}
            className={`inline-flex h-11 w-full items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto ${secondaryBtnClass}`}
          >
            {ctaSecondary.label}
          </a>
        )}
      </div>
    </section>
  );
}

export const demos: Record<string, CTABannerProps> = {
  default: {
    title: "Ready to ship faster?",
    description: "Join 10,000+ teams building with frontend-power-tools.",
    ctaPrimary: { label: "Start free", href: "#start" },
    ctaSecondary: { label: "Book a demo", href: "#demo" },
  },
  primary: {
    title: "Get started in minutes",
    description: "No credit card required. Free tier forever.",
    ctaPrimary: { label: "Sign up", href: "#signup" },
    variant: "primary",
  },
};
