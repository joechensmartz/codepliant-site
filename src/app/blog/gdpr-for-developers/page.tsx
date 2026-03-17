import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Compliance for Developers: A Practical Guide | Codepliant",
  description:
    "A practical GDPR guide for developers building SaaS applications. Covers data processing, consent, user rights, sub-processors, DPAs, common mistakes, code examples, and actionable steps your engineering team can take today.",
  alternates: {
    canonical: "https://codepliant.dev/blog/gdpr-for-developers",
  },
  keywords: [
    "GDPR compliance",
    "GDPR for developers",
    "GDPR SaaS",
    "data privacy",
    "privacy policy generator",
    "GDPR engineering checklist",
    "data processing agreement",
    "GDPR consent management",
    "right to erasure",
    "data subject rights",
    "GDPR code examples",
    "codepliant",
    "GDPR automation",
    "sub-processor register",
    "GDPR mistakes",
  ],
  openGraph: {
    title: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "Everything developers need to know about GDPR compliance. Practical, code-focused guidance for SaaS engineering teams.",
    url: "https://codepliant.dev/blog/gdpr-for-developers",
    type: "article",
    publishedTime: "2026-03-16T00:00:00Z",
    modifiedTime: "2026-03-16T00:00:00Z",
    authors: ["Codepliant"],
    tags: [
      "GDPR",
      "Data Privacy",
      "Developer Guide",
      "Compliance",
      "SaaS",
    ],
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "Developer GDPR guide covering data processing, consent, user rights, common mistakes, and practical compliance steps for SaaS teams.",
    images: ["/og-image.png"],
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "A practical GDPR guide for developers building SaaS applications. Covers data processing, consent, user rights, sub-processors, DPAs, and actionable steps.",
    datePublished: "2026-03-16",
    dateModified: "2026-03-16",
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
      "@id": "https://codepliant.dev/blog/gdpr-for-developers",
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
        name: "How can I check if my codebase has GDPR-relevant services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run `npx codepliant go` in your project directory. Codepliant scans your dependencies, imports, and environment variables to detect analytics, payment processors, error tracking, and other services that collect personal data, then generates compliance documentation automatically.",
        },
      },
      {
        "@type": "Question",
        name: "What are the most common GDPR mistakes developers make?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common mistakes include treating GDPR as a legal-only problem, not tracking sub-processors when adding new npm packages, collecting data without a documented legal basis, storing personal data in logs indefinitely, and assuming anonymization is simpler than it is.",
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
        name: "GDPR for Developers",
        item: "https://codepliant.dev/blog/gdpr-for-developers",
      },
    ],
  };
}

