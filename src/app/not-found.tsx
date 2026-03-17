import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "This page doesn't exist. Find what you're looking for on Codepliant.",
};

const popularPages = [
  { href: "/docs", label: "Docs", description: "Get started with Codepliant" },
  { href: "/pricing", label: "Pricing", description: "Free, Pro, and Team plans" },
  { href: "/blog", label: "Blog", description: "Guides, updates, and insights" },
  { href: "/compare", label: "Compare", description: "See how Codepliant stacks up" },
];

export default function NotFound() {
  return (
    <div className="max-w-[960px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-24)]">
      {/* Hero */}
      <div className="text-center mb-[var(--space-16)]">
        <p className="font-mono text-[length:var(--text-sm)] text-ink-tertiary mb-[var(--space-3)]">
          404
        </p>
        <h1 className="font-display font-bold text-[length:var(--text-2xl)] text-ink mb-[var(--space-4)]">
          This page doesn&apos;t exist
        </h1>
        <p className="text-[length:var(--text-base)] text-ink-secondary max-w-md mx-auto mb-[var(--space-6)]">
          Looks like this document wasn&apos;t in your <span className="font-mono text-[length:var(--text-sm)] bg-surface-secondary rounded px-[var(--space-2)] py-0.5">legal/</span> directory.
        </p>

        {/* CTA */}
        <div className="inline-flex flex-col items-center gap-[var(--space-3)]">
          <a
            href="/"
            className="inline-flex items-center gap-[var(--space-2)] bg-brand text-surface-primary font-medium text-[length:var(--text-sm)] rounded-lg px-[var(--space-6)] py-[var(--space-3)] hover:bg-brand-hover transition-colors duration-150"
          >
            Go home
          </a>
          <p className="text-[length:var(--text-xs)] text-ink-tertiary">
            or generate the docs you actually need:
          </p>
          <div className="inline-flex items-center bg-[var(--code-bg)] text-[var(--code-fg)] rounded-lg px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--text-sm)]">
            <span className="text-ink-tertiary mr-[var(--space-2)] select-none">$</span>
            <span>npx codepliant go</span>
          </div>
        </div>
      </div>

      {/* Popular pages */}
      <div className="max-w-lg mx-auto">
        <h2 className="font-display font-semibold text-[length:var(--text-sm)] text-ink-tertiary uppercase tracking-wider mb-[var(--space-4)] text-center">
          Popular pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)]">
          {popularPages.map((page) => (
            <a
              key={page.href}
              href={page.href}
              className="group block border border-border-subtle rounded-lg px-[var(--space-4)] py-[var(--space-3)] hover:border-border-strong hover:bg-surface-secondary transition-all duration-150"
            >
              <span className="font-display font-semibold text-[length:var(--text-base)] text-ink group-hover:text-brand transition-colors duration-150">
                {page.label}
              </span>
              <span className="block text-[length:var(--text-sm)] text-ink-secondary mt-0.5">
                {page.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
