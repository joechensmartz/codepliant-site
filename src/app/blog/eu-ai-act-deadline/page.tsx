import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
  description:
    "Comprehensive developer guide to the EU AI Act deadline on August 2, 2026. Risk classifications, Article 50 transparency obligations, code examples for detecting AI services, and practical compliance steps for SaaS engineering teams.",
  alternates: {
    canonical: "https://codepliant.dev/blog/eu-ai-act-deadline",
  },
  keywords: [
    "EU AI Act",
    "AI Act compliance",
    "Article 50 transparency",
    "AI disclosure",
    "AI governance",
    "EU AI Act deadline 2026",
    "AI risk classification",
    "developer compliance",
    "AI regulation",
    "codepliant",
  ],
  openGraph: {
    title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "The EU AI Act deadline is approaching. This developer guide covers risk classifications, transparency obligations, code examples, and practical compliance steps.",
    url: "https://codepliant.dev/blog/eu-ai-act-deadline",
    type: "article",
    publishedTime: "2026-03-15T00:00:00Z",
    modifiedTime: "2026-03-16T00:00:00Z",
    authors: ["Codepliant"],
    tags: ["EU AI Act", "AI Compliance", "Developer Guide"],
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "Comprehensive AI Act developer guide. Risk tiers, deadlines, transparency rules, code examples, and compliance steps.",
    images: ["/og-image.png"],
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "Comprehensive developer guide to the EU AI Act. Risk classifications, transparency obligations, code examples for AI detection, and practical compliance steps.",
    datePublished: "2026-03-15",
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
      "@id": "https://codepliant.dev/blog/eu-ai-act-deadline",
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
        name: "When does the EU AI Act take effect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The EU AI Act entered into force on August 1, 2024. Prohibited AI practices applied from February 2, 2025. Transparency obligations under Article 50 take effect August 2, 2026. High-risk AI system requirements apply from August 2, 2027.",
        },
      },
      {
        "@type": "Question",
        name: "Does the EU AI Act apply to companies outside the EU?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The EU AI Act has extraterritorial scope. It applies to any organization that places AI systems on the EU market or whose AI system output is used in the EU, regardless of where the organization is based.",
        },
      },
      {
        "@type": "Question",
        name: "What are the penalties for non-compliance with the EU AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fines range from 7.5 million EUR or 1% of global turnover (for incorrect information) to 35 million EUR or 7% of global turnover (for prohibited AI practices). For most SaaS companies, transparency violations carry fines up to 15 million EUR or 3% of global turnover.",
        },
      },
      {
        "@type": "Question",
        name: "How can I check if my codebase uses AI services covered by the EU AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run `npx codepliant go` in your project directory. Codepliant scans your dependencies, imports, and environment variables to detect AI service integrations (OpenAI, Anthropic, Google AI, LangChain, Vercel AI SDK, and more) and generates compliance documentation automatically.",
        },
      },
      {
        "@type": "Question",
        name: "What is Article 50 of the EU AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Article 50 establishes transparency obligations for AI systems. It requires that users be informed when interacting with AI (chatbot disclosure), when content is AI-generated (labeling), and when synthetic media such as deepfakes are produced. These obligations take effect on August 2, 2026.",
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
        name: "EU AI Act Deadline",
        item: "https://codepliant.dev/blog/eu-ai-act-deadline",
      },
    ],
  };
}

