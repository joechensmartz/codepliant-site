import type { Metadata } from "next";
import { CodeBlock } from "../components";

export const metadata: Metadata = {
  title:
    "SOC 2 for Startups: A Developer's Survival Guide | Codepliant",
  description:
    "SOC 2 survival guide for startup developers. Learn the 5 Trust Service Criteria, avoid common mistakes, and go from zero to SOC 2 ready in 30 days with Codepliant.",
  alternates: {
    canonical: "https://codepliant.dev/blog/soc2-for-startups",
  },
  keywords: [
    "SOC 2 for startups",
    "SOC 2 compliance",
    "SOC 2 developer guide",
    "SOC 2 Trust Service Criteria",
    "SOC 2 readiness",
    "SOC 2 checklist",
    "SOC 2 automation",
    "SOC 2 Type I",
    "SOC 2 Type II",
    "startup compliance",
    "enterprise sales compliance",
    "SOC 2 from code",
    "codepliant",
    "SOC 2 mistakes",
    "SOC 2 timeline",
  ],
  openGraph: {
    title: "SOC 2 for Startups: A Developer's Survival Guide",
    description:
      "SOC 2 survival guide for startup developers. Learn the 5 Trust Service Criteria, avoid common mistakes, and go from zero to SOC 2 ready in 30 days.",
    url: "https://codepliant.dev/blog/soc2-for-startups",
    type: "article",
    publishedTime: "2026-03-17T00:00:00Z",
    modifiedTime: "2026-03-17T00:00:00Z",
    authors: ["Codepliant"],
    tags: [
      "SOC 2",
      "Compliance",
      "Startups",
      "Developer Guide",
      "Security",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOC 2 for Startups: A Developer's Survival Guide",
    description:
      "From zero to SOC 2 ready in 30 days. The 5 Trust Service Criteria explained simply, common mistakes to avoid, and how to automate readiness from your code.",
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "SOC 2 for Startups: A Developer's Survival Guide",
    description:
      "SOC 2 survival guide for startup developers. Learn the 5 Trust Service Criteria, avoid common mistakes, and go from zero to SOC 2 ready in 30 days with Codepliant.",
    datePublished: "2026-03-17",
    dateModified: "2026-03-17",
    author: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://codepliant.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://codepliant.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://codepliant.dev/blog/soc2-for-startups",
    },
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long does it take a startup to get SOC 2 compliant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Traditional SOC 2 preparation takes 3-6 months. With Codepliant, you can generate SOC 2 readiness documents from your codebase in minutes and reach audit-ready status in as little as 30 days by automating evidence collection and control documentation.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 5 SOC 2 Trust Service Criteria?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The five Trust Service Criteria are Security (required for every SOC 2 audit), Availability (uptime and disaster recovery), Processing Integrity (data accuracy and completeness), Confidentiality (protection of sensitive business data), and Privacy (personal information handling under privacy regulations).",
        },
      },
      {
        "@type": "Question",
        name: "Can I generate SOC 2 readiness documents from my code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Run `npx codepliant go` in your project directory. Codepliant scans your codebase to detect authentication, encryption, logging, CI/CD pipelines, and cloud infrastructure, then generates SOC 2 readiness checklists, control mappings, and evidence documentation based on what it actually finds in your code.",
        },
      },
    ],
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
        name: "Blog",
        item: "https://codepliant.dev/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "SOC 2 for Startups",
        item: "https://codepliant.dev/blog/soc2-for-startups",
      },
    ],
  };
}

