import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Codepliant — Open Source Compliance",
  description:
    "Codepliant is an open source CLI that scans your code and generates compliance documents. No lawyers, no questionnaires, no network calls.",
  alternates: {
    canonical: "https://codepliant.dev/about",
  },
  openGraph: {
    title: "About | Codepliant",
    description:
      "Codepliant is an open source CLI that scans your code and generates compliance documents. No lawyers, no questionnaires, no network calls.",
    url: "https://codepliant.dev/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Codepliant",
    description:
      "Open source compliance for every developer. Code scanning, not questionnaires.",
    images: ["/opengraph-image"],
  },
};

const principles = [
  {
    title: "Zero network calls",
    description:
      "Everything runs on your machine. No code leaves your environment, no data is sent anywhere, no telemetry. Your codebase stays private.",
  },
  {
    title: "Open source",
    description:
      "The core CLI is MIT-licensed and always will be. You can read every line of code that analyzes your project. Transparency in compliance tooling is non-negotiable.",
  },
  {
    title: "Deterministic scanning",
    description:
      "No AI, no LLMs, no probabilistic guesswork in the scanning pipeline. Codepliant uses pattern matching against known service signatures. Same input, same output, every time.",
  },
  {
    title: "Developer experience",
    description:
      "One command, zero configuration. No questionnaires, no forms, no accounts. Compliance should fit into your workflow, not the other way around.",
  },
];

const stats = [
  { value: "5,218", label: "Tests passing" },
  { value: "1,200+", label: "Repos tested" },
  { value: "123+", label: "Document types" },
  { value: "13", label: "Ecosystems" },
];

function breadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://codepliant.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://codepliant.dev/about",
      },
    ],
  };
}

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">
            About Codepliant
          </h1>
          <p className="text-[length:var(--text-lg)] text-ink-secondary mb-[var(--space-16)]">
            Every developer should have access to accurate compliance documents
            without paying thousands for lawyers.
          </p>

          {/* Mission */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">
              Our mission
            </h2>
            <div className="space-y-[var(--space-4)] text-[length:var(--text-base)] text-ink-secondary leading-relaxed">
              <p>
                Every application that collects user data needs legal documents
                — privacy policies, terms of service, cookie disclosures, AI
                transparency notices. Traditionally, developers face three
                options: copy generic templates that don&apos;t reflect what
                their software actually does, pay thousands for legal counsel, or
                skip compliance entirely and hope for the best.
              </p>
              <p>
                We built Codepliant because none of those options are
                acceptable. Compliance documents should be accurate, accessible,
                and derived from reality — not from a questionnaire someone
                filled out six months ago.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">
              How it works
            </h2>
            <div className="space-y-[var(--space-4)] text-[length:var(--text-base)] text-ink-secondary leading-relaxed">
              <p>
                Codepliant takes a fundamentally different approach to
                compliance. Instead of asking you to fill out forms about what
                your application does, it reads your code and figures it out.
              </p>
              <p>
                The CLI scans your project&apos;s dependencies, imports,
                environment variables, and configuration files. It detects which
                services your application actually uses — which payment
                processors, analytics tools, authentication providers, AI
                models, databases, and monitoring services are in your stack.
                Then it generates jurisdiction-aware compliance documents that
                reference your actual services by name.
              </p>
              <p>
                Not &ldquo;third-party analytics.&rdquo; It says PostHog
                because it found PostHog in your code.
              </p>
            </div>
          </section>

          {/* Key principles */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-8)]">
              Key principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-6)]">
              {principles.map((p) => (
                <div key={p.title} className="bg-surface-secondary rounded-lg p-[var(--space-6)]">
                  <h3 className="font-semibold mb-[var(--space-2)]">{p.title}</h3>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-8)]">
              By the numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-6)]">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-[length:var(--text-xl)] font-bold text-brand">
                    {s.value}
                  </div>
                  <div className="text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-1)]">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Open source */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">
              Open source commitment
            </h2>
            <div className="space-y-[var(--space-4)] text-[length:var(--text-base)] text-ink-secondary leading-relaxed">
              <p>
                Codepliant is open source under the{" "}
                <strong>MIT license</strong>. The
                scanning engine, every service signature, and all document
                generators are publicly available. We believe that compliance
                tooling must be transparent — you should be able to audit exactly
                how your documents are generated.
              </p>
              <p>
                Contributions are welcome and encouraged. Whether it&apos;s new
                scanner signatures, additional document types, ecosystem support,
                documentation improvements, or bug reports — the project grows
                through community involvement.
              </p>
            </div>
          </section>

          {/* Community */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">Community-driven</h2>
            <div className="space-y-[var(--space-4)] text-[length:var(--text-base)] text-ink-secondary leading-relaxed">
              <p>
                Codepliant is maintained by a growing community of developers
                who believe compliance should be automated, not outsourced. The
                project welcomes contributions of all kinds — from new scanner
                signatures and document generators to documentation and bug
                fixes.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section>
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">
              Get involved
            </h2>
            <p className="text-[length:var(--text-base)] text-ink-secondary leading-relaxed mb-[var(--space-6)]">
              Check out the repository, read the contributing guide, or just run{" "}
              <code className="bg-code-bg text-code-fg px-[var(--space-2)] py-[var(--space-1)] rounded text-[length:var(--text-sm)]">
                npx codepliant go
              </code>{" "}
              in your project to see it in action.
            </p>
            <div className="flex flex-wrap gap-[var(--space-3)]">
              <a
                href="https://github.com/joechensmartz/codepliant"
                className="inline-flex items-center gap-[var(--space-2)] bg-brand hover:bg-brand-hover text-surface-primary px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150"
                style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5h8.5M8 5l3.5 3.5L8 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/joechensmartz/codepliant/blob/main/CONTRIBUTING.md"
                className="inline-flex items-center gap-[var(--space-2)] border border-border-subtle hover:border-brand hover:text-brand px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150"
                style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contributing guide
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5h8.5M8 5l3.5 3.5L8 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
