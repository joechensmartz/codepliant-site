import type { Metadata } from "next";
import { CodeBlock } from "../components";

export const metadata: Metadata = {
  title: "Colorado AI Act: SaaS Compliance Guide",
  description:
    "Colorado AI Act (SB 24-205) compliance guide for SaaS. Covers deadlines, high-risk AI requirements, impact assessments, and NIST AI RMF affirmative defense.",
  alternates: {
    canonical: "https://codepliant.dev/blog/colorado-ai-act",
  },
  keywords: [
    "Colorado AI Act",
    "SB 24-205",
    "algorithmic discrimination",
    "high-risk AI system",
    "AI impact assessment",
    "NIST AI RMF",
    "AI compliance",
    "Colorado AI regulation",
    "AI governance",
    "codepliant",
    "AI bias testing",
    "consumer transparency AI",
  ],
  openGraph: {
    title: "Colorado AI Act (SB 24-205): Compliance Guide for SaaS Companies",
    description:
      "Colorado AI Act (SB 24-205) compliance guide for SaaS. Covers deadlines, high-risk AI requirements, impact assessments, and NIST AI RMF affirmative defense.",
    url: "https://codepliant.dev/blog/colorado-ai-act",
    type: "article",
    publishedTime: "2026-03-16T00:00:00Z",
    modifiedTime: "2026-03-16T00:00:00Z",
    authors: ["Codepliant"],
    tags: ["Colorado AI Act", "AI Compliance", "Developer Guide", "SB 24-205"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorado AI Act (SB 24-205): Compliance Guide for SaaS Companies",
    description:
      "SB 24-205 compliance guide for SaaS companies. Deadlines, requirements, impact assessments, NIST AI RMF defense, and practical steps with code examples.",
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Colorado AI Act (SB 24-205): Compliance Guide for SaaS Companies",
    description:
      "Developer guide to the Colorado AI Act (SB 24-205). High-risk AI system requirements, algorithmic discrimination prevention, impact assessments, NIST AI RMF affirmative defense, and compliance steps with code examples.",
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
      "@id": "https://codepliant.dev/blog/colorado-ai-act",
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
        name: "When does the Colorado AI Act take effect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Colorado AI Act (SB 24-205) takes effect on February 1, 2026. Deployers must complete their first impact assessments for all high-risk AI systems by June 30, 2026. Impact assessments must be updated at least annually thereafter.",
        },
      },
      {
        "@type": "Question",
        name: "Does the Colorado AI Act apply to companies outside Colorado?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The Colorado AI Act applies to any company whose AI system makes consequential decisions about Colorado residents, regardless of where the company is headquartered. If your SaaS product is used by businesses in Colorado to make decisions about their customers or employees, the Act applies to you.",
        },
      },
      {
        "@type": "Question",
        name: "What is a high-risk AI system under the Colorado AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A high-risk AI system is one that makes or is a substantial factor in making consequential decisions about individuals. Consequential decisions include those affecting employment, education, financial services, housing, healthcare, legal services, and government services.",
        },
      },
      {
        "@type": "Question",
        name: "What is the NIST AI RMF affirmative defense in the Colorado AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Colorado AI Act provides an affirmative defense for companies that comply with the NIST AI Risk Management Framework (AI RMF) or a substantially equivalent framework. If you implement and can demonstrate adherence to the NIST AI RMF, you have a strong defense against enforcement actions even if an algorithmic discrimination issue arises.",
        },
      },
      {
        "@type": "Question",
        name: "How can I detect AI services in my codebase for Colorado AI Act compliance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run `npx codepliant go` in your project directory. Codepliant scans your dependencies, imports, and environment variables to detect AI service integrations (OpenAI, Anthropic, Google AI, LangChain, Vercel AI SDK, and more) and generates compliance documentation including AI governance docs aligned with the NIST AI RMF.",
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
        name: "Colorado AI Act",
        item: "https://codepliant.dev/blog/colorado-ai-act",
      },
    ],
  };
}

