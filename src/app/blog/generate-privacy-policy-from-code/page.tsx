import type { Metadata } from "next";
import { CodeBlock } from "../components";

export const metadata: Metadata = {
  title:
    "How to Generate a Privacy Policy from Your Code in 30 Seconds",
  description:
    "Generate a privacy policy from your codebase in 30 seconds. Install Codepliant, scan your project, and get a policy based on your actual data practices.",
  alternates: {
    canonical: "https://codepliant.dev/blog/generate-privacy-policy-from-code",
  },
  keywords: [
    "generate privacy policy from code",
    "privacy policy generator",
    "automatic privacy policy",
    "code-based privacy policy",
    "privacy policy CLI",
    "codepliant",
    "privacy policy from codebase",
    "privacy policy automation",
    "developer privacy policy",
    "npm privacy policy",
    "GDPR privacy policy generator",
    "privacy policy from package.json",
  ],
  openGraph: {
    title: "How to Generate a Privacy Policy from Your Code in 30 Seconds",
    description:
      "Generate a privacy policy from your codebase in 30 seconds. Install Codepliant, scan your project, and get a policy based on your actual data practices.",
    url: "https://codepliant.dev/blog/generate-privacy-policy-from-code",
    type: "article",
    publishedTime: "2026-03-17T00:00:00Z",
    modifiedTime: "2026-03-17T00:00:00Z",
    authors: ["Codepliant"],
    tags: ["Privacy Policy", "Developer Tools", "Automation", "CLI"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate a Privacy Policy from Your Code in 30 Seconds",
    description:
      "One command scans your codebase and generates a privacy policy that reflects your actual data practices. No templates, no guesswork.",
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "How to Generate a Privacy Policy from Your Code in 30 Seconds",
    description:
      "Step-by-step tutorial for generating a privacy policy directly from your codebase using Codepliant CLI. Covers installation, scanning, detection, and customization.",
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
      "@id": "https://codepliant.dev/blog/generate-privacy-policy-from-code",
    },
  };
}

function howToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate a Privacy Policy from Your Code",
    description:
      "Generate a legally compliant privacy policy by scanning your codebase for services, data flows, and third-party integrations.",
    totalTime: "PT30S",
    step: [
      {
        "@type": "HowToStep",
        name: "Install Codepliant",
        text: "Run npx codepliant go in your project directory. No installation needed — npx runs it directly.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Scan your codebase",
        text: "Codepliant scans package.json, source code imports, environment variables, and config files to detect third-party services and data practices.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Review the generated policy",
        text: "Open the generated privacy-policy.md file. Review the detected services, data categories, and disclosures for accuracy.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Customize and publish",
        text: "Add your company name, contact details, and any additional disclosures. Convert to HTML and publish on your website.",
        position: 4,
      },
    ],
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does Codepliant generate a privacy policy from code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Codepliant scans your package.json dependencies, source code imports, environment variables, and configuration files. It uses deterministic pattern matching (no AI) to detect services like Stripe, Google Analytics, Sentry, OpenAI, and hundreds of others. It then maps each detected service to the data it typically collects and generates a privacy policy that accurately reflects your application's actual data practices.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to generate a privacy policy with Codepliant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under 30 seconds for most projects. Codepliant runs entirely locally with zero network calls, so scanning is nearly instant. A typical Node.js project with 10-20 dependencies completes in 2-5 seconds. The total time from running the command to having a complete privacy policy is under 30 seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Is a code-generated privacy policy legally valid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Codepliant generates a strong starting point that reflects your actual data practices, which is better than generic templates that may not match your application. However, every generated document includes a disclaimer recommending legal review. You should have a qualified attorney review the final document before publishing, especially if you handle sensitive data or operate in regulated industries.",
        },
      },
      {
        "@type": "Question",
        name: "What languages and frameworks does Codepliant support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Codepliant supports 13 ecosystems: Node.js/npm, Python/pip, Ruby/gems, PHP/Composer, Java/Maven and Gradle, Go modules, Rust/Cargo, .NET/NuGet, Elixir/Mix, Kotlin, Terraform/IaC, and Flutter/Dart. It scans dependency manifests, source code imports, and environment variables across all supported ecosystems.",
        },
      },
      {
        "@type": "Question",
        name: "How is generating a privacy policy from code better than using a template?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Templates require you to manually identify every service, data type, and integration in your application. This is error-prone — developers routinely forget analytics tools, error tracking services, or third-party APIs they added months ago. Codepliant scans your actual code to detect these automatically, ensuring nothing is missed. It also updates when your dependencies change, keeping your policy accurate over time.",
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
        name: "Generate Privacy Policy from Code",
        item: "https://codepliant.dev/blog/generate-privacy-policy-from-code",
      },
    ],
  };
}

