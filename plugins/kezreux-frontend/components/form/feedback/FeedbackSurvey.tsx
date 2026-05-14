// @component: FeedbackSurvey
// @category: form
// @description: Star-rating (1–5, keyboard-accessible radio group) with optional comment and success state. Submits {rating, comment}.
// @keywords: form, feedback, survey, rating, stars, review, nps, csat
// @complexity: medium

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

export interface FeedbackSurveyProps {
  onSubmit: (data: { rating: number; comment: string }) => void | Promise<void>;
  title?: string;
  description?: ReactNode;
  ratingLabel?: string;
  commentLabel?: string;
  commentPlaceholder?: string;
  successMessage?: ReactNode;
  maxRating?: number;
  className?: string;
}

export function FeedbackSurvey({
  onSubmit,
  title = "How was your experience?",
  description,
  ratingLabel = "Rating",
  commentLabel = "Anything else?",
  commentPlaceholder = "Tell us more...",
  successMessage = "Thanks for the feedback.",
  maxRating = 5,
  className,
}: FeedbackSurveyProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setError("Pick a rating first.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className={`mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
      >
        <h2 className="text-xl font-semibold tracking-tight">{successMessage}</h2>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}

      <fieldset className="mt-6">
        <legend className="text-sm font-medium">{ratingLabel}</legend>
        <div role="radiogroup" aria-label={ratingLabel} className="mt-2 flex items-center gap-1.5">
          {Array.from({ length: maxRating }, (_, i) => i + 1).map((n) => {
            const selected = rating >= n;
            return (
              <label
                key={n}
                className="cursor-pointer rounded-sm p-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="sr-only"
                />
                <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={selected ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    selected ? "text-accent transition-colors" : "text-muted-foreground transition-colors"
                  }
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 space-y-1.5">
        <label htmlFor="fb-comment" className="block text-sm font-medium">
          {commentLabel}
          <span className="ml-1 text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="fb-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={commentPlaceholder}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Submit feedback"}
      </button>
    </form>
  );
}

export const demos: Record<string, FeedbackSurveyProps> = {
  default: {
    onSubmit: async () => {},
    description: "Your feedback helps us improve kezreux-frontend.",
  },
};
