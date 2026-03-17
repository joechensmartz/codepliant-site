import type { Metadata } from "next";
import { CodeBlock } from "../components";

export const metadata: Metadata = {
  title:
    "How to Write a Privacy Policy for Your SaaS App in 2026",
  description:
    "How to write a SaaS privacy policy in 2026. Covers GDPR Article 13, CCPA requirements, data collection disclosures, and a practical template you can adapt.",
  alternates: {
    canonical: "https://codepliant.dev/blog/privacy-policy-for-saas",
  },
  keywords: [
    "SaaS privacy policy",
    "privacy policy template",
    "GDPR privacy policy",
    "CCPA privacy policy",
    "privacy policy generator",
    "SaaS compliance",
    "data privacy",
    "GDPR Article 13",
    "privacy policy requirements",
    "codepliant",
    "privacy policy for apps",
    "SaaS legal documents",
  ],
  openGraph: {
    title: "How to Write a Privacy Policy for Your SaaS App in 2026",
    description:
      "How to write a SaaS privacy policy in 2026. Covers GDPR Article 13, CCPA requirements, data collection disclosures, and a practical template you can adapt.",
    url: "https://codepliant.dev/blog/privacy-policy-for-saas",
    type: "article",
    publishedTime: "2026-03-16T00:00:00Z",
    modifiedTime: "2026-03-16T00:00:00Z",
    authors: ["Codepliant"],
    tags: ["Privacy Policy", "SaaS Compliance", "GDPR", "CCPA"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Write a Privacy Policy for Your SaaS App in 2026",
    description:
      "SaaS privacy policy template and step-by-step guide covering GDPR Article 13, CCPA, and modern data privacy requirements.",
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "How to Write a Privacy Policy for Your SaaS App in 2026",
    description:
      "Step-by-step guide to writing a privacy policy for SaaS applications. Covers GDPR Article 13 checklist, CCPA, data collection disclosures, third-party services, and a practical SaaS privacy policy template.",
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
      "@id": "https://codepliant.dev/blog/privacy-policy-for-saas",
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
        name: "What must a GDPR-compliant privacy policy contain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under GDPR Article 13, a privacy policy must disclose: the identity and contact details of the data controller, the purposes and legal basis for processing, categories of personal data collected, recipients or categories of recipients, data retention periods, international transfer safeguards, data subject rights (access, rectification, erasure, portability, restriction, objection), the right to lodge a complaint with a supervisory authority, and whether data is used for automated decision-making or profiling.",
        },
      },
      {
        "@type": "Question",
        name: "How do I generate a privacy policy from my codebase?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run 'npx codepliant go' in your project directory. Codepliant scans your package.json, source code imports, environment variables, and configuration files to detect third-party services like Stripe, Google Analytics, Sentry, and OpenAI. It then generates a privacy policy that accurately reflects your application's data practices, along with terms of service, cookie policy, and AI disclosure documentation.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a privacy policy for my SaaS application?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. GDPR requires a privacy policy if you have any EU users. CCPA requires one for California users. Over 15 US states now have comprehensive privacy laws. Additionally, app stores, payment processors, and enterprise buyers all require a privacy policy before doing business. It is both a legal requirement and a business necessity.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I update my SaaS privacy policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You should review and update your privacy policy whenever you add a new third-party integration, ship an AI feature, expand to new markets, change data retention practices, or add new data collection points. Running Codepliant in your CI/CD pipeline can automatically detect when your data practices change and regenerate compliance documents accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a data controller and data processor for SaaS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For SaaS applications, you are typically a data controller for data you collect about users (analytics, billing, support) and a data processor for data your customers store using your service (customer content, user-generated data). Different GDPR obligations apply to each role, and your privacy policy must distinguish between these two categories of data.",
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
        name: "Privacy Policy for SaaS",
        item: "https://codepliant.dev/blog/privacy-policy-for-saas",
      },
    ],
  };
}

