import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HIPAA Compliance Tool for Healthcare Apps",
  description:
    "HIPAA compliance tool for healthcare apps. Scan your codebase to detect PHI handling and generate risk assessments, BAAs, and audit-ready policies.",
  keywords: [
    "HIPAA compliance tool",
    "HIPAA for developers",
    "PHI detection",
    "healthcare app compliance",
    "HIPAA SaaS checklist",
    "HIPAA risk assessment",
    "HIPAA technical safeguards",
    "protected health information",
    "ePHI encryption",
    "HIPAA documentation generator",
    "HIPAA BAA template",
    "healthcare compliance automation",
  ],
  alternates: {
    canonical: "https://codepliant.dev/hipaa-compliance",
  },
  openGraph: {
    title: "HIPAA Compliance Tool for Healthcare Apps",
    description:
      "HIPAA compliance tool for healthcare apps. Scan your codebase to detect PHI handling and generate risk assessments, BAAs, and audit-ready policies.",
    url: "https://codepliant.dev/hipaa-compliance",
  },
  twitter: {
    card: "summary_large_image",
    title: "HIPAA Compliance Tool for Healthcare Apps",
    description:
      "Detect PHI in your code and generate HIPAA compliance docs automatically.",
  },
};

const faqs = [
  {
    question: "What types of health data does Codepliant detect?",
    answer:
      "Codepliant identifies all 18 HIPAA identifiers in your database schemas and data models, including names, dates, Social Security numbers, medical record numbers, health plan IDs, and biometric data. It also detects PHI in API request/response schemas and form fields.",
  },
  {
    question: "Does Codepliant make my app HIPAA compliant?",
    answer:
      "Codepliant generates the documentation required by HIPAA, but compliance also requires administrative safeguards, physical safeguards, and organizational requirements. Use Codepliant alongside your security program to handle the technical documentation efficiently.",
  },
  {
    question: "Can Codepliant detect if PHI is being transmitted insecurely?",
    answer:
      "Yes. Codepliant analyzes your API endpoints, database connections, and third-party integrations to identify whether PHI is encrypted in transit and at rest. It flags unencrypted connections and missing TLS configurations.",
  },
  {
    question:
      "Do I need HIPAA compliance if I use a HIPAA-compliant cloud provider?",
    answer:
      "Yes. Using a HIPAA-compliant hosting provider (AWS, GCP, Azure) is necessary but not sufficient. You are still responsible for how your application handles PHI at the code level — access controls, encryption, audit logging, and proper BAAs with all vendors.",
  },
  {
    question: "Who is considered a Business Associate under HIPAA?",
    answer:
      "A Business Associate is any person or organization that creates, receives, maintains, or transmits PHI on behalf of a Covered Entity. If your SaaS product handles patient data for a healthcare provider, health plan, or clearinghouse, you are a Business Associate and must comply with HIPAA.",
  },
  {
    question: "What are the penalties for HIPAA violations?",
    answer:
      "HIPAA penalties range from $100 to $50,000 per violation depending on the level of negligence, with an annual maximum of $1.5 million per violation category. Criminal penalties can include fines up to $250,000 and imprisonment up to 10 years for intentional violations.",
  },
  {
    question: "Does HIPAA apply to mobile health apps?",
    answer:
      "It depends. If your app collects, stores, or transmits PHI on behalf of a Covered Entity or Business Associate, HIPAA applies. Apps that collect health data directly from consumers (like fitness trackers) may fall under FTC regulation instead. If your app integrates with EHR systems or processes insurance claims, HIPAA almost certainly applies.",
  },
  {
    question:
      "How often should I run Codepliant to maintain HIPAA compliance?",
    answer:
      "Run Codepliant in your CI/CD pipeline on every deploy or at minimum before each release. HIPAA requires ongoing risk assessment, and your PHI handling patterns change as you add features. Codepliant regenerates documentation from your current code so your compliance docs never go stale.",
  },
];

function webPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "HIPAA Compliance Tool for Healthcare Apps",
    description:
      "Scan your codebase to detect PHI handling and generate risk assessments, BAAs, and audit-ready HIPAA policies.",
    url: "https://codepliant.dev/hipaa-compliance",
    isPartOf: {
      "@type": "WebSite",
      name: "Codepliant",
      url: "https://codepliant.dev",
    },
    about: {
      "@type": "Thing",
      name: "Health Insurance Portability and Accountability Act (HIPAA)",
      sameAs: "https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act",
    },
    specialty: "HIPAA compliance documentation for healthcare software developers",
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

function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codepliant HIPAA Compliance Tool",
    version: "1.1.0",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "HIPAA compliance tool that scans your codebase to detect PHI handling and generate required documentation automatically.",
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
        name: "HIPAA Compliance",
        item: "https://codepliant.dev/hipaa-compliance",
      },
    ],
  };
}