export default function ColoradoAiAct() {
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

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-ink-tertiary mb-6">
            <a href="/" className="hover:text-ink transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-ink transition-colors">
              Blog
            </a>
            <span className="mx-2">/</span>
            <span className="text-ink-secondary">Colorado AI Act</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            AI Regulation
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Colorado AI Act (SB 24-205): What SaaS Companies Need to Know
          </h1>
          <p className="text-sm text-ink-tertiary mb-12">
            Published March 16, 2026 &middot; 18 min read
          </p>

          <div className="space-y-6 text-[length:var(--text-base)] text-ink-secondary leading-relaxed">
            {/* Urgency callout */}
            <div className="bg-urgency-muted border border-urgency/20 rounded-lg p-5">
              <p className="text-urgency font-semibold text-sm mb-1">
                Compliance deadline approaching
              </p>
              <p className="text-sm text-ink-secondary">
                The Colorado AI Act is now in effect as of{" "}
                <strong className="text-ink">February 1, 2026</strong>.
                Deployers must complete impact assessments by{" "}
                <strong className="text-ink">June 30, 2026</strong>. Run{" "}
                <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                  npx codepliant go
                </code>{" "}
                to scan your codebase for AI services and generate NIST AI RMF
                aligned governance documentation.
              </p>
            </div>

            {/* Introduction */}
            <p>
              Colorado Senate Bill 24-205, known as the Colorado AI Act, is the
              first comprehensive state-level AI regulation in the United
              States. Signed into law in May 2024, it takes effect on February
              1, 2026, with a compliance deadline of June 30, 2026 for
              companies to complete their initial impact assessments. If your
              SaaS application uses AI to make or substantially influence
              decisions that affect Colorado residents, this law applies to you.
            </p>
            <p>
              While the{" "}
              <a
                href="/blog/eu-ai-act-deadline"
                className="text-brand hover:underline"
              >
                EU AI Act
              </a>{" "}
              gets most of the attention, the Colorado AI Act is more
              immediately relevant for US-based SaaS companies. It creates
              concrete obligations around algorithmic discrimination prevention,
              impact assessments, transparency disclosures, and governance
              practices. And unlike federal AI guidance, it has enforcement
              teeth: the Colorado Attorney General can bring actions against
              non-compliant companies.
            </p>
            <p>
              This guide covers what the Colorado AI Act requires, who it
              applies to, what the deadlines are, how to detect AI services in
              your codebase, and what your engineering and product teams need to
              do to comply.
            </p>

            {/* Table of contents */}
            <div className="bg-surface-secondary rounded-lg p-5">
              <h2 className="text-sm font-semibold text-ink mb-3">
                In this guide
              </h2>
              <ol className="list-decimal list-inside space-y-1.5 text-sm">
                <li>
                  <a
                    href="#what-is-colorado-ai-act"
                    className="text-brand hover:underline"
                  >
                    What is the Colorado AI Act?
                  </a>
                </li>
                <li>
                  <a
                    href="#who-it-applies-to"
                    className="text-brand hover:underline"
                  >
                    Who does it apply to?
                  </a>
                </li>
                <li>
                  <a
                    href="#key-deadlines"
                    className="text-brand hover:underline"
                  >
                    Key deadlines for compliance
                  </a>
                </li>
                <li>
                  <a
                    href="#developer-obligations"
                    className="text-brand hover:underline"
                  >
                    Obligations for AI developers
                  </a>
                </li>
                <li>
                  <a
                    href="#deployer-obligations"
                    className="text-brand hover:underline"
                  >
                    Obligations for AI deployers
                  </a>
                </li>
                <li>
                  <a
                    href="#detecting-ai-services"
                    className="text-brand hover:underline"
                  >
                    Detecting AI services in your codebase
                  </a>
                </li>
                <li>
                  <a
                    href="#affirmative-defense"
                    className="text-brand hover:underline"
                  >
                    The NIST AI RMF affirmative defense
                  </a>
                </li>
                <li>
                  <a
                    href="#colorado-vs-eu"
                    className="text-brand hover:underline"
                  >
                    Colorado AI Act vs. EU AI Act
                  </a>
                </li>
                <li>
                  <a
                    href="#compliance-action-plan"
                    className="text-brand hover:underline"
                  >
                    Compliance action plan
                  </a>
                </li>
                <li>
                  <a
                    href="#state-landscape"
                    className="text-brand hover:underline"
                  >
                    US state AI regulation landscape
                  </a>
                </li>
              </ol>
            </div>

            {/* What is the Colorado AI Act */}
            <h2
              id="what-is-colorado-ai-act"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              What is the Colorado AI Act (SB 24-205)?
            </h2>
            <p>
              The Colorado AI Act regulates &quot;high-risk artificial
              intelligence systems&quot; &mdash; AI systems that make or are a
              substantial factor in making consequential decisions about
              Colorado residents. It applies to both developers (companies that
              build AI systems) and deployers (companies that use AI systems in
              their products or operations).
            </p>
            <p>
              The Act focuses specifically on preventing algorithmic
              discrimination &mdash; the use of AI in ways that result in
              unlawful differential treatment based on protected
              characteristics including age, race, sex, disability, religion,
              sexual orientation, gender identity, and veteran status.
            </p>
            <p>
              Unlike broader AI regulations, the Colorado AI Act is narrow in
              scope but deep in requirements. It does not attempt to regulate
              all AI &mdash; only high-risk systems that affect consequential
              decisions. But for those systems, the obligations are substantial.
            </p>

            {/* Who it applies to */}
            <h2
              id="who-it-applies-to"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Who does the Colorado AI Act apply to?
            </h2>
            <p>
              The Act applies to two categories of entities:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Developers
            </h3>
            <p>
              A developer is any entity that creates, codes, or substantially
              modifies an AI system. If you build AI features into your SaaS
              product, you are likely a developer under the Act. This includes
              companies that fine-tune foundation models, build custom ML
              models, or create AI-powered features that influence decisions.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Deployers
            </h3>
            <p>
              A deployer is any entity that uses a high-risk AI system to make
              consequential decisions. If your SaaS product is used by
              businesses in Colorado to make decisions about their customers or
              employees, both you and your customers may be deployers. This is
              critical for B2B SaaS: even if your company is not based in
              Colorado, if your customers use your AI features to make decisions
              about Colorado residents, the Act applies.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              What counts as a consequential decision?
            </h3>
            <p>
              The Act defines consequential decisions as those with material
              legal or similarly significant effects on individuals in these
              areas:
            </p>
            <div className="space-y-4">
              {[
                {
                  area: "Employment",
                  examples:
                    "Hiring, termination, promotion, compensation, performance evaluation, disciplinary actions. AI-powered resume screening, candidate ranking, and performance analytics all qualify.",
                },
                {
                  area: "Education",
                  examples:
                    "Admissions, financial aid, grading, disciplinary decisions, academic opportunity allocation. AI-driven tutoring systems that determine curriculum paths may qualify.",
                },
                {
                  area: "Financial services",
                  examples:
                    "Lending, credit, insurance underwriting, investment advice. AI-powered credit scoring, fraud detection that blocks transactions, and insurance pricing all qualify.",
                },
                {
                  area: "Housing",
                  examples:
                    "Tenant screening, rental pricing, mortgage qualification, property insurance. AI-powered tenant scoring tools and dynamic pricing algorithms qualify.",
                },
                {
                  area: "Healthcare",
                  examples:
                    "Treatment recommendations, insurance coverage decisions, resource allocation. AI diagnostic tools and triage systems qualify.",
                },
                {
                  area: "Legal services",
                  examples:
                    "Bail determinations, sentencing recommendations, case outcome predictions used to advise clients.",
                },
                {
                  area: "Government services",
                  examples:
                    "Benefits eligibility, licensing, permit approvals. AI systems used by government agencies to process applications.",
                },
              ].map((item) => (
                <div
                  key={item.area}
                  className="bg-surface-secondary rounded-lg p-5"
                >
                  <p className="font-semibold mb-1 text-ink">{item.area}</p>
                  <p className="text-sm text-ink-secondary">{item.examples}</p>
                </div>
              ))}
            </div>

            {/* Key deadlines */}
            <h2
              id="key-deadlines"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Key deadlines for SB 24-205 compliance
            </h2>
            <div className="space-y-4">
              {[
                {
                  date: "February 1, 2026",
                  event: "Act takes effect",
                  detail:
                    "The Colorado AI Act becomes law. All obligations begin to apply. Companies should already have compliance programs in progress.",
                },
                {
                  date: "June 30, 2026",
                  event: "Initial impact assessments due",
                  detail:
                    "Deployers must complete their first impact assessments for all high-risk AI systems in use. This is the hard compliance deadline most companies need to plan for.",
                },
                {
                  date: "Ongoing",
                  event: "Annual updates",
                  detail:
                    "Impact assessments must be updated at least annually, or whenever significant modifications are made to a high-risk AI system.",
                },
              ].map((milestone) => (
                <div
                  key={milestone.date}
                  className="bg-surface-secondary rounded-lg p-5"
                >
                  <p className="font-semibold mb-1 text-ink">
                    {milestone.date} &mdash; {milestone.event}
                  </p>
                  <p className="text-sm text-ink-secondary">{milestone.detail}</p>
                </div>
              ))}
            </div>

            {/* Developer obligations */}
            <h2
              id="developer-obligations"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Obligations for AI developers
            </h2>
            <p>
              If you build AI systems (including AI features in your SaaS
              product), the Colorado AI Act requires:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              1. Reasonable care to protect against algorithmic discrimination
            </h3>
            <p>
              This is the Act&apos;s core requirement. You must use reasonable
              care to protect consumers from known or foreseeable risks of
              algorithmic discrimination. &quot;Reasonable care&quot; is
              assessed based on the totality of circumstances, including the
              size and complexity of the AI system, the nature and severity of
              potential harms, and the feasibility and cost of mitigation
              measures.
            </p>
            <p>
              Practically, this means testing your AI systems for bias across
              protected characteristics, documenting the training data and its
              known limitations, implementing safeguards against discriminatory
              outputs, and monitoring system behavior in production.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              2. Documentation and disclosure
            </h3>
            <p>
              Developers must make available to deployers and other developers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                A general description of the AI system, including its intended
                uses and known limitations
              </li>
              <li>
                Documentation of the training data, including known biases or
                gaps
              </li>
              <li>
                The types of data the system processes and outputs it generates
              </li>
              <li>
                Known risks of algorithmic discrimination and mitigation
                measures
              </li>
              <li>
                How the system should be used, monitored, and maintained
              </li>
            </ul>
            <p>
              This documentation enables deployers to conduct their own impact
              assessments and implement appropriate safeguards.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              3. Public disclosure on your website
            </h3>
            <p>
              Developers must publish a statement on their website that
              describes the types of high-risk AI systems they develop, how
              they manage known or foreseeable risks of algorithmic
              discrimination, and the nature of the high-risk AI systems they
              have developed. Codepliant&apos;s{" "}
              <a
                href="/ai-disclosure-generator"
                className="text-brand hover:underline"
              >
                AI Disclosure Generator
              </a>{" "}
              can help you create this statement based on the actual AI services
              detected in your codebase.
            </p>

            {/* Deployer obligations */}
            <h2
              id="deployer-obligations"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Obligations for AI deployers
            </h2>
            <p>
              If your company uses high-risk AI systems (including AI features
              in SaaS products you subscribe to), you have deployer obligations:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              1. Risk management policy
            </h3>
            <p>
              Deployers must implement a risk management policy and governance
              framework for high-risk AI systems. This includes designating
              personnel responsible for AI governance, establishing processes
              for identifying and mitigating discrimination risks, and training
              employees who interact with high-risk AI systems. See our{" "}
              <a
                href="/ai-governance"
                className="text-brand hover:underline"
              >
                AI Governance Framework Generator
              </a>{" "}
              for NIST AI RMF aligned documentation.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              2. Impact assessments
            </h3>
            <p>
              This is the most substantial deployer obligation. Before
              deploying a high-risk AI system &mdash; and at least annually
              thereafter &mdash; you must complete an impact assessment that
              includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                The purpose, intended use cases, and deployment context of the
                AI system
              </li>
              <li>
                An analysis of whether the system poses risks of algorithmic
                discrimination
              </li>
              <li>
                The categories of data processed by the system
              </li>
              <li>
                Metrics used to evaluate system performance and fairness
              </li>
              <li>
                A description of the transparency measures provided to
                consumers
              </li>
              <li>
                Post-deployment monitoring plans
              </li>
            </ul>
            <p>
              Impact assessments must be retained for at least three years and
              provided to the Colorado Attorney General upon request.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              3. Consumer transparency
            </h3>
            <p>
              Deployers must notify consumers before a high-risk AI system
              makes a consequential decision about them. The notice must
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                That a high-risk AI system is being used to make or
                substantially assist in making a consequential decision
              </li>
              <li>
                A description of the system and how it is used in the decision
              </li>
              <li>
                Contact information for the deployer
              </li>
              <li>
                A description of the consumer&apos;s right to opt out (where
                applicable) and appeal
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              4. Consumer rights
            </h3>
            <p>
              When a high-risk AI system makes an adverse consequential
              decision, consumers have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Receive an explanation of the decision, including the principal
                factors and logic that led to the outcome
              </li>
              <li>
                Appeal the decision and request human review
              </li>
              <li>
                Correct inaccurate data that was used in the decision
              </li>
            </ul>

            {/* Detecting AI services */}
            <h2
              id="detecting-ai-services"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Detecting AI services in your codebase
            </h2>
            <p>
              The first step toward Colorado AI Act compliance is understanding
              what AI services your application uses. Codepliant scans your
              dependencies, imports, and environment variables to detect AI
              integrations automatically.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              AI providers Codepliant detects
            </h3>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border border-border-subtle rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface-secondary text-ink text-left">
                    <th className="px-4 py-2 font-semibold">Provider</th>
                    <th className="px-4 py-2 font-semibold">Package / Import</th>
                    <th className="px-4 py-2 font-semibold">Env variable</th>
                  </tr>
                </thead>
                <tbody className="text-ink-secondary">
                  {[
                    { provider: "OpenAI", pkg: "openai", env: "OPENAI_API_KEY" },
                    { provider: "Anthropic", pkg: "@anthropic-ai/sdk", env: "ANTHROPIC_API_KEY" },
                    { provider: "Google AI", pkg: "@google-ai/generativelanguage", env: "GOOGLE_AI_API_KEY" },
                    { provider: "LangChain", pkg: "langchain", env: "LANGCHAIN_API_KEY" },
                    { provider: "Vercel AI SDK", pkg: "ai", env: "OPENAI_API_KEY" },
                    { provider: "Cohere", pkg: "cohere-ai", env: "COHERE_API_KEY" },
                    { provider: "Together AI", pkg: "together-ai", env: "TOGETHER_API_KEY" },
                    { provider: "Replicate", pkg: "replicate", env: "REPLICATE_API_TOKEN" },
                  ].map((row) => (
                    <tr key={row.provider} className="border-t border-border-subtle">
                      <td className="px-4 py-2 font-medium text-ink">{row.provider}</td>
                      <td className="px-4 py-2 font-mono text-xs">{row.pkg}</td>
                      <td className="px-4 py-2 font-mono text-xs">{row.env}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Scan your codebase
            </h3>
            <p>
              Run Codepliant to identify all AI services and generate an
              inventory for your impact assessment:
            </p>
            <CodeBlock filename="Terminal">
{`$ npx codepliant go

  Scanning project...

  Detected services:
    ✓ OpenAI (openai) — AI / Machine Learning
    ✓ Anthropic (@anthropic-ai/sdk) — AI / Machine Learning
    ✓ Stripe (@stripe/stripe-js) — Payment Processing
    ✓ PostHog (posthog-js) — Analytics
    ✓ Sentry (@sentry/nextjs) — Error Tracking
    ✓ Prisma (prisma) — Database

  Generated documents:
    ✓ legal/privacy-policy.md
    ✓ legal/terms-of-service.md
    ✓ legal/ai-disclosure.md
    ✓ legal/cookie-policy.md
    ✓ legal/ai-governance.md

  Done in 1.2s`}
            </CodeBlock>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Get structured output for impact assessments
            </h3>
            <p>
              Use the JSON output mode to extract AI service data for your
              impact assessment documentation:
            </p>
            <CodeBlock filename="Terminal — JSON output filtered for AI services">
{`$ npx codepliant scan --json | jq '.services[] | select(.category == "AI / Machine Learning")'

{
  "name": "OpenAI",
  "package": "openai",
  "category": "AI / Machine Learning",
  "dataCollected": [
    "user prompts",
    "conversation history",
    "API usage metadata"
  ],
  "detectedVia": ["dependency", "import", "env"]
}
{
  "name": "Anthropic",
  "package": "@anthropic-ai/sdk",
  "category": "AI / Machine Learning",
  "dataCollected": [
    "user prompts",
    "conversation history",
    "API usage metadata"
  ],
  "detectedVia": ["dependency", "import"]
}`}
            </CodeBlock>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Automate compliance in CI/CD
            </h3>
            <p>
              Keep your impact assessment documentation current by running
              Codepliant in your CI/CD pipeline. This ensures documentation is
              regenerated whenever your AI integrations change:
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
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npx codepliant go
      - name: Commit updated docs
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add legal/
          git diff --cached --quiet || git commit -m "Update compliance docs"
          git push`}
            </CodeBlock>

            {/* Affirmative defense */}
            <h2
              id="affirmative-defense"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              The affirmative defense: NIST AI RMF alignment
            </h2>
            <p>
              The Colorado AI Act provides an important affirmative defense.
              Developers and deployers that comply with a recognized AI risk
              management framework &mdash; specifically the NIST AI Risk
              Management Framework (AI RMF) or a substantially equivalent
              framework &mdash; can use that compliance as a defense against
              enforcement actions.
            </p>
            <p>
              This is significant because it gives companies a clear path to
              compliance. If you implement the NIST AI RMF and can demonstrate
              adherence, you have a strong defense even if an algorithmic
              discrimination issue arises. Codepliant generates{" "}
              <a
                href="/ai-governance"
                className="text-brand hover:underline"
              >
                AI governance documentation
              </a>{" "}
              aligned with the NIST AI RMF, giving you a starting point for
              this defense.
            </p>
            <p>
              The NIST AI RMF consists of four core functions: Govern (establish
              policies and accountability), Map (identify and categorize AI
              risks), Measure (assess and analyze risks), and Manage (prioritize
              and act on risks). When you run{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                npx codepliant go
              </code>
              , the generated{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                ai-governance.md
              </code>{" "}
              document maps your detected AI services to these four functions,
              providing a concrete starting point for NIST AI RMF compliance.
            </p>

            {/* How it differs from the EU AI Act */}
            <h2
              id="colorado-vs-eu"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Colorado AI Act vs. EU AI Act: key differences
            </h2>
            <p>
              If you are also preparing for the{" "}
              <a
                href="/blog/eu-ai-act-deadline"
                className="text-brand hover:underline"
              >
                EU AI Act deadline on August 2, 2026
              </a>
              , here is how the two regulations compare:
            </p>
            <div className="space-y-4">
              {[
                {
                  dimension: "Scope",
                  comparison:
                    "The EU AI Act covers all AI systems with a risk-based classification. The Colorado Act focuses exclusively on high-risk AI systems that make consequential decisions.",
                },
                {
                  dimension: "Primary concern",
                  comparison:
                    "The EU AI Act addresses safety, transparency, and fundamental rights broadly. The Colorado Act focuses specifically on algorithmic discrimination.",
                },
                {
                  dimension: "Impact assessments",
                  comparison:
                    "Both require impact assessments for high-risk systems. The Colorado Act requires annual updates and three-year retention. The EU Act has more detailed conformity assessment procedures.",
                },
                {
                  dimension: "Enforcement",
                  comparison:
                    "The EU AI Act is enforced by national authorities with fines up to 7% of global turnover. The Colorado Act is enforced by the state Attorney General under existing consumer protection authority.",
                },
                {
                  dimension: "Affirmative defense",
                  comparison:
                    "The Colorado Act provides an explicit affirmative defense for NIST AI RMF compliance. The EU AI Act has no equivalent safe harbor.",
                },
                {
                  dimension: "Data privacy overlap",
                  comparison:
                    "The Colorado Act intersects with the Colorado Privacy Act (CPA). The EU AI Act intersects with GDPR. Both require understanding how personal data flows through AI systems.",
                },
              ].map((item) => (
                <div
                  key={item.dimension}
                  className="bg-surface-secondary rounded-lg p-5"
                >
                  <p className="font-semibold mb-1 text-ink">{item.dimension}</p>
                  <p className="text-sm text-ink-secondary">{item.comparison}</p>
                </div>
              ))}
            </div>
            <p>
              For companies that need to comply with both regulations,
              Codepliant generates documentation that covers overlapping
              requirements. See our guides on the{" "}
              <a
                href="/blog/eu-ai-act-deadline"
                className="text-brand hover:underline"
              >
                EU AI Act
              </a>{" "}
              and{" "}
              <a
                href="/blog/gdpr-for-developers"
                className="text-brand hover:underline"
              >
                GDPR for developers
              </a>{" "}
              for more detail on international compliance.
            </p>

            {/* Compliance steps */}
            <h2
              id="compliance-action-plan"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Compliance action plan for SaaS companies
            </h2>
            <p>
              With the June 30, 2026 impact assessment deadline approaching,
              here is what your team should do now:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong className="text-ink">Identify your high-risk AI systems.</strong>{" "}
                Review every AI feature in your product. Does it make or
                substantially influence decisions about employment, education,
                finance, housing, healthcare, or other consequential areas? If
                yes, it is a high-risk system under the Act. Run{" "}
                <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                  npx codepliant go
                </code>{" "}
                to generate an AI inventory from your codebase.
              </li>
              <li>
                <strong className="text-ink">Determine your role.</strong>{" "}
                Are you a developer (building the AI), a deployer (using the
                AI), or both? Most SaaS companies that build AI features into
                their products are both.
              </li>
              <li>
                <strong className="text-ink">Conduct impact assessments.</strong>{" "}
                For each high-risk AI system, document its purpose, data
                inputs, decision outputs, discrimination risks, fairness
                metrics, and mitigation measures. This assessment must be
                completed by June 30, 2026.
              </li>
              <li>
                <strong className="text-ink">Test for bias.</strong>{" "}
                Evaluate your AI systems for differential treatment across
                protected characteristics. Use statistical fairness metrics
                appropriate to your use case (demographic parity, equalized
                odds, calibration).
              </li>
              <li>
                <strong className="text-ink">Implement transparency notices.</strong>{" "}
                Build consumer-facing disclosures that inform users when
                high-risk AI is used in decisions affecting them. Include
                appeal and opt-out mechanisms. See our{" "}
                <a
                  href="/ai-disclosure-generator"
                  className="text-brand hover:underline"
                >
                  AI Disclosure Generator
                </a>{" "}
                for a starting point.
              </li>
              <li>
                <strong className="text-ink">Establish governance.</strong>{" "}
                Designate AI governance responsibility, create risk management
                policies, and train relevant staff. Use the NIST AI RMF as
                your framework to take advantage of the affirmative defense.
              </li>
              <li>
                <strong className="text-ink">Generate documentation.</strong>{" "}
                Use Codepliant to generate AI governance documentation aligned
                with NIST AI RMF. This documentation supports both compliance
                and the affirmative defense.
              </li>
              <li>
                <strong className="text-ink">Plan for ongoing compliance.</strong>{" "}
                Impact assessments must be updated annually and whenever
                significant system changes occur. Integrate Codepliant into
                your CI/CD pipeline to keep documentation current.
              </li>
            </ol>

            {/* Other state AI laws */}
            <h2
              id="state-landscape"
              className="text-2xl font-bold tracking-tight text-ink pt-4 scroll-mt-24"
            >
              Beyond Colorado: the US state AI regulation landscape
            </h2>
            <p>
              Colorado is the first state to enact comprehensive AI regulation,
              but it will not be the last. Several other states have introduced
              or are considering similar legislation:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-ink">Illinois:</strong> The Illinois AI
                Video Interview Act already regulates AI in hiring. Broader AI
                legislation is under consideration.
              </li>
              <li>
                <strong className="text-ink">California:</strong> Multiple AI
                bills were introduced in 2024-2025, including proposals for
                algorithmic impact assessments and AI transparency
                requirements.
              </li>
              <li>
                <strong className="text-ink">New York City:</strong> Local Law
                144 regulates automated employment decision tools, requiring
                annual bias audits.
              </li>
              <li>
                <strong className="text-ink">Connecticut:</strong> Enacted an
                AI governance framework in 2024 with disclosure and assessment
                requirements for state agencies.
              </li>
            </ul>
            <p>
              The trend is clear: AI regulation is expanding across the United
              States. Building compliance infrastructure now &mdash; impact
              assessment frameworks, transparency systems, governance processes
              &mdash; prepares you for the regulations that follow Colorado.
              If you also handle personal data of EU residents, read our{" "}
              <a
                href="/blog/gdpr-for-developers"
                className="text-brand hover:underline"
              >
                GDPR compliance guide
              </a>{" "}
              and{" "}
              <a
                href="/blog/privacy-policy-for-saas"
                className="text-brand hover:underline"
              >
                privacy policy guide for SaaS
              </a>{" "}
              to cover the data privacy side.
            </p>
          </div>

          {/* CTA */}
          <section className="bg-brand-muted border border-brand/20 rounded-lg p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3 text-ink">
              Prepare for the Colorado AI Act deadline
            </h2>
            <p className="text-ink-secondary text-sm mb-2">
              Scan your codebase to detect AI services and generate governance
              documentation aligned with the NIST AI RMF. Free, open source, no
              account required.
            </p>
            <p className="text-ink-tertiary text-xs mb-6">
              Detects OpenAI, Anthropic, Google AI, LangChain, Vercel AI SDK,
              Cohere, Replicate, Together AI, and more.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-lg font-mono text-sm inline-block mb-4">
              npx codepliant go
            </div>
            <p className="text-xs text-ink-tertiary">
              <a
                href="https://github.com/joechensmartz/codepliant"
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              {" "}&middot;{" "}
              <a
                href="https://www.npmjs.com/package/codepliant"
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm package
              </a>
              {" "}&middot;{" "}
              <a href="/docs" className="text-brand hover:underline">
                Documentation
              </a>
            </p>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-ink">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "AI Governance Framework Generator",
                  href: "/ai-governance",
                  desc: "Generate NIST AI RMF aligned governance documentation for your application.",
                },
                {
                  title: "EU AI Act: What Developers Need to Know",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Comprehensive guide to the EU AI Act deadline on August 2, 2026.",
                },
                {
                  title: "GDPR Compliance for Developers",
                  href: "/blog/gdpr-for-developers",
                  desc: "Developer-focused guide to GDPR compliance with code examples.",
                },
                {
                  title: "Privacy Policy for SaaS",
                  href: "/blog/privacy-policy-for-saas",
                  desc: "How to generate a privacy policy based on your actual codebase.",
                },
                {
                  title: "SOC 2 for Startups",
                  href: "/blog/soc2-for-startups",
                  desc: "Developer survival guide to SOC 2 compliance with a 30-day readiness timeline.",
                },
                {
                  title: "AI Disclosure Generator",
                  href: "/ai-disclosure-generator",
                  desc: "Generate AI transparency disclosures for your SaaS product.",
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
                  className="block bg-surface-secondary rounded-lg p-4 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <p className="font-semibold mb-1 text-sm text-ink">
                    {link.title}
                  </p>
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