const tocItems = [
  { id: "why-privacy-policy-matters", label: "Why your privacy policy matters" },
  { id: "legal-requirements", label: "Legal requirements" },
  { id: "gdpr-article-13-checklist", label: "GDPR Article 13 checklist" },
  { id: "saas-specific-considerations", label: "SaaS-specific considerations" },
  { id: "step-by-step", label: "Step-by-step guide" },
  { id: "detecting-services-codepliant", label: "Detecting services with Codepliant" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "template-outline", label: "Template outline" },
  { id: "generate-privacy-policy", label: "Generate your privacy policy" },
  { id: "keeping-current", label: "Keeping your policy current" },
];

export default function PrivacyPolicyForSaas() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-ink-secondary mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-ink transition-colors">Home</a>
            {" / "}
            <a href="/blog" className="hover:text-ink transition-colors">Blog</a>
            {" / "}
            <span className="text-ink">Privacy Policy for SaaS</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Blog
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            How to Write a Privacy Policy for Your SaaS App in 2026
          </h1>
          <p className="text-sm text-ink-secondary mb-12">
            Published March 16, 2026 &middot; 18 min read
          </p>

          {/* Table of Contents */}
          <nav className="bg-surface-secondary rounded-xl p-6 mb-12" aria-label="Table of contents">
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-3">
              Table of contents
            </h2>
            <ol className="space-y-2 text-sm">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-ink-secondary hover:text-brand transition-colors"
                  >
                    {i + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-custom space-y-6 text-base text-ink-secondary leading-relaxed">
            {/* Introduction */}
            <p>
              Every SaaS application needs a privacy policy. It is not optional.
              GDPR requires one if you have any EU users. The CCPA requires one
              if you have California users. And practically every app store,
              payment processor, and enterprise buyer will ask for one before
              doing business with you.
            </p>
            <p>
              Yet most SaaS founders treat privacy policies as an afterthought
              &mdash; copying a template from another website, running it through
              ChatGPT, or ignoring it until a customer asks. The result is a
              document that either says nothing useful or makes promises the
              application does not keep. Both outcomes create legal liability.
            </p>
            <p>
              This guide walks you through writing a privacy policy for a SaaS
              application from scratch. It covers what the law actually requires,
              what your users expect, and how to create a document that
              accurately reflects your application&apos;s data practices.
              Whether you are pre-launch or updating an existing policy, you will
              find practical, actionable guidance here. If you are also working
              on{" "}
              <a href="/blog/gdpr-for-developers" className="text-brand hover:underline">
                GDPR compliance more broadly
              </a>, this post pairs well with our developer-focused GDPR guide.
            </p>

            {/* Why it matters */}
            <h2
              id="why-privacy-policy-matters"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Why your SaaS privacy policy matters more than you think
            </h2>
            <p>
              A privacy policy is not just a legal document. It is a trust
              signal. Enterprise buyers review it during procurement. Privacy-
              conscious users read it before signing up. Regulators use it as
              the first evidence in enforcement actions. And increasingly,{" "}
              <a href="/ai-governance" className="text-brand hover:underline">
                AI governance frameworks
              </a>{" "}
              reference privacy policies as baseline compliance documentation.
            </p>
            <p>
              In 2026, the stakes are higher than ever. GDPR enforcement has
              produced over 4.5 billion EUR in fines across more than 2,000
              cases. The CCPA (now CPRA) has an active enforcement division.
              New state privacy laws in Texas, Oregon, Montana, and others took
              effect in 2024 and 2025. The{" "}
              <a href="/blog/eu-ai-act-deadline" className="text-brand hover:underline">
                EU AI Act
              </a>{" "}
              adds transparency requirements for AI-powered applications. Your
              privacy policy needs to address all of these.
            </p>
            <p>
              A well-written SaaS privacy policy also reduces support burden.
              When users can find clear answers about data handling, they file
              fewer tickets. When enterprise buyers can quickly verify your data
              practices, sales cycles shorten. It is a business advantage
              disguised as a legal requirement.
            </p>

            {/* Legal requirements */}
            <h2
              id="legal-requirements"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Legal requirements: what the law says you must include
            </h2>
            <p>
              Different jurisdictions have different requirements, but most
              privacy laws converge on the same core disclosures. Here is what
              you must include to comply with the major frameworks:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              GDPR requirements (EU/EEA users)
            </h3>
            <p>
              The General Data Protection Regulation requires your privacy
              policy to disclose:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Identity and contact details</strong> of the data
                controller (your company) and your Data Protection Officer if
                you have one.
              </li>
              <li>
                <strong>Categories of personal data</strong> you collect, with
                specificity. &quot;We collect personal information&quot; is not
                sufficient. List the actual data: email addresses, IP addresses,
                usage analytics, payment information, and so on.
              </li>
              <li>
                <strong>Legal basis for processing</strong> each category of
                data. Under GDPR, you must identify whether you process data
                based on consent, contractual necessity, legitimate interest,
                or legal obligation.
              </li>
              <li>
                <strong>Data retention periods</strong> for each category, or
                the criteria used to determine retention.
              </li>
              <li>
                <strong>Third parties</strong> with whom you share data,
                including sub-processors, analytics providers, and payment
                processors.
              </li>
              <li>
                <strong>International data transfers</strong> and the safeguards
                in place (Standard Contractual Clauses, adequacy decisions,
                etc.).
              </li>
              <li>
                <strong>User rights</strong> including access, rectification,
                erasure, portability, restriction, and the right to object.
              </li>
              <li>
                <strong>Right to lodge a complaint</strong> with a supervisory
                authority.
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              CCPA/CPRA requirements (California users)
            </h3>
            <p>
              The California Consumer Privacy Act, as amended by the California
              Privacy Rights Act, requires:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Categories of personal information</strong> collected in
                the preceding 12 months.
              </li>
              <li>
                <strong>Sources</strong> of that information (directly from
                users, from third parties, automatically collected).
              </li>
              <li>
                <strong>Business purposes</strong> for collection and use.
              </li>
              <li>
                <strong>Categories of third parties</strong> with whom you share
                information.
              </li>
              <li>
                <strong>Whether you sell or share personal information</strong>,
                and if so, a &quot;Do Not Sell or Share My Personal
                Information&quot; link.
              </li>
              <li>
                <strong>Consumer rights</strong> including the right to know,
                delete, correct, and opt out.
              </li>
              <li>
                <strong>Financial incentives</strong> tied to data collection,
                if any.
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Other US state privacy laws
            </h3>
            <p>
              As of 2026, over 15 US states have comprehensive privacy laws in
              effect. While each has nuances, they generally require the same
              core disclosures as CCPA plus specific rights like appeal
              processes and opt-out preference signals. A well-structured GDPR
              and CCPA compliant privacy policy will cover most state
              requirements, but you should verify against each state where you
              have significant user populations. For state-specific AI
              regulations, see our{" "}
              <a href="/blog/colorado-ai-act" className="text-brand hover:underline">
                Colorado AI Act guide
              </a>.
            </p>

            {/* GDPR Article 13 Checklist */}
            <h2
              id="gdpr-article-13-checklist"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              GDPR Article 13 checklist: what your privacy policy must contain
            </h2>
            <p>
              Article 13 of the GDPR specifies exactly what information must be
              provided when personal data is collected directly from the data
              subject. Use this checklist to audit your existing privacy policy
              or ensure your new one is complete:
            </p>

            <div className="bg-surface-secondary rounded-xl p-6 my-6">
              <h3 className="text-lg font-bold text-ink mb-4">
                Article 13 Required Disclosures
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  {
                    ref: "Art. 13(1)(a)",
                    item: "Identity and contact details of the controller (and representative, if applicable)",
                  },
                  {
                    ref: "Art. 13(1)(b)",
                    item: "Contact details of the Data Protection Officer (if appointed)",
                  },
                  {
                    ref: "Art. 13(1)(c)",
                    item: "Purposes of the processing and the legal basis for each purpose",
                  },
                  {
                    ref: "Art. 13(1)(d)",
                    item: "Legitimate interests pursued (if processing is based on Art. 6(1)(f))",
                  },
                  {
                    ref: "Art. 13(1)(e)",
                    item: "Recipients or categories of recipients of the personal data",
                  },
                  {
                    ref: "Art. 13(1)(f)",
                    item: "Details of international data transfers and applicable safeguards (SCCs, adequacy decisions, BCRs)",
                  },
                  {
                    ref: "Art. 13(2)(a)",
                    item: "Data retention period, or the criteria used to determine the retention period",
                  },
                  {
                    ref: "Art. 13(2)(b)",
                    item: "Right to access, rectification, erasure, restriction, objection, and data portability",
                  },
                  {
                    ref: "Art. 13(2)(c)",
                    item: "Right to withdraw consent at any time (where consent is the legal basis)",
                  },
                  {
                    ref: "Art. 13(2)(d)",
                    item: "Right to lodge a complaint with a supervisory authority",
                  },
                  {
                    ref: "Art. 13(2)(e)",
                    item: "Whether providing personal data is a statutory/contractual requirement and consequences of not providing it",
                  },
                  {
                    ref: "Art. 13(2)(f)",
                    item: "Existence of automated decision-making, including profiling, and meaningful information about the logic involved",
                  },
                ].map((entry) => (
                  <label
                    key={entry.ref}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 shrink-0 accent-accent"
                      readOnly
                    />
                    <span>
                      <strong className="text-ink">{entry.ref}:</strong>{" "}
                      {entry.item}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-ink-secondary mt-4">
                Codepliant automatically detects which of these disclosures apply
                to your application based on the services and data flows it finds
                in your codebase. Run{" "}
                <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs">
                  npx codepliant go
                </code>{" "}
                to generate a privacy policy that addresses each applicable item.
              </p>
            </div>

            {/* SaaS-specific considerations */}
            <h2
              id="saas-specific-considerations"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              SaaS-specific considerations most templates miss
            </h2>
            <p>
              Generic privacy policy templates are written for generic websites.
              SaaS applications have unique data practices that require specific
              disclosures. Here is what most templates miss:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              User-generated content and customer data
            </h3>
            <p>
              SaaS applications store customer data &mdash; the content your
              users create and manage within your application. This is
              fundamentally different from data you collect about users. Your
              privacy policy must distinguish between data you collect for your
              own purposes (analytics, billing, support) and data your customers
              store using your service. For the latter, you are typically a data
              processor under GDPR, not a data controller, and different
              obligations apply.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Third-party integrations and sub-processors
            </h3>
            <p>
              Most SaaS applications integrate with dozens of third-party
              services: payment processors like Stripe, analytics tools like
              Mixpanel or PostHog, error tracking like Sentry, email delivery
              via SendGrid or Resend, cloud hosting on AWS or Vercel, and AI
              APIs from OpenAI or Anthropic. Each of these is a sub-processor
              that handles your users&apos; data.
            </p>
            <p>
              Your privacy policy must disclose these third parties. GDPR
              requires you to name them or at minimum categorize them. Best
              practice is to maintain a sub-processor list that you reference
              from your privacy policy. This list should include the
              sub-processor name, purpose, data processed, and location.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              AI features and automated decision-making
            </h3>
            <p>
              If your SaaS uses AI &mdash; and most do in 2026 &mdash; your
              privacy policy must address it. GDPR Article 22 gives users the
              right not to be subject to decisions based solely on automated
              processing. The{" "}
              <a href="/blog/eu-ai-act-deadline" className="text-brand hover:underline">
                EU AI Act
              </a>{" "}
              adds transparency requirements for AI systems. Your privacy policy
              should disclose what AI features your application includes, what
              data they process, whether they make or influence decisions, and
              how users can opt out or request human review. See our{" "}
              <a href="/ai-disclosure-generator" className="text-brand hover:underline">
                AI Disclosure Generator
              </a>{" "}
              for automated AI transparency documentation.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Multi-tenant data isolation
            </h3>
            <p>
              SaaS applications are multi-tenant by nature. Your privacy policy
              should reassure users that their data is logically isolated from
              other customers. While you do not need to describe your technical
              architecture, stating that customer data is isolated and not
              accessible to other customers builds trust and addresses a common
              concern in enterprise procurement.
            </p>

            {/* Step-by-step guide */}
            <h2
              id="step-by-step"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Step-by-step: writing your SaaS privacy policy
            </h2>
            <p>
              Here is a practical process for creating a privacy policy that is
              both legally compliant and genuinely useful.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 1: Audit your actual data practices
            </h3>
            <p>
              Before writing anything, you need to know what your application
              actually does with data. This is where most privacy policies go
              wrong &mdash; they are written based on assumptions rather than
              facts. Run Codepliant against your codebase to generate an
              accurate inventory of data collection, third-party integrations,
              and AI usage:
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm">
              npx codepliant go
            </div>
            <p>
              Codepliant scans your package.json, source code imports,
              environment variables, and configuration files to detect services
              like Stripe, Google Analytics, Sentry, OpenAI, and dozens more.
              The output tells you exactly what data your application collects
              and which third parties it shares data with.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 2: Map data flows
            </h3>
            <p>
              For each data category, document where data comes from (user
              input, automatic collection, third parties), where it is stored
              (your database, third-party services, CDNs), who can access it
              (your team, sub-processors, AI providers), and how long it is
              retained.
            </p>
            <p>
              This mapping exercise reveals disclosures you might otherwise
              miss. For example, if you use Sentry for error tracking, stack
              traces may contain user data. If you use an AI API, user inputs
              may be sent to the AI provider&apos;s servers. These data flows
              must be disclosed.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 3: Structure the document
            </h3>
            <p>
              A well-structured SaaS privacy policy should include these
              sections:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                <strong>Introduction</strong> &mdash; Who you are, what the
                policy covers, effective date.
              </li>
              <li>
                <strong>Information we collect</strong> &mdash; Broken down by
                category: account data, usage data, payment data, customer
                content, cookies and tracking.
              </li>
              <li>
                <strong>How we use your information</strong> &mdash; Specific
                purposes tied to specific data categories.
              </li>
              <li>
                <strong>Legal basis for processing</strong> &mdash; Required for
                GDPR compliance.
              </li>
              <li>
                <strong>How we share your information</strong> &mdash;
                Sub-processors, legal requirements, business transfers.
              </li>
              <li>
                <strong>International data transfers</strong> &mdash;
                Safeguards for cross-border data flows.
              </li>
              <li>
                <strong>Data retention</strong> &mdash; How long you keep each
                category.
              </li>
              <li>
                <strong>Your rights</strong> &mdash; GDPR rights, CCPA rights,
                how to exercise them.
              </li>
              <li>
                <strong>AI and automated processing</strong> &mdash; AI
                features, data sent to AI providers, opt-out options.
              </li>
              <li>
                <strong>Security</strong> &mdash; Overview of security
                measures.
              </li>
              <li>
                <strong>Children&apos;s privacy</strong> &mdash; Age
                restrictions and COPPA compliance.
              </li>
              <li>
                <strong>Changes to this policy</strong> &mdash; How you notify
                users of updates.
              </li>
              <li>
                <strong>Contact information</strong> &mdash; How to reach you
                with privacy questions.
              </li>
            </ol>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 4: Write in plain language
            </h3>
            <p>
              GDPR explicitly requires that privacy policies be written in
              &quot;clear and plain language.&quot; This means avoiding legal
              jargon, using short sentences, and structuring information so
              users can find what they need quickly. Write at an eighth-grade
              reading level. Use headings and bullet points. Define technical
              terms when you must use them.
            </p>
            <p>
              Bad: &quot;We may process certain categories of personal data
              insofar as such processing is necessary for the legitimate
              interests pursued by the controller or by a third party.&quot;
            </p>
            <p>
              Good: &quot;We use your email address to send you account
              notifications and product updates. You can opt out of product
              updates at any time from your account settings.&quot;
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 5: Keep it accurate and up to date
            </h3>
            <p>
              A privacy policy is only as good as its accuracy. Every time you
              add a new integration, enable a new analytics tool, or ship an AI
              feature, your privacy policy may need updating. This is why
              Codepliant is designed to run in CI/CD pipelines &mdash; it
              regenerates compliance documentation on every deployment, so your
              privacy policy stays in sync with your actual data practices.
            </p>

            {/* Detecting services with Codepliant */}
            <h2
              id="detecting-services-codepliant"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Detecting services and generating a privacy policy with Codepliant
            </h2>
            <p>
              Codepliant scans your project to detect every third-party service
              that touches user data. Here is what the scan looks like for a
              typical SaaS application:
            </p>

            <CodeBlock filename="Terminal">
{`$ npx codepliant go

Scanning project...
  ✓ package.json dependencies
  ✓ Source code imports
  ✓ Environment variables
  ✓ Configuration files

Detected services:
  Payment    Stripe          (stripe, @stripe/stripe-js)
  Analytics  PostHog         (posthog-js)
  Analytics  Google Analytics (NEXT_PUBLIC_GA_ID)
  Auth       NextAuth        (next-auth)
  Error      Sentry          (@sentry/nextjs, SENTRY_DSN)
  Email      Resend          (resend, RESEND_API_KEY)
  AI         OpenAI          (openai, OPENAI_API_KEY)
  Database   Prisma          (@prisma/client)

Generating documents...
  ✓ ./compliance/privacy-policy.md
  ✓ ./compliance/terms-of-service.md
  ✓ ./compliance/cookie-policy.md
  ✓ ./compliance/ai-disclosure.md

Done. 4 documents generated.`}
            </CodeBlock>

            <p>
              The generated privacy policy includes service-specific disclosures
              for every detected integration. For example, if Codepliant detects
              Stripe, the privacy policy will include a section about payment
              data processed by Stripe, the categories of data involved (payment
              card numbers, billing addresses, transaction history), and a
              reference to Stripe&apos;s own privacy policy.
            </p>

            <p>
              You can also use the JSON output to inspect exactly which services
              were detected and what data categories apply:
            </p>

            <CodeBlock filename="Terminal — JSON scan output">
{`$ npx codepliant scan --json | jq '.services[] | {name, category, dataCollected}'

{
  "name": "Stripe",
  "category": "payment",
  "dataCollected": ["payment card numbers", "billing addresses", "transaction history"]
}
{
  "name": "PostHog",
  "category": "analytics",
  "dataCollected": ["page views", "click events", "session recordings", "IP addresses"]
}
{
  "name": "Sentry",
  "category": "error-tracking",
  "dataCollected": ["error stack traces", "browser metadata", "IP addresses"]
}
{
  "name": "OpenAI",
  "category": "ai",
  "dataCollected": ["user prompts", "API request metadata"]
}`}
            </CodeBlock>

            <p>
              This structured output makes it straightforward to build a data
              map for your privacy policy. Each detected service maps directly
              to a disclosure requirement under GDPR Article 13(1)(e)
              (recipients of personal data) and Article 13(1)(c) (purposes of
              processing).
            </p>

            <p>
              For CI/CD integration, add Codepliant to your deployment pipeline
              so compliance documents are regenerated whenever your dependencies
              change:
            </p>

            <CodeBlock filename=".github/workflows/compliance.yml">
{`name: Compliance Docs
on:
  push:
    branches: [main]
    paths:
      - 'package.json'
      - 'requirements.txt'
      - '.env.example'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx codepliant go
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "docs: regenerate compliance documents"`}
            </CodeBlock>

            {/* Common mistakes */}
            <h2
              id="common-mistakes"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Common privacy policy mistakes SaaS companies make
            </h2>
            <div className="space-y-4">
              {[
                {
                  mistake: "Copying a competitor's privacy policy",
                  why: "Their data practices are different from yours. A copied policy will either under-disclose (creating legal risk) or over-disclose (undermining trust by claiming you collect data you do not).",
                },
                {
                  mistake: "Using vague language to cover everything",
                  why: "Phrases like 'we may collect various types of information' violate GDPR's specificity requirements. Regulators have fined companies for vague privacy policies.",
                },
                {
                  mistake: "Forgetting third-party services",
                  why: "If you use Stripe, Google Analytics, Sentry, or any external API, you are sharing user data with those services. This must be disclosed.",
                },
                {
                  mistake: "Not disclosing AI data processing",
                  why: "If user data is sent to OpenAI or Anthropic for processing, this is a data transfer to a third party. GDPR and the EU AI Act require transparency about AI processing.",
                },
                {
                  mistake: "Setting it and forgetting it",
                  why: "Your data practices change every time you ship a feature. A privacy policy written at launch is almost certainly inaccurate six months later.",
                },
                {
                  mistake: "No retention periods",
                  why: "GDPR requires specific retention periods or criteria. 'We retain your data for as long as necessary' is not compliant.",
                },
              ].map((item) => (
                <div
                  key={item.mistake}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <p className="font-semibold mb-1">{item.mistake}</p>
                  <p className="text-sm text-ink-secondary">{item.why}</p>
                </div>
              ))}
            </div>

            {/* SaaS privacy policy template outline */}
            <h2
              id="template-outline"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              SaaS privacy policy template: what to include in each section
            </h2>
            <p>
              While every SaaS application is different, here is a template
              outline with guidance on what to include in each section. This is
              not a copy-paste template &mdash; it is a framework you should
              adapt to your actual data practices.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Information we collect
            </h3>
            <p>
              Break this into clear sub-categories. For a typical SaaS
              application, these include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Account information:</strong> Name, email address,
                company name, job title. Collected during signup and profile
                setup.
              </li>
              <li>
                <strong>Payment information:</strong> Credit card details,
                billing address. Typically processed by Stripe or a similar
                payment processor &mdash; clarify that you do not store raw
                card numbers.
              </li>
              <li>
                <strong>Usage data:</strong> Pages viewed, features used,
                session duration, click patterns. Collected via analytics tools.
              </li>
              <li>
                <strong>Device and technical data:</strong> IP address, browser
                type, operating system, device identifiers. Collected
                automatically.
              </li>
              <li>
                <strong>Customer content:</strong> Data your users create,
                upload, or store within your application. Clarify your role as
                data processor for this content.
              </li>
              <li>
                <strong>Communications:</strong> Support tickets, emails, chat
                messages. Retained for support quality and dispute resolution.
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              How we use your information
            </h3>
            <p>
              Tie each use to a specific purpose and, for GDPR, a legal basis:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Providing the service:</strong> Account information and
                customer content are processed to deliver the service you signed
                up for. Legal basis: contractual necessity.
              </li>
              <li>
                <strong>Billing:</strong> Payment information is processed to
                charge for subscriptions. Legal basis: contractual necessity.
              </li>
              <li>
                <strong>Analytics and improvement:</strong> Usage data helps us
                understand how features are used and prioritize improvements.
                Legal basis: legitimate interest.
              </li>
              <li>
                <strong>Support:</strong> Communications are used to resolve
                your issues. Legal basis: contractual necessity.
              </li>
              <li>
                <strong>Security:</strong> Technical data is used for fraud
                prevention and security monitoring. Legal basis: legitimate
                interest.
              </li>
            </ul>

            {/* Generating with Codepliant */}
            <h2
              id="generate-privacy-policy"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Generate your privacy policy from your codebase
            </h2>
            <p>
              Writing a privacy policy manually is time-consuming and error-
              prone. You have to audit your codebase, identify every integration,
              map data flows, and then translate all of that into clear legal
              language. And you have to repeat this process every time your
              application changes.
            </p>
            <p>
              Codepliant automates this entire process. It scans your source
              code, detects third-party services and data collection patterns,
              and generates a privacy policy that accurately reflects your
              application&apos;s data practices. Because it reads your actual
              code, the output is specific to your application &mdash; not a
              generic template.
            </p>
            <p>
              To generate a privacy policy for your SaaS application:
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm">
              npx codepliant go
            </div>
            <p>
              Codepliant produces a markdown privacy policy alongside terms of
              service,{" "}
              <a href="/cookie-policy-generator" className="text-brand hover:underline">
                cookie policy
              </a>, and{" "}
              <a href="/ai-disclosure-generator" className="text-brand hover:underline">
                AI disclosure
              </a>{" "}
              documentation. Run it in your CI/CD pipeline to keep your
              compliance documents synchronized with your code.
            </p>

            {/* Keeping it updated */}
            <h2
              id="keeping-current"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Keeping your privacy policy current
            </h2>
            <p>
              A privacy policy is a living document. Here are the events that
              should trigger a review and potential update:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Adding a new third-party integration or sub-processor</li>
              <li>Shipping an AI feature or changing AI providers</li>
              <li>Expanding to new markets or jurisdictions</li>
              <li>Changing data retention practices</li>
              <li>Adding new data collection points (forms, tracking, etc.)</li>
              <li>Changes to applicable privacy laws</li>
              <li>Acquisitions, mergers, or other corporate changes</li>
            </ul>
            <p>
              When you update your privacy policy, notify existing users.
              GDPR does not prescribe a specific notification method, but best
              practice is an in-app banner or email notification with a summary
              of changes and a link to the updated policy.
            </p>
          </div>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your SaaS privacy policy
            </h2>
            <p className="text-ink-secondary text-sm mb-4">
              Scan your codebase to generate a privacy policy based on your
              actual data practices. Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block mb-4">
              npx codepliant go
            </div>
            <p className="text-xs text-ink-secondary">
              Run this command in your project directory to generate a privacy
              policy, terms of service, cookie policy, and AI disclosure.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs">
              <a
                href="https://github.com/joechensmartz/codepliant"
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <span className="text-ink-secondary">|</span>
              <a
                href="https://www.npmjs.com/package/codepliant"
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm
              </a>
              <span className="text-ink-secondary">|</span>
              <a
                href="/docs"
                className="text-brand hover:underline"
              >
                Documentation
              </a>
              <span className="text-ink-secondary">|</span>
              <a
                href="/privacy-policy-generator"
                className="text-brand hover:underline"
              >
                Privacy Policy Generator
              </a>
            </div>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "GDPR Compliance for Developers",
                  href: "/blog/gdpr-for-developers",
                  desc: "Practical GDPR guide for engineering teams building SaaS products.",
                },
                {
                  title: "EU AI Act: What Developers Need to Know",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Comprehensive guide to EU AI Act deadlines, risk classifications, and compliance steps.",
                },
                {
                  title: "Colorado AI Act Guide",
                  href: "/blog/colorado-ai-act",
                  desc: "State-level AI regulation and what it means for your SaaS application.",
                },
                {
                  title: "Generate Privacy Policy from Code in 30 Seconds",
                  href: "/blog/generate-privacy-policy-from-code",
                  desc: "Step-by-step tutorial for scanning your codebase and generating an accurate privacy policy.",
                },
                {
                  title: "HIPAA for SaaS Developers",
                  href: "/blog/hipaa-for-developers",
                  desc: "HIPAA compliance guide for SaaS developers handling health data.",
                },
                {
                  title: "SOC 2 for Startups",
                  href: "/blog/soc2-for-startups",
                  desc: "Developer survival guide to SOC 2 compliance with a 30-day readiness timeline.",
                },
                {
                  title: "Privacy Policy Generator",
                  href: "/privacy-policy-generator",
                  desc: "Generate a privacy policy from your codebase in seconds.",
                },
                {
                  title: "GDPR Compliance Hub",
                  href: "/gdpr-compliance",
                  desc: "Everything you need to know about GDPR compliance for your application.",
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
                  <p className="font-semibold mb-1 text-sm">{link.title}</p>
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
