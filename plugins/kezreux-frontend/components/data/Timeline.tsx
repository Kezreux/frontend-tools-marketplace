// @component: Timeline
// @category: data
// @description: Vertical timeline of events — time, title, description, optional icon, status tint (default/success/warning/error). Connector line drawn between event dots.
// @keywords: data, timeline, activity, log, events, history, audit
// @complexity: medium

import type { ReactNode } from "react";

export interface TimelineEvent {
  /** When the event happened — typically a short timestamp like "2h ago" or "May 14". */
  time: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  status?: "default" | "success" | "warning" | "error";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  const dotClass = (s: TimelineEvent["status"]) => {
    if (s === "success") return "bg-accent text-accent-foreground";
    if (s === "warning") return "bg-muted text-foreground";
    if (s === "error") return "bg-destructive text-destructive-foreground";
    return "bg-card text-foreground border border-border";
  };

  return (
    <ol className={`relative ${className ?? ""}`}>
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border"
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs ${dotClass(event.status)}`}
              aria-hidden="true"
            >
              {event.icon ?? <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div className="flex-1 pt-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <time className="flex-shrink-0 text-xs text-muted-foreground">{event.time}</time>
              </div>
              {event.description && (
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export const demos: Record<string, TimelineProps> = {
  default: {
    events: [
      {
        time: "2h ago",
        title: "Deployment succeeded",
        description: "Version 0.3.0 deployed to production.",
        status: "success",
      },
      {
        time: "3h ago",
        title: "Build completed",
        description: "All 12 jobs passed in 4m 32s.",
        status: "success",
      },
      {
        time: "5h ago",
        title: "Pull request merged",
        description: "Nicholas merged PR 142: 'Add subcategory support'.",
      },
      {
        time: "Yesterday",
        title: "Security scan flagged 1 issue",
        description: "Low-severity dependency advisory in 'example-pkg'.",
        status: "warning",
      },
    ],
  },
};
