import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Governance Framework for SaaS",
  description:
    "Scan your codebase to detect AI services and generate governance docs aligned with the EU AI Act and NIST AI RMF. Free, open source CLI. Try it today.",
  keywords: [
    "AI governance",
    "AI governance framework",
    "EU AI Act compliance",
    "EU AI Act risk classification",
    "NIST AI RMF",
    "AI risk management",
    "AI model inventory",
    "AI transparency notice",
    "AI disclosure",
    "AI governance checklist",
    "AI compliance for SaaS",
    "AI governance for developers",
    "AI acceptable use policy",
    "AI conformity assessment",
    "Colorado AI Act",
  ],
  alternates: {
    canonical: "https://www.codepliant.site/ai-governance",
  },
  openGraph: {
    title: "AI Governance Framework for SaaS",
    description:
      "Scan your codebase to detect AI services and generate governance docs aligned with the EU AI Act and NIST AI RMF. Free, open source CLI.",
    url: "https://www.codepliant.site/ai-governance",
    images: [{ url: "/ai-governance/opengraph-image", width: 1200, height: 630, alt: "AI Governance Framework for SaaS — Codepliant" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Governance Framework for SaaS",
    description:
      "Detect AI services in your code and generate governance docs aligned with the EU AI Act and NIST AI RMF. Try it free.",
    images: ["/ai-governance/opengraph-image"],
  },
};

const faqs = [
  {
    question: "What is the NIST AI Risk Management Framework?",
    answer:
      "The NIST AI RMF (published January 2023) is a voluntary framework for managing AI risks throughout the AI lifecycle. It organizes AI risk management into four functions: Govern, Map, Measure, and Manage. Codepliant maps your AI usage to these functions automatically.",
  },
  {
    question: "How does Codepliant detect AI usage in my codebase?",
    answer:
      "Codepliant scans for AI/ML library imports (OpenAI, Anthropic, Hugging Face, TensorFlow, PyTorch, LangChain), API integrations with AI services, model files, training pipelines, prompt templates, and inference endpoints. It also checks environment variables like OPENAI_API_KEY, ANTHROPIC_API_KEY, and HUGGINGFACE_TOKEN. It builds a complete AI inventory from your source code.",
  },
  {
    question: "Does Codepliant handle EU AI Act risk classification?",
    answer:
      "Yes. Codepliant analyzes your AI use cases and maps them to the EU AI Act risk tiers (Unacceptable, High-Risk, Limited Risk, Minimal Risk). It generates the documentation required for your specific risk level, including conformity assessments for high-risk systems and Article 50 transparency notices for all AI systems.",
  },
  {
    question: "What if I use third-party AI APIs rather than training my own models?",
    answer:
      "The EU AI Act and NIST AI RMF apply to deployers of AI systems, not just developers. If you integrate OpenAI, Anthropic, or any AI API, you have governance obligations. Codepliant detects these integrations and generates appropriate documentation for AI deployers.",
  },
  {
    question: "When does the EU AI Act take effect?",
    answer:
      "The EU AI Act entered into force on August 1, 2024. Prohibited AI practices applied from February 2, 2025. Transparency obligations for all AI systems (Article 50) take effect on August 2, 2025. High-risk system obligations apply from August 2, 2026. Companies deploying AI in the EU should prepare now.",
  },
  {
    question: "Does the Colorado AI Act affect my SaaS company?",
    answer:
      "If your SaaS product uses AI to make or substantially support consequential decisions affecting Colorado residents — such as in employment, lending, insurance, housing, education, or healthcare — the Colorado AI Act (SB 24-205) applies to you. It requires algorithmic impact assessments, risk management policies, and consumer disclosures. Codepliant generates these documents from your code.",
  },
  {
    question: "What is an AI model inventory and why do I need one?",
    answer:
      "An AI model inventory is a documented catalog of every AI system and model your application uses, including model provider, version, purpose, data inputs, outputs, and risk classification. Both the EU AI Act and NIST AI RMF require organizations to maintain inventories. Codepliant generates this automatically by scanning your AI integrations.",
  },
  {
    question: "How often should I update my AI governance documentation?",
    answer:
      "AI governance documentation should be updated whenever you add, modify, or remove AI integrations — and at minimum before each release. Run Codepliant in your CI/CD pipeline to regenerate documentation on every deploy. This ensures your governance docs reflect your actual AI usage, not outdated assumptions.",
  },
];

function webPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Governance Framework Generator",
    description:
      "Generate EU AI Act and NIST AI RMF aligned governance documentation for AI-powered applications by scanning your codebase.",
    url: "https://www.codepliant.site/ai-governance",
    isPartOf: {
      "@type": "WebSite",
      name: "Codepliant",
      url: "https://www.codepliant.site",
    },
    about: {
      "@type": "Thing",
      name: "AI Governance",
      sameAs: "https://en.wikipedia.org/wiki/Regulation_of_artificial_intelligence",
    },
    specialty: "AI governance documentation for developers building AI-powered applications",
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
    name: "Codepliant AI Governance Framework Generator",
    version: "1.1.0",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "AI governance framework generator that scans your codebase and produces NIST AI RMF and EU AI Act aligned documentation.",
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
        item: "https://www.codepliant.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Governance",
        item: "https://www.codepliant.site/ai-governance",
      },
    ],
  };
}

