import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free CLI & Document Generation Service",
  description:
    "Codepliant CLI is free and open source. We also offer a paid document generation service: single documents from $9, full bundles from $49. All 123+ document types, 13 ecosystems.",
  alternates: {
    canonical: "https://www.codepliant.site/pricing",
  },
  openGraph: {
    title: "Pricing | Codepliant",
    description:
      "Free CLI for scanning code. Paid generation service from $9. All 123+ compliance document types included.",
    url: "https://www.codepliant.site/pricing",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Codepliant",
    description: "Free open source CLI + paid document generation service from $9.",
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

const servicePackages = [
  {
    name: "Single Document",
    price: "$9",
    description: "One compliance document as PDF",
    features: ["Choose any document type", "Based on your actual code", "Delivered as PDF"],
  },
  {
    name: "Full Bundle",
    price: "$49",
    description: "All 120+ documents as ZIP",
    features: ["Every detected document type", "Full code analysis", "Delivered as ZIP archive"],
    popular: true,
  },
  {
    name: "Branded Bundle",
    price: "$99",
    description: "Full bundle with your company branding",
    features: ["Everything in Full Bundle", "Your company name & logo", "Contact info embedded", "Ready to publish"],
  },
];

const faqs = [
  {
    question: "Can I use Codepliant for free?",
    answer:
      "The CLI is free and open source under the MIT license. We also offer a paid document generation service where we scan your repo and deliver publication-ready documents starting at $9.",
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
        name: "Free CLI",
        price: "0",
        priceCurrency: "USD",
        description: features.slice(0, 3).join(", "),
      },
      {
        "@type": "Offer",
        name: "Single Document",
        price: "9",
        priceCurrency: "USD",
        description: "One compliance document as PDF",
      },
      {
        "@type": "Offer",
        name: "Full Bundle",
        price: "49",
        priceCurrency: "USD",
        description: "All 120+ documents as ZIP",
      },
      {
        "@type": "Offer",
        name: "Branded Bundle",
        price: "99",
        priceCurrency: "USD",
        description: "Full bundle with your company branding",
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

          {/* Document Generation Service */}
          <div className="mt-[var(--space-16)]">
            <div className="text-center mb-[var(--space-8)]">
              <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
                Document Generation Service
              </h2>
              <p className="text-[length:var(--text-base)] text-ink-secondary">
                Point us at your repo. We scan your code and deliver publication-ready compliance documents.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-4)] max-w-[720px] mx-auto">
              {servicePackages.map((pkg) => (
                <a
                  key={pkg.name}
                  href="/generate"
                  className="relative rounded-lg p-[var(--space-6)] bg-surface-primary ring-1 ring-border-subtle hover:ring-brand transition-colors duration-150 block"
                  style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-[var(--space-4)] bg-brand text-surface-primary text-[length:var(--text-xs)] font-medium px-[var(--space-2)] py-0.5 rounded">
                      Most Popular
                    </span>
                  )}
                  <div className="font-display text-[length:var(--text-xl)] font-bold mb-[var(--space-1)]">
                    {pkg.price}
                  </div>
                  <div className="font-medium text-[length:var(--text-sm)] mb-[var(--space-2)]">
                    {pkg.name}
                  </div>
                  <p className="text-[length:var(--text-xs)] text-ink-secondary mb-[var(--space-4)]">
                    {pkg.description}
                  </p>
                  <ul className="space-y-[var(--space-2)] text-[length:var(--text-xs)]">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-[var(--space-2)] text-ink-secondary">
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
                      </li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </div>

          {/* CTA banner */}
          <div className="mt-[var(--space-8)] rounded-lg border border-brand/20 bg-brand/5 p-[var(--space-6)] text-center">
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
