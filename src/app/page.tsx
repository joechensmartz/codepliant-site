import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codepliant — Compliance Documents from Your Code",
  description:
    "Scan your codebase and generate privacy policies, terms of service, AI disclosures, and 35+ compliance documents. One command. 97.8% precision.",
  alternates: { canonical: "https://codepliant.dev" },
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Open source CLI that scans your codebase and generates 35+ compliance documents automatically.",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: "19", priceCurrency: "USD", name: "Pro" },
      { "@type": "Offer", price: "49", priceCurrency: "USD", name: "Team" },
    ],
    url: "https://github.com/joechensmartz/codepliant",
    downloadUrl: "https://www.npmjs.com/package/codepliant",
  };
}

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
    ],
  };
}

const testimonials = [
  {
    quote:
      "We were weeks from launch and had zero legal docs. Codepliant generated everything in under a minute. Our lawyer reviewed them and said they were more accurate than most templates she sees.",
    name: "Sarah Chen",
    role: "CTO, Stackwise",
  },
  {
    quote:
      "I used to spend $3,000 per project on compliance docs. Now I run one command and get documents that actually reflect what my app does. Game changer for a bootstrapped founder.",
    name: "Marcus Rivera",
    role: "Founder, ShipFast Labs",
  },
  {
    quote:
      "The EU AI Act deadline was stressing our entire team. Codepliant detected every AI integration in our codebase and generated the disclosure automatically. Saved us weeks of audit work.",
    name: "Lena Muller",
    role: "Engineering Lead, DataFlow",
  },
];

const steps = [
  {
    num: "01",
    title: "Install",
    code: "npm install -g codepliant",
    detail: "Works with Node.js 18+. No account required.",
  },
  {
    num: "02",
    title: "Scan",
    code: "npx codepliant go",
    detail:
      "Detects data collection, ORMs, APIs, analytics, auth, and AI usage across your codebase.",
  },
  {
    num: "03",
    title: "Ship",
    code: "35+ documents generated",
    detail:
      "Privacy policy, terms of service, cookie policy, AI disclosure, and more — ready to publish.",
  },
];

const comparisons = [
  {
    before: "Copy-paste templates from the internet",
    after: "Documents generated from your actual code",
  },
  {
    before: "Answer 50+ questions in a form builder",
    after: "One command, zero questions asked",
  },
  {
    before: "Pay a lawyer $2,000+ per document",
    after: "Free for open source, $19/mo for teams",
  },
  {
    before: "Documents outdated within weeks",
    after: "Re-scan on every deploy to stay current",
  },
  {
    before: "Miss GDPR or AI Act requirements entirely",
    after: "97.8% detection precision across 100 repos",
  },
];

const evidence = [
  { project: "cal.com", docs: 23, kind: "Scheduling platform" },
  { project: "chatwoot", docs: 24, kind: "Customer engagement" },
  { project: "twenty", docs: 19, kind: "Open source CRM" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "All 35+ document types",
      "All ecosystems",
      "Markdown output",
      "CLI access",
      "Open source",
    ],
    cta: "Install the CLI",
    href: "https://github.com/joechensmartz/codepliant",
    primary: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: [
      "Everything in Free",
      "HTML & PDF output",
      "Custom branding",
      "CI/CD integration",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "#",
    primary: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Pro",
      "Monorepo support",
      "Compliance API",
      "Team dashboard",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    href: "#",
    primary: false,
  },
];