function DaysUntilDeadline() {
  const deadline = new Date("2026-08-02T00:00:00Z");
  const now = new Date();
  const days = Math.max(
    0,
    Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
  return <>{days}</>;
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

export default function EuAiActDeadline() {
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
          <nav className="text-sm text-ink-tertiary mb-6">
            <a href="/" className="hover:text-ink transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-ink transition-colors">
              Blog
            </a>
            <span className="mx-2">/</span>
            <span className="text-ink-secondary">EU AI Act Deadline</span>
          </nav>

          <p className="text-sm font-medium text-urgency mb-4 tracking-wide uppercase">
            EU AI Act
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            EU AI Act: What Developers Need to Know Before August 2, 2026
          </h1>
          <p className="text-sm text-ink-tertiary mb-12">
            Published March 15, 2026 &middot; Updated March 16, 2026 &middot;
            14 min read
          </p>

          <div className="space-y-6 text-[length:var(--text-base)] text-ink-secondary leading-relaxed">
            {/* Urgency callout */}
            <div className="bg-urgency-muted border border-urgency/20 rounded-xl p-5">
              <p className="text-urgency font-semibold text-sm mb-1">
                Deadline approaching
              </p>
              <p className="text-sm text-ink-secondary">
                Article 50 transparency obligations become enforceable on{" "}
                <strong className="text-ink">August 2, 2026</strong>. If your
                SaaS uses any AI provider — OpenAI, Anthropic, Google AI,
                LangChain, Vercel AI SDK — you need to disclose it. Run{" "}
                <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                  npx codepliant go
                </code>{" "}
                to check what AI services your codebase uses.
              </p>
            </div>

            {/* Introduction */}
            <p>
              The EU AI Act is the world&apos;s first comprehensive legal
              framework for artificial intelligence. If you build software that
              uses AI — and in 2026, that means most SaaS products — you need to
              understand what the Act requires and when those requirements kick
              in. The most immediately relevant deadline for developers is{" "}
              <strong className="text-ink">August 2, 2026</strong>, when Article
              50 transparency obligations become enforceable.
            </p>
            <p>
              This guide covers everything developers need to know: the
              regulatory timeline, risk classification system, specific
              obligations by risk tier, how to detect AI services in your
              codebase, practical compliance steps, and what happens if you do
              not comply. Whether you are integrating OpenAI APIs, running
              fine-tuned models, or building AI features with LangChain and
              Vercel AI SDK, this article will help you prepare.
            </p>

            {/* Table of contents */}
            <div className="bg-surface-secondary rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ink mb-3">
                In this guide
              </h2>
              <ol className="list-decimal list-inside space-y-1.5 text-sm">
                <li>
                  <a
                    href="#timeline"
                    className="text-brand hover:underline"
                  >
                    Key dates for developers
                  </a>
                </li>
                <li>
                  <a
                    href="#risk-classification"
                    className="text-brand hover:underline"
                  >
                    Risk classification system
                  </a>
                </li>
                <li>
                  <a
                    href="#article-50"
                    className="text-brand hover:underline"
                  >
                    What Article 50 means in practice
                  </a>
                </li>
                <li>
                  <a
                    href="#detecting-ai"
                    className="text-brand hover:underline"
                  >
                    Detecting AI services in your codebase
                  </a>
                </li>
                <li>
                  <a
                    href="#extraterritorial"
                    className="text-brand hover:underline"
                  >
                    Extraterritorial scope
                  </a>
                </li>
                <li>
                  <a
                    href="#penalties"
                    className="text-brand hover:underline"
                  >
                    Penalties for non-compliance
                  </a>
                </li>
                <li>
                  <a href="#gpai" className="text-brand hover:underline">
                    General-purpose AI model rules
                  </a>
                </li>
                <li>
                  <a
                    href="#compliance-steps"
                    className="text-brand hover:underline"
                  >
                    Practical compliance steps
                  </a>
                </li>
                <li>
                  <a
                    href="#industry-impact"
                    className="text-brand hover:underline"
                  >
                    Impact by industry
                  </a>
                </li>
                <li>
                  <a
                    href="#what-to-do"
                    className="text-brand hover:underline"
                  >
                    What to do right now
                  </a>
                </li>
              </ol>
            </div>

            {/* Timeline */}
            <h2
              id="timeline"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              The EU AI Act timeline: key dates for developers
            </h2>
            <p>
              The EU AI Act was published in the Official Journal of the European
              Union on July 12, 2024, and entered into force on August 1, 2024.
              But the obligations phase in gradually over three years:
            </p>
            <div className="space-y-4">
              {[
                {
                  date: "February 2, 2025",
                  event: "Prohibited AI practices",
                  detail:
                    "AI systems that pose unacceptable risks are banned. This includes social scoring systems, real-time biometric identification in public spaces (with exceptions), manipulation techniques that exploit vulnerabilities, and emotion recognition in workplaces and education.",
                  status: "In effect",
                  statusColor: "text-brand",
                },
                {
                  date: "August 2, 2025",
                  event: "Governance and general-purpose AI",
                  detail:
                    "National competent authorities must be designated. Rules for general-purpose AI (GPAI) models begin to apply, including transparency and copyright obligations for GPAI providers like OpenAI and Anthropic.",
                  status: "In effect",
                  statusColor: "text-brand",
                },
                {
                  date: "August 2, 2026",
                  event: "Transparency obligations (Article 50)",
                  detail:
                    "This is the critical deadline for most developers. All AI systems that interact with people, generate synthetic content, or make decisions affecting individuals must include transparency measures. If your SaaS uses AI, this applies to you.",
                  status: "Upcoming",
                  statusColor: "text-urgency",
                },
                {
                  date: "August 2, 2027",
                  event: "High-risk AI system requirements",
                  detail:
                    "Full compliance requirements for high-risk AI systems, including conformity assessments, quality management systems, post-market monitoring, and registration in the EU database.",
                  status: "Future",
                  statusColor: "text-ink-tertiary",
                },
              ].map((milestone) => (
                <div
                  key={milestone.date}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-ink">
                      {milestone.date} — {milestone.event}
                    </h3>
                    <span
                      className={`text-xs font-medium ${milestone.statusColor}`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-secondary">
                    {milestone.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Risk classification */}
            <h2
              id="risk-classification"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Understanding the risk classification system
            </h2>
            <p>
              The EU AI Act takes a risk-based approach. Your obligations depend
              on which risk tier your AI system falls into. Understanding your
              classification is the first step toward compliance.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Unacceptable Risk (Prohibited)
            </h3>
            <p>
              These AI practices are banned outright, effective February 2025.
              They include social scoring by governments, real-time remote
              biometric identification in public spaces (with narrow law
              enforcement exceptions), AI that manipulates behavior to cause
              harm, and systems that exploit age, disability, or social
              situations.
            </p>
            <p>
              As a developer, verify that none of your AI features fall into this
              category. Most SaaS applications do not, but edge cases exist. For
              example, an AI-powered hiring tool that infers emotional states
              from video interviews could be classified as prohibited emotion
              recognition in the workplace.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              High Risk
            </h3>
            <p>
              High-risk AI systems have the most extensive obligations. These
              include AI used in hiring and recruitment, credit scoring and
              insurance, education (admissions, grading), critical
              infrastructure, law enforcement, border control, and access to
              essential services.
            </p>
            <p>
              If your AI system is classified as high-risk, you must implement a
              risk management system, ensure data governance with training data
              documentation, maintain technical documentation, enable human
              oversight, achieve accuracy and robustness standards, and register
              in the EU AI database. The full requirements take effect August 2,
              2027, but preparation should start now.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Limited Risk (Transparency Obligations)
            </h3>
            <p>
              This is where most SaaS AI features land. Limited-risk systems are
              subject to Article 50 transparency obligations, effective{" "}
              <strong className="text-ink">August 2, 2026</strong>. These
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-ink">
                  AI-generated content labeling:
                </strong>{" "}
                Users must be informed when content (text, images, audio, video)
                is generated by AI. This applies to chatbots, AI writing
                assistants, image generators, and any feature that produces
                synthetic content.
              </li>
              <li>
                <strong className="text-ink">Chatbot disclosure:</strong> When a
                user interacts with an AI system, they must be informed they are
                interacting with AI, not a human. This includes customer support
                chatbots, virtual assistants, and AI agents.
              </li>
              <li>
                <strong className="text-ink">Deepfake labeling:</strong>{" "}
                AI-generated or manipulated images, audio, or video must be
                labeled as artificially generated. This includes AI avatars,
                voice synthesis, and image editing tools.
              </li>
              <li>
                <strong className="text-ink">
                  Emotion recognition disclosure:
                </strong>{" "}
                If your system detects emotions or biometric categorization,
                users must be informed (though many emotion recognition uses are
                prohibited entirely).
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Minimal Risk
            </h3>
            <p>
              AI systems that pose minimal risk — spam filters, AI-powered
              search, recommendation engines, inventory management — have no
              mandatory obligations under the Act. However, the European
              Commission encourages voluntary codes of conduct for these systems,
              and best practice suggests documenting AI usage even when not
              legally required.
            </p>

            {/* What Article 50 means in practice */}
            <h2
              id="article-50"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              What Article 50 means in practice for your application
            </h2>
            <p>
              Article 50 is the section most relevant to SaaS developers in
              2026. Let us break down what it requires in concrete terms.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              1. Disclose AI-generated content
            </h3>
            <p>
              If your application generates text, images, audio, or video using
              AI, you must clearly inform users that the content is AI-generated.
              This applies whether you use OpenAI, Anthropic, Mistral, Llama, or
              any other AI provider.
            </p>
            <p>
              Practically, this means adding visible labels or disclosures near
              AI-generated content. A writing assistant should indicate which
              portions were AI-generated. An image generation tool must label
              outputs as AI-generated. A code assistant should distinguish AI
              suggestions from human-written code.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              2. Identify AI interactions
            </h3>
            <p>
              If your application includes a chatbot, virtual assistant, or any
              feature where AI communicates with users in natural language, you
              must inform users that they are interacting with an AI system. This
              must happen before or at the start of the interaction.
            </p>
            <p>
              A simple implementation is a banner or notice at the top of the
              chat interface stating &quot;You are interacting with an AI
              assistant.&quot; The disclosure must be clear, concise, and
              impossible to miss.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              3. Mark synthetic media
            </h3>
            <p>
              AI-generated or substantially modified images, audio, and video
              must be labeled as such. The Act requires both human-readable
              disclosures (visible labels) and machine-readable markings
              (metadata, watermarks). This means implementing both UI labeling
              and technical watermarking for any synthetic media your application
              produces.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              4. Document your AI systems
            </h3>
            <p>
              While not explicitly an Article 50 requirement, the broader AI Act
              expects organizations to maintain documentation of their AI
              systems. This includes what AI models you use, what data they
              process, what decisions they influence, and what safeguards you
              have in place. Maintaining this documentation from the start makes
              compliance with future obligations significantly easier.
            </p>

            {/* Detecting AI services — NEW section with code examples */}
            <h2
              id="detecting-ai"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Detecting AI services in your codebase
            </h2>
            <p>
              The first step toward AI Act compliance is knowing exactly which AI
              services your application uses. In a growing codebase with dozens
              of dependencies, this is harder than it sounds. AI integrations can
              appear in direct dependencies, transitive dependencies, environment
              variables, and import statements scattered across hundreds of
              files.
            </p>
            <p>
              Codepliant scans your codebase and detects AI services
              automatically. Here is how it works — and what it looks for.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              What Codepliant detects
            </h3>
            <p>
              Codepliant recognizes these AI service integrations out of the box:
            </p>
            <div className="space-y-3">
              {[
                {
                  provider: "OpenAI",
                  packages: "openai",
                  envVars: "OPENAI_API_KEY, OPENAI_ORG",
                },
                {
                  provider: "Anthropic",
                  packages: "@anthropic-ai/sdk",
                  envVars: "ANTHROPIC_API_KEY, CLAUDE_API_KEY",
                },
                {
                  provider: "Google Generative AI",
                  packages: "@google/generative-ai",
                  envVars: "GOOGLE_AI_KEY, GEMINI_API_KEY",
                },
                {
                  provider: "LangChain",
                  packages: "langchain",
                  envVars: "LANGCHAIN_API_KEY",
                },
                {
                  provider: "Vercel AI SDK",
                  packages:
                    "@vercel/ai, @ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google",
                  envVars: "(inherits provider keys)",
                },
                {
                  provider: "Cohere",
                  packages: "cohere, cohere-ai",
                  envVars: "COHERE_API_KEY",
                },
                {
                  provider: "Together AI",
                  packages: "together-ai",
                  envVars: "TOGETHER_API_KEY",
                },
                {
                  provider: "Replicate",
                  packages: "replicate",
                  envVars: "REPLICATE_API_TOKEN",
                },
              ].map((item) => (
                <div
                  key={item.provider}
                  className="bg-surface-secondary rounded-lg px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-ink">
                    {item.provider}
                  </span>
                  <span className="text-ink-secondary">
                    {" "}
                    — packages:{" "}
                    <code className="bg-code-bg text-code-fg px-1 py-0.5 rounded text-xs font-mono">
                      {item.packages}
                    </code>{" "}
                    | env:{" "}
                    <code className="bg-code-bg text-code-fg px-1 py-0.5 rounded text-xs font-mono">
                      {item.envVars}
                    </code>
                  </span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-4">
              Running the scan
            </h3>
            <p>
              To audit your project for AI services, run Codepliant in your
              project root:
            </p>
            <CodeBlock filename="terminal">
              {`$ npx codepliant go

Scanning /Users/you/your-saas-app...

Detected services:
  ├── openai (AI) — via package.json dependency + OPENAI_API_KEY in .env
  ├── @anthropic-ai/sdk (AI) — via import in src/lib/chat.ts
  ├── @vercel/ai (AI) — via package.json dependency
  ├── stripe (Payment) — via package.json dependency + STRIPE_SECRET_KEY
  ├── posthog-js (Analytics) — via import in src/app/providers.tsx
  └── @sendgrid/mail (Email) — via package.json dependency

AI services detected: 3
  → openai: collects "prompts, completions, user messages, usage metadata"
  → @anthropic-ai/sdk: collects "prompts, completions, user messages"
  → @vercel/ai: collects "prompts, completions, streaming responses"

Generating documents...
  ✓ legal/privacy-policy.md
  ✓ legal/ai-disclosure.md         ← EU AI Act Article 50
  ✓ legal/terms-of-service.md
  ✓ legal/cookie-policy.md
  ... and 31 more documents

Done. Generated 35 documents in legal/`}
            </CodeBlock>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              JSON output for CI/CD integration
            </h3>
            <p>
              For automated pipelines, use the{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                --json
              </code>{" "}
              flag to get machine-readable output. This is useful for blocking
              deployments that introduce new AI services without updated
              disclosure documentation:
            </p>
            <CodeBlock filename="terminal">
              {`$ npx codepliant scan --json | jq '.services[] | select(.category == "ai")'`}
            </CodeBlock>
            <CodeBlock filename="output.json">
              {`{
  "name": "openai",
  "category": "ai",
  "detectedVia": ["dependency", "envVariable"],
  "dataCollected": [
    "prompts",
    "completions",
    "user messages",
    "usage metadata"
  ],
  "evidence": [
    { "type": "dependency", "file": "package.json", "value": "openai@4.73.0" },
    { "type": "envVariable", "file": ".env", "key": "OPENAI_API_KEY" }
  ]
}
{
  "name": "@anthropic-ai/sdk",
  "category": "ai",
  "detectedVia": ["import"],
  "dataCollected": [
    "prompts",
    "completions",
    "user messages"
  ],
  "evidence": [
    { "type": "import", "file": "src/lib/chat.ts", "value": "import Anthropic from '@anthropic-ai/sdk'" }
  ]
}`}
            </CodeBlock>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Example: GitHub Actions compliance check
            </h3>
            <p>
              Add a compliance gate to your CI pipeline that fails if AI
              services are detected but no AI disclosure document exists:
            </p>
            <CodeBlock filename=".github/workflows/compliance.yml">
              {`name: Compliance Check
on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Codepliant scan
        run: npx codepliant go
      - name: Verify AI disclosure exists
        run: |
          if npx codepliant scan --json | jq -e '.services[] | select(.category == "ai")' > /dev/null 2>&1; then
            if [ ! -f "legal/ai-disclosure.md" ]; then
              echo "ERROR: AI services detected but no AI disclosure document found."
              echo "Run 'npx codepliant go' locally to generate compliance docs."
              exit 1
            fi
          fi`}
            </CodeBlock>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Generated AI disclosure document
            </h3>
            <p>
              When Codepliant detects AI services, it generates an{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                ai-disclosure.md
              </code>{" "}
              document that covers the specific transparency requirements of
              Article 50. The document includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                A list of all AI services integrated in your application, with
                their purpose and data handling practices
              </li>
              <li>
                The types of AI-generated content your application produces
              </li>
              <li>
                How users are informed about AI interactions (chatbot
                disclosures, content labels)
              </li>
              <li>
                Data processing details specific to each AI provider (what data
                is sent to which provider, retention policies, geographic
                processing)
              </li>
              <li>
                References to each AI provider&apos;s terms of service and data
                processing agreements
              </li>
            </ul>
            <p>
              This is not a generic template. Because Codepliant scans your
              actual code, the disclosure document reflects your specific AI
              usage — not a checklist of possibilities. See the{" "}
              <a
                href="/ai-disclosure-generator"
                className="text-brand hover:underline"
              >
                AI Disclosure Generator
              </a>{" "}
              page for more details on the output format.
            </p>

            {/* Extraterritorial scope */}
            <h2
              id="extraterritorial"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Extraterritorial scope: why this affects non-EU companies
            </h2>
            <p>
              Like GDPR before it, the EU AI Act has extraterritorial reach.
              Article 2 establishes that the Act applies to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Providers who place AI systems on the EU market, regardless of
                where they are established
              </li>
              <li>Deployers of AI systems located within the EU</li>
              <li>
                Providers and deployers located outside the EU, where the output
                produced by the AI system is used in the EU
              </li>
            </ul>
            <p>
              If your SaaS product is accessible to EU users and includes AI
              features, you are likely within scope. This mirrors how{" "}
              <a
                href="/blog/gdpr-for-developers"
                className="text-brand hover:underline"
              >
                GDPR applies to any company processing data of EU residents
              </a>
              , and companies that ignored GDPR&apos;s extraterritorial scope
              learned expensive lessons.
            </p>

            {/* Penalties */}
            <h2
              id="penalties"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Penalties for non-compliance
            </h2>
            <p>
              The EU AI Act introduces a tiered penalty structure based on the
              severity of the violation:
            </p>
            <div className="space-y-4">
              {[
                {
                  violation: "Prohibited AI practices",
                  penalty:
                    "Up to 35 million EUR or 7% of global annual turnover, whichever is higher",
                },
                {
                  violation: "High-risk system obligations",
                  penalty:
                    "Up to 15 million EUR or 3% of global annual turnover",
                },
                {
                  violation: "Transparency obligations (Article 50)",
                  penalty:
                    "Up to 15 million EUR or 3% of global annual turnover",
                },
                {
                  violation: "Incorrect information to authorities",
                  penalty:
                    "Up to 7.5 million EUR or 1% of global annual turnover",
                },
              ].map((item) => (
                <div
                  key={item.violation}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1 text-ink">
                    {item.violation}
                  </h3>
                  <p className="text-sm text-ink-secondary">{item.penalty}</p>
                </div>
              ))}
            </div>
            <p className="pt-4">
              For SMEs and startups, fines are capped proportionally. But even
              proportional fines based on 3% of turnover can be significant.
              More practically, non-compliance creates business risk: enterprise
              customers increasingly require AI governance as part of vendor
              assessments.
            </p>

            {/* GPAI rules */}
            <h2
              id="gpai"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              General-purpose AI model rules: what API consumers need to know
            </h2>
            <p>
              The AI Act introduces specific obligations for providers of
              general-purpose AI (GPAI) models — companies like OpenAI,
              Anthropic, Google, and Meta. These obligations include publishing
              model documentation, complying with EU copyright law, and
              implementing safety testing for models with systemic risk.
            </p>
            <p>
              As a developer consuming these APIs, you do not bear the GPAI
              provider obligations directly. However, you benefit from
              understanding them. GPAI providers must give you sufficient
              documentation to fulfill your own downstream obligations.
              Practically, this means OpenAI and Anthropic will publish technical
              documentation, model cards, and usage policies that you should
              reference in your own compliance documentation.
            </p>
            <p>
              Importantly, using a GPAI API does not exempt you from deployer
              obligations. You remain responsible for how you use the AI output,
              what disclosures you provide to your users, and what risks your
              specific application introduces.
            </p>

            {/* Practical compliance steps */}
            <h2
              id="compliance-steps"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Practical compliance steps for developers
            </h2>
            <p>
              With the August 2, 2026 deadline approaching, here is a practical
              checklist for engineering teams:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 1: Inventory your AI usage
            </h3>
            <p>
              Catalog every AI integration in your application. This includes
              direct API calls to AI providers, embedded ML models, AI-powered
              features in third-party libraries, and any automated
              decision-making systems.
            </p>
            <CodeBlock filename="terminal">
              {`# Scan your project and output only AI services
$ npx codepliant scan --json | jq '[.services[] | select(.category == "ai")]'`}
            </CodeBlock>
            <p>
              Codepliant checks three detection surfaces: package dependencies
              (package.json, requirements.txt, Gemfile, go.mod, Cargo.toml),
              import/require statements in source files, and environment variable
              patterns (.env files). This catches AI services that other audit
              approaches miss — a developer might add{" "}
              <code className="bg-code-bg text-code-fg px-1.5 py-0.5 rounded text-xs font-mono">
                @anthropic-ai/sdk
              </code>{" "}
              as a dependency without updating any internal documentation.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 2: Classify your risk level
            </h3>
            <p>
              For each AI system or feature, determine which risk tier applies.
              Most SaaS AI features (content generation, search, chatbots,
              recommendations) fall under limited risk with transparency
              obligations. If you are in hiring, credit, education, or
              healthcare, you may be high-risk. The{" "}
              <a
                href="/ai-governance"
                className="text-brand hover:underline"
              >
                AI Governance Framework
              </a>{" "}
              page explains how to perform a risk assessment aligned with both
              the EU AI Act and the NIST AI RMF.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 3: Implement transparency measures
            </h3>
            <p>
              For the August 2026 deadline, focus on Article 50 transparency:
              add AI-generated content labels, chatbot disclosures, synthetic
              media marking, and general AI usage notices. These are UI changes
              that your engineering team can implement directly.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 4: Generate compliance documentation
            </h3>
            <p>
              Document your AI systems, their purposes, risk assessments, and
              transparency measures. This documentation serves as evidence of
              compliance and is required for high-risk systems.
            </p>
            <CodeBlock filename="terminal">
              {`# Generate all compliance documents including AI disclosure
$ npx codepliant go

# Output includes:
#   legal/ai-disclosure.md          — Article 50 transparency statement
#   legal/privacy-policy.md         — Updated with AI data processing
#   legal/data-processing-record.md — Record of processing activities
#   ... and 32 more documents`}
            </CodeBlock>

            <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
              Step 5: Establish ongoing governance
            </h3>
            <p>
              Compliance is not a one-time event. Establish processes for
              reviewing AI usage when adding new features, updating
              documentation when AI integrations change, monitoring AI system
              performance and risks, and responding to user complaints about AI
              decisions. Integrate Codepliant into your CI/CD pipeline to
              regenerate compliance documentation on every deployment.
            </p>

            {/* Comparison with GDPR */}
            <h2 className="text-2xl font-bold tracking-tight text-ink pt-4">
              Lessons from GDPR: why early preparation matters
            </h2>
            <p>
              The EU AI Act follows the same enforcement playbook as GDPR. When
              GDPR took effect in May 2018, many companies assumed enforcement
              would be slow and limited. Eight years later, over 2,000 fines
              totaling more than 4.5 billion EUR have been issued. Meta alone has
              been fined over 2.5 billion EUR for GDPR violations.
            </p>
            <p>
              The AI Act enforcement is expected to follow a similar pattern:
              initial guidance and warnings, followed by increasing enforcement
              activity. Companies that prepare now will avoid both financial
              penalties and the reputational damage of being an early enforcement
              target.
            </p>
            <p>
              GDPR also showed that compliance creates competitive advantage.
              Companies with strong data privacy practices win enterprise deals
              faster. The same dynamic is already emerging with AI governance —
              procurement teams at large organizations are adding AI compliance
              requirements to their vendor assessment questionnaires. For more on
              GDPR compliance, see our{" "}
              <a
                href="/blog/gdpr-for-developers"
                className="text-brand hover:underline"
              >
                GDPR guide for developers
              </a>
              .
            </p>

            {/* Industry impact */}
            <h2
              id="industry-impact"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              Impact by industry
            </h2>
            <p>
              The AI Act affects different industries differently. Here is how
              common SaaS verticals are impacted:
            </p>
            <div className="space-y-4">
              {[
                {
                  industry: "Developer tools and AI coding assistants",
                  impact:
                    "Limited risk. Must disclose AI-generated code suggestions and label AI-assisted outputs. Implement transparency notices in IDE plugins and API responses.",
                },
                {
                  industry: "Customer support and chatbots",
                  impact:
                    "Limited risk. Must inform users they are interacting with AI before or at the start of the conversation. Requires clear chatbot labeling.",
                },
                {
                  industry: "Content creation and marketing tools",
                  impact:
                    "Limited risk. Must label AI-generated text, images, and video. Both human-readable labels and machine-readable metadata required for media content.",
                },
                {
                  industry: "HR tech and recruitment platforms",
                  impact:
                    "High risk. AI used in hiring decisions requires conformity assessments, risk management systems, human oversight, and registration in the EU database. Full requirements by August 2027.",
                },
                {
                  industry: "Fintech and lending platforms",
                  impact:
                    "High risk. AI used in credit scoring or insurance decisions has extensive documentation, testing, and oversight requirements. Must enable human review of AI decisions.",
                },
                {
                  industry: "Healthcare and medtech",
                  impact:
                    "High risk. AI in medical diagnosis, treatment recommendations, or health monitoring requires conformity assessments and is also subject to HIPAA in the US market.",
                },
              ].map((item) => (
                <div
                  key={item.industry}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1 text-ink">
                    {item.industry}
                  </h3>
                  <p className="text-sm text-ink-secondary">{item.impact}</p>
                </div>
              ))}
            </div>

            {/* What to do right now */}
            <h2
              id="what-to-do"
              className="text-2xl font-bold tracking-tight text-ink pt-4"
            >
              What to do right now
            </h2>
            <p>
              You have less than five months until Article 50 obligations become
              enforceable. Here is what your engineering team should prioritize:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong className="text-ink">Run an AI audit.</strong> Use
                Codepliant to scan your codebase and generate a complete AI
                inventory. Understand exactly what AI systems your application
                uses and how they process data.
              </li>
              <li>
                <strong className="text-ink">
                  Add transparency disclosures.
                </strong>{" "}
                Implement AI-generated content labels, chatbot notices, and AI
                usage disclosures in your UI. These are the minimum requirements
                for August 2026.
              </li>
              <li>
                <strong className="text-ink">
                  Generate compliance documentation.
                </strong>{" "}
                Use Codepliant to produce AI disclosure statements, risk
                assessments, and governance frameworks aligned with both the EU
                AI Act and the NIST AI RMF.
              </li>
              <li>
                <strong className="text-ink">Brief your legal team.</strong>{" "}
                Share this guide and your AI inventory with legal counsel. They
                can help determine your exact risk classification and identify
                any high-risk use cases that need additional preparation.
              </li>
              <li>
                <strong className="text-ink">Integrate into CI/CD.</strong> Add
                Codepliant to your deployment pipeline so compliance
                documentation updates automatically as your AI integrations
                evolve.
              </li>
            </ol>
          </div>

          {/* CTA */}
          <section className="bg-brand-muted border border-brand/20 rounded-2xl p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3 text-ink">
              Check your AI compliance now
            </h2>
            <p className="text-ink-secondary text-sm mb-2">
              Scan your codebase to detect AI services and generate Article 50
              compliant documentation. Free, open source, no account required.
            </p>
            <p className="text-ink-tertiary text-xs mb-6">
              Detects OpenAI, Anthropic, Google AI, LangChain, Vercel AI SDK,
              Cohere, Replicate, Together AI, and more.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block mb-4">
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
                  desc: "Generate NIST AI RMF and EU AI Act aligned governance documentation.",
                },
                {
                  title: "AI Disclosure Generator",
                  href: "/ai-disclosure-generator",
                  desc: "Generate Article 50 compliant AI transparency disclosures from your code.",
                },
                {
                  title: "GDPR Compliance for Developers",
                  href: "/blog/gdpr-for-developers",
                  desc: "Practical GDPR guide covering data processing, consent, and user rights.",
                },
                {
                  title: "Colorado AI Act Guide",
                  href: "/blog/colorado-ai-act",
                  desc: "Colorado's AI Act obligations for SaaS developers using AI in consequential decisions.",
                },
                {
                  title: "Codepliant vs Termly vs Iubenda",
                  href: "/compare",
                  desc: "Compare compliance tools: code scanning vs form builders.",
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
                  <h3 className="font-semibold mb-1 text-sm text-ink">
                    {link.title}
                  </h3>
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
