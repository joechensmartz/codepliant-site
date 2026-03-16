import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Governance Framework for SaaS",
  description:
    "Generate AI governance frameworks aligned with NIST AI RMF and the EU AI Act. Codepliant scans your codebase to build AI risk management documentation, model inventories, and transparency reports.",
  alternates: {
    canonical: "https://codepliant.dev/ai-governance",
  },
  openGraph: {
    title: "AI Governance Framework for SaaS",
    description:
      "AI governance framework generator aligned with NIST AI RMF and EU AI Act. AI risk management documentation from your code.",
    url: "https://codepliant.dev/ai-governance",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Governance Framework for SaaS",
    description:
      "Generate AI governance frameworks from your codebase. NIST AI RMF and EU AI Act aligned.",
    images: ["/og-image.png"],
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
      "Codepliant scans for AI/ML library imports (OpenAI, Anthropic, Hugging Face, TensorFlow, PyTorch, LangChain), API integrations with AI services, model files, training pipelines, prompt templates, and inference endpoints. It builds a complete AI inventory from your source code.",
  },
  {
    question: "Does Codepliant handle EU AI Act risk classification?",
    answer:
      "Yes. Codepliant analyzes your AI use cases and maps them to the EU AI Act risk tiers (Unacceptable, High-Risk, Limited Risk, Minimal Risk). It generates the documentation required for your specific risk level, including conformity assessments for high-risk systems.",
  },
  {
    question: "What if I use third-party AI APIs rather than training my own models?",
    answer:
      "The EU AI Act and NIST AI RMF apply to deployers of AI systems, not just developers. If you integrate OpenAI, Anthropic, or any AI API, you have governance obligations. Codepliant detects these integrations and generates appropriate documentation for AI deployers.",
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
    name: "Codepliant AI Governance Framework Generator",
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

export default function AiGovernance() {
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
          <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
            AI Governance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            AI Governance Framework for SaaS
          </h1>
          <p className="text-lg text-muted mb-12">
            AI regulation is here. The EU AI Act takes effect in 2026, and the
            NIST AI Risk Management Framework is becoming the de facto standard
            in the US. Codepliant scans your codebase to detect AI usage, classify
            risk levels, and generate governance documentation aligned with both
            frameworks — so your team ships AI features responsibly.
          </p>

          {/* Framework alignment */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              NIST AI RMF + EU AI Act alignment
            </h2>
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
                <div key={item.title} className="bg-surface rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* EU AI Act specifics */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              EU AI Act compliance by risk level
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                The EU AI Act categorizes AI systems into risk tiers, each with
                different obligations. Codepliant analyzes your AI integrations
                and determines which tier applies to your use case:
              </p>
              <div className="space-y-4">
                {[
                  {
                    level: "Minimal Risk",
                    desc: "Most SaaS AI features (content generation, search, recommendations). Requires transparency disclosures. Codepliant generates Article 50 transparency notices and AI usage disclosures.",
                  },
                  {
                    level: "Limited Risk",
                    desc: "AI systems that interact directly with users (chatbots, deepfake generators). Requires user notification. Codepliant generates interaction disclosure notices and chatbot labeling documentation.",
                  },
                  {
                    level: "High-Risk",
                    desc: "AI in hiring, credit scoring, critical infrastructure, education, and law enforcement. Requires conformity assessments, risk management systems, and human oversight. Codepliant generates the full documentation package.",
                  },
                ].map((tier) => (
                  <div key={tier.level} className="bg-surface rounded-xl p-5">
                    <h3 className="font-semibold mb-2">{tier.level}</h3>
                    <p className="text-sm text-muted">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Documents generated */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
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
              ].map((doc) => (
                <div
                  key={doc}
                  className="bg-surface rounded-xl px-4 py-3 text-sm"
                >
                  {doc}
                </div>
              ))}
            </div>
          </section>

          {/* Why now */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Why AI governance matters now
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                The EU AI Act&apos;s transparency obligations (Article 50) take
                effect on August 2, 2026. Companies deploying AI systems in the
                EU — including SaaS products accessible to EU users — must
                comply or face fines up to 3% of global annual turnover.
              </p>
              <p>
                In the US, the NIST AI RMF is increasingly referenced in
                federal procurement requirements and state-level AI
                legislation. Companies that adopt AI governance frameworks
                early gain a competitive advantage in enterprise sales, where
                buyers now include AI governance in vendor assessments.
              </p>
              <p>
                Codepliant makes AI risk management practical for engineering
                teams. Instead of hiring a dedicated AI governance officer or
                engaging a consulting firm, run a single command to generate
                framework-aligned documentation from your actual AI
                implementation.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Generate your AI governance framework
            </h2>
            <p className="text-muted text-sm mb-6">
              Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
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
