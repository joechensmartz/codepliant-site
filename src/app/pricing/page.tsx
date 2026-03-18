import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Starter $10/mo & Pro $30/mo",
  description:
    "Codepliant CLI is free and open source. Document generation service: Starter at $10/mo (5 generations) or Pro at $30/mo (30 generations). Each generation produces 120+ compliance documents.",
  alternates: {
    canonical: "https://www.codepliant.site/pricing",
  },
  openGraph: {
    title: "Pricing | Codepliant",
    description:
      "Free CLI for scanning code. Document generation from $10/mo. 120+ compliance documents per generation.",
    url: "https://www.codepliant.site/pricing",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Codepliant",
    description: "Free open source CLI + document generation service from $10/mo.",
    images: ["/opengraph-image"],
  },
};

const cliFeatures = [
  "Unlimited generations",
  "All 123+ document types",
  "Markdown output",
  "All 13 ecosystems",
  "8 ORM scanners",
  "4 languages (EN/DE/FR/ES)",
  "Open source (MIT)",
  "Community support",
  "Zero network calls",
  "No runtime dependencies",
];

const allPlans = [
  {
    name: "Free CLI",
    price: "$0",
    period: "forever",
    description: "Run locally, generate Markdown",
    features: [
      "Unlimited generations",
      "All 123+ document types",
      "Markdown output",
      "All 13 ecosystems",
      "Open source (MIT)",
      "Zero network calls",
    ],
    cta: "npx codepliant go",
    ctaHref: "/docs",
    ctaStyle: "outline" as const,
  },
  {
    name: "Starter",
    price: "$10",
    period: "/mo",
    description: "5 PDF/DOCX/HTML generations per month",
    features: [
      "5 generations per month",
      "Publication-ready PDF, DOCX, HTML",
      "Professional formatting",
      "Download as ZIP",
      "Just paste your GitHub repo URL",
      "Email support",
    ],
    popular: true,
    cta: "Start Generating",
    ctaHref: "/generate",
    ctaStyle: "solid" as const,
  },
  {
    name: "Pro",
    price: "$30",
    period: "/mo",
    description: "30 PDF/DOCX/HTML generations per month",
    features: [
      "30 generations per month",
      "Everything in Starter",
      "Company branding on documents",
      "Priority support",
    ],
    cta: "Start Generating",
    ctaHref: "/generate",
    ctaStyle: "solid" as const,
  },
];

const exampleDocs = [
  "Privacy Policy",
  "Terms of Service",
  "AI Disclosure",
  "Cookie Policy",
  "Data Processing Agreement",
  "Security Policy",
  "Incident Response Plan",
  "Data Flow Map",
  "DSAR Handling Guide",
  "Data Retention Policy",
  "Access Control Policy",
  "Vendor Security Questionnaire",
];

const faqs = [
  {
    question: "Can I use Codepliant for free?",
    answer:
      "Yes. The CLI is free and open source under the MIT license. Run npx codepliant go to generate Markdown documents locally — unlimited, forever free. The subscription plans are for our web service that generates publication-ready PDF, DOCX, and HTML documents with professional formatting.",
  },
  {
    question: "What counts as one generation?",
    answer:
      "One generation means scanning one repository and producing all applicable compliance documents. Each generation typically produces 120+ documents tailored to your codebase.",
  },
  {
    question: "What output formats are included?",
    answer:
      "The free CLI generates Markdown documents locally. The paid web service generates publication-ready PDF, DOCX, and HTML with professional formatting. All paid formats are included in both Starter and Pro plans.",
  },
  {
    question: "What does \"codepliant diff\" do?",
    answer:
      "The diff command compares your current scan against a previous snapshot and shows what changed — new services detected, removed services, and which compliance documents need updating. It is essential for CI/CD workflows and audit trails.",
  },
  {
    question: "Do you offer enterprise support?",
    answer:
      "Enterprise support and custom features are coming soon. Contact hello@codepliant.site if you are interested.",
  },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant",
    version: "1.1.0",
    description: "Open-source CLI that scans codebases and generates compliance documents automatically.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    offers: [
      {
        "@type": "Offer",
        name: "Free CLI",
        price: "0",
        priceCurrency: "USD",
        description: cliFeatures.slice(0, 3).join(", "),
      },
      {
        "@type": "Offer",
        name: "Starter Plan",
        price: "10",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "10",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "5 document generations per month, 120+ documents each",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "30",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "30",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "30 document generations per month with priority support and custom branding",
      },
    ],
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
        item: "https://www.codepliant.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: "https://www.codepliant.site/pricing",
      },
    ],
  };
}