export default function AiGovernance() {
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
            <span className="text-ink">AI Governance</span>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            AI Governance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            AI Governance Framework for SaaS
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            AI regulation is here. The EU AI Act takes effect in phases through
            2026, US states are passing their own AI laws, and enterprise buyers
            now require AI governance documentation in vendor assessments.
            Codepliant scans your codebase to detect AI services, classify risk
            levels, and generate governance documentation aligned with the EU AI
            Act, NIST AI RMF, and emerging state laws — so your team ships AI
            features responsibly.
          </p>

          {/* What AI governance means for developers */}
          <section className="mb-16" id="what-is-ai-governance">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              What AI governance means for developers
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                AI governance is the set of policies, processes, and controls
                that ensure AI systems are developed and deployed responsibly.
                For developers, this means documenting what AI systems your
                application uses, what data they process, what decisions they
                influence, and what safeguards are in place.
              </p>
              <p>
                Unlike traditional compliance (where legal teams handle
                documentation), AI governance requires engineering involvement.
                Developers know which AI APIs are integrated, what data is sent
                to model providers, whether outputs influence user-facing
                decisions, and what monitoring exists. Without developer input,
                governance documentation is guesswork.
              </p>
              <p>
                Codepliant bridges this gap by scanning your actual code to
                generate governance documentation. Instead of filling out
                questionnaires or interviewing engineers, run a single command
                to produce an accurate AI inventory, risk classifications, and
                compliance documents from evidence in your codebase.
              </p>
            </div>
          </section>

          {/* EU AI Act overview */}
          <section className="mb-16" id="eu-ai-act-overview">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              EU AI Act overview
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                The{" "}
                <a
                  href="/blog/eu-ai-act-deadline"
                  className="text-brand hover:underline"
                >
                  EU AI Act
                </a>{" "}
                is the world&apos;s first comprehensive AI regulation. It
                classifies AI systems into risk tiers and imposes obligations
                proportional to risk. The law applies to any organization that
                places AI systems on the EU market or deploys AI systems
                affecting people in the EU — regardless of where the
                organization is headquartered.
              </p>
              <p>
                Fines for non-compliance reach up to{" "}
                <strong>35 million euros or 7% of global annual turnover</strong>{" "}
                for prohibited AI practices, and up to{" "}
                <strong>15 million euros or 3% of turnover</strong> for other
                violations. For SaaS companies with EU users, compliance is not
                optional.
              </p>
            </div>

            <h3 className="text-lg font-bold tracking-tight mt-8 mb-4">
              Risk classification under the EU AI Act
            </h3>
            <div className="space-y-4">
              {[
                {
                  level: "Unacceptable Risk — Prohibited",
                  desc: "Social scoring by governments, real-time biometric identification in public spaces (with narrow exceptions), manipulation of vulnerable groups, and emotion recognition in workplaces and schools. These AI practices are banned entirely as of February 2025.",
                  color: "border-l-4 border-red-500",
                },
                {
                  level: "High Risk — Heavy obligations",
                  desc: "AI used in hiring and recruitment, credit scoring, insurance underwriting, critical infrastructure management, education assessment, law enforcement, and immigration processing. Requires conformity assessments, risk management systems, data governance, human oversight, technical documentation, and registration in the EU database.",
                  color: "border-l-4 border-orange-500",
                },
                {
                  level: "Limited Risk — Transparency obligations",
                  desc: "AI systems that interact directly with users (chatbots), generate synthetic content (deepfakes, AI-generated text), or perform emotion recognition or biometric categorization. Must disclose that users are interacting with AI and label AI-generated content.",
                  color: "border-l-4 border-yellow-500",
                },
                {
                  level: "Minimal Risk — Voluntary codes of conduct",
                  desc: "Most SaaS AI features fall here: content recommendations, search ranking, spam filtering, code completion, and internal analytics. No mandatory obligations, but transparency is recommended. Codepliant still generates Article 50 transparency notices and AI disclosure documents for best practice.",
                  color: "border-l-4 border-green-500",
                },
              ].map((tier) => (
                <div
                  key={tier.level}
                  className={`bg-surface-secondary rounded-lg p-5 ${tier.color}`}
                >
                  <h4 className="font-semibold mb-2">{tier.level}</h4>
                  <p className="text-sm text-ink-secondary">{tier.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold tracking-tight mt-8 mb-4">
              Key EU AI Act deadlines
            </h3>
            <div className="space-y-3">
              {[
                {
                  date: "February 2, 2025",
                  event: "Prohibited AI practices banned",
                },
                {
                  date: "August 2, 2025",
                  event:
                    "Transparency obligations for all AI systems (Article 50); GPAI model obligations apply",
                },
                {
                  date: "August 2, 2026",
                  event:
                    "High-risk AI system obligations fully enforceable; penalties in effect",
                },
                {
                  date: "August 2, 2027",
                  event:
                    "Obligations for high-risk AI embedded in regulated products (medical devices, vehicles, aviation)",
                },
              ].map((milestone) => (
                <div
                  key={milestone.date}
                  className="flex gap-4 bg-surface-secondary rounded-lg px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-ink whitespace-nowrap min-w-[140px]">
                    {milestone.date}
                  </span>
                  <span className="text-ink-secondary">{milestone.event}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-ink-secondary mt-6">
              For a detailed breakdown of the EU AI Act and what it means for
              your engineering team, read our{" "}
              <a
                href="/blog/eu-ai-act-deadline"
                className="text-brand hover:underline"
              >
                EU AI Act developer guide
              </a>
              .
            </p>
          </section>

          {/* NIST AI RMF alignment */}
          <section className="mb-16" id="nist-ai-rmf">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              NIST AI RMF alignment
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed mb-6">
              <p>
                The NIST AI Risk Management Framework (AI RMF 1.0, published
                January 2023) is the de facto US standard for AI governance. It
                is increasingly referenced in federal procurement requirements,
                state-level AI legislation like the{" "}
                <a
                  href="/blog/colorado-ai-act"
                  className="text-brand hover:underline"
                >
                  Colorado AI Act
                </a>
                , and enterprise vendor assessments. Codepliant maps your AI
                usage to all four NIST AI RMF functions.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "GOVERN — Establish AI policies",
                  desc: "Define organizational AI governance policies. Codepliant generates an AI acceptable use policy, model governance charter, and role-responsibility matrix based on the AI systems detected in your code.",
                },
                {
                  title: "MAP — Identify and categorize AI systems",
                  desc: "Catalog all AI usage in your application. Codepliant creates a model inventory, maps AI features to EU AI Act risk tiers, and documents intended use cases and known limitations.",
                },
                {
                  title: "MEASURE — Assess AI risks",
                  desc: "Quantify risks associated with your AI systems. Codepliant generates risk assessments covering bias, reliability, transparency, privacy, and security for each detected AI integration.",
                },
                {
                  title: "MANAGE — Mitigate and monitor",
                  desc: "Implement ongoing risk management. Codepliant documents your monitoring setup, logging configurations, and human oversight mechanisms for AI-powered features.",
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

          {/* How Codepliant detects AI services */}
          <section className="mb-16" id="ai-detection">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              How Codepliant detects AI services and generates compliance
              documents
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                Codepliant performs static analysis across your entire codebase
                to identify AI integrations. It scans source code imports,
                dependency manifests, environment variables, and configuration
                files to build a complete picture of your AI usage.
              </p>
            </div>

            <div className="mt-8 mb-6">
              <h3 className="font-semibold mb-4">
                AI services and patterns Codepliant detects
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
                        category: "LLM Providers",
                        services:
                          "OpenAI (GPT-4, o1), Anthropic (Claude), Google AI (Gemini), Cohere, Mistral, Groq",
                      },
                      {
                        category: "ML Frameworks",
                        services:
                          "TensorFlow, PyTorch, Hugging Face Transformers, scikit-learn, JAX, ONNX Runtime",
                      },
                      {
                        category: "AI Orchestration",
                        services:
                          "LangChain, LlamaIndex, Semantic Kernel, AutoGen, CrewAI, Haystack",
                      },
                      {
                        category: "AI Infrastructure",
                        services:
                          "Replicate, Baseten, Modal, AWS SageMaker, Azure ML, Vertex AI",
                      },
                      {
                        category: "Vector Databases",
                        services:
                          "Pinecone, Weaviate, Qdrant, Chroma, Milvus, pgvector",
                      },
                      {
                        category: "AI APIs",
                        services:
                          "Stability AI, ElevenLabs, AssemblyAI, Deepgram, Whisper, DALL-E",
                      },
                      {
                        category: "Env Variables",
                        services:
                          "OPENAI_API_KEY, ANTHROPIC_API_KEY, HUGGINGFACE_TOKEN, GOOGLE_AI_KEY, COHERE_API_KEY",
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
                Once Codepliant identifies your AI integrations, it
                automatically classifies each one against the EU AI Act risk
                tiers based on use case context. It then generates the
                governance documents required for your risk level — from
                minimal-risk transparency notices to high-risk conformity
                assessment packages.
              </p>
              <p>
                Because the documents are generated from code, they stay
                accurate as your AI integrations evolve. Add a new LLM
                provider, swap out a vector database, or integrate a new AI
                API — run Codepliant again and your governance documentation
                updates automatically. Run it in CI/CD to regenerate on every
                deploy.
              </p>
            </div>
          </section>

          {/* Documents generated */}
          <section className="mb-16" id="generated-docs">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              AI governance documents Codepliant generates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "AI Model Inventory",
                "AI Risk Assessment",
                "AI Acceptable Use Policy",
                "Transparency Notice (Art. 50)",
                "AI Disclosure Statement",
                "Model Governance Charter",
                "Bias & Fairness Report",
                "Human Oversight Documentation",
                "AI Data Governance Plan",
                "Conformity Assessment (High-Risk)",
                "Algorithmic Impact Assessment",
                "AI Incident Response Plan",
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

          {/* AI governance checklist */}
          <section className="mb-16" id="ai-governance-checklist">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              AI governance checklist for SaaS companies
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Use this checklist to evaluate your organization&apos;s AI
              governance readiness. Codepliant automates detection of many of
              these items from your code.
            </p>

            <div className="space-y-6">
              {[
                {
                  heading: "AI inventory & classification",
                  items: [
                    "All AI systems and models documented in a central inventory",
                    "Each AI system classified by EU AI Act risk tier",
                    "Model providers, versions, and update cadences recorded",
                    "Intended use cases and known limitations documented",
                    "Data inputs and outputs for each AI system cataloged",
                  ],
                },
                {
                  heading: "Risk management",
                  items: [
                    "AI risk assessment completed for each system",
                    "Bias and fairness evaluation performed",
                    "Reliability and accuracy metrics defined and monitored",
                    "Adversarial robustness and security risks assessed",
                    "Risk mitigation measures documented and implemented",
                  ],
                },
                {
                  heading: "Transparency & disclosure",
                  items: [
                    "Users informed when interacting with AI systems",
                    "AI-generated content labeled appropriately",
                    "Article 50 transparency notices published",
                    "AI disclosure statement available to users and regulators",
                    "Data subjects informed about automated decision-making (GDPR Art. 22)",
                  ],
                },
                {
                  heading: "Human oversight",
                  items: [
                    "Human-in-the-loop defined for consequential AI decisions",
                    "Override mechanisms in place for automated outputs",
                    "Escalation procedures documented for AI failures",
                    "AI outputs reviewed before affecting rights or opportunities",
                    "Staff trained on AI system limitations and failure modes",
                  ],
                },
                {
                  heading: "Data governance",
                  items: [
                    "Training data sources documented and assessed for quality",
                    "Data sent to AI providers identified and minimized",
                    "Data retention policies defined for AI inputs and outputs",
                    "Personal data in AI pipelines compliant with GDPR/privacy laws",
                    "Data Processing Agreements in place with AI model providers",
                  ],
                },
                {
                  heading: "Monitoring & incident response",
                  items: [
                    "AI system performance monitored in production",
                    "Logging in place for AI inputs, outputs, and decisions",
                    "Drift detection for model accuracy and fairness over time",
                    "AI incident response plan documented and tested",
                    "Feedback mechanisms for users to report AI errors",
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

          {/* Why now */}
          <section className="mb-16" id="why-now">
            <h2 className="text-2xl font-bold tracking-tight mb-6 scroll-mt-24">
              Why AI governance matters now
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                The EU AI Act&apos;s transparency obligations (Article 50) take
                effect on August 2, 2025. High-risk system requirements follow
                in August 2026. Companies deploying AI systems in the EU —
                including SaaS products accessible to EU users — must comply
                or face fines up to 7% of global annual turnover.
              </p>
              <p>
                In the US, state-level AI legislation is accelerating. The{" "}
                <a
                  href="/blog/colorado-ai-act"
                  className="text-brand hover:underline"
                >
                  Colorado AI Act
                </a>{" "}
                (SB 24-205) requires algorithmic impact assessments and risk
                management policies for AI systems making consequential
                decisions. Other states including Illinois, Texas, and
                California are advancing similar bills. Companies that build
                governance frameworks now will be prepared as these laws take
                effect.
              </p>
              <p>
                Beyond regulation, AI governance is becoming a competitive
                requirement. Enterprise buyers now include AI governance in
                vendor assessments and security questionnaires. SOC 2 auditors
                are asking about AI risk management. Investors expect AI
                governance documentation before funding. Early adopters gain a
                measurable advantage in enterprise sales cycles.
              </p>
              <p>
                Codepliant makes AI governance practical for engineering teams.
                Instead of hiring a dedicated AI governance officer or engaging
                a consulting firm, run a single command to generate
                framework-aligned documentation from your actual AI
                implementation.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-lg p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your AI governance framework
            </h2>
            <p className="text-ink-secondary text-sm mb-6 max-w-md mx-auto">
              One command detects your AI integrations, classifies risk levels,
              and generates governance documentation aligned with the EU AI Act
              and NIST AI RMF. Free, open source, no account required.
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

          {/* Related resources */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "EU AI Act Developer Guide",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Everything developers need to know about the EU AI Act deadlines, risk tiers, and compliance requirements.",
                },
                {
                  title: "Colorado AI Act Guide",
                  href: "/blog/colorado-ai-act",
                  desc: "What SaaS companies need to know about the Colorado AI Act and algorithmic impact assessments.",
                },
                {
                  title: "Data Privacy Compliance Hub",
                  href: "/data-privacy",
                  desc: "Overview of all compliance frameworks Codepliant supports, including GDPR, HIPAA, and SOC 2.",
                },
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "GDPR documentation automation for applications that process personal data.",
                },
                {
                  title: "SOC 2 Compliance Tool",
                  href: "/soc2-compliance",
                  desc: "SOC 2 readiness checklists and control mappings for startups.",
                },
                {
                  title: "HIPAA Compliance Tool",
                  href: "/hipaa-compliance",
                  desc: "HIPAA documentation automation for AI-powered healthcare applications handling PHI.",
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
