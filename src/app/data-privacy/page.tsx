import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Data Privacy Compliance Tool for Developers | GDPR, CCPA, LGPD, PIPEDA",
  description:
    "Detect personal data usage in your code and generate privacy compliance docs for GDPR, CCPA, LGPD, PIPEDA, and DPDP Act. Free, open source CLI.",
  keywords: [
    "data privacy compliance",
    "data privacy tool",
    "GDPR compliance",
    "CCPA compliance",
    "LGPD compliance",
    "PIPEDA compliance",
    "DPDP Act",
    "privacy by design",
    "privacy policy generator",
    "data protection",
    "developer privacy tool",
    "code scanner privacy",
    "personal data detection",
    "privacy regulations",
  ],
  alternates: {
    canonical: "https://codepliant.dev/data-privacy",
  },
  openGraph: {
    title: "Data Privacy Compliance Tool for Developers",
    description:
      "Detect personal data usage in your code and generate privacy compliance docs for GDPR, CCPA, LGPD, PIPEDA, and DPDP Act. Free, open source CLI.",
    url: "https://codepliant.dev/data-privacy",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Privacy Compliance Tool for Developers",
    description:
      "One CLI to scan code and generate privacy compliance docs for GDPR, CCPA, LGPD, PIPEDA, and more.",
    images: ["/opengraph-image"],
  },
};

const regulations = [
  {
    name: "GDPR",
    fullName: "General Data Protection Regulation",
    region: "European Union",
    effective: "May 2018",
    scope:
      "Applies to any organization processing personal data of EU/EEA residents, regardless of where the organization is based. Covers consent, data subject rights, breach notification, DPAs, and cross-border transfers.",
    fines: "Up to 4% of global annual turnover or EUR 20 million",
    href: "/gdpr-compliance",
  },
  {
    name: "CCPA / CPRA",
    fullName: "California Consumer Privacy Act / California Privacy Rights Act",
    region: "California, United States",
    effective: "Jan 2020 / Jan 2023",
    scope:
      "Applies to for-profit businesses collecting personal information of California residents that meet revenue or data volume thresholds. Grants consumers rights to know, delete, opt-out of sale, and correct their data.",
    fines: "Up to $7,500 per intentional violation",
    href: null,
  },
  {
    name: "LGPD",
    fullName: "Lei Geral de Protecao de Dados",
    region: "Brazil",
    effective: "Sep 2020",
    scope:
      "Brazil's comprehensive data protection law modeled on GDPR. Applies to any processing of personal data collected in Brazil or of individuals located in Brazil, regardless of where the processor is based.",
    fines: "Up to 2% of revenue in Brazil, capped at BRL 50 million per violation",
    href: null,
  },
  {
    name: "PIPEDA",
    fullName: "Personal Information Protection and Electronic Documents Act",
    region: "Canada",
    effective: "Apr 2000 (updated 2024)",
    scope:
      "Canada's federal privacy law governing how private-sector organizations collect, use, and disclose personal information in the course of commercial activity. Provinces may have substantially similar legislation.",
    fines: "Up to CAD 100,000 per violation under current enforcement",
    href: null,
  },
  {
    name: "DPDP Act",
    fullName: "Digital Personal Data Protection Act",
    region: "India",
    effective: "Aug 2023 (rules pending)",
    scope:
      "India's first comprehensive data protection law. Applies to processing of digital personal data collected in India or for offering goods/services to individuals in India. Introduces Data Fiduciary obligations and consent requirements.",
    fines: "Up to INR 250 crore (approx. USD 30 million) per violation",
    href: null,
  },
];