export default function Pricing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }}
      />

      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-[var(--space-16)]">
            <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">
              Simple, transparent pricing
            </h1>
            <p className="text-[length:var(--text-lg)] text-ink-secondary">
              Markdown is free. PDF, DOCX, and HTML are paid.
            </p>
          </div>

          {/* Free vs Paid distinction */}
          <div className="rounded-lg border border-brand/20 bg-brand/5 p-[var(--space-4)] text-center mb-[var(--space-12)]">
            <p className="text-[length:var(--text-sm)] text-ink-secondary">
              <strong className="text-ink">Free CLI</strong> generates Markdown locally, always free, unlimited.{" "}
              <strong className="text-ink">Paid service</strong> generates publication-ready PDF, DOCX, and HTML — ready to send to lawyers, investors, and partners.
            </p>
          </div>

          {/* All plans — 3 columns */}
          <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-6)] mb-[var(--space-16)]">
            {allPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg p-[var(--space-6)] bg-surface-primary ring-1 ${
                  plan.popular ? "ring-2 ring-brand" : "ring-border-subtle"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-[var(--space-4)] bg-brand text-surface-primary text-[length:var(--text-xs)] font-medium px-[var(--space-2)] py-0.5 rounded">
                    Most Popular
                  </span>
                )}
                <div className="mb-[var(--space-4)]">
                  <div className="font-medium text-[length:var(--text-base)] mb-[var(--space-1)]">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-[var(--space-1)]">
                    <span className="font-display text-[length:var(--text-2xl)] font-bold">{plan.price}</span>
                    <span className="text-[length:var(--text-sm)] text-ink-secondary">{plan.period}</span>
                  </div>
                  <p className="text-[length:var(--text-sm)] mt-[var(--space-2)] text-ink-secondary">
                    {plan.description}
                  </p>
                </div>

                <div className="border-t border-border-subtle mb-[var(--space-4)]" />

                <ul className="space-y-[var(--space-3)] text-[length:var(--text-sm)] mb-[var(--space-6)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-[var(--space-2)]">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0 text-brand"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.ctaHref}
                  className={`block text-center py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150 ${
                    plan.ctaStyle === "solid"
                      ? "bg-brand text-surface-primary hover:bg-brand-hover"
                      : "bg-surface-secondary border border-border-subtle text-ink hover:bg-surface-primary"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          </div>

          {/* Example output section */}
          <div className="rounded-lg border border-border-subtle bg-surface-secondary p-[var(--space-6)] mb-[var(--space-16)]">
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
              Run{" "}
              <code className="font-mono text-brand">npx codepliant go</code>{" "}
              in your project directory — no account needed.
            </p>
            <div className="grid grid-cols-2 gap-[var(--space-2)]">
              {cliFeatures.map((f) => (
                <div key={f} className="flex items-start gap-[var(--space-2)] text-[length:var(--text-xs)] text-ink-secondary">
                  <svg
                    className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <a
              href="https://github.com/joechensmartz/codepliant"
              className="inline-block mt-[var(--space-4)] text-[length:var(--text-sm)] text-brand hover:text-brand-hover font-medium transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Get started on GitHub
            </a>
          </div>

          {/* Example Output section */}
          <div className="mb-[var(--space-16)]">
            <div className="text-center mb-[var(--space-8)]">
              <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
                See what you get
              </h2>
              <p className="text-[length:var(--text-base)] text-ink-secondary">
                Each generation produces 120+ compliance documents tailored to your codebase.
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-surface-primary p-[var(--space-6)]">
              <a
                href="/example-compliance-docs.zip"
                download
                className="flex items-center gap-[var(--space-3)] mb-[var(--space-6)] py-[var(--space-3)] px-[var(--space-4)] rounded-lg bg-brand text-surface-primary hover:bg-brand-hover transition-colors duration-150 text-[length:var(--text-sm)] font-medium"
                style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download example ZIP (generated from a real Next.js project)
              </a>

              <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
                What&apos;s inside:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--space-2)]">
                {exampleDocs.map((doc) => (
                  <div key={doc} className="flex items-start gap-[var(--space-2)] text-[length:var(--text-xs)] text-ink-secondary">
                    <svg
                      className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {doc}
                  </div>
                ))}
              </div>
              <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-4)]">
                ...and 100+ more documents covering security, governance, audit, HR, and vendor management.
              </p>
            </div>
          </div>

          {/* CTA banner */}
          <div className="rounded-lg border border-brand/20 bg-brand/5 p-[var(--space-6)] text-center mb-[var(--space-16)]">
            <p className="font-display font-semibold text-[length:var(--text-base)] text-ink mb-[var(--space-2)]">
              Need expert compliance help?
            </p>
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
              Get a compliance review, custom package, or enterprise consultation tailored to your project.
            </p>
            <a
              href="/contact"
              className="inline-block py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Get Compliance Help
            </a>
          </div>

          {/* FAQ section */}
          <div className="mt-[var(--space-24)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-12)] text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[var(--space-12)] gap-y-[var(--space-8)]">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold mb-[var(--space-2)]">{faq.question}</h3>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
