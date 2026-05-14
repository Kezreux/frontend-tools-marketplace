// @component: FAQAccordion
// @category: marketing
// @description: Disclosure-pattern FAQ accordion — click a question to expand its answer. ARIA-correct (aria-expanded, aria-controls, button-based triggers).
// @keywords: marketing, faq, accordion, disclosure, expandable, questions
// @complexity: medium

import { useState } from "react";
import type { ReactNode } from "react";

export interface FAQItem {
  question: ReactNode;
  answer: ReactNode;
}

export interface FAQAccordionProps {
  title?: ReactNode;
  items: FAQItem[];
  /** Allow multiple items open at the same time. Default false (single-open). */
  allowMultiple?: boolean;
  /** Index of the item to open by default. */
  defaultOpen?: number;
  className?: string;
}

export function FAQAccordion({
  title,
  items,
  allowMultiple = false,
  defaultOpen,
  className,
}: FAQAccordionProps) {
  const [openSet, setOpenSet] = useState<Set<number>>(
    new Set(defaultOpen !== undefined ? [defaultOpen] : [])
  );

  function toggle(i: number) {
    setOpenSet((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <section
      aria-labelledby={title ? "faq-title" : undefined}
      className={`mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 ${className ?? ""}`}
    >
      {title && (
        <h2
          id="faq-title"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </h2>
      )}

      <dl className={title ? "mt-10 space-y-2" : "space-y-2"}>
        {items.map((item, i) => {
          const open = openSet.has(i);
          return (
            <div
              key={i}
              className="overflow-hidden rounded-md border border-border bg-card text-card-foreground"
            >
              <dt>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-foreground transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-inset"
                >
                  <span>{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </dt>
              {open && (
                <dd
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="border-t border-border px-5 py-4 text-sm text-muted-foreground"
                >
                  {item.answer}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export const demos: Record<string, FAQAccordionProps> = {
  default: {
    title: "Frequently asked questions",
    defaultOpen: 0,
    items: [
      {
        question: "What's included in the free plan?",
        answer:
          "Three projects, community support, 1 GB storage, and access to all core features. No time limit — the free plan is forever.",
      },
      {
        question: "Can I switch plans later?",
        answer:
          "Yes. Upgrade or downgrade any time from your account settings. Prorated billing handles the difference automatically.",
      },
      {
        question: "Do you offer education or non-profit discounts?",
        answer:
          "Yes — verified students and registered non-profits get 50% off paid plans. Contact us with documentation.",
      },
      {
        question: "How do I cancel?",
        answer:
          "Self-serve from account settings. Your data stays accessible for 30 days after cancellation.",
      },
    ],
  },
};