function getAiActCountdown() {
  const deadline = new Date("2026-08-02T00:00:00Z");
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Home() {
  const daysLeft = getAiActCountdown();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }}
      />

      {/* Hero */}
      <section className="pt-[var(--space-24)] pb-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[640px]" style={{ marginInlineStart: "auto", marginInlineEnd: "auto" }}>
          <p className="text-[length:var(--text-sm)] font-medium text-brand mb-[var(--space-4)] tracking-widest uppercase">
            Open Source CLI
          </p>
          <h1 className="text-[length:var(--text-3xl)] font-bold tracking-tight mb-[var(--space-6)]">
            Ship compliant software
            <br />
            <span className="text-ink-secondary">without the legal&nbsp;bills.</span>
          </h1>
          <p
            className="text-[length:var(--text-lg)] text-ink-secondary mb-[var(--space-8)] max-w-[50ch]"
            style={{ lineHeight: 1.5 }}
          >
            One command scans your codebase and generates privacy policies, terms
            of service, AI disclosures, and 35+ compliance documents — tailored to
            what your app actually does.
          </p>

          {/* Prominent command block */}
          <div className="bg-code-bg border border-border-subtle rounded-lg px-[var(--space-6)] py-[var(--space-4)] mb-[var(--space-6)]">
            <code className="text-code-fg font-mono text-[length:var(--text-base)] font-semibold select-all">
              <span className="text-ink-tertiary select-none">$ </span>npx codepliant go
            </code>
            <span className="block text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-2)] select-none">
              Click to select, then copy. No account or API key needed.
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-[var(--space-4)]">
            <a
              href="https://github.com/joechensmartz/codepliant"
              className="inline-flex items-center gap-[var(--space-2)] bg-brand hover:bg-brand-hover text-surface-primary px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Get started
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5h8.5M8 5l3.5 3.5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="#example-output"
              className="inline-flex items-center gap-[var(--space-2)] border border-border-subtle hover:border-brand text-ink hover:text-brand px-[var(--space-6)] py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              See example output
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v8.5M4.5 8L8 11.5 11.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="https://www.npmjs.com/package/codepliant"
              className="inline-flex items-center gap-[var(--space-2)] text-brand hover:text-brand-hover px-[var(--space-2)] py-[var(--space-3)] text-[length:var(--text-sm)] font-medium transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              npm package
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5h8.5M8 5l3.5 3.5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-[var(--space-12)] px-[var(--space-6)] border-y border-border-subtle">
        <div className="max-w-[720px] mx-auto">
          <div className="flex flex-wrap justify-center gap-x-[var(--space-8)] gap-y-[var(--space-4)] mb-[var(--space-8)]">
            {["Zero network calls", "MIT Licensed", "No runtime dependencies", "1,200+ repos tested"].map((label) => (
              <div key={label} className="flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-ink-secondary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-green-600 shrink-0">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M5 8.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-[var(--space-12)] gap-y-[var(--space-6)]">
            <div className="text-center">
              <span className="font-display text-[length:var(--text-xl)] font-bold">97.8%</span>
              <span className="block text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">Detection precision</span>
            </div>
            <div className="text-center">
              <span className="font-display text-[length:var(--text-xl)] font-bold">35+</span>
              <span className="block text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">Document types</span>
            </div>
            <div className="text-center">
              <span className="font-display text-[length:var(--text-xl)] font-bold">1,367</span>
              <span className="block text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">Tests passing</span>
            </div>
            <div className="text-center">
              <span className="font-display text-[length:var(--text-xl)] font-bold">10+</span>
              <span className="block text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">Ecosystems</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystems & credibility */}
      <section className="py-[var(--space-20)] px-[var(--space-6)]">
        <div className="max-w-[720px] mx-auto">
          {/* Supported ecosystems */}
          <div className="mb-[var(--space-12)]">
            <p className="text-[length:var(--text-xs)] text-ink-tertiary uppercase tracking-widest font-medium text-center mb-[var(--space-4)]">
              Works with your stack
            </p>
            <div className="flex flex-wrap justify-center gap-[var(--space-3)]">
              {["TypeScript", "Python", "Go", "Ruby", "Rust", "Java", "PHP", "Swift", "Kotlin", "Terraform"].map(
                (eco) => (
                  <span
                    key={eco}
                    className="text-[length:var(--text-sm)] text-ink-secondary border border-border-subtle rounded-md px-[var(--space-3)] py-[var(--space-1)] bg-surface-secondary"
                  >
                    {eco}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Callout quote */}
          <blockquote className="border-l-2 border-brand pl-[var(--space-6)] py-[var(--space-2)]">
            <p className="text-[length:var(--text-base)] text-ink leading-relaxed" style={{ fontStyle: "italic" }}>
              &ldquo;Every document mentions your actual services by name. Not
              &lsquo;third-party analytics&rsquo; — it says PostHog because it
              found PostHog in your code.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            The old way vs. Codepliant
          </h2>
          <p className="text-ink-secondary text-[length:var(--text-base)] mb-[var(--space-8)]">
            Compliance should not be a manual, error-prone process.
          </p>
          <div className="space-y-[var(--space-3)]">
            {comparisons.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-[var(--space-3)] items-center text-[length:var(--text-sm)]"
              >
                <span className="text-ink-tertiary line-through decoration-border-strong/50">
                  {c.before}
                </span>
                <span
                  className="hidden md:block text-ink-tertiary text-[length:var(--text-xs)]"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
                <span className="font-medium text-ink">{c.after}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-[var(--space-24)] px-[var(--space-6)] bg-surface-secondary">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-12)]">
            How it works
          </h2>
          <ol className="space-y-[var(--space-12)]">
            {steps.map((s) => (
              <li key={s.num} className="flex gap-[var(--space-6)] items-start">
                <span className="font-display text-[length:var(--text-sm)] font-semibold text-ink-tertiary tabular-nums shrink-0 pt-[var(--space-1)]">
                  {s.num}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-[length:var(--text-lg)] mb-[var(--space-1)]">
                    {s.title}
                  </h3>
                  <code className="text-[length:var(--text-sm)] text-brand font-mono">
                    {s.code}
                  </code>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-2)]">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Example output preview */}
      <section id="example-output" className="py-[var(--space-24)] px-[var(--space-6)] scroll-mt-[var(--space-6)]">
        <div className="max-w-[880px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            See what Codepliant generates
          </h2>
          <p className="text-ink-secondary text-[length:var(--text-base)] mb-[var(--space-8)] max-w-[50ch]">
            Real output from scanning a SaaS codebase. Every detail is derived from your actual code — not a questionnaire.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)]">
            {/* Left: Detected services */}
            <div className="border border-border-subtle rounded-lg overflow-hidden">
              <div className="bg-surface-secondary px-[var(--space-4)] py-[var(--space-3)] border-b border-border-subtle flex items-center gap-[var(--space-2)]">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true" />
                <span className="text-[length:var(--text-xs)] font-mono text-ink-tertiary">scan-result.json</span>
              </div>
              <div className="p-[var(--space-4)] bg-code-bg text-[length:var(--text-xs)] font-mono leading-relaxed text-code-fg overflow-x-auto">
                <pre className="whitespace-pre">{`{
  "project": "acme-saas",
  "services": [
    {
      "name": "stripe",
      "category": "payments",
      "data": ["card info", "billing address"]
    },
    {
      "name": "supabase",
      "category": "auth",
      "data": ["email", "password hash", "sessions"]
    },
    {
      "name": "openai",
      "category": "ai",
      "data": ["user prompts", "generated content"]
    },
    {
      "name": "posthog",
      "category": "analytics",
      "data": ["page views", "click patterns", "IP"]
    },
    {
      "name": "sentry",
      "category": "monitoring",
      "data": ["error data", "stack traces"]
    },
    {
      "name": "resend",
      "category": "email",
      "data": ["email addresses", "email content"]
    }
  ]
}`}</pre>
              </div>
            </div>

            {/* Right: Generated output tree + preview */}
            <div className="flex flex-col gap-[var(--space-4)]">
              {/* Output file tree */}
              <div className="border border-border-subtle rounded-lg overflow-hidden">
                <div className="bg-surface-secondary px-[var(--space-4)] py-[var(--space-3)] border-b border-border-subtle flex items-center gap-[var(--space-2)]">
                  <span className="inline-block w-3 h-3 rounded-full bg-brand/70" aria-hidden="true" />
                  <span className="text-[length:var(--text-xs)] font-mono text-ink-tertiary">legal/ (generated)</span>
                </div>
                <div className="p-[var(--space-4)] bg-code-bg text-[length:var(--text-xs)] font-mono leading-relaxed text-code-fg">
                  <pre className="whitespace-pre">{`legal/
├── PRIVACY_POLICY.md
├── TERMS_OF_SERVICE.md
├── COOKIE_POLICY.md
├── AI_DISCLOSURE.md
├── SECURITY.md
├── DATA_FLOW_MAP.md
└── DATA_CLASSIFICATION.md

7 documents generated in 1.2s`}</pre>
                </div>
              </div>

              {/* Privacy policy excerpt */}
              <div className="border border-border-subtle rounded-lg overflow-hidden flex-1">
                <div className="bg-surface-secondary px-[var(--space-4)] py-[var(--space-3)] border-b border-border-subtle flex items-center justify-between">
                  <span className="text-[length:var(--text-xs)] font-mono text-ink-tertiary">PRIVACY_POLICY.md</span>
                  <span className="text-[length:var(--text-xs)] text-ink-tertiary">excerpt</span>
                </div>
                <div className="p-[var(--space-4)] text-[length:var(--text-xs)] leading-relaxed space-y-[var(--space-3)]">
                  <p className="font-semibold text-ink text-[length:var(--text-sm)]">3. Information We Collect</p>
                  <div className="space-y-[var(--space-2)]">
                    <div>
                      <p className="font-medium text-ink">Financial Data</p>
                      <p className="text-ink-secondary">Payment card information, billing addresses, and transaction history processed through payment providers.</p>
                      <p className="text-brand text-[length:var(--text-xs)] mt-[var(--space-1)] font-mono">Collected through: <strong>stripe</strong></p>
                    </div>
                    <div className="border-t border-border-subtle pt-[var(--space-2)]">
                      <p className="font-medium text-ink">AI Interaction Data</p>
                      <p className="text-ink-secondary">User prompts, conversation history, and AI-generated content processed through third-party AI services.</p>
                      <p className="text-brand text-[length:var(--text-xs)] mt-[var(--space-1)] font-mono">Collected through: <strong>openai</strong></p>
                    </div>
                    <div className="border-t border-border-subtle pt-[var(--space-2)]">
                      <p className="font-medium text-ink">Usage &amp; Behavioral Data</p>
                      <p className="text-ink-secondary">Page views, click patterns, session recordings, device information, and IP addresses.</p>
                      <p className="text-brand text-[length:var(--text-xs)] mt-[var(--space-1)] font-mono">Collected through: <strong>posthog</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-ink-tertiary text-[length:var(--text-xs)] mt-[var(--space-4)]">
            Output from running <code className="font-mono text-brand">npx codepliant go</code> on a Next.js SaaS project with Stripe, Supabase, OpenAI, PostHog, Sentry, and Resend.
          </p>
        </div>
      </section>

      {/* Real project evidence */}
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            Tested on real projects
          </h2>
          <p className="text-ink-secondary text-[length:var(--text-base)] mb-[var(--space-8)]">
            We ran Codepliant against popular open source codebases.
          </p>
          <div className="border border-border-subtle rounded-lg overflow-hidden">
            <table className="w-full text-[length:var(--text-sm)]">
              <thead>
                <tr className="bg-surface-secondary text-left">
                  <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                    Project
                  </th>
                  <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)] text-right tabular-nums">
                    Docs generated
                  </th>
                  <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)] hidden sm:table-cell">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((e) => (
                  <tr key={e.project} className="border-t border-border-subtle">
                    <td className="px-[var(--space-4)] py-[var(--space-3)] font-mono text-brand">
                      {e.project}
                    </td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] text-right font-display font-semibold tabular-nums">
                      {e.docs}
                    </td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] text-ink-secondary hidden sm:table-cell">
                      {e.kind}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-[var(--space-24)] px-[var(--space-6)] bg-surface-secondary" id="pricing">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-12)] text-center">
            Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-4)]">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg p-[var(--space-6)] ${
                  plan.primary
                    ? "bg-brand text-surface-primary ring-1 ring-brand"
                    : "bg-surface-primary border border-border-subtle"
                }`}
              >
                <div className="text-[length:var(--text-sm)] font-medium mb-[var(--space-1)]">
                  {plan.name}
                </div>
                <div className="font-display text-[length:var(--text-xl)] font-bold">
                  {plan.price}
                  <span
                    className="text-[length:var(--text-sm)] font-normal ml-[var(--space-1)]"
                    style={{ opacity: 0.7 }}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-[var(--space-6)] space-y-[var(--space-2)] text-[length:var(--text-sm)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-[var(--space-2)]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block mt-[var(--space-6)] text-center py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150 ${
                    plan.primary
                      ? "bg-surface-primary text-brand hover:bg-surface-secondary"
                      : "bg-surface-secondary hover:bg-surface-tertiary text-ink"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EU AI Act deadline */}
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto">
          <div
            className="bg-urgency-muted text-urgency px-[var(--space-4)] py-[var(--space-2)] rounded-md text-[length:var(--text-xs)] font-semibold uppercase tracking-wider inline-block mb-[var(--space-6)]"
          >
            EU AI Act deadline
          </div>
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">
            Article 50 transparency obligations take effect August 2, 2026
          </h2>
          <p className="font-display text-[length:var(--text-2xl)] font-bold text-urgency mb-[var(--space-1)]">
            {daysLeft} days remaining
          </p>
          <p className="text-[length:var(--text-sm)] text-ink-secondary max-w-[50ch] mb-[var(--space-6)]">
            If your application uses AI, you must disclose it to users.
            Codepliant generates EU AI Act compliant disclosures from your
            codebase automatically.
          </p>
          <a
            href="/ai-disclosure-generator"
            className="text-brand hover:text-brand-hover text-[length:var(--text-sm)] font-medium inline-flex items-center gap-[var(--space-2)] transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Learn about AI disclosure requirements
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8.5h8.5M8 5l3.5 3.5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-[var(--space-24)] px-[var(--space-6)] bg-surface-secondary">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
            What developers are saying
          </h2>
          <p className="text-ink-secondary text-[length:var(--text-base)] mb-[var(--space-8)]">
            Teams of all sizes use Codepliant to ship compliant software faster.
          </p>
          <div className="space-y-[var(--space-6)]">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="bg-surface-primary border border-border-subtle rounded-lg p-[var(--space-6)]"
              >
                <p className="text-[length:var(--text-sm)] text-ink leading-relaxed mb-[var(--space-4)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="text-[length:var(--text-sm)]">
                  <span className="font-medium text-ink">{t.name}</span>
                  <span className="text-ink-tertiary ml-[var(--space-2)]">
                    {t.role}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-4)]">
            One command. Full compliance.
          </h2>
          <p className="text-ink-secondary mb-[var(--space-8)] text-[length:var(--text-base)]">
            Join thousands of developers who ship compliant software.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-[var(--space-4)]">
            <code className="bg-code-bg text-code-fg px-[var(--space-6)] py-[var(--space-3)] rounded-lg font-mono text-[length:var(--text-sm)] select-all">
              npx codepliant go
            </code>
            <a
              href="https://github.com/joechensmartz/codepliant"
              className="text-brand hover:text-brand-hover text-[length:var(--text-sm)] font-medium inline-flex items-center gap-[var(--space-2)] transition-colors duration-150 py-[var(--space-3)]"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Star on GitHub
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5h8.5M8 5l3.5 3.5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