export default function HipaaCompliance() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd()) }}
      />
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
            <span className="text-ink">HIPAA Compliance</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            HIPAA Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            HIPAA Compliance Tool for Healthcare Apps
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            Building a healthcare application means handling Protected Health
            Information (PHI) under strict federal regulations. Codepliant scans
            your codebase to detect health data collection patterns, identify
            compliance gaps, and generate the documentation HIPAA requires —
            from risk assessments to Business Associate Agreements.
          </p>

          {/* What is HIPAA */}
          <section className="mb-16" id="what-is-hipaa">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              What is HIPAA and why does it matter for developers?
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                The Health Insurance Portability and Accountability Act (HIPAA)
                is a federal law enacted in 1996 that sets national standards
                for protecting sensitive patient health information. The HIPAA
                Privacy Rule and Security Rule together define how organizations
                must handle Protected Health Information (PHI) — including
                electronic PHI (ePHI) stored, processed, or transmitted by
                software systems.
              </p>
              <p>
                For developers building healthcare SaaS products, HIPAA is not
                optional. If your application touches patient data on behalf of
                a healthcare provider, health plan, or healthcare clearinghouse,
                your company is a <strong>Business Associate</strong> under
                HIPAA and must comply with the Security Rule&apos;s technical
                safeguards. This includes how your code handles access controls,
                encryption, audit logging, and data transmission.
              </p>
            </div>
          </section>

          {/* Who needs HIPAA compliance */}
          <section className="mb-16" id="who-needs-hipaa">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              Who needs HIPAA compliance?
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Covered Entities",
                  desc: "Healthcare providers (hospitals, clinics, doctors), health plans (insurers, HMOs), and healthcare clearinghouses that transmit health information electronically.",
                },
                {
                  title: "Business Associates",
                  desc: "Any company that creates, receives, maintains, or transmits PHI on behalf of a Covered Entity. This includes SaaS platforms, cloud hosting providers, EHR vendors, billing services, and analytics companies that process health data.",
                },
                {
                  title: "Subcontractors of Business Associates",
                  desc: "If your SaaS product uses third-party services (payment processors, email providers, cloud databases) that handle PHI, those vendors are also subject to HIPAA. You need BAAs with each one.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-secondary rounded-lg p-5"
                >
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PHI definition */}
          <section className="mb-16" id="what-is-phi">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              What qualifies as Protected Health Information (PHI)?
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                PHI is any individually identifiable health information held or
                transmitted by a Covered Entity or Business Associate. It
                includes information that relates to an individual&apos;s past,
                present, or future physical or mental health condition, the
                provision of healthcare, or payment for healthcare — when linked
                to data that can identify the individual.
              </p>
              <p>
                HIPAA defines <strong>18 identifiers</strong> that make health
                information individually identifiable:
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Names",
                "Dates (birth, admission, discharge, death)",
                "Telephone numbers",
                "Geographic data (street address, city, ZIP)",
                "Fax numbers",
                "Social Security numbers",
                "Email addresses",
                "Medical record numbers",
                "Account numbers",
                "Health plan beneficiary numbers",
                "Certificate/license numbers",
                "Vehicle identifiers & serial numbers",
                "Device identifiers & serial numbers",
                "Web URLs",
                "IP addresses",
                "Biometric identifiers (fingerprints, voice)",
                "Full-face photographs",
                "Any other unique identifying number or code",
              ].map((identifier) => (
                <div
                  key={identifier}
                  className="bg-surface-secondary rounded-lg px-4 py-2.5 text-sm"
                >
                  {identifier}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-ink-secondary">
              If your database, API, or forms collect any of these identifiers
              alongside health-related data, you are handling PHI and HIPAA
              applies.
            </p>
          </section>

          {/* HIPAA technical safeguard requirements */}
          <section className="mb-16" id="technical-safeguards">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              HIPAA technical safeguard requirements
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              The HIPAA Security Rule (45 CFR Part 164, Subpart C) requires
              Covered Entities and Business Associates to implement technical
              safeguards to protect ePHI. These are the requirements that
              directly affect your code.
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "164.312(a) — Access controls",
                  desc: "Implement technical policies to restrict access to ePHI to authorized users and software. This includes unique user identification, emergency access procedures, automatic logoff, and encryption/decryption. Codepliant detects authentication mechanisms, role-based access, and session management in your codebase.",
                },
                {
                  title: "164.312(b) — Audit controls",
                  desc: "Implement hardware, software, and procedural mechanisms to record and examine activity in information systems containing ePHI. Codepliant identifies logging frameworks, audit trail implementations, and monitoring integrations in your code.",
                },
                {
                  title: "164.312(c) — Integrity controls",
                  desc: "Protect ePHI from improper alteration or destruction. Implement electronic mechanisms to corroborate that ePHI has not been altered. Codepliant identifies input validation, checksums, audit logging, and data integrity mechanisms in your application.",
                },
                {
                  title: "164.312(d) — Person or entity authentication",
                  desc: "Verify that users accessing ePHI are who they claim to be. Codepliant detects your authentication flows, MFA implementations, identity provider integrations, and token validation logic.",
                },
                {
                  title: "164.312(e) — Transmission security",
                  desc: "Guard against unauthorized access to ePHI during electronic transmission. Implement integrity controls and encryption. Codepliant checks for TLS configuration, encrypted API endpoints, and secure data transfer mechanisms.",
                },
              ].map((req) => (
                <div
                  key={req.title}
                  className="bg-surface-secondary rounded-lg p-5"
                >
                  <h3 className="font-semibold mb-2">{req.title}</h3>
                  <p className="text-sm text-ink-secondary">{req.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Codepliant detects health data */}
          <section className="mb-16" id="health-data-detection">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              How Codepliant detects health data in your code
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Codepliant performs static analysis across your entire codebase
                to identify PHI handling patterns. It scans ORM schemas (Prisma,
                Drizzle, Mongoose, TypeORM, Sequelize, Django, SQLAlchemy),
                API definitions, form handlers, and database migrations to
                identify fields that match the 18 HIPAA identifiers — names,
                dates of birth, Social Security numbers, medical record numbers,
                device identifiers, and more.
              </p>
              <p>
                Beyond schema detection, Codepliant traces how health data moves
                through your application. It maps data flow from user input
                through your application logic to storage and third-party
                services, identifying potential exposure points where PHI could
                be logged, cached, or transmitted without proper safeguards.
              </p>
            </div>

            {/* Healthcare service detection table */}
            <div className="mt-8 mb-6">
              <h3 className="font-semibold mb-4">
                Healthcare services and integrations Codepliant detects
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border-subtle rounded-lg overflow-hidden">
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
                        category: "EHR / Health APIs",
                        services:
                          "HL7 FHIR, Epic, Cerner, Allscripts, athenahealth, DrChrono",
                      },
                      {
                        category: "Telehealth SDKs",
                        services:
                          "Twilio Video, Vonage, Zoom SDK, Doxy.me, VSee",
                      },
                      {
                        category: "Insurance & Claims",
                        services:
                          "Eligible, Change Healthcare, Availity, claim processing APIs",
                      },
                      {
                        category: "Auth & Identity",
                        services:
                          "Auth0, Okta, NextAuth, Clerk, Firebase Auth, AWS Cognito",
                      },
                      {
                        category: "Databases & ORMs",
                        services:
                          "Prisma, Drizzle, Mongoose, TypeORM, Sequelize, Django ORM, SQLAlchemy",
                      },
                      {
                        category: "Cloud & Infrastructure",
                        services:
                          "AWS (S3, RDS, Lambda), GCP (Cloud SQL, GKE), Azure (Blob, SQL)",
                      },
                      {
                        category: "Payments & Billing",
                        services:
                          "Stripe, Square, medical billing APIs, insurance payment processors",
                      },
                      {
                        category: "Monitoring & Logging",
                        services:
                          "Sentry, Datadog, New Relic, Winston, Pino, Morgan",
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
                Codepliant also analyzes your dependency tree for packages that
                indicate health data processing — FHIR client libraries,
                HL7 parsers, medical imaging packages, and healthcare-specific
                SDKs. Environment variables like{" "}
                <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
                  EHR_API_KEY
                </code>
                ,{" "}
                <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
                  FHIR_BASE_URL
                </code>
                , and{" "}
                <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
                  HIPAA_AUDIT_LOG
                </code>{" "}
                are flagged as indicators of health data handling.
              </p>
            </div>
          </section>

          {/* HIPAA checklist for SaaS developers */}
          <section className="mb-16" id="saas-checklist">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              HIPAA compliance checklist for SaaS developers
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Use this checklist to evaluate your healthcare application&apos;s
              HIPAA readiness. Codepliant automates detection of many of these
              items from your code.
            </p>

            <div className="space-y-6">
              {[
                {
                  heading: "Access controls",
                  items: [
                    "Unique user IDs for all users accessing ePHI",
                    "Role-based access controls (RBAC) limiting PHI access to authorized users",
                    "Automatic session timeout and logoff after inactivity",
                    "Emergency access procedure documented and implemented",
                    "Multi-factor authentication (MFA) for all PHI access",
                  ],
                },
                {
                  heading: "Encryption",
                  items: [
                    "ePHI encrypted at rest (AES-256 or equivalent)",
                    "ePHI encrypted in transit (TLS 1.2+ on all endpoints)",
                    "Database connections using SSL/TLS",
                    "Encryption keys managed securely (not hardcoded)",
                    "Backups encrypted with same standards as primary data",
                  ],
                },
                {
                  heading: "Audit logging",
                  items: [
                    "All access to ePHI logged with user ID, timestamp, and action",
                    "Log tampering protections in place (immutable logs or append-only)",
                    "Logs reviewed regularly for unauthorized access",
                    "Audit logs retained for minimum 6 years",
                    "PHI excluded from log contents (no patient data in log messages)",
                  ],
                },
                {
                  heading: "Data integrity & availability",
                  items: [
                    "Input validation on all PHI fields",
                    "Backup and disaster recovery plan documented and tested",
                    "Data integrity checks (checksums, version control for records)",
                    "Deletion and retention policies enforced in code",
                  ],
                },
                {
                  heading: "Third-party vendors",
                  items: [
                    "Business Associate Agreements (BAAs) signed with all vendors handling PHI",
                    "Cloud provider configured for HIPAA (AWS BAA, GCP BAA, Azure BAA)",
                    "Sub-processor list maintained and up to date",
                    "Vendor risk assessments completed annually",
                  ],
                },
                {
                  heading: "Breach preparedness",
                  items: [
                    "Breach notification procedures documented (60-day rule)",
                    "Incident response plan tested and updated",
                    "Breach risk assessment methodology defined",
                    "Contact information for HHS OCR and affected individuals documented",
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

          {/* Documents generated */}
          <section className="mb-16" id="generated-docs">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              HIPAA documentation Codepliant generates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "HIPAA Risk Assessment",
                "Business Associate Agreement",
                "PHI Data Flow Map",
                "Access Control Policy",
                "Encryption Documentation",
                "Audit Log Requirements",
                "Breach Notification Plan",
                "Workforce Training Guide",
                "Minimum Necessary Standard",
                "Compliance Gap Analysis",
                "Incident Response Plan",
                "Data Retention Policy",
              ].map((doc) => (
                <div
                  key={doc}
                  className="bg-surface-secondary rounded-lg px-4 py-3 text-sm"
                >
                  {doc}
                </div>
              ))}
            </div>
          </section>

          {/* Why developers need HIPAA tooling */}
          <section className="mb-16" id="why-tooling">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              Why healthcare app developers need compliance tooling
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                HIPAA violations carry penalties from $100 to $50,000 per
                violation, with an annual maximum of $1.5 million per violation
                category. Criminal penalties can reach $250,000 and 10 years
                imprisonment. The HHS Office for Civil Rights investigates over
                1,000 cases annually, and the most common finding is inadequate
                risk analysis — exactly what Codepliant automates.
              </p>
              <p>
                Digital health startups face a unique challenge: they need to
                move fast to compete, but HIPAA demands thorough documentation
                and risk management. Traditional compliance consulting costs
                $30,000 to $100,000 and takes months. Codepliant bridges this
                gap by generating compliance documentation from your actual
                code, ensuring your documentation stays accurate as your
                application evolves.
              </p>
              <p>
                Unlike form-based compliance tools that ask you what data you
                collect, Codepliant looks at your code to determine what you
                actually collect. This means your HIPAA documentation reflects
                reality, not assumptions — a critical distinction when the HHS
                comes knocking.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-lg p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Scan your healthcare app for HIPAA readiness
            </h2>
            <p className="text-ink-secondary text-sm mb-6 max-w-md mx-auto">
              One command detects PHI handling patterns, identifies compliance
              gaps, and generates audit-ready documentation. Free, open source,
              no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-lg font-mono text-sm inline-block">
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
                  title: "SOC 2 Compliance Tool",
                  href: "/soc2-compliance",
                  desc: "SOC 2 readiness checklists and control mappings for startups.",
                },
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "GDPR documentation automation for developers handling EU personal data.",
                },
                {
                  title: "AI Governance Framework",
                  href: "/ai-governance",
                  desc: "EU AI Act and NIST AI RMF compliance for AI-powered healthcare applications.",
                },
                {
                  title: "HIPAA for SaaS Developers Guide",
                  href: "/blog/hipaa-for-developers",
                  desc: "Practical HIPAA guide covering PHI identifiers, technical safeguards, and BAAs.",
                },
                {
                  title: "Codepliant vs Termly vs Iubenda",
                  href: "/compare",
                  desc: "See how code-based scanning compares to form builders for compliance documentation.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block bg-surface-secondary rounded-lg p-4 hover:ring-1 hover:ring-border-strong transition-shadow"
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
