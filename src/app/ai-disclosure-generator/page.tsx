import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI Disclosure Generator | EU AI Act Article 50 Compliance | Codepliant",
  description:
    "AI disclosure generator for EU AI Act Article 50 compliance. Scans your code to detect AI integrations and generates transparency documents. Deadline: Aug 2026.",
  keywords: [
    "AI disclosure generator",
    "EU AI Act compliance",
    "AI Act Article 50",
    "AI transparency disclosure",
    "AI disclosure template",
    "EU AI Act disclosure",
    "AI compliance tool",
    "AI Act transparency obligations",
    "AI disclosure for developers",
    "automated AI disclosure",
    "AI disclosure generator for SaaS",
    "EU AI Act deadline 2026",
    "Article 50 AI Act",
    "AI system transparency",
  ],
  alternates: {
    canonical: "https://codepliant.dev/ai-disclosure-generator",
  },
  openGraph: {
    title: "AI Disclosure Generator | EU AI Act Article 50 Compliance",
    description:
      "AI disclosure generator for EU AI Act Article 50 compliance. Scans your code to detect AI integrations and generates transparency documents. Deadline: Aug 2026.",
    url: "https://codepliant.dev/ai-disclosure-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Disclosure Generator | EU AI Act Article 50 Compliance",
    description:
      "AI disclosure generator that detects AI services in your code and generates transparency documents for EU AI Act compliance.",
  },
};

const faqs = [
  {
    question: "What is Article 50 of the EU AI Act?",
    answer:
      "Article 50 of the EU AI Act establishes transparency obligations for providers and deployers of AI systems. It requires that users are informed when they are interacting with AI, when content is AI-generated, and when AI systems are used for decision-making that affects them. These obligations apply broadly — not just to high-risk AI systems.",
  },
  {
    question: "When does Article 50 take effect?",
    answer:
      "Article 50 transparency obligations take effect on August 2, 2026. Organizations using AI in products or services available to EU citizens must comply by this date. This applies regardless of where your company is headquartered — if EU residents use your product, you must comply.",
  },
  {
    question: "Does the EU AI Act apply to my application?",
    answer:
      "If your application uses AI and is accessible to users in the EU, you likely need to comply. This includes chatbots, AI-generated content, recommendation systems, automated decision-making, and any feature powered by large language models like GPT-4, Claude, or open source models. The Act has extraterritorial scope similar to GDPR.",
  },
  {
    question: "What AI integrations does Codepliant detect?",
    answer:
      "Codepliant detects OpenAI API (GPT-4, DALL-E, Whisper), Anthropic Claude, Google AI/Gemini, Hugging Face Transformers, Replicate, Cohere, AI21 Labs, Stability AI, local model inference (ONNX, TensorFlow, PyTorch), LangChain, LlamaIndex, and other AI/ML frameworks in your codebase. Detection covers dependencies, source code imports, and environment variables.",
  },
  {
    question: "What documents does Codepliant generate for AI compliance?",
    answer:
      "Codepliant generates AI Disclosure documents (user-facing transparency notices), AI Checklists (internal compliance checklists), AI Model Cards (technical documentation of AI models used), and AI-specific sections in your privacy policy. Together these cover Article 50 requirements including transparency notices, capability descriptions, and risk assessments.",
  },
  {
    question: "What penalties apply for non-compliance with Article 50?",
    answer:
      "Non-compliance with EU AI Act transparency obligations can result in fines up to 15 million EUR or 3% of global annual turnover, whichever is higher. For comparison, GDPR fines cap at 20 million EUR or 4% of turnover. National market surveillance authorities in each EU member state will enforce these requirements.",
  },
  {
    question: "Is the AI disclosure generator free?",
    answer:
      "Yes. Codepliant is open source (MIT licensed) and completely free. Run npx codepliant go in your project directory and all compliance documents — including AI disclosures — are generated locally. No account, no API key, no network calls.",
  },
  {
    question:
      "How is this different from manually writing an AI disclosure?",
    answer:
      "Manually writing an AI disclosure requires you to know every AI integration in your codebase, understand what Article 50 requires for each type, and keep the document updated as your stack changes. Codepliant automates all three: it detects AI services from your code, maps them to Article 50 requirements, and regenerates when your dependencies change.",
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
    name: "Codepliant AI Disclosure Generator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "AI disclosure generator that scans your codebase for AI integrations and generates EU AI Act Article 50 compliant transparency documents. Detects OpenAI, Anthropic, Google AI, Hugging Face, and other AI services automatically.",
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
        name: "AI Disclosure Generator",
        item: "https://codepliant.dev/ai-disclosure-generator",
      },
    ],
  };
}

