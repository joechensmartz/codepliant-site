"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

const categories = [
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "docs", label: "Documentation" },
  { value: "ux", label: "Usability" },
  { value: "other", label: "Other" },
];

export default function FeedbackPage() {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: dbError } = await supabase.from("feedback").insert({
        email: email || null,
        rating: rating || null,
        category,
        message,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      });

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[480px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-muted mb-[var(--space-6)]">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-3)]">
            Thank you for your feedback!
          </h1>
          <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-8)]">
            We read every submission and use it to improve Codepliant.
          </p>
          <a
            href="/"
            className="inline-block py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors"
          >
            Back to home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[480px] mx-auto">
        <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-2)]">
          Send Feedback
        </h1>
        <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-8)]">
          Help us improve Codepliant. Bug reports, feature ideas, and honest opinions are all welcome.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-5)]">
          {/* Rating */}
          <fieldset>
            <legend className="text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
              How would you rate Codepliant?
            </legend>
            <div className="flex gap-[var(--space-2)]">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-10 h-10 rounded-lg border text-[length:var(--text-sm)] font-medium transition-colors ${
                    rating >= n
                      ? "bg-brand text-surface-primary border-brand"
                      : "border-border-subtle text-ink-secondary hover:border-brand hover:text-brand"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </fieldset>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
              Category <span className="text-urgency">*</span>
            </label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-[var(--space-3)] py-[var(--space-3)] rounded-lg border border-border-subtle bg-surface-primary text-[length:var(--text-sm)] text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
              Your feedback <span className="text-urgency">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's working well? What could be better?"
              className="w-full px-[var(--space-3)] py-[var(--space-3)] rounded-lg border border-border-subtle bg-surface-primary text-[length:var(--text-sm)] text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand resize-y"
            />
          </div>

          {/* Email (optional) */}
          <div>
            <label htmlFor="email" className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
              Email <span className="text-ink-tertiary font-normal">(optional, if you want a reply)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-[var(--space-3)] py-[var(--space-3)] rounded-lg border border-border-subtle bg-surface-primary text-[length:var(--text-sm)] text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {error && (
            <p className="text-[length:var(--text-sm)] text-urgency">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Send Feedback"}
          </button>
        </form>
      </div>
    </section>
  );
}