const privacyByDesign = [
  {
    principle: "Proactive not reactive",
    description:
      "Prevent privacy issues before they occur. Codepliant detects data collection patterns in your code at build time, not after a breach.",
  },
  {
    principle: "Privacy as the default",
    description:
      "Personal data should be automatically protected. Codepliant flags unnecessary data collection and generates documentation that reflects your actual practices.",
  },
  {
    principle: "Privacy embedded into design",
    description:
      "Privacy should be built into systems, not bolted on. Run Codepliant in CI/CD to ensure every deployment has up-to-date compliance documentation.",
  },
  {
    principle: "Full functionality",
    description:
      "Privacy and functionality are not trade-offs. Codepliant generates accurate documents from your code without requiring you to change your architecture.",
  },
  {
    principle: "End-to-end security",
    description:
      "Data must be protected throughout its lifecycle. Codepliant detects encryption libraries, access controls, and data retention patterns in your codebase.",
  },
  {
    principle: "Visibility and transparency",
    description:
      "Users deserve to know how their data is used. Codepliant generates privacy policies, cookie policies, and data flow maps that describe your actual services by name.",
  },
  {
    principle: "Respect for user privacy",
    description:
      "Keep the user at the center. Codepliant generates DSAR guides, consent documentation, and data subject rights procedures tailored to your application.",
  },
];

const scanCapabilities = [
  {
    label: "Personal data detection",
    detail:
      "Identifies PII collection through form fields, database schemas, API inputs, and authentication flows",
  },
  {
    label: "Third-party data sharing",
    detail:
      "Detects analytics SDKs, advertising pixels, payment processors, and external API integrations that receive user data",
  },
  {
    label: "Cookie and tracker scanning",
    detail:
      "Finds tracking scripts, session management, and cookie-setting patterns across your frontend code",
  },
  {
    label: "Data storage patterns",
    detail:
      "Scans ORM schemas, database configurations, and cloud storage integrations to map where personal data is stored",
  },
  {
    label: "Cross-border transfer detection",
    detail:
      "Identifies cloud provider regions, CDN configurations, and third-party services that may transfer data internationally",
  },
  {
    label: "Consent mechanism analysis",
    detail:
      "Detects consent management platforms, cookie banners, and opt-in/opt-out logic in your codebase",
  },
];

const relatedPages = [
  {
    name: "GDPR Compliance Tool",
    href: "/gdpr-compliance",
    desc: "Generate privacy policies, DPAs, data flow maps, and 10+ GDPR documents from your code.",
  },
  {
    name: "HIPAA Compliance Tool",
    href: "/hipaa-compliance",
    desc: "Detect PHI in your codebase and generate risk assessments, BAAs, and access control documentation.",
  },
  {
    name: "Privacy Policy Generator",
    href: "/privacy-policy-generator",
    desc: "Generate an accurate privacy policy based on what your application actually does with user data.",
  },
  {
    name: "Cookie Policy Generator",
    href: "/cookie-policy-generator",
    desc: "Detect cookies and trackers in your code and generate a compliant cookie policy automatically.",
  },
  {
    name: "GDPR for Developers Guide",
    href: "/blog/gdpr-for-developers",
    desc: "Practical guide to GDPR compliance for development teams, covering data mapping, consent, and documentation.",
  },
  {
    name: "Privacy Policy for SaaS",
    href: "/blog/privacy-policy-for-saas",
    desc: "What your SaaS privacy policy must include and how to generate one from your codebase.",
  },
  {
    name: "SOC 2 Compliance Tool",
    href: "/soc2-compliance",
    desc: "SOC 2 readiness checklists and control mappings for startups selling to enterprise.",
  },
  {
    name: "AI Governance Framework",
    href: "/ai-governance",
    desc: "EU AI Act and NIST AI RMF compliance documentation for AI-powered applications.",
  },
];