function getCountdown() {
  const deadline = new Date("2026-08-02T00:00:00Z");
  const now = new Date("2026-03-17T00:00:00Z");
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AiDisclosureGenerator() {
  const daysLeft = getCountdown();

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
                AI Disclosure Generator
              </li>
            </ol>
          </nav>

          {/* Countdown banner */}
          <div className="bg-urgency-muted text-urgency rounded-2xl p-6 text-center mb-12">
            <div className="text-5xl font-bold mb-1">{daysLeft}</div>
            <div className="text-sm font-medium">
              days until EU AI Act Article 50 takes effect
            </div>
            <div className="text-xs mt-1 opacity-70">August 2, 2026</div>
          </div>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            EU AI Act Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            AI Disclosure Generator for Developers
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            The EU AI Act requires transparency when users interact with AI
            systems. Most teams do not know which of their dependencies
            trigger disclosure obligations. Codepliant scans your codebase,
            detects every AI integration, and generates the required
            disclosure documents automatically.
          </p>

          {/* Why AI disclosure is mandatory by Aug 2, 2026 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Why AI disclosure is mandatory by August 2, 2026
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                The EU AI Act (Regulation 2024/1689) entered into force on
                August 1, 2024. Article 50 transparency obligations apply
                from August 2, 2026 — regardless of your AI system&apos;s
                risk classification. Unlike the high-risk provisions that
                take effect later, transparency applies to almost every
                application that uses AI in any form.
              </p>
              <p>
                The Act has extraterritorial scope. If your product is
                accessible to people in the EU, you must comply — even if
                your company is based in the US, UK, or elsewhere. This
                mirrors GDPR&apos;s approach and means most SaaS products,
                mobile apps, and web applications with AI features fall
                within scope.
              </p>
              <div className="border border-border rounded-xl px-5 py-4">
                <h3 className="font-semibold text-sm text-ink mb-2">
                  Penalties for non-compliance
                </h3>
                <p className="text-sm">
                  Fines for transparency violations can reach up to{" "}
                  <strong className="text-ink">15 million EUR</strong> or{" "}
                  <strong className="text-ink">
                    3% of global annual turnover
                  </strong>
                  , whichever is higher. National market surveillance
                  authorities in each EU member state are responsible for
                  enforcement.
                </p>
              </div>
            </div>
          </section>

          {/* What an AI disclosure must contain */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              What an AI disclosure must contain (Article 50)
            </h2>
            <p className="text-ink-secondary mb-6">
              Article 50 defines specific transparency obligations depending
              on how AI is used in your application. Every AI disclosure must
              address the relevant requirements below:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "AI interaction notification",
                  desc: "Users must be informed, clearly and before interaction begins, that they are communicating with an AI system. This covers chatbots, virtual assistants, AI-powered support, and any interface where a user might reasonably believe they are interacting with a human (Art. 50(1)).",
                },
                {
                  title: "AI-generated content marking",
                  desc: "Text, images, audio, and video generated or substantially modified by AI must be labeled as AI-generated. This includes deepfakes, synthetic media, AI-written articles, and AI-generated code. The marking must be machine-readable where technically feasible (Art. 50(2)).",
                },
                {
                  title: "Emotion recognition and biometric disclosure",
                  desc: "If your system uses emotion recognition or biometric categorization, you must inform individuals that such processing is taking place and explain its purpose. This applies even when the system is not classified as high-risk (Art. 50(3)).",
                },
                {
                  title: "AI capabilities and limitations",
                  desc: "Deployers must provide information about what the AI system can and cannot do, including known limitations, accuracy levels, and potential failure modes. This helps users form appropriate expectations about AI-generated outputs.",
                },
                {
                  title: "Purpose and scope of AI use",
                  desc: "A clear statement of why AI is used, what data it processes, and the scope of decisions it influences. If AI assists in decisions affecting individuals (hiring, credit, content moderation), the AI's role must be specifically disclosed.",
                },
                {
                  title: "Human oversight mechanisms",
                  desc: "Where relevant, disclosures should describe what human oversight exists over AI outputs — whether AI suggestions are reviewed by humans, how users can request human review, and how errors are corrected.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-xl px-5 py-4"
                >
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-ink-secondary text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-ink-secondary text-sm mt-4">
              The specific obligations that apply depend on how AI is used in
              your application. A chatbot requires interaction disclosure. An
              AI image generator requires content marking. A product using
              both needs both. Codepliant detects which obligations apply
              based on the AI services it finds in your code.
            </p>
          </section>

          {/* How Codepliant detects AI services */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              How Codepliant detects AI services and generates disclosures
            </h2>
            <p className="text-ink-secondary mb-6">
              Instead of asking you to list your AI integrations, Codepliant
              reads your codebase and finds them. Here is what happens when
              you run the CLI:
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Scan dependencies for AI packages",
                  desc: "Codepliant reads your package.json, requirements.txt, go.mod, Cargo.toml, or equivalent and matches against known AI service packages — openai, @anthropic-ai/sdk, @google/generative-ai, transformers, langchain, replicate, and dozens more.",
                },
                {
                  step: "2",
                  title: "Scan source code imports",
                  desc: "Dependencies alone miss some AI integrations. Codepliant also scans your source files for import and require statements that reference AI libraries, catching direct API calls and vendored modules that are not listed as top-level dependencies.",
                },
                {
                  step: "3",
                  title: "Scan environment variables",
                  desc: "AI services require API keys. Codepliant scans your .env files and configuration for patterns like OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_AI_KEY, HUGGING_FACE_TOKEN, and REPLICATE_API_TOKEN to detect services even when the SDK is abstracted away.",
                },
                {
                  step: "4",
                  title: "Map detections to Article 50 obligations",
                  desc: "Each detected AI service is categorized by type: conversational AI, content generation, image generation, speech-to-text, embeddings, model inference. Each type maps to specific Article 50 transparency obligations — chatbot detection triggers interaction disclosure requirements, image AI triggers content marking requirements.",
                },
                {
                  step: "5",
                  title: "Generate disclosure documents",
                  desc: "Codepliant produces an AI Disclosure (user-facing transparency notice), an AI Checklist (internal compliance checklist), an AI Model Card (technical documentation), and AI-specific sections for your privacy policy. Every document names the specific services found in your code.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-ink-secondary text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI integrations we detect */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              AI integrations Codepliant detects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "OpenAI API (GPT-4, DALL-E, Whisper)",
                "Anthropic Claude",
                "Google AI / Gemini",
                "Hugging Face Transformers",
                "LangChain / LlamaIndex",
                "Replicate",
                "Cohere",
                "AI21 Labs",
                "Stability AI (Stable Diffusion)",
                "Mistral AI",
                "TensorFlow / Keras",
                "PyTorch",
                "ONNX Runtime",
                "Custom ML model inference",
                "Vector databases (Pinecone, Weaviate)",
                "Embedding APIs",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-surface-secondary rounded-xl px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Before/After comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              No disclosure vs. Codepliant-generated
            </h2>
            <p className="text-ink-secondary mb-6">
              Here is what most applications look like today versus what
              Article 50 requires — shown for a Next.js app using OpenAI for
              chat, DALL-E for image generation, and Anthropic Claude for
              content summarization.
            </p>

            <div className="space-y-6">
              {/* Before: No disclosure */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <div className="bg-surface-secondary px-5 py-3 border-b border-border flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-ink-secondary">
                    Typical application — no AI disclosure
                  </span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3 font-mono text-ink-secondary leading-relaxed">
                  <p className="italic">
                    No AI disclosure exists. Users interact with AI-powered
                    chat without knowing it is AI. AI-generated images are
                    displayed without labels. Summaries produced by Claude
                    appear as if written by the platform. The privacy policy
                    mentions &quot;automated processing&quot; but does not
                    name any AI systems or describe their capabilities.
                  </p>
                  <p className="text-xs opacity-60 mt-2">
                    This is the current state for the majority of applications
                    using AI APIs.
                  </p>
                </div>
              </div>

              {/* After: Codepliant-generated */}
              <div className="border-2 border-brand rounded-2xl overflow-hidden">
                <div className="bg-brand/5 px-5 py-3 border-b border-brand/20 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand" />
                  <span className="text-sm font-medium text-brand">
                    Codepliant-generated AI disclosure
                  </span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3 font-mono text-ink-secondary leading-relaxed">
                  <p>
                    <span className="text-ink-primary font-semibold">
                      AI Systems Used in This Application
                    </span>
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Conversational AI (via OpenAI GPT-4):
                    </strong>{" "}
                    Our chat feature is powered by OpenAI&apos;s GPT-4 model.
                    When you use chat, your messages are processed by this AI
                    system. Responses are generated by AI, not written by
                    humans. The AI may produce inaccurate or incomplete
                    information.
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      AI Image Generation (via OpenAI DALL-E):
                    </strong>{" "}
                    Images created through our platform are generated by
                    OpenAI&apos;s DALL-E model. All AI-generated images are
                    labeled as such and include machine-readable metadata per
                    Art. 50(2).
                  </p>
                  <p>
                    <strong className="text-ink-primary">
                      Content Summarization (via Anthropic Claude):
                    </strong>{" "}
                    Article summaries and content digests are produced by
                    Anthropic&apos;s Claude model. These summaries are
                    AI-generated and may not capture all nuances of the source
                    material.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Human Oversight
                    </span>
                  </p>
                  <p>
                    AI-generated content is not reviewed by humans before
                    display. Users can report inaccurate AI outputs via the
                    feedback button. Our team reviews flagged content within 48
                    hours.
                  </p>
                  <p>
                    <span className="text-ink-primary font-semibold">
                      Data Processing
                    </span>
                  </p>
                  <p>
                    Chat messages are sent to OpenAI, Inc. (San Francisco,
                    CA). Content for summarization is sent to Anthropic, PBC
                    (San Francisco, CA). International transfers are governed
                    by Standard Contractual Clauses (SCCs). See our Privacy
                    Policy for details.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-secondary rounded-xl px-5 py-4">
              <p className="text-sm text-ink-secondary">
                <strong className="text-ink-primary">The difference:</strong>{" "}
                Without a disclosure, users have no idea they are interacting
                with AI — a direct violation of Article 50(1). Codepliant
                names each AI system, describes what it does, acknowledges
                limitations, identifies the provider companies, and discloses
                data transfers. It generates this from what it finds in your
                code, not from a questionnaire.
              </p>
            </div>
          </section>

          {/* Documents generated */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Documents generated for AI compliance
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "AI Disclosure",
                  desc: "User-facing transparency notice listing every AI system, its purpose, capabilities, limitations, and the provider. Designed to satisfy Article 50 interaction and content labeling requirements.",
                },
                {
                  name: "AI Checklist",
                  desc: "Internal compliance checklist mapping each detected AI integration to specific Article 50 obligations. Helps your team verify that all transparency requirements are met before the August 2026 deadline.",
                },
                {
                  name: "AI Model Card",
                  desc: "Technical documentation of AI models used — their capabilities, training data provenance (where known), performance characteristics, and known limitations. Useful for internal governance and audits.",
                },
                {
                  name: "Privacy Policy (AI sections)",
                  desc: "AI-specific data processing disclosures integrated into your privacy policy — which AI providers receive user data, what data is sent, how it is processed, and international transfer mechanisms.",
                },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="bg-surface-secondary rounded-xl p-5"
                >
                  <div className="font-semibold mb-1">{doc.name}</div>
                  <p className="text-sm text-ink-secondary">{doc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your AI disclosure before August 2, 2026
            </h2>
            <p className="text-ink-secondary text-sm mb-2 max-w-md mx-auto">
              Scan your codebase for AI integrations and generate Article 50
              compliant disclosure documents. Names your actual AI services,
              maps transparency obligations, and produces ready-to-publish
              documents.
            </p>
            <p className="text-ink-secondary text-xs mb-6">
              Free, open source, no account required. Works offline.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-sm mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-ink-secondary text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related resources */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Privacy Policy Generator",
                  href: "/privacy-policy-generator",
                  desc: "Generate privacy policies from your actual codebase, including AI data processing disclosures.",
                },
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "Full GDPR documentation suite from code scanning.",
                },
                {
                  title: "Terms of Service Generator",
                  href: "/terms-of-service-generator",
                  desc: "Generate ToS with AI-specific clauses for liability and IP ownership.",
                },
                {
                  title: "Data Privacy Hub",
                  href: "/data-privacy",
                  desc: "Overview of global privacy regulations and compliance requirements.",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block border border-border rounded-xl px-5 py-4 hover:border-brand transition-colors"
                >
                  <h3 className="font-semibold text-sm mb-1">{link.title}</h3>
                  <p className="text-ink-secondary text-sm">{link.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
