import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOC 2 Compliance Tool for Startups | Automate Audit Readiness",
  description:
    "SOC 2 compliance tool for startups. Scan your codebase to generate readiness checklists, control mappings, and evidence docs. All 5 Trust Service Criteria.",
  keywords: [
    "SOC 2 compliance",
    "SOC 2 audit",
    "SOC 2 readiness",
    "SOC 2 checklist",
    "SOC 2 for startups",
    "SOC 2 automation",
    "Trust Service Criteria",
    "SOC 2 Type I",
    "SOC 2 Type II",
    "compliance automation",
    "audit readiness tool",
    "SOC 2 controls",
    "SOC 2 evidence",
  ],
  alternates: {
    canonical: "https://codepliant.dev/soc2-compliance",
  },
  openGraph: {
    title: "SOC 2 Compliance Tool for Startups",
    description:
      "SOC 2 compliance tool for startups. Scan your codebase to generate readiness checklists, control mappings, and evidence docs. All 5 Trust Service Criteria.",
    url: "https://codepliant.dev/soc2-compliance",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOC 2 Compliance Tool for Startups",
    description:
      "Automate SOC 2 readiness from your code. Checklists, control mappings, and evidence docs for all 5 Trust Service Criteria.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is SOC 2 compliance?",
    answer:
      "SOC 2 (System and Organization Controls 2) is an auditing framework developed by the AICPA that evaluates how organizations manage customer data. It is based on five Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. A SOC 2 report is issued by an independent CPA firm after auditing your controls.",
  },
  {
    question: "Who needs SOC 2 compliance?",
    answer:
      "Any SaaS company, cloud service provider, or technology vendor that stores, processes, or transmits customer data. Enterprise buyers increasingly require SOC 2 Type II reports before signing contracts. If you sell B2B software, SOC 2 is effectively a revenue prerequisite.",
  },
  {
    question: "What is the difference between SOC 2 Type I and Type II?",
    answer:
      "SOC 2 Type I evaluates whether your controls are properly designed at a specific point in time. SOC 2 Type II evaluates whether those controls operated effectively over a period (typically 6-12 months). Type I is faster to achieve and is often the first step for startups, while Type II is what enterprise buyers ultimately require.",
  },
  {
    question: "What SOC 2 Trust Service Criteria does Codepliant cover?",
    answer:
      "Codepliant maps your codebase against all five SOC 2 Trust Service Criteria: Security (CC), Availability (A), Processing Integrity (PI), Confidentiality (C), and Privacy (P). Most startups begin with Security, which is the only required category.",
  },
  {
    question: "Can Codepliant replace a SOC 2 audit?",
    answer:
      "No. SOC 2 requires an independent CPA auditor. Codepliant accelerates your preparation by generating evidence documentation, identifying control gaps, and producing a readiness checklist so you go into the audit well-prepared and spend less time on back-and-forth with auditors.",
  },
  {
    question: "How long does SOC 2 preparation usually take?",
    answer:
      "Without tooling, SOC 2 Type I preparation typically takes 3-6 months and costs $50,000-$100,000 when you factor in consultants, GRC platforms, and engineering time. Codepliant reduces the documentation burden from weeks to minutes by generating control mappings and evidence from your actual code.",
  },
  {
    question: "Does Codepliant work with my existing security tools?",
    answer:
      "Codepliant complements your security stack. It scans your code to detect what controls you already have (encryption, access controls, logging, monitoring) and documents them in a format auditors expect. It works alongside GRC platforms, SIEM tools, and vulnerability scanners.",
  },
  {
    question: "How does Codepliant detect SOC 2 controls in my code?",
    answer:
      "Codepliant performs static analysis across your codebase. It scans dependencies, imports, environment variables, configuration files, ORM schemas, and infrastructure-as-code templates to identify security controls like encryption libraries, authentication mechanisms, logging frameworks, and monitoring integrations.",
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
    name: "Codepliant SOC 2 Compliance Tool",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "SOC 2 compliance tool that scans your codebase and generates readiness checklists, control mappings, and evidence documentation for all five Trust Service Criteria.",
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
        name: "SOC 2 Compliance",
        item: "https://codepliant.dev/soc2-compliance",
      },
    ],
  };
}