const faqs = [
  {
    question: "What data privacy regulations does Codepliant cover?",
    answer:
      "Codepliant generates compliance documentation relevant to GDPR, CCPA/CPRA, LGPD, PIPEDA, the DPDP Act, ePrivacy Directive, and general data privacy best practices. It scans your code to detect what personal data you collect, how you process it, and which third parties receive it, then generates documentation tailored to each regulation.",
  },
  {
    question:
      "How does Codepliant detect personal data usage in my codebase?",
    answer:
      "Codepliant performs static analysis across your project. It scans package.json dependencies, source code imports, environment variables, ORM schemas, API routes, and configuration files. It uses deterministic pattern matching (no AI/LLMs) to identify analytics SDKs, authentication flows, payment processors, database schemas, and other data-handling patterns.",
  },
  {
    question: "Do I still need a lawyer for data privacy compliance?",
    answer:
      "Yes. Codepliant generates accurate first drafts based on your actual code, but privacy regulations are complex and jurisdiction-specific. We recommend having a qualified privacy attorney review generated documents before publishing. Codepliant saves you time and money by giving your lawyer an accurate starting point instead of a blank page.",
  },
  {
    question: "What is privacy by design?",
    answer:
      "Privacy by design is a framework developed by Ann Cavoukian that embeds privacy protections into the design of systems and processes from the start, rather than adding them as an afterthought. It is now enshrined in Article 25 of GDPR as 'data protection by design and by default.' Codepliant supports this approach by integrating privacy scanning into your development workflow.",
  },
  {
    question: "Can Codepliant help with data subject access requests (DSARs)?",
    answer:
      "Codepliant generates DSAR response guides that document what personal data your application collects, where it is stored, and how to retrieve or delete it. This gives your team a reference document for responding to access, deletion, and portability requests under GDPR, CCPA, and other regulations.",
  },
  {
    question: "Does Codepliant send my code to any external server?",
    answer:
      "No. Codepliant runs entirely on your local machine. It makes zero network calls during scanning or document generation. Your source code never leaves your computer. This is a core architectural principle — not a feature toggle.",
  },
  {
    question: "How often should I regenerate privacy documentation?",
    answer:
      "Regenerate whenever you add new third-party services, change data collection patterns, or deploy significant feature updates. The best approach is to run Codepliant in your CI/CD pipeline so documentation stays in sync with every deployment. The 'codepliant diff' command shows exactly what changed since the last generation.",
  },
  {
    question: "What documents does Codepliant generate for data privacy?",
    answer:
      "Codepliant generates privacy policies, cookie policies, data processing agreements, data flow maps, DSAR guides, data retention policies, consent documentation, AI disclosures, terms of service, and many more — over 123 document types across all supported compliance frameworks.",
  },
];

function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant Data Privacy Compliance Tool",
    version: "1.1.0",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Data privacy compliance tool for developers. Scans code and generates documentation for GDPR, CCPA, LGPD, PIPEDA, DPDP Act, and privacy-by-design principles.",
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

