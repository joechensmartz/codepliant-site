import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Compliance Tool for Developers",
  description:
    "Automate GDPR compliance by scanning your codebase. Generate privacy policies, DPAs, DSAR guides, and data flow maps from your actual code. Free CLI.",
  keywords: [
    "GDPR compliance tool",
    "GDPR for developers",
    "GDPR documentation generator",
    "personal data detection",
    "privacy policy generator",
    "data processing agreement",
    "DSAR guide",
    "DPIA generator",
    "GDPR data flow map",
    "Article 30 records of processing",
    "GDPR developer checklist",
    "GDPR consent management",
  ],
  alternates: {
    canonical: "https://codepliant.dev/gdpr-compliance",
  },
  openGraph: {
    title: "GDPR Compliance Tool for Developers",
    description:
      "Automate GDPR compliance by scanning your codebase. Generate privacy policies, DPAs, DSAR guides, and data flow maps from your actual code. Free CLI.",
    url: "https://codepliant.dev/gdpr-compliance",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDPR Compliance Tool for Developers",
    description:
      "Detect personal data in your code and generate GDPR compliance docs automatically.",
  },
};

const faqs = [
  {
    question: "What GDPR documents does Codepliant generate?",
    answer:
      "Codepliant generates Privacy Policies, Data Processing Agreements (DPA), Data Subject Access Request (DSAR) Guides, Consent Guides, Data Flow Maps, Data Retention Policies, Privacy Impact Assessments (PIA/DPIA), Sub-Processor Lists, Cookie Policies, and Compliance Reports — all from scanning your code.",
  },
  {
    question: "Does Codepliant replace a Data Protection Officer?",
    answer:
      "No. Codepliant is a developer tool that automates the documentation aspect of GDPR compliance. You should still consult with legal professionals and, if required under Article 37, appoint a DPO. Codepliant helps you create accurate documentation faster.",
  },
  {
    question: "How does code scanning help with GDPR?",
    answer:
      "GDPR requires you to document what personal data you collect, how you process it, where you store it, and who you share it with. Codepliant scans your ORM schemas, API integrations, analytics SDKs, and auth flows to answer these questions from evidence rather than memory.",
  },
  {
    question: "Does Codepliant detect data transfers outside the EU?",
    answer:
      "Yes. Codepliant identifies third-party services in your code (AWS, Google Cloud, Stripe, analytics providers) and flags potential international data transfers that require GDPR safeguards like Standard Contractual Clauses (SCCs) or adequacy decisions.",
  },
  {
    question: "What are the penalties for GDPR non-compliance?",
    answer:
      "GDPR fines can reach up to 20 million euros or 4% of global annual turnover, whichever is higher. Even smaller violations carry fines of up to 10 million euros or 2% of turnover. Supervisory authorities across the EU have collectively issued billions in fines since 2018.",
  },
  {
    question: "Does GDPR apply if my company is outside the EU?",
    answer:
      "Yes. GDPR applies to any organization that offers goods or services to individuals in the EU/EEA, or monitors the behavior of individuals in the EU/EEA — regardless of where the organization is based. If your app has EU users, GDPR likely applies to you.",
  },
  {
    question:
      "How often should I run Codepliant to maintain GDPR compliance?",
    answer:
      "Run Codepliant in your CI/CD pipeline on every deploy or at minimum before each release. Your data processing activities change as you add features, integrate new services, or update schemas. Codepliant regenerates documentation from your current code so your compliance docs never go stale.",
  },
  {
    question: "Can Codepliant help with Data Subject Access Requests (DSARs)?",
    answer:
      "Yes. Codepliant generates a DSAR Guide that documents exactly where personal data is stored in your application — which database tables, which third-party services, and which data categories. This makes it significantly faster to respond to access, rectification, erasure, and portability requests within the 30-day GDPR deadline.",
  },
];

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

function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant GDPR Compliance Tool",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "GDPR compliance tool that scans your codebase to detect personal data processing and generate required documentation automatically.",
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
        name: "GDPR Compliance",
        item: "https://codepliant.dev/gdpr-compliance",
      },
    ],
  };
}