function CodeBlock({
  filename,
  children,
}: {
  filename?: string;
  children: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden my-6">
      {filename && (
        <div className="bg-code-bg px-4 py-2 text-code-fg text-xs font-mono opacity-70 border-b border-border-subtle">
          {filename}
        </div>
      )}
      <pre className="bg-code-bg text-code-fg px-4 py-4 overflow-x-auto text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function GdprForDevelopers() {
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
            <span className="text-ink-secondary">GDPR for Developers</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            <a href="/blog" className="hover:underline">
              Blog
            </a>
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            GDPR Compliance for Developers: A Practical Guide
          </h1>
          <p className="text-sm text-ink-secondary mb-12">
            Published March 16, 2026 &middot; 20 min read
          </p>

          {/* Table of Contents */}
          <nav className="bg-surface-secondary rounded-2xl p-6 mb-12">
            <h2 className="text-sm font-bold tracking-wide uppercase text-ink mb-4">
              Table of contents
            </h2>
            <ol className="space-y-2 text-sm text-ink-secondary list-decimal list-inside">
              <li>
                <a
                  href="#core-concepts"
                  className="hover:text-ink transition-colors"
                >
                  GDPR core concepts developers need to understand
                </a>
              </li>
              <li>
                <a
                  href="#engineering-checklist"
                  className="hover:text-ink transition-colors"
                >
                  What you need to build: the GDPR engineering checklist
                </a>
              </li>
              <li>
                <a
                  href="#detecting-gdpr-services"
                  className="hover:text-ink transition-colors"
                >
                  Detecting GDPR-relevant services with Codepliant
                </a>
              </li>
              <li>
                <a
                  href="#common-mistakes"
                  className="hover:text-ink transition-colors"
                >
                  Common GDPR mistakes developers make
                </a>
              </li>
              <li>
                <a
                  href="#implementation-patterns"
                  className="hover:text-ink transition-colors"
                >
                  Common GDPR implementation patterns for SaaS
                </a>
              </li>
              <li>
                <a
                  href="#international-transfers"
                  className="hover:text-ink transition-colors"
                >
                  International data transfers
                </a>
              </li>
              <li>
                <a
                  href="#gdpr-and-ai"
                  className="hover:text-ink transition-colors"
                >
                  GDPR and AI: additional obligations
                </a>
              </li>
              <li>
                <a
                  href="#enforcement"
                  className="hover:text-ink transition-colors"
                >
                  GDPR enforcement: the numbers
                </a>
              </li>
              <li>
                <a
                  href="#action-plan"
                  className="hover:text-ink transition-colors"
                >
                  Action plan for your engineering team
                </a>
              </li>
            </ol>
          </nav>

          <div className="prose-custom space-y-6 text-base text-ink-secondary leading-relaxed">
            {/* Introduction */}
            <p>
              GDPR has been in effect since May 2018, yet most developers still
              treat it as a legal problem rather than an engineering one. That
              is a mistake. The majority of GDPR obligations &mdash; consent
              management, data minimization, right to erasure, breach
              notification &mdash; are implemented in code. Your legal team
              writes the policies. Your engineering team makes them real.
            </p>
            <p>
              This guide is written for developers who build SaaS applications.
              It skips the legal theory and focuses on what you need to
              understand, what you need to build, and what you can automate.
              Whether you are retrofitting GDPR compliance into an existing
              product or building a new application from scratch, this article
              covers the practical engineering decisions you will face. If your
              application also uses AI, see our{" "}
              <a
                href="/blog/eu-ai-act-deadline"
                className="text-brand hover:underline"
              >
                EU AI Act developer guide
              </a>{" "}
              for the additional obligations that apply.
            </p>

            {/* Core concepts */}
            <h2
              id="core-concepts"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              GDPR core concepts developers need to understand
            </h2>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Controller vs. processor
            </h3>
            <p>
              This distinction determines your obligations. A data controller
              decides why and how personal data is processed. A data processor
              processes data on behalf of a controller. As a SaaS provider, you
              are typically both: a controller for data you collect about your
              users (analytics, billing), and a processor for data your
              customers store in your application (customer content).
            </p>
            <p>
              This dual role has practical implications. For data you control,
              you must determine legal bases, set retention periods, and respond
              to user rights requests directly. For data you process on behalf
              of customers, your customers (the controllers) handle user rights,
              and you provide the technical mechanisms for them to do so &mdash;
              data export APIs, deletion endpoints, and access controls.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Personal data is broader than you think
            </h3>
            <p>
              Under GDPR, personal data means any information relating to an
              identifiable person. This includes obvious identifiers like names
              and email addresses, but also IP addresses, cookie identifiers,
              device fingerprints, location data, and even pseudonymous data if
              it can be re-identified. In practice, almost all data your
              application collects about users qualifies as personal data.
            </p>
            <p>
              Developers often underestimate this scope. Server logs containing
              IP addresses are personal data. Error tracking payloads that
              include user IDs are personal data. Analytics events tied to
              session identifiers are personal data. When in doubt, treat it as
              personal data.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Legal bases for processing
            </h3>
            <p>
              GDPR requires a legal basis for every data processing activity.
              The six legal bases are: consent, contractual necessity, legal
              obligation, vital interests, public task, and legitimate interest.
              For SaaS applications, you will primarily use three:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Contractual necessity:</strong> Processing needed to
                fulfill your service agreement. Storing user content, processing
                payments, sending transactional emails &mdash; all contractual
                necessity.
              </li>
              <li>
                <strong>Legitimate interest:</strong> Processing that serves a
                legitimate business purpose where the impact on the individual
                is minimal. Product analytics, security monitoring, fraud
                prevention &mdash; typically legitimate interest, but you must
                document a Legitimate Interest Assessment (LIA).
              </li>
              <li>
                <strong>Consent:</strong> The individual explicitly agrees to
                processing. Marketing emails, non-essential cookies, and
                optional data sharing require consent. Consent must be freely
                given, specific, informed, and unambiguous.
              </li>
            </ul>

            {/* What you need to build */}
            <h2
              id="engineering-checklist"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              What you need to build: the GDPR engineering checklist
            </h2>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              1. Consent management
            </h3>
            <p>
              If you rely on consent for any processing activity, you need a
              system that records when consent was given, what the user
              consented to, how consent was obtained, and allows withdrawal at
              any time. For cookies, this means a cookie consent banner that
              blocks non-essential cookies until the user opts in. Do not use
              pre-checked boxes. Do not use &quot;by continuing to use this site
              you consent&quot; banners &mdash; these are not valid GDPR
              consent.
            </p>
            <p>
              Technically, implement consent as a database record linked to the
              user: timestamp, consent scope, version of the privacy policy
              shown, and the user&apos;s choice. When consent is withdrawn,
              stop the associated processing immediately and record the
              withdrawal.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              2. Data subject rights endpoints
            </h3>
            <p>
              GDPR grants individuals several rights that your application must
              support. From an engineering perspective, these translate to API
              endpoints or admin tools:
            </p>
            <div className="space-y-4">
              {[
                {
                  right: "Right of access (Article 15)",
                  implementation:
                    "Build a data export endpoint that compiles all personal data you hold about a user into a machine-readable format (JSON or CSV). This includes account data, usage logs, support tickets, and any derived data.",
                },
                {
                  right: "Right to rectification (Article 16)",
                  implementation:
                    "Allow users to update their personal data through your UI. Most SaaS apps already have profile editing, but verify it covers all personal data, not just name and email.",
                },
                {
                  right: "Right to erasure (Article 17)",
                  implementation:
                    "Build a deletion flow that removes personal data from your primary database, removes it from backups within a reasonable timeframe, propagates deletion to sub-processors, and maintains an audit log of the deletion itself (without the deleted data).",
                },
                {
                  right: "Right to data portability (Article 20)",
                  implementation:
                    "Export user data in a structured, commonly used, machine-readable format. JSON is the standard choice. The export should include data the user provided directly (not derived analytics data).",
                },
                {
                  right: "Right to object (Article 21)",
                  implementation:
                    "Allow users to opt out of processing based on legitimate interest. This typically means opt-out controls for analytics, marketing, and profiling.",
                },
              ].map((item) => (
                <div
                  key={item.right}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.right}</h3>
                  <p className="text-sm text-ink-secondary">{item.implementation}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              3. Data minimization
            </h3>
            <p>
              GDPR requires you to collect only the data you actually need.
              This is an engineering principle as much as a legal one. Audit
              every form field, every analytics event, and every API payload.
              Ask: do we need this data to provide the service? If not, do not
              collect it.
            </p>
            <p>
              Common violations include collecting full names when only an
              email is needed for login, tracking granular user behavior when
              aggregate metrics would suffice, storing IP addresses
              indefinitely in server logs, and requesting broad OAuth scopes
              when narrow ones would work. Each unnecessary data point
              increases your compliance burden and your attack surface.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              4. Breach notification system
            </h3>
            <p>
              GDPR requires you to notify your supervisory authority within 72
              hours of becoming aware of a personal data breach. If the breach
              poses a high risk to individuals, you must also notify affected
              users without undue delay. This means you need:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Monitoring and alerting for unauthorized data access
              </li>
              <li>
                An incident response plan with clear ownership and procedures
              </li>
              <li>
                Templates for authority and user notifications
              </li>
              <li>
                Logging sufficient to determine the scope of a breach
              </li>
            </ul>
            <p>
              The 72-hour clock starts when you become &quot;aware&quot; of the
              breach, not when you discover the root cause. Having a documented
              incident response process is essential to meeting this deadline.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              5. Data Processing Agreements (DPAs)
            </h3>
            <p>
              Every sub-processor that handles personal data on your behalf
              needs a Data Processing Agreement. This is a legal contract, but
              developers need to be aware of it because adding a new third-party
              service means a new DPA is needed. Major services like AWS,
              Stripe, Vercel, and Sentry have standardized DPAs you can sign
              online. Smaller services may require negotiation.
            </p>
            <p>
              Maintain a sub-processor register that lists every third-party
              service, what data it processes, where it is hosted, and the DPA
              status. Codepliant automatically detects your third-party services
              by scanning your codebase, giving you a starting point for this
              register. Learn more about generating this documentation on
              our{" "}
              <a
                href="/privacy-policy-generator"
                className="text-brand hover:underline"
              >
                Privacy Policy Generator
              </a>{" "}
              page.
            </p>

            {/* Detecting GDPR services with Codepliant */}
            <h2
              id="detecting-gdpr-services"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Detecting GDPR-relevant services with Codepliant
            </h2>
            <p>
              Before you can comply with GDPR, you need to know what data your
              application actually collects and which third-party services it
              sends data to. Codepliant automates this discovery by scanning
              your{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                package.json
              </code>
              , source imports, and{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                .env
              </code>{" "}
              files.
            </p>
            <p>
              Run a single command to scan your project and see which
              GDPR-relevant services are detected:
            </p>

            <CodeBlock filename="Terminal">
{`$ npx codepliant go

Scanning project...

Detected services:
  Analytics:     Google Analytics, Mixpanel, Segment
  Payments:      Stripe
  Auth:          Auth0
  Error tracking: Sentry
  Email:         SendGrid
  Database:      PostgreSQL (Prisma)
  AI:            OpenAI

Generated documents:
  ./compliance/privacy-policy.md
  ./compliance/cookie-policy.md
  ./compliance/terms-of-service.md
  ./compliance/ai-disclosure.md

Done. 4 documents generated.`}
            </CodeBlock>

            <p>
              Codepliant detects services across three layers: dependency
              names in your package manifest, import statements in your source
              code, and environment variable patterns in{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                .env
              </code>{" "}
              files. Here is what it looks for in each category relevant to
              GDPR:
            </p>

            <CodeBlock filename="GDPR-relevant detection patterns">
{`# Analytics (collect user behavior data)
Dependencies: @google-analytics/data, mixpanel, @segment/analytics-next
Imports:      gtag(), mixpanel.track(), analytics.track()
Env vars:     GA_TRACKING_ID, MIXPANEL_TOKEN, SEGMENT_WRITE_KEY

# Payment processors (handle financial PII)
Dependencies: stripe, @paypal/checkout-server-sdk
Imports:      new Stripe(), paypal.orders.create()
Env vars:     STRIPE_SECRET_KEY, PAYPAL_CLIENT_ID

# Error tracking (may capture user context)
Dependencies: @sentry/node, @sentry/nextjs, bugsnag
Imports:      Sentry.init(), Bugsnag.start()
Env vars:     SENTRY_DSN, BUGSNAG_API_KEY

# Email services (process email addresses)
Dependencies: @sendgrid/mail, nodemailer, postmark
Imports:      sgMail.send(), transporter.sendMail()
Env vars:     SENDGRID_API_KEY, SMTP_HOST, POSTMARK_API_TOKEN

# Auth providers (store identity data)
Dependencies: auth0, next-auth, @clerk/nextjs, firebase-admin
Imports:      auth0.getSession(), getServerSession()
Env vars:     AUTH0_SECRET, NEXTAUTH_SECRET, CLERK_SECRET_KEY`}
            </CodeBlock>

            <p>
              For a JSON-formatted scan result you can pipe into your own
              tooling, use the{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                scan
              </code>{" "}
              subcommand:
            </p>

            <CodeBlock filename="Terminal">
{`$ npx codepliant scan --json

{
  "services": {
    "stripe": {
      "category": "payments",
      "dataCollected": [
        "payment card numbers",
        "billing addresses",
        "email addresses",
        "transaction history"
      ],
      "detectedVia": ["dependency", "import", "env"]
    },
    "google-analytics": {
      "category": "analytics",
      "dataCollected": [
        "IP addresses",
        "page views",
        "device information",
        "user behavior"
      ],
      "detectedVia": ["dependency", "env"]
    },
    "sentry": {
      "category": "error-tracking",
      "dataCollected": [
        "error stack traces",
        "user context",
        "device information",
        "IP addresses"
      ],
      "detectedVia": ["dependency", "import"]
    }
  }
}`}
            </CodeBlock>
            <p>
              This output tells you exactly which services require DPAs, what
              data categories to disclose in your{" "}
              <a
                href="/privacy-policy-generator"
                className="text-brand hover:underline"
              >
                privacy policy
              </a>
              , and which services need entries in your{" "}
              <a
                href="/cookie-policy-generator"
                className="text-brand hover:underline"
              >
                cookie policy
              </a>
              . Instead of manually auditing your codebase every quarter, run
              Codepliant in CI to catch new sub-processors the moment a
              developer adds an{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                npm install
              </code>
              .
            </p>

            {/* Common GDPR mistakes */}
            <h2
              id="common-mistakes"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Common GDPR mistakes developers make
            </h2>
            <p>
              After scanning hundreds of codebases, we see the same patterns
              repeatedly. Here are the GDPR mistakes that catch engineering
              teams off guard:
            </p>

            <div className="space-y-4">
              {[
                {
                  mistake: "1. Adding npm packages without checking data implications",
                  detail:
                    "Every npm install that adds a third-party service is potentially a new sub-processor. Installing @sentry/nextjs, mixpanel, or @sendgrid/mail means personal data may flow to a new company. Developers rarely flag this to their compliance team. Codepliant catches these automatically by scanning your dependency tree.",
                },
                {
                  mistake: "2. Logging personal data in plain text",
                  detail:
                    "console.log(user) during debugging, error handlers that dump request bodies, and verbose ORM logging all risk writing personal data to log files. These logs often have no retention policy, no access controls, and get shipped to third-party log aggregators without a DPA in place.",
                },
                {
                  mistake: "3. Treating anonymization as trivial",
                  detail:
                    "Replacing a user's name with 'Anonymous' is not anonymization. GDPR requires that re-identification is not reasonably possible. If your dataset contains timestamps, IP addresses, or behavioral patterns alongside the 'anonymized' record, the data may still be personal data. True anonymization requires removing or generalizing all quasi-identifiers.",
                },
                {
                  mistake: "4. Forgetting about backups in deletion flows",
                  detail:
                    "When a user exercises their right to erasure, deleting their row from the primary database is not enough. If their data exists in database backups, data warehouse exports, Redis caches, CDN edge caches, or Elasticsearch indices, those copies need to be addressed too. Document a realistic timeline for backup expiry and communicate it.",
                },
                {
                  mistake: "5. Using Google Fonts, CDN scripts, or embedded iframes without consent",
                  detail:
                    "Loading resources from external domains causes the user's browser to send their IP address to those domains. The CJEU ruled in 2022 that serving Google Fonts from Google's CDN without consent violates GDPR. Self-host fonts and scripts, or get consent before loading them.",
                },
                {
                  mistake: "6. No data retention policy in code",
                  detail:
                    "GDPR requires storage limitation: you cannot keep personal data indefinitely. Yet most applications have no automated cleanup. Server logs grow forever, soft-deleted records are never purged, and analytics databases accumulate years of user-level data. Define retention periods per data category and enforce them with scheduled jobs.",
                },
                {
                  mistake: "7. Collecting data 'just in case'",
                  detail:
                    "Requesting full name, phone number, company name, and job title on a signup form when only email is needed for the service violates data minimization. Collecting broad OAuth scopes 'in case we need them later' is the same problem. Only collect what you need for the stated purpose, and document why each field is necessary.",
                },
              ].map((item) => (
                <div
                  key={item.mistake}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.mistake}</h3>
                  <p className="text-sm text-ink-secondary">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Common technical patterns */}
            <h2
              id="implementation-patterns"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Common GDPR implementation patterns for SaaS
            </h2>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Soft delete with scheduled purge
            </h3>
            <p>
              When a user requests deletion, soft-delete their account
              immediately (marking it as deleted and removing it from the
              application) but schedule the hard delete for 30 days later. This
              gives you a recovery window for accidental deletions while still
              honoring the erasure request promptly. After 30 days, a background
              job permanently removes all personal data and propagates deletion
              to sub-processors.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Anonymization for analytics
            </h3>
            <p>
              If you need historical analytics but not individual-level data,
              anonymize records after a defined retention period. Replace user
              identifiers with random tokens, aggregate event data, and remove
              any fields that could enable re-identification. Truly anonymous
              data is outside GDPR scope entirely.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Encryption at rest and in transit
            </h3>
            <p>
              While GDPR does not mandate specific security measures, it
              requires &quot;appropriate technical and organizational
              measures.&quot; Encryption at rest (AES-256 for databases and
              file storage) and in transit (TLS 1.2+ for all connections) are
              considered baseline. Most cloud providers handle this by default,
              but verify your configuration. Also consider field-level
              encryption for sensitive data like government IDs or health
              information.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Audit logging
            </h3>
            <p>
              Maintain immutable audit logs for all access to personal data,
              data modifications, consent changes, and deletion operations. These
              logs serve as evidence of compliance during regulatory inquiries.
              Log the actor, action, timestamp, and affected data categories
              &mdash; but do not log the personal data itself.
            </p>

            {/* International data transfers */}
            <h2
              id="international-transfers"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              International data transfers
            </h2>
            <p>
              If you transfer personal data outside the EU/EEA (which most SaaS
              applications do if they use US-based cloud services), you need a
              legal mechanism for the transfer:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>EU-US Data Privacy Framework:</strong> If your
                sub-processor is certified under the DPF, transfers to that
                processor are covered. Major providers like AWS, Google Cloud,
                and Microsoft are certified.
              </li>
              <li>
                <strong>Standard Contractual Clauses (SCCs):</strong> The
                fallback mechanism for transfers to countries without adequacy
                decisions. Most DPAs from major providers include SCCs.
              </li>
              <li>
                <strong>Adequacy decisions:</strong> Transfers to countries the
                European Commission deems adequate (UK, Canada, Japan, South
                Korea, and others) require no additional safeguards.
              </li>
            </ul>
            <p>
              For each sub-processor, verify which transfer mechanism applies
              and document it. Your{" "}
              <a
                href="/privacy-policy-generator"
                className="text-brand hover:underline"
              >
                privacy policy
              </a>{" "}
              must disclose international transfers and the safeguards in place.
              Codepliant detects your sub-processors automatically, so you
              always have an up-to-date list to audit against. For a broader
              view of data privacy requirements, visit our{" "}
              <a
                href="/data-privacy"
                className="text-brand hover:underline"
              >
                Data Privacy Compliance Hub
              </a>
              .
            </p>

            {/* GDPR and AI */}
            <h2
              id="gdpr-and-ai"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              GDPR and AI: additional obligations for AI-powered SaaS
            </h2>
            <p>
              If your SaaS uses AI, GDPR adds specific obligations on top of
              the standard requirements. For a detailed breakdown of AI-specific
              regulation, see our{" "}
              <a
                href="/blog/eu-ai-act-deadline"
                className="text-brand hover:underline"
              >
                EU AI Act developer guide
              </a>{" "}
              and the{" "}
              <a
                href="/ai-governance"
                className="text-brand hover:underline"
              >
                AI Governance Hub
              </a>
              :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Article 22 &mdash; Automated decision-making:</strong>
                {" "}Users have the right not to be subject to decisions based
                solely on automated processing that significantly affect them.
                If your AI makes decisions about access, pricing, content
                moderation, or eligibility, you must offer human review.
              </li>
              <li>
                <strong>Transparency about AI processing:</strong> Your privacy
                policy must disclose the existence of automated decision-making,
                provide meaningful information about the logic involved, and
                explain the significance and consequences for the user.
                Codepliant can generate an{" "}
                <a
                  href="/ai-disclosure-generator"
                  className="text-brand hover:underline"
                >
                  AI Disclosure document
                </a>{" "}
                for you automatically.
              </li>
              <li>
                <strong>Data sent to AI providers:</strong> If you send user
                data to OpenAI, Anthropic, or other AI APIs, this is a data
                transfer to a sub-processor. You need a DPA with the AI
                provider, and the transfer must be disclosed in your privacy
                policy.
              </li>
              <li>
                <strong>Training data:</strong> If user data could be used to
                train AI models (either by you or your AI provider), this
                requires a separate legal basis &mdash; typically consent. Most
                major AI providers now offer options to opt out of training data
                usage.
              </li>
            </ul>

            {/* Enforcement reality */}
            <h2
              id="enforcement"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              GDPR enforcement: the numbers developers should know
            </h2>
            <p>
              GDPR enforcement is real and increasing. As of 2026, regulators
              have issued over 2,000 fines totaling more than 4.5 billion EUR.
              While headline fines target large companies (Meta: 2.5 billion
              EUR, Amazon: 746 million EUR, TikTok: 345 million EUR), small and
              mid-size companies are fined regularly too. The median fine is
              around 50,000 EUR &mdash; significant for a startup.
            </p>
            <p>
              Common violations that result in fines include:
            </p>
            <div className="space-y-4">
              {[
                {
                  violation: "Insufficient legal basis for processing",
                  detail:
                    "The most common violation. Typically results from relying on legitimate interest when consent is required, or processing data without any documented legal basis.",
                },
                {
                  violation: "Inadequate privacy notices",
                  detail:
                    "Vague, incomplete, or inaccessible privacy policies. Regulators check whether your privacy policy accurately reflects your data practices.",
                },
                {
                  violation: "Non-compliant consent mechanisms",
                  detail:
                    "Pre-checked consent boxes, consent bundled with terms of service, cookie banners that track before consent is given.",
                },
                {
                  violation: "Failure to honor data subject rights",
                  detail:
                    "Not responding to access or deletion requests within the required one-month timeframe, or providing incomplete responses.",
                },
                {
                  violation: "Insufficient security measures",
                  detail:
                    "Data breaches caused by inadequate security, especially where basic measures like encryption or access controls were missing.",
                },
              ].map((item) => (
                <div
                  key={item.violation}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.violation}</h3>
                  <p className="text-sm text-ink-secondary">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Practical steps */}
            <h2
              id="action-plan"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Action plan: GDPR compliance for your engineering team
            </h2>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>Scan your codebase.</strong> Run Codepliant to generate
                an inventory of all data collection, third-party integrations,
                and AI usage in your application. This gives you the factual
                foundation for compliance.
              </li>
              <li>
                <strong>Document your data processing.</strong> For each data
                category, record the legal basis, retention period, and
                sub-processors involved. This is your Record of Processing
                Activities (ROPA), required by Article 30.
              </li>
              <li>
                <strong>Implement user rights.</strong> Build or verify data
                export, deletion, and consent management flows. Test them
                end-to-end, including propagation to sub-processors.
              </li>
              <li>
                <strong>Review your privacy policy.</strong> Ensure it
                accurately reflects your data practices, names your
                sub-processors, specifies retention periods, and covers AI
                processing if applicable. Use the{" "}
                <a
                  href="/privacy-policy-generator"
                  className="text-brand hover:underline"
                >
                  Privacy Policy Generator
                </a>{" "}
                to create one from your codebase.
              </li>
              <li>
                <strong>Set up consent management.</strong> Implement a GDPR-
                compliant cookie consent banner. Ensure non-essential cookies
                are blocked until opt-in. See our{" "}
                <a
                  href="/cookie-policy-generator"
                  className="text-brand hover:underline"
                >
                  Cookie Policy Generator
                </a>{" "}
                for help documenting your cookie usage.
              </li>
              <li>
                <strong>Prepare for breaches.</strong> Document an incident
                response plan. Test it with a tabletop exercise. Ensure you can
                identify, assess, and report a breach within 72 hours.
              </li>
              <li>
                <strong>Integrate into CI/CD.</strong> Add Codepliant to your
                deployment pipeline to regenerate compliance documentation on
                every deploy. This keeps your privacy policy synchronized with
                your code.
              </li>
            </ol>
          </div>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3">
              Check your GDPR compliance now
            </h2>
            <p className="text-ink-secondary text-sm mb-6">
              Run{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                npx codepliant go
              </code>{" "}
              to scan your codebase for GDPR-relevant services and generate
              privacy policies, data inventories, and compliance documentation.
              Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block mb-4">
              npx codepliant go
            </div>
            <p className="text-xs text-ink-secondary mt-4">
              Works with Node.js, Python, Ruby, Go, Java, PHP, and more.{" "}
              <a href="/docs" className="text-brand hover:underline">
                Read the docs
              </a>
              .
            </p>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "GDPR Compliance Hub",
                  href: "/gdpr-compliance",
                  desc: "Everything you need to know about GDPR compliance for your application.",
                },
                {
                  title: "EU AI Act: What Developers Need to Know",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Comprehensive guide to the EU AI Act deadline, risk classifications, and compliance steps.",
                },
                {
                  title: "How to Write a Privacy Policy for Your SaaS App",
                  href: "/blog/privacy-policy-for-saas",
                  desc: "Step-by-step guide to creating a legally compliant SaaS privacy policy.",
                },
                {
                  title: "Colorado AI Act: Developer Guide",
                  href: "/blog/colorado-ai-act",
                  desc: "What the Colorado AI Act means for developers building AI-powered applications.",
                },
                {
                  title: "Privacy Policy Generator",
                  href: "/privacy-policy-generator",
                  desc: "Generate a privacy policy from your codebase in seconds.",
                },
                {
                  title: "Data Privacy Compliance Hub",
                  href: "/data-privacy",
                  desc: "Overview of all compliance frameworks Codepliant supports.",
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
        </div>
      </article>
    </>
  );
}
