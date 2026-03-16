import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU AI Act Compliance Tool — AI Disclosure Generator",
  description:
    "Generate EU AI Act Article 50 compliant AI disclosures from your codebase. Detect OpenAI, Anthropic, Hugging Face, and other AI integrations automatically. Deadline: August 2, 2026.",
  alternates: {
    canonical: "https://codepliant.dev/ai-disclosure-generator",
  },
  openGraph: {
    title: "EU AI Act Compliance Tool — AI Disclosure Generator",
    description:
      "Generate AI disclosures required by EU AI Act Article 50. Scans your code for AI integrations.",
    url: "https://codepliant.dev/ai-disclosure-generator",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EU AI Act Compliance Tool — AI Disclosure Generator",
    description: "AI disclosure generator for EU AI Act Article 50 compliance.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is Article 50 of the EU AI Act?",
    answer:
      "Article 50 of the EU AI Act establishes transparency obligations for providers and deployers of AI systems. It requires that users are informed when they are interacting with AI, when content is AI-generated, and when AI systems are used for decision-making that affects them.",
  },
  {
    question: "When does Article 50 take effect?",
    answer:
      "Article 50 transparency obligations take effect on August 2, 2026. Organizations using AI in products or services available to EU citizens must comply by this date.",
  },
  {
    question: "Does the EU AI Act apply to my application?",
    answer:
      "If your application uses AI and is accessible to users in the EU, you likely need to comply. This includes chatbots, AI-generated content, recommendation systems, automated decision-making, and any feature powered by large language models like GPT-4, Claude, or open source models.",
  },
  {
    question: "What AI integrations does Codepliant detect?",
    answer:
      "Codepliant detects OpenAI API, Anthropic Claude, Google AI/Gemini, Hugging Face, Replicate, Cohere, AI21 Labs, Stability AI, local model inference (ONNX, TensorFlow, PyTorch), LangChain, and other AI/ML frameworks in your codebase.",
  },
  {
    question: "What documents does Codepliant generate for AI compliance?",
    answer:
      "Codepliant generates AI Disclosure documents, AI Checklists, AI Model Cards, and includes AI-related sections in your privacy policy. These documents cover Article 50 requirements including transparency notices, capability descriptions, and risk assessments.",
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
      "Generate EU AI Act Article 50 compliant AI disclosures by scanning your codebase for AI integrations.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

function getCountdown() {
  const deadline = new Date("2026-08-02T00:00:00Z");
  const now = new Date("2026-03-15T00:00:00Z");
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

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <div className="bg-urgency-muted text-urgency rounded-2xl p-6 text-center mb-12">
            <div className="text-5xl font-bold mb-1">{daysLeft}</div>
            <div className="text-sm font-medium">
              days until EU AI Act Article 50 takes effect
            </div>
            <div className="text-xs mt-1 opacity-70">August 2, 2026</div>
          </div>

          <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
            EU AI Act Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            EU AI Act Compliance Tool — AI Disclosure Generator
          </h1>
          <p className="text-lg text-muted mb-12">
            Article 50 of the EU AI Act requires transparency when users
            interact with AI systems. Codepliant scans your codebase, detects AI
            integrations, and generates the required disclosure documents
            automatically.
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Article 50 requirements explained
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                The EU AI Act is the world&apos;s first comprehensive AI
                regulation. Article 50 specifically addresses transparency
                obligations that apply to a wide range of AI systems, not just
                high-risk ones.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "AI interaction disclosure",
                    desc: "Users must be informed when they are interacting with an AI system (e.g., chatbots, virtual assistants). The disclosure must be clear, timely, and in a format the user can understand.",
                  },
                  {
                    title: "AI-generated content labeling",
                    desc: "Content generated or manipulated by AI (text, images, audio, video) must be marked as such. This applies to deepfakes, synthetic media, and AI-written content.",
                  },
                  {
                    title: "Emotion recognition & biometric categorization",
                    desc: "Systems that use emotion recognition or biometric categorization must inform the individuals being analyzed.",
                  },
                  {
                    title: "Automated decision-making",
                    desc: "When AI is used to make or assist decisions that affect individuals, transparency about the AI's role is required.",
                  },
                ].map((req) => (
                  <div key={req.title} className="bg-surface rounded-xl p-5">
                    <h3 className="font-semibold text-foreground mb-2">
                      {req.title}
                    </h3>
                    <p className="text-sm">{req.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              AI integrations we detect
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
                "Stability AI",
                "TensorFlow / PyTorch / ONNX",
                "Custom ML model inference",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-surface rounded-xl px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Documents generated for AI compliance
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "AI Disclosure",
                  desc: "User-facing transparency notice about AI usage in your application.",
                },
                {
                  name: "AI Checklist",
                  desc: "Internal compliance checklist covering Article 50 requirements.",
                },
                {
                  name: "AI Model Card",
                  desc: "Technical documentation of AI models used, their capabilities, and limitations.",
                },
                {
                  name: "Privacy Policy (AI sections)",
                  desc: "AI-specific data processing disclosures integrated into your privacy policy.",
                },
              ].map((doc) => (
                <div key={doc.name} className="bg-surface rounded-xl p-5">
                  <div className="font-semibold mb-1">{doc.name}</div>
                  <p className="text-sm text-muted">{doc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Prepare for August 2, 2026
            </h2>
            <p className="text-muted text-sm mb-6">
              Scan your codebase for AI integrations and generate disclosure
              documents today.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted leading-relaxed">
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
