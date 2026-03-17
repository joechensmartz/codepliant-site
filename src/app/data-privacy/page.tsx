import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Privacy Compliance for Developers",
  description:
    "Complete data privacy compliance toolkit for developers. Scan your codebase to generate GDPR, HIPAA, SOC 2, and AI governance documentation. One tool for all your privacy compliance needs.",
  alternates: {
    canonical: "https://codepliant.dev/data-privacy",
  },
  openGraph: {
    title: "Data Privacy Compliance for Developers",
    description:
      "Developer privacy tool covering GDPR, HIPAA, SOC 2, and AI governance. Generate compliance docs from code.",
    url: "https://codepliant.dev/data-privacy",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Privacy Compliance for Developers",
    description:
      "One tool for GDPR, HIPAA, SOC 2, and AI compliance. Scan code, generate docs.",
    images: ["/og-image.png"],
  },
};

const frameworks = [
  {
    name: "GDPR Compliance",
    href: "/gdpr-compliance",
    desc: "EU General Data Protection Regulation. Required if you process personal data of EU residents. Codepliant generates privacy policies, DPAs, data flow maps, and 10+ GDPR documents.",
    tags: ["Privacy Policy", "DPA", "DSAR Guide", "Data Flow Map"],
  },
  {
    name: "HIPAA Compliance",
    href: "/hipaa-compliance",
    desc: "US Health Insurance Portability and Accountability Act. Required if your app handles Protected Health Information. Codepliant detects PHI in your code and generates risk assessments and BAAs.",
    tags: ["Risk Assessment", "BAA", "PHI Detection", "Access Controls"],
  },
  {
    name: "SOC 2 Compliance",
    href: "/soc2-compliance",
    desc: "Service Organization Control 2. Expected by enterprise buyers for SaaS products. Codepliant maps your security controls to Trust Service Criteria and generates audit-ready evidence.",
    tags: ["Readiness Checklist", "Control Mapping", "Gap Analysis"],
  },
  {
    name: "AI Governance",
    href: "/ai-governance",
    desc: "NIST AI RMF and EU AI Act alignment. Required if your application uses AI or machine learning. Codepliant generates model inventories, risk assessments, and transparency disclosures.",
    tags: ["AI Model Inventory", "Risk Assessment", "Transparency Notice"],
  },
  {
    name: "EU AI Act Disclosure",
    href: "/ai-disclosure-generator",
    desc: "Article 50 transparency obligations take effect August 2, 2026. If your app uses AI, you must disclose it. Codepliant generates compliant AI disclosure documents from your codebase.",
    tags: ["AI Disclosure", "Transparency Report", "Article 50"],
  },
  {
    name: "Cookie Policy",
    href: "/cookie-policy-generator",
    desc: "ePrivacy Directive and GDPR cookie consent requirements. Codepliant detects tracking scripts, analytics SDKs, and cookie usage in your code to generate accurate cookie policies.",
    tags: ["Cookie Policy", "Consent Guide", "Tracker Detection"],
  },
];

const generators = [
  { name: "Privacy Policy Generator", href: "/privacy-policy-generator" },
  { name: "Terms of Service Generator", href: "/terms-of-service-generator" },
  { name: "Cookie Policy Generator", href: "/cookie-policy-generator" },
  { name: "AI Disclosure Generator", href: "/ai-disclosure-generator" },
];

function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant Data Privacy Compliance Tool",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Data privacy compliance tool for developers. Scans code and generates GDPR, HIPAA, SOC 2, and AI governance documentation.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
        name: "Data Privacy",
        item: "https://codepliant.dev/data-privacy",
      },
    ],
  };
}

export default function DataPrivacy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd()) }}
      />

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Data Privacy
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Data Privacy Compliance for Developers
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            Data privacy regulations are multiplying. GDPR, HIPAA, SOC 2, the
            EU AI Act — each with its own documentation requirements. Codepliant
            is a developer privacy tool that scans your codebase once and
            generates compliance documentation for every framework that applies
            to your application.
          </p>

          {/* Compliance frameworks hub */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Compliance frameworks
            </h2>
            <div className="space-y-4">
              {frameworks.map((fw) => (
                <a
                  key={fw.name}
                  href={fw.href}
                  className="block bg-surface-secondary rounded-xl p-5 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{fw.name}</h3>
                  <p className="text-sm text-ink-secondary mb-3">{fw.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {fw.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-surface-secondary px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Document generators */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Document generators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generators.map((gen) => (
                <a
                  key={gen.name}
                  href={gen.href}
                  className="bg-surface-secondary rounded-xl px-4 py-3 text-sm font-medium hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  {gen.name}
                </a>
              ))}
            </div>
          </section>

          {/* How Codepliant works */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              One scan, every framework
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Most compliance tools focus on a single regulation. Codepliant
                takes a different approach: it scans your codebase to understand
                what your application actually does with data — then generates
                documentation for every applicable framework simultaneously.
              </p>
              <p>
                The scan detects database schemas, API integrations, analytics
                SDKs, authentication flows, AI/ML usage, health data handling,
                payment processing, and third-party data sharing. From this
                single analysis, Codepliant produces 35+ document types across
                GDPR, HIPAA, SOC 2, EU AI Act, and general data privacy
                requirements.
              </p>
              <p>
                Because all documents are generated from your actual code, they
                stay consistent with each other and accurate as your application
                evolves. Run Codepliant in your CI/CD pipeline to keep
                compliance documentation in sync with every deployment.
              </p>
            </div>
          </section>

          {/* Who needs data privacy compliance */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Which regulations apply to you
            </h2>
            <div className="space-y-4">
              {[
                {
                  scenario: "You have users in the EU",
                  frameworks: "GDPR, ePrivacy Directive, EU AI Act (if using AI)",
                },
                {
                  scenario: "You handle health information",
                  frameworks: "HIPAA, plus GDPR if EU users are included",
                },
                {
                  scenario: "You sell to enterprise customers",
                  frameworks: "SOC 2, plus GDPR/HIPAA depending on data types",
                },
                {
                  scenario: "You use AI or machine learning",
                  frameworks: "EU AI Act, NIST AI RMF, state-level AI laws",
                },
                {
                  scenario: "You operate a SaaS product",
                  frameworks: "Privacy policy, terms of service, cookie policy at minimum",
                },
              ].map((item) => (
                <div key={item.scenario} className="bg-surface-secondary rounded-xl p-5">
                  <h3 className="font-semibold mb-1">{item.scenario}</h3>
                  <p className="text-sm text-ink-secondary">{item.frameworks}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Compare */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              How Codepliant compares
            </h2>
            <a
              href="/compare"
              className="block bg-surface-secondary rounded-xl p-5 hover:ring-1 hover:ring-border-strong transition-shadow"
            >
              <h3 className="font-semibold mb-2">
                Codepliant vs Termly vs Iubenda
              </h3>
              <p className="text-sm text-ink-secondary">
                See how code-based scanning compares to form builders and cookie
                consent platforms for compliance documentation. Feature-by-feature
                comparison across privacy policies, GDPR, SOC 2, HIPAA, and AI
                Act coverage.
              </p>
            </a>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Scan your codebase for data privacy compliance
            </h2>
            <p className="text-ink-secondary text-sm mb-6">
              Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