export default function Soc2Compliance() {
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

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-ink-secondary">
              <li>
                <a
                  href="/"
                  className="hover:text-brand transition-colors"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-primary font-medium">
                SOC 2 Compliance
              </li>
            </ol>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            SOC 2 Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            SOC 2 Compliance Tool for Startups
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            SOC 2 compliance is the gold standard for SaaS security, and
            enterprise buyers expect it. Codepliant scans your codebase to
            generate a SOC 2 readiness checklist, map your existing controls to
            Trust Service Criteria, and produce evidence documentation — cutting
            months off your audit preparation.
          </p>

          {/* What is SOC 2 */}
          <section className="mb-16" id="what-is-soc2">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              What is SOC 2 and who needs it?
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                SOC 2 (System and Organization Controls 2) is an auditing
                framework created by the American Institute of Certified Public
                Accountants (AICPA). It defines criteria for managing customer
                data based on five Trust Service Criteria: Security,
                Availability, Processing Integrity, Confidentiality, and
                Privacy.
              </p>
              <p>
                Unlike certifications you can self-declare, SOC 2 requires an
                independent CPA firm to audit your organization and issue a
                report. There are two types: <strong>Type I</strong> evaluates
                whether your controls are properly designed at a point in time,
                and <strong>Type II</strong> evaluates whether they operated
                effectively over a period (typically 6-12 months).
              </p>
              <p>
                <strong>You need SOC 2 if you:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sell SaaS to mid-market or enterprise companies</li>
                <li>Store, process, or transmit customer data in the cloud</li>
                <li>Respond to security questionnaires during sales cycles</li>
                <li>Want to close enterprise deals faster by proactively demonstrating trust</li>
              </ul>
              <p>
                According to industry reports, 76% of enterprise procurement
                teams require SOC 2 Type II before signing a contract. For
                startups selling B2B, SOC 2 is not optional — it is a revenue
                gate.
              </p>
            </div>
          </section>

          {/* 5 Trust Service Criteria */}
          <section className="mb-16" id="trust-service-criteria">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              The 5 Trust Service Criteria explained
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              SOC 2 is organized around five Trust Service Criteria (TSC). Only
              Security is required for every SOC 2 audit. The other four are
              optional and selected based on your business context. Here is
              what each criterion covers and how Codepliant detects relevant
              controls in your code.
            </p>
            <div className="space-y-4">
              {[
                {
                  label: "CC",
                  title: "Security (Common Criteria)",
                  status: "Required",
                  desc: "Protection against unauthorized access to systems and data. Includes logical access controls, encryption, firewalls, intrusion detection, and vulnerability management. Codepliant detects authentication mechanisms (OAuth, JWT, session-based), RBAC implementations, encryption libraries (bcrypt, argon2, TLS configuration), and input validation patterns in your code.",
                },
                {
                  label: "A",
                  title: "Availability",
                  status: "Optional",
                  desc: "Systems are available for operation and use as committed. Includes monitoring, disaster recovery, and incident response. Codepliant identifies uptime monitoring SDKs (Datadog, PagerDuty, New Relic), health check endpoints, load balancer configurations, and backup mechanisms in your infrastructure code.",
                },
                {
                  label: "PI",
                  title: "Processing Integrity",
                  status: "Optional",
                  desc: "System processing is complete, valid, accurate, timely, and authorized. Includes data validation, error handling, and quality assurance. Codepliant detects input validation libraries (Zod, Joi, class-validator), error handling patterns, queue processing frameworks, and data transformation pipelines.",
                },
                {
                  label: "C",
                  title: "Confidentiality",
                  status: "Optional",
                  desc: "Information designated as confidential is protected as committed. Includes encryption at rest, access restrictions, and data classification. Codepliant identifies encryption-at-rest configurations (KMS, Vault), secrets management patterns (env vars, secret managers), and data masking or redaction logic.",
                },
                {
                  label: "P",
                  title: "Privacy",
                  status: "Optional",
                  desc: "Personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments. Overlaps with GDPR requirements. Codepliant scans ORM schemas for PII fields, detects analytics and tracking integrations, identifies consent management patterns, and maps data flows to third-party processors.",
                },
              ].map((tsc) => (
                <div key={tsc.label} className="bg-surface-secondary rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">
                      <span className="text-brand font-mono mr-2">{tsc.label}</span>
                      {tsc.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                        tsc.status === "Required"
                          ? "bg-brand/10 text-brand"
                          : "bg-surface-secondary text-ink-secondary border border-border"
                      }`}
                    >
                      {tsc.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-secondary">{tsc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What SOC 2 requires from engineering */}
          <section className="mb-16" id="engineering-requirements">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              What SOC 2 requires from your engineering team
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Beyond the Trust Service Criteria, SOC 2 defines specific Common
              Criteria (CC) control families that your engineering team must
              implement and document. These are the controls auditors evaluate
              most closely.
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "CC6 — Logical and physical access controls",
                  desc: "Demonstrate how your application controls access to systems and data. Codepliant detects authentication mechanisms, RBAC implementations, and session management in your code.",
                },
                {
                  title: "CC7 — System operations monitoring",
                  desc: "Show that you monitor your systems for anomalies. Codepliant identifies logging frameworks, monitoring SDKs, and alerting integrations across your codebase.",
                },
                {
                  title: "CC8 — Change management",
                  desc: "Document your change management process. Codepliant analyzes your CI/CD configuration, code review requirements, and deployment pipelines.",
                },
                {
                  title: "CC9 — Risk mitigation",
                  desc: "Prove you identify and mitigate risks. Codepliant generates a risk assessment based on third-party dependencies, data handling patterns, and infrastructure configuration.",
                },
              ].map((req) => (
                <div key={req.title} className="bg-surface-secondary rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{req.title}</h3>
                  <p className="text-sm text-ink-secondary">{req.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Codepliant generates SOC 2 readiness docs */}
          <section className="mb-16" id="how-it-works">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              How Codepliant generates SOC 2 readiness documents
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                SOC 2 automation starts with understanding what your application
                actually does. Codepliant performs static analysis across your
                entire codebase to identify security controls, data handling
                patterns, and infrastructure configuration.
              </p>
            </div>
            <div className="space-y-4 mt-6">
              {[
                {
                  step: "1",
                  title: "Scan your codebase",
                  desc: "Codepliant analyzes dependencies, imports, environment variables, ORM schemas, and infrastructure-as-code files. It detects encryption at rest and in transit, authentication mechanisms (OAuth, JWT, session-based), role-based access controls, input validation, and logging frameworks.",
                },
                {
                  step: "2",
                  title: "Map controls to Trust Service Criteria",
                  desc: "Each detected control is mapped to the relevant SOC 2 criteria. Authentication maps to CC6 (Access Controls), logging maps to CC7 (System Operations), CI/CD configuration maps to CC8 (Change Management). The mapping uses the AICPA's official criteria definitions.",
                },
                {
                  step: "3",
                  title: "Generate evidence documentation",
                  desc: "Codepliant produces audit-ready documents with references to specific files and configurations in your codebase. The readiness checklist shows which controls you already satisfy and which gaps remain. The control mapping provides the evidence narrative your auditor needs.",
                },
                {
                  step: "4",
                  title: "Identify gaps and recommendations",
                  desc: "The compliance gap analysis highlights missing controls and provides actionable recommendations. If you have no monitoring SDK detected, it recommends adding one. If encryption-at-rest is missing, it flags that as a gap against CC6.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-ink-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What Codepliant generates */}
          <section className="mb-16" id="generated-docs">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              SOC 2 documentation Codepliant generates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "SOC 2 Readiness Checklist",
                "Control-to-Criteria Mapping",
                "Access Control Evidence",
                "Encryption Inventory",
                "Third-Party Vendor List",
                "Change Management Summary",
                "Logging & Monitoring Report",
                "Data Flow Diagram",
                "Risk Assessment",
                "Compliance Gap Analysis",
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

          {/* Timeline and cost comparison */}
          <section className="mb-16" id="timeline-cost">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              SOC 2 timeline and cost: manual vs. Codepliant
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              The traditional path to SOC 2 involves hiring a compliance
              consultant, purchasing a GRC platform, and dedicating engineering
              time for months. Codepliant eliminates the documentation
              bottleneck, which is typically the most time-consuming part for
              engineering teams.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold"></th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Manual approach
                    </th>
                    <th className="text-left py-3 pl-4 font-semibold text-brand">
                      With Codepliant
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-secondary">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-ink-primary">
                      Documentation time
                    </td>
                    <td className="py-3 px-4">4-8 weeks</td>
                    <td className="py-3 pl-4 text-brand font-medium">
                      Minutes
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-ink-primary">
                      Total prep time (Type I)
                    </td>
                    <td className="py-3 px-4">3-6 months</td>
                    <td className="py-3 pl-4 text-brand font-medium">
                      2-6 weeks
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-ink-primary">
                      Compliance consultant
                    </td>
                    <td className="py-3 px-4">$20,000-$50,000</td>
                    <td className="py-3 pl-4 text-brand font-medium">
                      $0 (open source)
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-ink-primary">
                      GRC platform
                    </td>
                    <td className="py-3 px-4">$10,000-$30,000/yr</td>
                    <td className="py-3 pl-4 text-brand font-medium">
                      $0 (open source)
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-ink-primary">
                      Engineering hours
                    </td>
                    <td className="py-3 px-4">200-400 hours</td>
                    <td className="py-3 pl-4 text-brand font-medium">
                      10-20 hours
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-ink-primary">
                      Total estimated cost
                    </td>
                    <td className="py-3 px-4">$50,000-$100,000+</td>
                    <td className="py-3 pl-4 text-brand font-medium">
                      Audit fee only
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-secondary mt-4">
              * Codepliant handles documentation and evidence generation. You
              will still need an independent CPA firm to conduct the audit
              (typically $10,000-$30,000 for Type I). Codepliant reduces total
              cost by eliminating consultant and platform fees.
            </p>
          </section>

          {/* SOC 2 readiness checklist */}
          <section className="mb-16" id="soc2-checklist">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              SOC 2 readiness checklist for startups
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Use this checklist to evaluate your organization&apos;s SOC 2
              readiness. Codepliant automates detection of many of these
              controls from your code.
            </p>

            <div className="space-y-6">
              {[
                {
                  heading: "Access controls (CC6)",
                  items: [
                    "Unique user accounts for all team members (no shared credentials)",
                    "Role-based access controls (RBAC) limiting data access by role",
                    "Multi-factor authentication (MFA) enforced for all production systems",
                    "Least-privilege access to databases, cloud consoles, and admin panels",
                    "Offboarding process that revokes access within 24 hours of departure",
                    "Password policy enforcing minimum length and complexity requirements",
                  ],
                },
                {
                  heading: "Encryption & data protection (CC6)",
                  items: [
                    "Data encrypted at rest (AES-256 or equivalent) in all databases",
                    "Data encrypted in transit (TLS 1.2+ on all endpoints and API calls)",
                    "Secrets stored in a secrets manager (not hardcoded or in .env files in repos)",
                    "Encryption keys rotated on a defined schedule",
                    "Backups encrypted with the same standards as primary storage",
                  ],
                },
                {
                  heading: "Monitoring & logging (CC7)",
                  items: [
                    "Centralized logging for application events and errors",
                    "Infrastructure monitoring with alerting for anomalies",
                    "Audit logs capturing who accessed what data and when",
                    "Log retention policy defined and enforced (minimum 90 days)",
                    "Alerting configured for failed login attempts and suspicious activity",
                  ],
                },
                {
                  heading: "Change management (CC8)",
                  items: [
                    "All code changes go through pull request review before merging",
                    "CI/CD pipeline with automated tests before deployment",
                    "Separate development, staging, and production environments",
                    "Deployment rollback procedures documented and tested",
                    "Infrastructure changes managed through infrastructure-as-code",
                  ],
                },
                {
                  heading: "Risk management (CC9)",
                  items: [
                    "Annual risk assessment covering security, availability, and data integrity",
                    "Third-party vendor risk assessments completed for critical vendors",
                    "Business continuity and disaster recovery plan documented",
                    "Incident response plan tested at least annually",
                    "Security awareness training completed by all employees annually",
                  ],
                },
                {
                  heading: "Availability & business continuity (A1)",
                  items: [
                    "Uptime SLA defined and monitored (e.g., 99.9%)",
                    "Automated health checks and status page for customers",
                    "Database backups automated and tested for restoration",
                    "Failover procedures documented for critical infrastructure",
                    "Capacity planning reviewed quarterly to prevent resource exhaustion",
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

          {/* Why startups need SOC 2 */}
          <section className="mb-16" id="why-startups">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              Why startups need SOC 2 compliance
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Enterprise sales cycles stall without SOC 2. Procurement teams
                send security questionnaires, and without a SOC 2 report, you
                are answering the same questions manually for every prospect.
                A SOC 2 report is a standardized answer to those questions.
              </p>
              <p>
                Beyond sales, SOC 2 signals maturity to investors, partners,
                and customers. It demonstrates that your organization takes
                security seriously and has formalized controls around data
                protection. For startups raising Series A and beyond, SOC 2
                compliance is increasingly expected during due diligence.
              </p>
              <p>
                The earlier you start, the easier it is. Building SOC 2
                controls into your engineering practices from day one costs a
                fraction of retrofitting them later. Codepliant helps you
                understand where you stand today so you can close gaps
                incrementally rather than scrambling before an audit.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Start your SOC 2 readiness assessment
            </h2>
            <p className="text-ink-secondary text-sm mb-6">
              Scan your codebase. See what controls you already have. Get a
              readiness checklist in minutes. Free, open source, no account
              required.
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
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "GDPR documentation automation for applications processing EU personal data.",
                },
                {
                  title: "AI Governance Framework",
                  href: "/ai-governance",
                  desc: "EU AI Act and NIST AI RMF compliance documentation for AI-powered applications.",
                },
                {
                  title: "Terms of Service Generator",
                  href: "/terms-of-service-generator",
                  desc: "Generate Terms of Service from your codebase instead of using generic templates.",
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