export default function DataPrivacy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-ink-secondary">
              <li>
                <a href="/" className="hover:text-brand transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-primary font-medium">Data Privacy</li>
            </ol>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Data Privacy Hub
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Data Privacy Compliance for Developers
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            Privacy regulations are multiplying worldwide. GDPR in Europe, CCPA
            in California, LGPD in Brazil, PIPEDA in Canada, the DPDP Act in
            India — each with unique documentation requirements, consent rules,
            and penalties. Codepliant scans your codebase once and generates
            compliance documentation for every regulation that applies to your
            application.
          </p>

          {/* Global privacy regulations overview */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Global privacy regulations you need to know
            </h2>
            <p className="text-ink-secondary mb-6">
              If your application has users in more than one country, multiple
              privacy regulations likely apply simultaneously. Here are the five
              most impactful data privacy laws worldwide.
            </p>
            <div className="space-y-4">
              {regulations.map((reg) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{reg.name}</h3>
                        <p className="text-xs text-ink-secondary">
                          {reg.fullName}
                        </p>
                      </div>
                      <span className="text-xs bg-surface-secondary px-2 py-1 rounded ml-3 shrink-0">
                        {reg.region}
                      </span>
                    </div>
                    <p className="text-sm text-ink-secondary mb-3">
                      {reg.scope}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-secondary">
                      <span>
                        Effective: <strong>{reg.effective}</strong>
                      </span>
                      <span>
                        Max penalty: <strong>{reg.fines}</strong>
                      </span>
                    </div>
                  </>
                );

                if (reg.href) {
                  return (
                    <a
                      key={reg.name}
                      href={reg.href}
                      className="block bg-surface-secondary rounded-xl p-5 hover:ring-1 hover:ring-border-strong transition-shadow"
                    >
                      {inner}
                    </a>
                  );
                }

                return (
                  <div
                    key={reg.name}
                    className="bg-surface-secondary rounded-xl p-5"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </section>

          {/* How Codepliant handles data privacy scanning */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              How Codepliant scans for data privacy
            </h2>
            <p className="text-ink-secondary mb-6">
              Instead of filling out questionnaires about what data you collect,
              Codepliant reads your source code to find out. One scan detects
              every privacy-relevant pattern in your application.
            </p>
            <div className="space-y-4">
              {scanCapabilities.map((cap, i) => (
                <div
                  key={cap.label}
                  className="flex gap-4 bg-surface-secondary rounded-xl p-5"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-brand text-surface-primary flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{cap.label}</h3>
                    <p className="text-sm text-ink-secondary">{cap.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy-by-design principles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Privacy-by-design principles
            </h2>
            <p className="text-ink-secondary mb-6">
              Privacy by design, developed by Ann Cavoukian and enshrined in
              GDPR Article 25, requires that data protection is built into
              systems from the ground up. These seven foundational principles
              guide how Codepliant approaches compliance documentation.
            </p>
            <div className="space-y-3">
              {privacyByDesign.map((item, i) => (
                <div
                  key={item.principle}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">
                    <span className="text-brand mr-2">{i + 1}.</span>
                    {item.principle}
                  </h3>
                  <p className="text-sm text-ink-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Which regulations apply to you */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Which regulations apply to you
            </h2>
            <div className="space-y-4">
              {[
                {
                  scenario: "You have users in the EU or EEA",
                  frameworks:
                    "GDPR, ePrivacy Directive, EU AI Act (if using AI)",
                },
                {
                  scenario: "You have users in California",
                  frameworks:
                    "CCPA/CPRA if you meet revenue or data volume thresholds",
                },
                {
                  scenario: "You have users in Brazil",
                  frameworks:
                    "LGPD — similar obligations to GDPR with local enforcement",
                },
                {
                  scenario: "You operate in Canada",
                  frameworks:
                    "PIPEDA at the federal level, plus provincial laws like PIPA (Alberta, BC)",
                },
                {
                  scenario: "You have users in India",
                  frameworks:
                    "DPDP Act — consent requirements and Data Fiduciary obligations",
                },
                {
                  scenario: "You handle health information",
                  frameworks:
                    "HIPAA, plus GDPR if EU users are included",
                },
                {
                  scenario: "You use AI or machine learning",
                  frameworks:
                    "EU AI Act, NIST AI RMF, state-level AI laws (Colorado, Illinois)",
                },
                {
                  scenario: "You operate a SaaS product",
                  frameworks:
                    "Privacy policy, terms of service, cookie policy at minimum — plus framework-specific docs depending on your users",
                },
              ].map((item) => (
                <div
                  key={item.scenario}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.scenario}</h3>
                  <p className="text-sm text-ink-secondary">
                    {item.frameworks}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related pages */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related compliance tools and guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="block bg-surface-secondary rounded-xl p-5 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{page.name}</h3>
                  <p className="text-sm text-ink-secondary">{page.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-ink-secondary">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Scan your codebase for data privacy compliance
            </h2>
            <p className="text-ink-secondary text-sm mb-6">
              Detect personal data usage, third-party sharing, and cookie
              tracking. Generate privacy documentation for every regulation that
              applies. Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block mb-4">
              npx codepliant go
            </div>
            <p className="text-xs text-ink-secondary">
              Works offline. Zero network calls. No API key needed.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