export default function Soc2ForStartups() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-ink-tertiary mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-ink transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-ink transition-colors">
              Blog
            </a>
            <span className="mx-2">/</span>
            <span className="text-ink-secondary">SOC 2 for Startups</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            <a href="/blog" className="hover:underline">
              Blog
            </a>
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            SOC 2 for Startups: A Developer&apos;s Survival Guide
          </h1>
          <p className="text-sm text-ink-secondary mb-12">
            Published March 17, 2026 &middot; 12 min read
          </p>

          {/* Table of Contents */}
          <nav className="bg-surface-secondary rounded-2xl p-6 mb-12">
            <p className="text-sm font-semibold mb-3">In this article</p>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <a href="#what-is-soc2" className="hover:text-ink transition-colors">
                  1. What is SOC 2 and why your startup needs it
                </a>
              </li>
              <li>
                <a href="#trust-service-criteria" className="hover:text-ink transition-colors">
                  2. The 5 Trust Service Criteria explained simply
                </a>
              </li>
              <li>
                <a href="#type-1-vs-type-2" className="hover:text-ink transition-colors">
                  3. Type I vs. Type II: which one first?
                </a>
              </li>
              <li>
                <a href="#common-mistakes" className="hover:text-ink transition-colors">
                  4. Common mistakes startups make
                </a>
              </li>
              <li>
                <a href="#codepliant-soc2" className="hover:text-ink transition-colors">
                  5. How Codepliant generates SOC 2 readiness docs from code
                </a>
              </li>
              <li>
                <a href="#30-day-timeline" className="hover:text-ink transition-colors">
                  6. From zero to SOC 2 ready in 30 days
                </a>
              </li>
              <li>
                <a href="#get-started" className="hover:text-ink transition-colors">
                  7. Get started now
                </a>
              </li>
            </ul>
          </nav>

          {/* Intro */}
          <p className="text-[length:var(--text-lg)] text-ink-secondary leading-relaxed mb-6">
            You just landed a meeting with your first enterprise prospect. The demo went
            great. They love the product. Then their security team sends over a vendor
            questionnaire, and the first question reads: <strong>&ldquo;Please provide
            your most recent SOC 2 Type II report.&rdquo;</strong>
          </p>
          <p className="text-[length:var(--text-lg)] text-ink-secondary leading-relaxed mb-12">
            If that sentence made your stomach drop, you are not alone. SOC 2 is the
            single most common security compliance requirement for B2B SaaS, and it is the
            gate that stands between your startup and enterprise revenue. This guide
            explains what SOC 2 actually is, what it requires in plain language, and how
            to get there without burning three months of engineering time.
          </p>

          {/* Section 1 */}
          <h2
            id="what-is-soc2"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            1. What is SOC 2 and why your startup needs it
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-4">
            SOC 2 (System and Organization Controls 2) is an auditing framework created
            by the AICPA (American Institute of Certified Public Accountants). It
            evaluates how your organization manages customer data across five categories
            called Trust Service Criteria.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-4">
            Unlike certifications you can self-declare (like ISO 27001), SOC 2 requires
            an independent CPA firm to audit your controls and issue a formal report.
            That report is what enterprise buyers ask for.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Why startups cannot ignore it
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink-secondary mb-6">
            <li>
              <strong>Enterprise sales blocker.</strong> 85% of enterprise procurement
              teams require SOC 2 before signing. No report means no deal.
            </li>
            <li>
              <strong>Faster sales cycles.</strong> Having SOC 2 ready eliminates weeks of
              back-and-forth security questionnaires during the sales process.
            </li>
            <li>
              <strong>Investor signal.</strong> VCs increasingly view SOC 2 as a sign of
              operational maturity, especially at Series A and beyond.
            </li>
            <li>
              <strong>Competitive moat.</strong> If your competitor has SOC 2 and you
              do not, the buyer picks them. It is that simple.
            </li>
          </ul>

          {/* Section 2 */}
          <h2
            id="trust-service-criteria"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            2. The 5 Trust Service Criteria explained simply
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-6">
            SOC 2 is built around five Trust Service Criteria (TSC). Only Security is
            mandatory for every audit. You pick which additional criteria are relevant to
            your business.
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">
                Security (CC Series) &mdash; Required
              </p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Protects the system against unauthorized access. This is the foundation of
                every SOC 2 audit. It covers access controls, firewalls, encryption,
                intrusion detection, and security incident response. If you only pick one
                criterion, it is this one.
              </p>
              <p className="text-sm text-ink-tertiary mt-2">
                <strong>What auditors look for:</strong> MFA on all accounts, least-privilege
                access, encrypted data at rest and in transit, vulnerability scanning, and
                an incident response plan.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Availability (A Series)</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Ensures the system is available for operation as committed. This is about
                uptime, disaster recovery, and business continuity. Relevant if you have
                SLAs with customers.
              </p>
              <p className="text-sm text-ink-tertiary mt-2">
                <strong>What auditors look for:</strong> Uptime monitoring, backup
                procedures, disaster recovery plan, capacity planning, and documented SLAs.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Processing Integrity (PI Series)</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                System processing is complete, valid, accurate, and authorized. Relevant if
                you process financial transactions, calculations, or data transformations
                where accuracy matters.
              </p>
              <p className="text-sm text-ink-tertiary mt-2">
                <strong>What auditors look for:</strong> Input validation, error handling,
                data reconciliation, QA processes, and processing monitoring.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Confidentiality (C Series)</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Protects information designated as confidential. This covers trade secrets,
                business plans, intellectual property, and any data marked as confidential
                in contracts.
              </p>
              <p className="text-sm text-ink-tertiary mt-2">
                <strong>What auditors look for:</strong> Data classification policies,
                encryption, access restrictions on confidential data, secure disposal, and
                NDA processes.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Privacy (P Series)</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Covers the collection, use, retention, disclosure, and disposal of personal
                information. Overlaps with GDPR and CCPA. Relevant if you handle end-user
                personal data.
              </p>
              <p className="text-sm text-ink-tertiary mt-2">
                <strong>What auditors look for:</strong> Privacy notice, consent mechanisms,
                data retention policies, data subject rights processes, and third-party
                data sharing controls.
              </p>
            </div>
          </div>

          <div className="bg-surface-secondary rounded-2xl p-6 mb-8 border-l-4 border-brand">
            <p className="text-sm text-ink-secondary leading-relaxed">
              <strong>Startup tip:</strong> Most early-stage SaaS companies start with
              Security + Availability. Only add Processing Integrity, Confidentiality, or
              Privacy if your customers specifically request them. Adding unnecessary
              criteria increases audit scope and cost without adding value.
            </p>
          </div>

          {/* Section 3 */}
          <h2
            id="type-1-vs-type-2"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            3. Type I vs. Type II: which one first?
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 pr-4 font-semibold"></th>
                  <th className="text-left py-3 pr-4 font-semibold">Type I</th>
                  <th className="text-left py-3 font-semibold">Type II</th>
                </tr>
              </thead>
              <tbody className="text-ink-secondary">
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4 font-medium">What it proves</td>
                  <td className="py-3 pr-4">Controls are designed properly</td>
                  <td className="py-3">Controls work effectively over time</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4 font-medium">Observation period</td>
                  <td className="py-3 pr-4">Single point in time</td>
                  <td className="py-3">3&ndash;12 months</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4 font-medium">Timeline</td>
                  <td className="py-3 pr-4">1&ndash;3 months</td>
                  <td className="py-3">6&ndash;12 months</td>
                </tr>
                <tr className="border-b border-border-subtle">
                  <td className="py-3 pr-4 font-medium">Cost</td>
                  <td className="py-3 pr-4">$15K&ndash;$30K</td>
                  <td className="py-3">$30K&ndash;$80K</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">Best for</td>
                  <td className="py-3 pr-4">First-time audits, urgency</td>
                  <td className="py-3">Enterprise buyers want this</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-ink-secondary leading-relaxed mb-4">
            <strong>The playbook:</strong> Get Type I first to unblock deals now, then
            immediately start your observation period for Type II. Most auditors can run
            both in parallel. Type I shows you are serious; Type II is the gold standard
            buyers ultimately want.
          </p>

          {/* Section 4 */}
          <h2
            id="common-mistakes"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            4. Common mistakes startups make
          </h2>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Mistake 1: Starting too late
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            The most expensive SOC 2 mistake is scrambling to get compliant after an
            enterprise prospect asks for your report. By then you are already behind.
            Building security controls retroactively is 3&ndash;5x more expensive than
            designing them in from the start.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-6">
            <strong>Fix:</strong> Start SOC 2 preparation as soon as you are selling to
            businesses. Even at pre-seed, documenting your controls takes minimal effort
            and saves months later.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Mistake 2: Collecting evidence manually
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            Screenshots of AWS console settings. Manually exported GitHub PR lists.
            Spreadsheets tracking who has access to what. This is how startups burn 100+
            engineering hours on compliance busywork.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-6">
            <strong>Fix:</strong> Automate evidence collection from your code and
            infrastructure. Your codebase already contains the answers: authentication
            setup, encryption config, CI/CD pipelines, logging, and access controls are
            all in your repository.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Mistake 3: Over-scoping the audit
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            Including all five Trust Service Criteria when you only need two. Including
            legacy systems that are being sunset. Including internal tools that never
            touch customer data.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-6">
            <strong>Fix:</strong> Minimize scope ruthlessly. Only include systems that
            store, process, or transmit customer data. Start with Security +
            Availability. You can always expand scope in your next audit.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Mistake 4: Treating SOC 2 as a one-time project
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-4">
            SOC 2 Type II requires continuous compliance. If you build controls just
            to pass the audit and then stop maintaining them, your next audit will
            surface gaps. Enterprise customers expect annual renewal.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-6">
            <strong>Fix:</strong> Integrate compliance checks into your CI/CD pipeline.
            Make compliance a byproduct of good engineering, not a separate workstream.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-4">
            Mistake 5: Buying expensive GRC platforms too early
          </h3>
          <p className="text-ink-secondary leading-relaxed mb-6">
            Enterprise GRC tools like Vanta and Drata cost $20K&ndash;$50K/year. For a
            5-person startup burning through runway, that is a painful line item.
            Especially when 80% of SOC 2 readiness can be derived from what already
            exists in your codebase.
          </p>
          <p className="text-ink-secondary leading-relaxed mb-6">
            <strong>Fix:</strong> Start with open-source tools that scan your code for
            compliance signals. Upgrade to a GRC platform when you reach the scale that
            justifies the cost.
          </p>

          {/* Section 5 */}
          <h2
            id="codepliant-soc2"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            5. How Codepliant generates SOC 2 readiness docs from code
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-4">
            Codepliant is an open-source CLI that scans your codebase and generates
            compliance documentation based on what it actually finds. No manual
            data entry. No questionnaires. One command:
          </p>

          <CodeBlock filename="Terminal">
            {`npx codepliant go

Scanning project...
  Detected: Node.js + TypeScript
  Detected: AWS S3, RDS (encrypted at rest)
  Detected: Auth0 (MFA enabled)
  Detected: GitHub Actions CI/CD
  Detected: Winston logging (structured)
  Detected: Sentry error tracking

Generating documents...
  [+] SOC 2 Readiness Checklist
  [+] Access Control Policy
  [+] Change Management Policy
  [+] Incident Response Plan
  [+] Encryption Policy
  [+] Backup & Recovery Policy
  [+] Audit Log Policy
  [+] Risk Register
  [+] Business Continuity Plan

9 documents generated in compliance-docs/`}
          </CodeBlock>

          <p className="text-ink-secondary leading-relaxed mb-6">
            Here is what Codepliant detects and maps to SOC 2 controls:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Authentication &amp; Access</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Scans for auth libraries (Auth0, Clerk, NextAuth, Passport), MFA
                configuration, role-based access patterns, and session management. Maps to
                SOC 2 Security controls CC6.1&ndash;CC6.8.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Encryption &amp; Data Protection</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Detects TLS configuration, database encryption settings, key management
                services (AWS KMS, Google Cloud KMS), and hashing algorithms. Maps to
                SOC 2 Security and Confidentiality controls.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">CI/CD &amp; Change Management</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Analyzes GitHub Actions, GitLab CI, and other pipeline configurations for
                code review requirements, automated testing, deployment approvals, and
                environment separation. Maps to SOC 2 Change Management controls CC8.1.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Logging &amp; Monitoring</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Identifies logging libraries (Winston, Pino, Bunyan), error tracking
                (Sentry, Datadog, New Relic), and audit trail implementations. Maps to
                SOC 2 Monitoring controls CC7.1&ndash;CC7.4.
              </p>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2">Infrastructure &amp; Availability</p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Scans Terraform, CloudFormation, and Docker configurations for backup
                policies, multi-region setup, health checks, and auto-scaling rules.
                Maps to SOC 2 Availability controls A1.1&ndash;A1.3.
              </p>
            </div>
          </div>

          <p className="text-ink-secondary leading-relaxed mb-4">
            Every generated document is grounded in your actual code, not generic
            templates. If Codepliant detects that you use Auth0 with MFA enforced, your
            Access Control Policy will reference that specific configuration. If your
            Terraform uses encrypted RDS instances, the Encryption Policy reflects it.
          </p>

          <p className="text-ink-secondary leading-relaxed mb-6">
            The result: compliance documents that match reality, ready to hand to your
            auditor on day one.
          </p>

          {/* Section 6 */}
          <h2
            id="30-day-timeline"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            6. From zero to SOC 2 ready in 30 days
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-6">
            Here is a realistic 30-day timeline for a startup using Codepliant to
            prepare for a SOC 2 Type I audit.
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2 text-brand">
                Week 1: Baseline scan &amp; gap analysis
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-ink-secondary">
                <li>
                  Run <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs">npx codepliant go</code> to
                  generate your initial readiness documents
                </li>
                <li>Review the SOC 2 Readiness Checklist for gaps</li>
                <li>Identify controls that exist in code vs. controls that are missing</li>
                <li>Choose your Trust Service Criteria scope (start with Security + Availability)</li>
              </ul>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2 text-brand">
                Week 2: Close critical gaps
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-ink-secondary">
                <li>Enable MFA on all accounts (AWS, GitHub, cloud providers)</li>
                <li>Implement structured logging if not present</li>
                <li>Document your incident response process</li>
                <li>Set up automated backups and verify restore procedures</li>
                <li>Re-run Codepliant to update documents with new controls</li>
              </ul>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2 text-brand">
                Week 3: Policy review &amp; team alignment
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-ink-secondary">
                <li>Review and customize generated policies (add company-specific details)</li>
                <li>Share policies with your team for acknowledgment</li>
                <li>Set up a compliance docs folder in your repository</li>
                <li>
                  Add Codepliant to CI/CD to keep documents in sync with code changes
                </li>
              </ul>
            </div>

            <div className="bg-surface-secondary rounded-2xl p-6">
              <p className="font-semibold mb-2 text-brand">
                Week 4: Auditor engagement
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-ink-secondary">
                <li>Select an auditor (look for CPA firms experienced with startups)</li>
                <li>Share your generated documentation package</li>
                <li>Complete the auditor readiness assessment</li>
                <li>Schedule your Type I audit window</li>
              </ul>
            </div>
          </div>

          <CodeBlock filename="Add Codepliant to CI/CD">
            {`# .github/workflows/compliance.yml
name: Compliance Check
on:
  push:
    branches: [main]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx codepliant go --output compliance-docs/
      - uses: actions/upload-artifact@v4
        with:
          name: compliance-docs
          path: compliance-docs/`}
          </CodeBlock>

          <div className="bg-surface-secondary rounded-2xl p-6 mb-8 border-l-4 border-brand">
            <p className="text-sm text-ink-secondary leading-relaxed">
              <strong>Key insight:</strong> The 30-day timeline works because Codepliant
              automates the most time-consuming part of SOC 2 preparation &mdash;
              documenting what your controls actually are. Instead of spending weeks
              manually inventorying your security posture, you scan your code and get
              accurate documentation in minutes.
            </p>
          </div>

          {/* Section 7: CTA */}
          <h2
            id="get-started"
            className="text-2xl font-bold tracking-tight mt-16 mb-6"
          >
            7. Get started now
          </h2>

          <p className="text-ink-secondary leading-relaxed mb-6">
            SOC 2 does not have to be a six-month engineering detour. Scan your codebase,
            generate your readiness documents, close the gaps, and get to your audit.
            One command to start:
          </p>

          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-12">
            <h3 className="text-xl font-bold mb-3">
              Scan your codebase for SOC 2 readiness
            </h3>
            <p className="text-ink-secondary text-sm mb-6">
              Codepliant detects your security controls, generates readiness documents, and
              identifies gaps &mdash; all from your actual code. Free, open source, runs
              locally.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
            <p className="text-xs text-ink-tertiary mt-4">
              No account required. No data leaves your machine.
            </p>
          </section>

          {/* Related links */}
          <div className="border-t border-border-subtle pt-8">
            <h3 className="text-lg font-semibold mb-4">Related reading</h3>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <a
                  href="/soc2-compliance"
                  className="text-brand hover:underline"
                >
                  SOC 2 Compliance Tool &mdash; Full Feature Overview
                </a>
              </li>
              <li>
                <a
                  href="/blog/gdpr-for-developers"
                  className="text-brand hover:underline"
                >
                  GDPR Compliance for Developers: A Practical Guide
                </a>
              </li>
              <li>
                <a
                  href="/blog/generate-privacy-policy-from-code"
                  className="text-brand hover:underline"
                >
                  How to Generate a Privacy Policy from Your Code in 30 Seconds
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
