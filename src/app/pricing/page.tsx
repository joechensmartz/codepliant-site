import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Codepliant pricing plans. Free for open source, Pro at $19/month, Team at $49/month. Generate compliance documents from your code.",
  alternates: {
    canonical: "https://codepliant.dev/pricing",
  },
  openGraph: {
    title: "Pricing | Codepliant",
    description:
      "Free for open source. Pro at $19/mo. Team at $49/mo. Generate compliance documents from code.",
    url: "https://codepliant.dev/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Codepliant",
    description: "Codepliant pricing. Free, Pro $19/mo, Team $49/mo.",
    images: ["/og-image.png"],
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For individual developers and open source projects.",
    features: [
      "Full CLI scanning",
      "Markdown output",
      "Up to 5 document types",
      "12 ecosystem support",
      "8 ORM scanners",
      "4 languages (EN/DE/FR/ES)",
      "Open source (MIT)",
      "Community support",
    ],
    cta: "Get started",
    href: "https://github.com/joechensmartz/codepliant",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    badge: "Most Popular",
    desc: "For solo developers, freelancers, and startups.",
    features: [
      "Everything in Free",
      "Unlimited document types",
      "HTML, PDF, DOCX & JSON output",
      "Change detection (codepliant diff)",
      "Notion & Confluence export",
      "CI/CD GitHub Action",
      "Custom branding & templates",
      "Priority email support",
    ],
    cta: "Start free trial",
    href: "/docs",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    desc: "For teams and organizations managing multiple projects.",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Multi-project scanning (scan-all)",
      "Webhook notifications",
      "Custom compliance templates",
      "Shared template library",
      "SSO / SAML",
      "Dedicated support with SLA",
    ],
    cta: "Contact us",
    href: "mailto:hello@codepliant.dev",
    highlight: false,
  },
];

const faqs = [
  {
    question: "Can I use Codepliant for free?",
    answer:
      "Yes. The CLI is free and open source under the MIT license. You get full scanning, Markdown output, and up to 5 document types at no cost. The Pro and Team plans unlock additional output formats, unlimited document types, and collaboration features.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes. Pro comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Both Pro and Team plans are month-to-month. Cancel anytime from your dashboard. No long-term contracts.",
  },
  {
    question: "What does \"codepliant diff\" do?",
    answer:
      "The diff command compares your current scan against a previous snapshot and shows what changed — new services detected, removed services, and which compliance documents need updating. It is essential for CI/CD workflows and audit trails.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes. Pro is $149/year (save $79) and Team is $399/year (save $189). Contact us for annual pricing.",
  },
  {
    question: "Do you offer discounts for startups?",
    answer:
      "Yes. We offer 50% off the first year for startups with fewer than 10 employees. Contact us for details.",
  },
  {
    question: "What happens if I exceed 5 document types on Free?",
    answer:
      "The Free plan generates up to 5 document types per scan. If your project needs more, upgrading to Pro unlocks all 120+ document types with no limits.",
  },
  {
    question: "Can I self-host the Team dashboard?",
    answer:
      "Not yet, but it is on the roadmap. Currently the Team dashboard is a hosted solution. Enterprise customers can contact us about on-premise deployment options.",
  },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant",
    description: "Open-source CLI that scans codebases and generates compliance documents automatically.",
    applicationCategory: "DeveloperApplication",
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.replace("$", ""),
      priceCurrency: "USD",
      ...(p.period === "/month" ? { billingIncrement: "P1M" } : {}),
      description: p.features.slice(0, 3).join(", "),
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
        item: "https://codepliant.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: "https://codepliant.dev/pricing",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }}
      />

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing</h1>
            <p className="text-lg text-ink-secondary">
              Free for open source. Pay only when you need more.
            </p>
          </div>

          {/* Pricing cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-brand text-surface-primary ring-2 ring-brand scale-[1.02]"
                    : "bg-surface-primary ring-1 ring-border-subtle"
                }`}
              >
                {/* "Most Popular" badge */}
                {"badge" in plan && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-surface-primary text-brand text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">{plan.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span
                      className={`text-sm font-normal ${
                        plan.highlight ? "text-surface-primary/70" : "text-ink-secondary"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-3 ${
                      plan.highlight ? "text-surface-primary/70" : "text-ink-secondary"
                    }`}
                  >
                    {plan.desc}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className={`border-t mb-6 ${
                    plan.highlight ? "border-white/20" : "border-border-subtle"
                  }`}
                />

                {/* Features */}
                <ul className="space-y-3 text-sm mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlight ? "text-surface-primary" : "text-brand"
                        }`}
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

                {/* CTA button */}
                <a
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-surface-primary text-brand hover:bg-surface-secondary"
                      : "bg-surface-secondary border border-border-subtle hover:bg-surface-tertiary"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Annual savings note */}
          <p className="text-center text-sm text-ink-secondary mt-8">
            Save up to 34% with annual billing. All plans include a 14-day free
            trial.
          </p>

          {/* FAQ section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">
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