const tocItems = [
  { id: "the-problem", label: "The problem with manual privacy policies" },
  { id: "what-codepliant-detects", label: "What Codepliant detects" },
  { id: "step-1-install", label: "Step 1: Run the command" },
  { id: "step-2-scan", label: "Step 2: Watch the scan" },
  { id: "step-3-review", label: "Step 3: Review the output" },
  { id: "step-4-customize", label: "Step 4: Customize and publish" },
  { id: "manual-vs-automated", label: "Manual vs automated: the comparison" },
  { id: "ci-cd-integration", label: "Keeping your policy up to date" },
  { id: "faq", label: "FAQ" },
];

export default function GeneratePrivacyPolicyFromCode() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd()) }}
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
            <span className="text-ink">Generate Privacy Policy from Code</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Tutorial
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            How to Generate a Privacy Policy from Your Code in 30 Seconds
          </h1>
          <p className="text-sm text-ink-secondary mb-12">
            Published March 17, 2026 &middot; 10 min read
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
              Writing a privacy policy by hand takes 30 minutes on a good day.
              You need to audit every dependency, trace every data flow, list
              every third-party integration, and translate it all into legal
              language. Most developers skip steps, miss services, or copy a
              template that does not match their application.
            </p>
            <p>
              There is a faster way. Codepliant scans your actual codebase
              &mdash; dependencies, imports, environment variables, and config
              files &mdash; and generates a privacy policy that reflects what
              your application really does. One command, 30 seconds, done.
            </p>
            <p>
              This tutorial walks through the entire process. You will see
              exactly what happens when you run the command, what gets
              detected, and how to customize the output.
            </p>

            {/* The Problem */}
            <h2
              id="the-problem"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              The problem with manual privacy policies
            </h2>
            <p>
              Most privacy policies are wrong. Not because developers are
              careless, but because manually auditing a codebase for data
              practices is tedious and error-prone. Consider what a thorough
              audit requires:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-ink">Review every dependency</strong> in
                package.json, requirements.txt, Gemfile, or your ecosystem&apos;s
                equivalent to identify services that collect or process data
              </li>
              <li>
                <strong className="text-ink">Search source code</strong> for
                imports and API calls to analytics providers, payment processors,
                error trackers, email services, and AI APIs
              </li>
              <li>
                <strong className="text-ink">Check environment variables</strong>{" "}
                for API keys that reveal integrations not visible in dependencies
              </li>
              <li>
                <strong className="text-ink">Map each service</strong> to the
                specific data it collects: IP addresses, device info, payment
                details, usage patterns, or personal identifiers
              </li>
              <li>
                <strong className="text-ink">Write the disclosures</strong> in a
                format that satisfies GDPR, CCPA, and other applicable
                regulations
              </li>
            </ul>
            <p>
              A typical SaaS application has 15 to 50 dependencies that touch
              user data. Developers add new integrations every sprint. The
              privacy policy falls out of date the moment it is published.
            </p>
            <p>
              Template generators are not much better. They ask you to fill in
              checkboxes: &quot;Do you use analytics? Do you process
              payments?&quot; But they cannot tell you what your code actually
              does. They rely on your memory, which is unreliable for a
              codebase that changes weekly.
            </p>

            {/* What Codepliant detects */}
            <h2
              id="what-codepliant-detects"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              What Codepliant detects in your codebase
            </h2>
            <p>
              Codepliant uses deterministic pattern matching &mdash; no AI, no
              network calls, no data leaving your machine. It scans three
              layers of your project:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              1. Dependency manifests
            </h3>
            <p>
              Package files like <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">package.json</code>,{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">requirements.txt</code>,{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">Gemfile</code>,{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">go.mod</code>,{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">Cargo.toml</code>, and{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">pom.xml</code>{" "}
              are parsed to identify services like Stripe, Sentry, Google
              Analytics, SendGrid, and hundreds more.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              2. Source code imports
            </h3>
            <p>
              Import and require statements are scanned across your source
              files. This catches services used through SDKs that might not
              appear in the top-level dependency manifest &mdash; for example,
              using the OpenAI API through a wrapper library.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              3. Environment variables
            </h3>
            <p>
              Your <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">.env</code>,{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">.env.example</code>, and{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">.env.local</code> files
              are checked for patterns like{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">STRIPE_SECRET_KEY</code>,{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">SENTRY_DSN</code>, or{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">OPENAI_API_KEY</code>.
              This catches integrations configured through environment
              variables even when the SDK is not a direct dependency.
            </p>

            <p>
              Each detected service is mapped to its data collection
              categories: personal identifiers, payment information, device
              data, usage analytics, location data, and more. This mapping
              drives the generated privacy policy, ensuring every disclosure
              is grounded in what your code actually does.
            </p>

            {/* Step 1 */}
            <h2
              id="step-1-install"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Step 1: Run the command
            </h2>
            <p>
              Open your terminal, navigate to your project directory, and run:
            </p>
            <CodeBlock filename="Terminal">
{`npx codepliant go`}
            </CodeBlock>
            <p>
              That is it. No installation, no configuration, no account
              creation. The <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">npx</code>{" "}
              command downloads and runs Codepliant directly. If you prefer to
              install it globally:
            </p>
            <CodeBlock filename="Terminal">
{`npm install -g codepliant
codepliant go`}
            </CodeBlock>
            <p>
              Everything runs locally. No data is sent anywhere. No network
              calls are made. Your source code never leaves your machine.
            </p>

            {/* Step 2 */}
            <h2
              id="step-2-scan"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Step 2: Watch the scan
            </h2>
            <p>
              When you run <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">npx codepliant go</code>,
              you will see output like this:
            </p>
            <CodeBlock filename="Terminal output">
{`$ npx codepliant go

  Codepliant v1.1.0

  Scanning project...

  Detected ecosystem: Node.js (package.json)
  Scanning dependencies... 34 packages analyzed
  Scanning source imports... 128 files checked
  Scanning environment variables... 3 env files found

  Services detected:
    - Stripe (payments)         → payment details, billing info
    - Google Analytics (analytics) → IP address, device info, usage data
    - Sentry (error tracking)   → error logs, device info, IP address
    - OpenAI (AI/ML)            → user prompts, generated content
    - SendGrid (email)          → email addresses, names
    - AWS S3 (cloud storage)    → uploaded files, metadata
    - Mixpanel (analytics)      → user behavior, device info

  Generating documents...
    ✓ privacy-policy.md
    ✓ terms-of-service.md
    ✓ cookie-policy.md
    ✓ ai-disclosure.md

  Done in 2.4s — 4 documents generated in ./compliance/`}
            </CodeBlock>
            <p>
              The scan typically completes in 2 to 5 seconds. Larger monorepos
              may take slightly longer, but it is always under 30 seconds.
              Each detected service is shown with the data categories it
              collects, so you can immediately verify accuracy.
            </p>

            {/* Step 3 */}
            <h2
              id="step-3-review"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Step 3: Review the generated privacy policy
            </h2>
            <p>
              Open <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">compliance/privacy-policy.md</code>.
              Here is what a generated privacy policy looks like for the
              example project above:
            </p>
            <CodeBlock filename="compliance/privacy-policy.md (excerpt)">
{`# Privacy Policy

Last updated: March 17, 2026

## Information We Collect

### Information You Provide
- **Account information**: name, email address
- **Payment information**: processed by Stripe (we do not store
  card numbers directly)
- **Communications**: emails sent through SendGrid
- **User content**: prompts and inputs submitted to AI features

### Information Collected Automatically
- **Usage data**: pages visited, features used, session duration
  (via Google Analytics, Mixpanel)
- **Device information**: browser type, operating system, screen
  resolution (via Google Analytics)
- **Error data**: application errors, stack traces, browser info
  (via Sentry)
- **IP address**: collected by Google Analytics, Sentry

## Third-Party Services

| Service          | Purpose          | Data Shared              |
|------------------|------------------|--------------------------|
| Stripe           | Payments         | Payment details          |
| Google Analytics | Analytics        | Usage data, IP address   |
| Sentry           | Error tracking   | Error logs, device info  |
| OpenAI           | AI features      | User prompts             |
| SendGrid         | Email delivery   | Email addresses          |
| AWS S3           | File storage     | Uploaded files           |
| Mixpanel         | Analytics        | User behavior data       |

## AI-Powered Features

This application uses OpenAI to provide AI-powered features.
User inputs may be sent to OpenAI's API for processing. Please
review OpenAI's privacy policy for details on how they handle
data.

...`}
            </CodeBlock>
            <p>
              Notice how every section is driven by actual detections from your
              code. Stripe was in your dependencies, so payment disclosures
              appear. OpenAI was detected, so the AI features section is
              included. If your application did not use AI, that section would
              not exist. Nothing is assumed. Nothing is generic.
            </p>
            <p>
              The generated document also includes sections for data retention,
              user rights (GDPR and CCPA), cookie disclosures, and contact
              information placeholders. Codepliant generates 123+ document
              types across privacy policies, terms of service, cookie policies,
              AI disclosures, EULAs, and more.
            </p>

            {/* Step 4 */}
            <h2
              id="step-4-customize"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Step 4: Customize and publish
            </h2>
            <p>
              The generated privacy policy needs a few additions before you
              publish it:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-ink">Company details</strong>: add your
                legal entity name, address, and contact email where indicated
                by placeholders
              </li>
              <li>
                <strong className="text-ink">Data retention periods</strong>:
                specify how long you keep each category of data (Codepliant
                flags this but cannot determine your retention policy from code
                alone)
              </li>
              <li>
                <strong className="text-ink">Legal basis</strong>: confirm the
                legal basis for each processing activity (consent, legitimate
                interest, contractual necessity)
              </li>
              <li>
                <strong className="text-ink">DPO contact</strong>: if you have
                a Data Protection Officer, add their contact details
              </li>
              <li>
                <strong className="text-ink">Legal review</strong>: have a
                qualified attorney review the document before publishing,
                especially if you handle health data, financial data, or
                children&apos;s data
              </li>
            </ul>
            <p>
              To generate a specific document type or output format, use the
              scan command with options:
            </p>
            <CodeBlock filename="Terminal">
{`# Generate only the privacy policy
npx codepliant scan --type privacy-policy

# Get JSON output for programmatic use
npx codepliant scan --json

# Use the interactive wizard for guided customization
npx codepliant wizard`}
            </CodeBlock>

            {/* Manual vs Automated */}
            <h2
              id="manual-vs-automated"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Manual vs automated: the real comparison
            </h2>
            <p>
              Here is what the two approaches look like side by side:
            </p>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-3 pr-4 text-ink font-semibold">Task</th>
                    <th className="text-left py-3 pr-4 text-ink font-semibold">Manual approach</th>
                    <th className="text-left py-3 text-ink font-semibold">Codepliant</th>
                  </tr>
                </thead>
                <tbody className="text-ink-secondary">
                  <tr className="border-b border-border-subtle">
                    <td className="py-3 pr-4 font-medium text-ink">Audit dependencies</td>
                    <td className="py-3 pr-4">10-15 min: read through package.json, cross-reference each package</td>
                    <td className="py-3">Automatic: parsed and matched in under 1 second</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="py-3 pr-4 font-medium text-ink">Find source code integrations</td>
                    <td className="py-3 pr-4">5-10 min: grep for API calls, search for SDKs</td>
                    <td className="py-3">Automatic: all imports scanned in seconds</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="py-3 pr-4 font-medium text-ink">Check env variables</td>
                    <td className="py-3 pr-4">2-3 min: review .env files for API keys</td>
                    <td className="py-3">Automatic: pattern-matched against known services</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="py-3 pr-4 font-medium text-ink">Map data categories</td>
                    <td className="py-3 pr-4">5-10 min: research what each service collects</td>
                    <td className="py-3">Automatic: pre-mapped for all recognized services</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="py-3 pr-4 font-medium text-ink">Write the document</td>
                    <td className="py-3 pr-4">10-15 min: draft disclosures, format sections</td>
                    <td className="py-3">Automatic: generated in Markdown, ready to convert</td>
                  </tr>
                  <tr className="border-b border-border-subtle">
                    <td className="py-3 pr-4 font-medium text-ink">Accuracy</td>
                    <td className="py-3 pr-4">Depends on memory; easy to miss services added months ago</td>
                    <td className="py-3">Deterministic: detects everything in the codebase</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-ink">Total time</td>
                    <td className="py-3 pr-4 font-bold text-ink">30-50 minutes</td>
                    <td className="py-3 font-bold text-brand">Under 30 seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The manual approach is not just slower. It is less accurate.
              Developers forget services they added three sprints ago. They
              overlook transitive dependencies. They miss environment
              variables in staging configs. Code-based scanning catches
              everything because it reads the source of truth: your code
              itself.
            </p>

            {/* CI/CD integration */}
            <h2
              id="ci-cd-integration"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Keeping your privacy policy up to date
            </h2>
            <p>
              A privacy policy that was accurate at launch becomes inaccurate
              the moment you add a new integration. The solution is to run
              Codepliant as part of your development workflow:
            </p>
            <CodeBlock filename=".github/workflows/compliance.yml">
{`name: Compliance Check
on:
  pull_request:
    paths:
      - 'package.json'
      - 'requirements.txt'
      - '.env.example'
      - 'src/**'

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx codepliant scan --json > compliance-report.json
      - run: npx codepliant diff
        # Shows what changed since last generation`}
            </CodeBlock>
            <p>
              The <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-sm">codepliant diff</code>{" "}
              command compares your current scan results against the last
              generated documents and shows exactly what changed. New service
              added? It flags the missing disclosure. Dependency removed? It
              marks the now-unnecessary section.
            </p>
            <p>
              This turns compliance from a one-time chore into a continuous
              process. Your privacy policy stays in sync with your code,
              automatically. No more quarterly audits. No more &quot;I think we
              added Mixpanel last month but I am not sure if the privacy policy
              covers it.&quot;
            </p>

            {/* FAQ */}
            <h2
              id="faq"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Frequently asked questions
            </h2>

            <h3 className="text-lg font-bold tracking-tight text-ink pt-2">
              Does Codepliant send my code anywhere?
            </h3>
            <p>
              No. Codepliant makes zero network calls. Everything runs locally
              on your machine. Your source code, dependencies, and environment
              variables are never transmitted. This is a core design principle,
              not a feature that can be toggled off.
            </p>

            <h3 className="text-lg font-bold tracking-tight text-ink pt-2">
              What if a service is not recognized?
            </h3>
            <p>
              Codepliant recognizes hundreds of services across 13 ecosystems.
              If a service is not in the database, the generated privacy policy
              will not include it &mdash; which is why you should still review
              the output. You can also{" "}
              <a
                href="https://github.com/codepliant/codepliant"
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                open an issue or contribute
              </a>{" "}
              to add new service signatures.
            </p>

            <h3 className="text-lg font-bold tracking-tight text-ink pt-2">
              Can I use Codepliant with a monorepo?
            </h3>
            <p>
              Yes. Run it from the root of your monorepo and it will scan all
              workspace packages. For Turborepo and Nx workspaces, it detects
              the workspace structure and scans each package&apos;s dependencies.
            </p>

            <h3 className="text-lg font-bold tracking-tight text-ink pt-2">
              Do I still need a lawyer?
            </h3>
            <p>
              Yes. Codepliant generates an accurate starting point based on
              your code, but privacy law has nuances that automated tools
              cannot fully address: jurisdiction-specific requirements,
              industry regulations, data transfer agreements, and edge cases
              in your business model. A legal review of the generated document
              is strongly recommended, especially before launch. If you need
              help understanding{" "}
              <a href="/blog/gdpr-for-developers" className="text-brand hover:underline">
                GDPR requirements
              </a>{" "}
              or writing a broader{" "}
              <a href="/blog/privacy-policy-for-saas" className="text-brand hover:underline">
                SaaS privacy policy
              </a>, we have guides for those too.
            </p>

            {/* Related reading */}
            <div className="border-t border-border-subtle pt-8 mt-8">
              <h3 className="text-lg font-bold tracking-tight text-ink mb-4">Related reading</h3>
              <ul className="space-y-2 text-sm text-ink-secondary">
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
                    href="/blog/privacy-policy-for-saas"
                    className="text-brand hover:underline"
                  >
                    How to Write a Privacy Policy for Your SaaS App
                  </a>
                </li>
                <li>
                  <a
                    href="/blog/soc2-for-startups"
                    className="text-brand hover:underline"
                  >
                    SOC 2 for Startups: A Developer&apos;s Survival Guide
                  </a>
                </li>
                <li>
                  <a
                    href="/blog/hipaa-for-developers"
                    className="text-brand hover:underline"
                  >
                    HIPAA for SaaS Developers: What You Actually Need to Know
                  </a>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <section className="bg-surface-secondary rounded-2xl p-8 text-center mt-8">
              <h2 className="text-xl font-bold mb-3 text-ink">
                Generate your privacy policy now
              </h2>
              <p className="text-ink-secondary text-sm mb-6">
                One command scans your codebase and generates a privacy policy
                that reflects your actual data practices. No account needed.
              </p>
              <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
                npx codepliant go
              </div>
              <p className="text-xs text-ink-tertiary mt-4">
                Works with Node.js, Python, Ruby, Go, Rust, Java, PHP, .NET,
                Elixir, Kotlin, and Terraform.{" "}
                <a href="/docs" className="text-brand hover:underline">
                  Read the docs
                </a>{" "}
                or{" "}
                <a href="/privacy-policy-generator" className="text-brand hover:underline">
                  learn more about the privacy policy generator
                </a>.
              </p>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
