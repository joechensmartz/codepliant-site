import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free & Open Source",
  description:
    "Codepliant is free and open source under the MIT license. All 123+ document types, all 13 ecosystems included. Start scanning with npx codepliant go.",
  alternates: {
    canonical: "https://codepliant.site/pricing",
  },
  openGraph: {
    title: "Pricing | Codepliant",
    description:
      "Free forever. MIT licensed. All features included. Generate compliance documents from code.",
    url: "https://codepliant.site/pricing",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Codepliant",
    description: "Codepliant is free and open source. All features included.",
    images: ["/opengraph-image"],
  },
};

const features = [
  "Full CLI scanning",
  "All 123+ document types",
  "Markdown output",
  "13 ecosystem support",
  "8 ORM scanners",
  "4 languages (EN/DE/FR/ES)",
  "Open source (MIT)",
  "Community support",
  "Zero network calls",
  "No runtime dependencies",
];

const faqs = [
  {
    question: "Can I use Codepliant for free?",
    answer:
      "Yes. Codepliant is completely free and open source under the MIT license. All features are included — there are no paid tiers or feature restrictions.",
  },
  {
    question: "What does \"codepliant diff\" do?",
    answer:
      "The diff command compares your current scan against a previous snapshot and shows what changed — new services detected, removed services, and which compliance documents need updating. It is essential for CI/CD workflows and audit trails.",
  },
  {
    question: "Is there a limit on document types?",
    answer:
      "No. You get access to all 123+ document types with no limits. Every feature is available for free.",
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
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: features.slice(0, 3).join(", "),
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
        item: "https://codepliant.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: "https://codepliant.site/pricing",
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
        <div className="max-w-[640px] mx-auto">
          <div className="text-center mb-[var(--space-16)]">
            <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">
              Free &amp; Open Source
            </h1>
            <p className="text-[length:var(--text-lg)] text-ink-secondary">
              Free forever. MIT licensed. All features included.
            </p>
          </div>

          {/* Single plan card */}
          <div className="rounded-lg p-[var(--space-8)] bg-surface-primary ring-1 ring-border-subtle max-w-[480px] mx-auto">
            <div className="mb-[var(--space-6)]">
              <div className="flex items-baseline gap-[var(--space-2)]">
                <span className="font-display text-[length:var(--text-2xl)] font-bold">$0</span>
                <span className="text-[length:var(--text-sm)] text-ink-secondary">forever</span>
              </div>
              <p className="text-[length:var(--text-sm)] mt-[var(--space-3)] text-ink-secondary">
                Everything you need to scan your codebase and generate compliance documents. No restrictions.
              </p>
            </div>

            <div className="border-t border-border-subtle mb-[var(--space-6)]" />

            <ul className="space-y-[var(--space-3)] text-[length:var(--text-sm)] mb-[var(--space-8)]">
              {features.map((f) => (
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
              href="https://github.com/joechensmartz/codepliant"
              className="block text-center py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              Get started on GitHub
            </a>
          </div>

          {/* Enterprise note */}
          <p className="text-center text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-8)]">
            Enterprise support and custom features coming soon — contact{" "}
            <a href="mailto:hello@codepliant.site" className="text-brand hover:text-brand-hover font-medium">
              hello@codepliant.site
            </a>
          </p>

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
