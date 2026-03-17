"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="max-w-[960px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-24)]">
      <div className="text-center">
        <p className="font-mono text-[length:var(--text-sm)] text-ink-tertiary mb-[var(--space-3)]">
          Error
        </p>
        <h1 className="font-display font-bold text-[length:var(--text-2xl)] text-ink mb-[var(--space-4)]">
          Something went wrong
        </h1>
        <p className="text-[length:var(--text-base)] text-ink-secondary max-w-md mx-auto mb-[var(--space-8)]">
          An unexpected error occurred. If this keeps happening, please{" "}
          <a
            href="https://github.com/joechensmartz/codepliant/issues"
            className="text-brand hover:text-brand-hover underline underline-offset-2 transition-colors duration-150"
            target="_blank"
            rel="noopener noreferrer"
          >
            open an issue
          </a>
          .
        </p>
        <div className="flex items-center justify-center gap-[var(--space-3)]">
          <button
            onClick={reset}
            className="inline-flex items-center bg-brand text-white font-medium text-[length:var(--text-sm)] rounded-lg px-[var(--space-6)] py-[var(--space-3)] hover:bg-brand-hover transition-colors duration-150"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center border border-border-subtle font-medium text-[length:var(--text-sm)] text-ink-secondary rounded-lg px-[var(--space-6)] py-[var(--space-3)] hover:bg-surface-secondary hover:text-ink transition-all duration-150"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