export default function GdprCompliance() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
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

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb navigation */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-ink-secondary mb-8"
          >
            <a href="/" className="hover:text-ink transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-ink">GDPR Compliance</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            GDPR Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            GDPR Compliance Tool for Developers
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            The General Data Protection Regulation requires detailed
            documentation of how your application collects, processes, and
            stores personal data. Codepliant scans your codebase to detect
            personal data handling patterns and generate accurate compliance
            documents — from privacy policies to data flow maps — in one
            command.
          </p>

          {/* What is GDPR */}
          <section className="mb-16" id="what-is-gdpr">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              What is GDPR and why does it matter for developers?
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                The General Data Protection Regulation (GDPR) is the
                European Union&apos;s comprehensive data protection law that
                took effect on May 25, 2018. It replaced the 1995 Data
                Protection Directive and established a unified framework for
                how organizations collect, process, store, and transfer
                personal data of individuals in the EU and European Economic
                Area (EEA).
              </p>
              <p>
                For developers, GDPR is not just a legal concern — it
                directly affects how you design and build software. The
                regulation requires <strong>privacy by design</strong>{" "}
                (Article 25), meaning data protection must be built into
                your application architecture from the start, not bolted on
                after launch. Every database schema, API endpoint, analytics
                integration, and third-party service in your codebase has
                GDPR implications.
              </p>
              <p>
                GDPR applies to any organization that processes personal
                data of individuals in the EU/EEA, regardless of where the
                organization is based. If your app has EU users, GDPR
                applies to you. Fines for non-compliance can reach{" "}
                <strong>20 million euros or 4% of global annual turnover</strong>,
                whichever is higher.
              </p>
            </div>
          </section>

          {/* Key GDPR articles for developers */}
          <section className="mb-16" id="key-articles">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              Key GDPR articles every developer should know
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              GDPR contains 99 articles, but these are the ones that
              directly impact how you write code and architect your
              application.
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Article 5 — Principles of data processing",
                  desc: "Personal data must be processed lawfully, fairly, and transparently. It must be collected for specified purposes, limited to what is necessary, kept accurate, stored only as long as needed, and protected with appropriate security. Codepliant maps your actual data practices against these principles.",
                },
                {
                  title: "Article 6 — Lawful basis for processing",
                  desc: "You need a legal basis for every type of personal data processing: consent, contract performance, legal obligation, vital interests, public task, or legitimate interests. Codepliant identifies your processing activities so you can document the legal basis for each one.",
                },
                {
                  title: "Article 13 — Information to data subjects",
                  desc: "When you collect personal data directly from individuals, you must inform them of your identity, purpose, legal basis, retention period, their rights, and any third parties receiving their data. Codepliant generates privacy policies with this information based on your actual code.",
                },
                {
                  title: "Article 17 — Right to erasure (right to be forgotten)",
                  desc: "Data subjects can request deletion of their personal data. Your application must be architected to support this — knowing where personal data is stored across your databases, caches, backups, logs, and third-party services. Codepliant maps all personal data storage locations.",
                },
                {
                  title: "Article 25 — Data protection by design and by default",
                  desc: "You must implement appropriate technical and organizational measures to ensure data protection is integrated into your processing activities. This includes data minimization, pseudonymization, and privacy-preserving defaults. Codepliant audits your code for these patterns.",
                },
                {
                  title: "Article 28 — Data processors",
                  desc: "If you use third-party services (cloud providers, analytics, payment processors) that process personal data on your behalf, you need Data Processing Agreements with each one. Codepliant identifies your processors directly from your codebase and dependency tree.",
                },
                {
                  title: "Article 30 — Records of processing activities",
                  desc: "You must maintain detailed records of all processing activities: categories of data, purposes, recipients, transfers to third countries, and retention periods. Codepliant generates these records automatically from your ORM schemas, API integrations, and service configurations.",
                },
                {
                  title: "Article 35 — Data Protection Impact Assessment",
                  desc: "High-risk processing activities require a DPIA before you begin processing. This includes large-scale profiling, systematic monitoring of public areas, and processing sensitive data categories. Codepliant generates DPIA documents based on the data practices detected in your code.",
                },
              ].map((req) => (
                <div
                  key={req.title}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-2">{req.title}</h3>
                  <p className="text-sm text-ink-secondary">{req.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Data subject rights */}
          <section className="mb-16" id="data-subject-rights">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              GDPR rights of data subjects
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                GDPR grants individuals (data subjects) specific rights over
                their personal data. Your application must be designed to
                fulfill these rights, and you must respond to requests
                within 30 days. Codepliant helps by mapping exactly where
                personal data lives in your system so you can respond
                efficiently.
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: "Right of access (Article 15)",
                  desc: "Data subjects can request a copy of all personal data you hold about them, along with information about how it is processed. Your DSAR response must include the categories of data, purposes, recipients, retention periods, and the source of the data.",
                },
                {
                  title: "Right to rectification (Article 16)",
                  desc: "Individuals can request correction of inaccurate personal data or completion of incomplete data. Your application needs mechanisms to update personal data across all storage locations, including third-party services and backups.",
                },
                {
                  title: "Right to erasure (Article 17)",
                  desc: "Also known as the right to be forgotten. Data subjects can request deletion of their personal data when it is no longer necessary, when consent is withdrawn, or when processing is unlawful. You must erase data from databases, caches, logs, and notify third-party processors.",
                },
                {
                  title: "Right to data portability (Article 20)",
                  desc: "Individuals can request their personal data in a structured, commonly used, machine-readable format (like JSON or CSV) and have it transmitted to another controller. Your application must support data export functionality.",
                },
                {
                  title: "Right to object (Article 21)",
                  desc: "Data subjects can object to processing based on legitimate interests or for direct marketing purposes. When they object to direct marketing, processing must stop immediately. For other grounds, you must demonstrate compelling legitimate reasons to continue.",
                },
                {
                  title: "Right to restriction of processing (Article 18)",
                  desc: "Individuals can request that you restrict processing of their data while accuracy is contested, processing is unlawful, or you no longer need the data but they need it for legal claims. Your system must support marking data as restricted.",
                },
              ].map((right) => (
                <div
                  key={right.title}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-2">{right.title}</h3>
                  <p className="text-sm text-ink-secondary">{right.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Codepliant detects GDPR-relevant services */}
          <section className="mb-16" id="service-detection">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              How Codepliant detects GDPR-relevant services in your code
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Codepliant performs static analysis across your entire
                codebase to identify personal data processing patterns. It
                scans ORM schemas (Prisma, Drizzle, Mongoose, TypeORM,
                Sequelize, Django, SQLAlchemy), API definitions, form
                handlers, and database migrations to identify fields that
                contain personal data — names, email addresses, IP
                addresses, device identifiers, location data, and more.
              </p>
              <p>
                Beyond schema detection, Codepliant traces how personal
                data flows through your application. It maps data from user
                input through your application logic to storage and
                third-party services, identifying every processor and
                sub-processor that touches personal data.
              </p>
            </div>

            {/* Service detection table */}
            <div className="mt-8 mb-6">
              <h3 className="font-semibold mb-4">
                Services and integrations Codepliant detects
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border-subtle rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-surface-secondary">
                      <th className="text-left px-4 py-3 font-semibold">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Services & Patterns
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {[
                      {
                        category: "Analytics & Tracking",
                        services:
                          "Google Analytics, Mixpanel, Segment, Amplitude, Posthog, Hotjar, Plausible",
                      },
                      {
                        category: "Auth & Identity",
                        services:
                          "Auth0, Okta, NextAuth, Clerk, Firebase Auth, AWS Cognito, Supabase Auth",
                      },
                      {
                        category: "Databases & ORMs",
                        services:
                          "Prisma, Drizzle, Mongoose, TypeORM, Sequelize, Django ORM, SQLAlchemy",
                      },
                      {
                        category: "Cloud & Infrastructure",
                        services:
                          "AWS (S3, RDS, Lambda), GCP (Cloud SQL, GKE), Azure (Blob, SQL), Vercel, Cloudflare",
                      },
                      {
                        category: "Payments",
                        services:
                          "Stripe, PayPal, Braintree, Square, Adyen, Mollie",
                      },
                      {
                        category: "Email & Communication",
                        services:
                          "SendGrid, Mailgun, Postmark, AWS SES, Twilio, Resend",
                      },
                      {
                        category: "AI & Machine Learning",
                        services:
                          "OpenAI, Anthropic, Google AI, Hugging Face, Replicate, Cohere",
                      },
                      {
                        category: "Advertising",
                        services:
                          "Google Ads, Facebook Pixel, TikTok Pixel, LinkedIn Insight Tag",
                      },
                      {
                        category: "Monitoring & Logging",
                        services:
                          "Sentry, Datadog, New Relic, LogRocket, Winston, Pino",
                      },
                    ].map((row) => (
                      <tr key={row.category}>
                        <td className="px-4 py-3 font-medium text-ink">
                          {row.category}
                        </td>
                        <td className="px-4 py-3 text-ink-secondary">
                          {row.services}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Codepliant also analyzes your dependency tree for packages
                that indicate personal data processing — analytics clients,
                cookie management libraries, consent management platforms,
                and advertising SDKs. Environment variables like{" "}
                <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
                  GOOGLE_ANALYTICS_ID
                </code>
                ,{" "}
                <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
                  STRIPE_SECRET_KEY
                </code>
                , and{" "}
                <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
                  SENDGRID_API_KEY
                </code>{" "}
                are flagged as indicators of third-party data processing.
              </p>
            </div>
          </section>

          {/* What Codepliant generates */}
          <section className="mb-16" id="generated-docs">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              GDPR documentation Codepliant generates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Privacy Policy",
                "Data Processing Agreement (DPA)",
                "DSAR Response Guide",
                "Consent Management Guide",
                "Data Flow Map",
                "Data Retention Policy",
                "PIA / DPIA",
                "Sub-Processor List",
                "Cookie Policy",
                "Records of Processing (Art. 30)",
                "International Transfer Assessment",
                "Compliance Report",
              ].map((doc) => (
                <div
                  key={doc}
                  className="bg-surface-secondary rounded-xl px-4 py-3 text-sm"
                >
                  {doc}
                </div>
              ))}
            </div>
          </section>

          {/* GDPR checklist for developers */}
          <section className="mb-16" id="developer-checklist">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              GDPR compliance checklist for developers
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Use this checklist to evaluate your application&apos;s GDPR
              readiness. Codepliant automates detection of many of these
              items from your code.
            </p>

            <div className="space-y-6">
              {[
                {
                  heading: "Lawful basis & consent",
                  items: [
                    "Legal basis documented for each type of data processing",
                    "Consent collected before processing where required (not pre-ticked)",
                    "Consent is granular — separate consent for separate purposes",
                    "Users can withdraw consent as easily as they gave it",
                    "Consent records stored with timestamp, scope, and method",
                  ],
                },
                {
                  heading: "Data subject rights",
                  items: [
                    "Process for responding to DSARs within 30 days",
                    "Data export in machine-readable format (JSON, CSV) for portability",
                    "Account deletion that removes data from all storage locations",
                    "Ability to restrict processing without full deletion",
                    "Opt-out mechanism for direct marketing and profiling",
                  ],
                },
                {
                  heading: "Privacy by design",
                  items: [
                    "Data minimization — only collect what is necessary",
                    "Purpose limitation — do not repurpose data without new consent",
                    "Storage limitation — retention periods defined and enforced in code",
                    "Privacy-preserving defaults (minimal data collection by default)",
                    "Pseudonymization or encryption of personal data where possible",
                  ],
                },
                {
                  heading: "Transparency & documentation",
                  items: [
                    "Privacy policy that covers all Article 13 requirements",
                    "Cookie banner with granular opt-in for non-essential cookies",
                    "Records of processing activities maintained (Article 30)",
                    "Data flow map showing all personal data movements",
                    "Sub-processor list kept current with all third-party services",
                  ],
                },
                {
                  heading: "Security measures",
                  items: [
                    "Personal data encrypted at rest and in transit (TLS 1.2+)",
                    "Access controls limiting who can access personal data",
                    "Audit logging for access to personal data",
                    "Regular testing of security measures",
                    "Breach notification process documented (72-hour rule)",
                  ],
                },
                {
                  heading: "Third parties & transfers",
                  items: [
                    "Data Processing Agreements signed with all processors",
                    "International transfers covered by SCCs or adequacy decisions",
                    "Sub-processor changes communicated to data subjects",
                    "Vendor risk assessments completed for all processors",
                  ],
                },
              ].map((group) => (
                <div key={group.heading}>
                  <h3 className="font-semibold mb-3">{group.heading}</h3>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <label
                        key={item}
                        className="flex items-start gap-3 bg-surface-secondary rounded-lg px-4 py-3 text-sm cursor-pointer hover:ring-1 hover:ring-border-strong transition-shadow"
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 rounded border-border-subtle"
                        />
                        <span className="text-ink-secondary">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How Codepliant automates GDPR */}
          <section className="mb-16" id="how-it-works">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              How Codepliant automates GDPR compliance
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Codepliant performs static analysis on your codebase to
                identify data practices. It scans ORM schemas to understand
                what personal data you store, detects authentication flows
                and session management, identifies analytics SDKs and
                advertising pixels, traces payment processor integrations,
                and maps third-party API calls that receive personal data.
              </p>
              <p>
                From this analysis, it generates a complete set of GDPR
                documentation. The privacy policy includes specific data
                categories, legal bases, and retention periods derived from
                your actual code. The data flow map shows how personal data
                moves through your application and to third parties. The
                DPA template lists your actual sub-processors. The DSAR
                guide documents exactly where each category of personal
                data is stored so your team can respond to requests
                efficiently.
              </p>
              <p>
                Because the documents are generated from code, they stay
                accurate as your application evolves. Add a new analytics
                SDK, integrate a new payment processor, or add fields to
                your user model — run Codepliant again and your compliance
                documentation updates automatically. Run it in your CI/CD
                pipeline to regenerate documents on every deploy.
              </p>
              <p>
                Unlike form-based compliance tools that ask you what data
                you collect, Codepliant looks at your code to determine
                what you actually collect. This means your GDPR
                documentation reflects reality, not assumptions — a
                critical distinction when a supervisory authority
                investigates.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Automate your GDPR documentation
            </h2>
            <p className="text-ink-secondary text-sm mb-6 max-w-md mx-auto">
              One command detects personal data processing, identifies your
              processors, and generates audit-ready GDPR documentation.
              Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-ink-secondary">
              <a
                href="https://github.com/joechensmartz/codepliant"
                className="hover:text-ink transition-colors underline"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/codepliant"
                className="hover:text-ink transition-colors underline"
              >
                npm
              </a>
              <a
                href="/docs"
                className="hover:text-ink transition-colors underline"
              >
                Docs
              </a>
            </div>
          </section>

          {/* Related pages */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "Data Privacy Compliance Hub",
                  href: "/data-privacy",
                  desc: "Overview of all compliance frameworks Codepliant supports.",
                },
                {
                  title: "HIPAA Compliance Tool",
                  href: "/hipaa-compliance",
                  desc: "HIPAA documentation automation for healthcare applications handling PHI.",
                },
                {
                  title: "SOC 2 Compliance Tool",
                  href: "/soc2-compliance",
                  desc: "SOC 2 readiness checklists and control mappings for startups.",
                },
                {
                  title: "Codepliant vs Termly vs Iubenda",
                  href: "/compare",
                  desc: "See how code-based scanning compares to form builders for GDPR compliance.",
                },
                {
                  title: "AI Governance Framework",
                  href: "/ai-governance",
                  desc: "EU AI Act and NIST AI RMF compliance documentation for AI-powered applications.",
                },
                {
                  title: "GDPR for Developers Guide",
                  href: "/blog/gdpr-for-developers",
                  desc: "Practical GDPR guide with code examples for engineering teams.",
                },
                {
                  title: "Privacy Policy for SaaS",
                  href: "/blog/privacy-policy-for-saas",
                  desc: "How to write a SaaS privacy policy that satisfies GDPR Article 13.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block bg-surface-secondary rounded-xl p-4 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <h3 className="font-semibold mb-1 text-sm">{link.title}</h3>
                  <p className="text-xs text-ink-secondary">{link.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
