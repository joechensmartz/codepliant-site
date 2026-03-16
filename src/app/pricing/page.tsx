import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Codepliant pricing plans. Free for open source, Pro at $29/month, Team at $79/month. Generate compliance documents from your code.",
  alternates: {
    canonical: "https://codepliant.dev/pricing",
  },
  openGraph: {
    title: "Pricing | Codepliant",
    description:
      "Free for open source. Pro at $29/mo. Team at $79/mo. Generate compliance documents from code.",
    url: "https://codepliant.dev/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Codepliant",
    description: "Codepliant pricing. Free, Pro $29/mo, Team $79/mo.",
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
      "All 25+ document types",
      "10+ ecosystem support",
      "8 ORM scanners",
      "Markdown output",
      "CLI access",
      "4 languages (EN/DE/FR/ES)",
      "Open source (MIT)",
      "Community support",
    ],
    cta: "Get started",
    href: "https://github.com/codepliant/codepliant",
    primary: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For startups and professional developers.",
    features: [
      "Everything in Free",
      "HTML & PDF output",
      "Custom branding & logo",
      "CI/CD integration",
      "Compliance page hosting",
      "Cookie banner widget",
      "Badge embedding",
      "Priority email support",
    ],
    cta: "Start free trial",
    href: "#",
    primary: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    desc: "For teams and organizations.",
    features: [
      "Everything in Pro",
      "Monorepo support",
      "Compliance API server",
      "Team dashboard",
      "MCP server (7 tools)",
      "Plugin system",
      "SLA guarantee",
      "Dedicated support",
    ],
    cta: "Contact us",
    href: "#",
    primary: false,
  },
];

const faqs = [
  {
    question: "Can I use Codepliant for free?",
    answer:
      "Yes. The CLI is free and open source under the MIT license. You get all 25+ document types, all ecosystems, and Markdown output at no cost. The Pro and Team plans add output formats, branding, and collaboration features.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes. Pro comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Both Pro and Team plans are month-to-month. Cancel anytime from your dashboard.",
  },
  {
    question: "Do you offer discounts for startups?",
    answer:
      "Yes. We offer 50% off the first year for startups with fewer than 10 employees. Contact us for details.",
  },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant",
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

export default function Pricing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />

      <section className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing</h1>
            <p className="text-lg text-muted">
              Free for open source. Pay only when you need more.
            </p>
          </div>

          <div className="space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.primary
                    ? "bg-brand text-white ring-2 ring-brand"
                    : "bg-surface"
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <div className="text-2xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal opacity-70">
                      {plan.period}
                    </span>
                  </div>
                </div>
                <p
                  className={`text-sm mb-6 ${
                    plan.primary ? "text-white/70" : "text-muted"
                  }`}
                >
                  {plan.desc}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    plan.primary
                      ? "bg-white text-brand hover:bg-gray-100"
                      : "bg-surface-secondary border border-border-subtle hover:bg-surface-tertiary"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
              Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted leading-relaxed">
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
