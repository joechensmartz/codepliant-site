import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
  description:
    "Comprehensive developer guide to the EU AI Act deadline on August 2, 2026. Understand risk classifications, transparency obligations, compliance requirements, and how to prepare your AI-powered application.",
  alternates: {
    canonical: "https://codepliant.dev/blog/eu-ai-act-deadline",
  },
  openGraph: {
    title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "The EU AI Act deadline is approaching. This developer guide covers everything you need to know about compliance.",
    url: "https://codepliant.dev/blog/eu-ai-act-deadline",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "Comprehensive AI Act developer guide. Risk tiers, deadlines, transparency rules, and compliance steps.",
    images: ["/og-image.png"],
  },
};

function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "Comprehensive developer guide to the EU AI Act. Risk classifications, transparency obligations, compliance timelines, and practical preparation steps.",
    datePublished: "2026-03-15",
    dateModified: "2026-03-15",
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
    ],
  };
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

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
            Blog
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            EU AI Act: What Developers Need to Know Before August 2, 2026
          </h1>
          <p className="text-sm text-muted mb-12">
            Published March 15, 2026 &middot; 12 min read
          </p>

          <div className="prose-custom space-y-6 text-base text-muted leading-relaxed">
            {/* Introduction */}
            <p>
              The EU AI Act is the world&apos;s first comprehensive legal
              framework for artificial intelligence. If you build software that
              uses AI — and in 2026, that means most SaaS products — you need
              to understand what the Act requires and when those requirements
              kick in. The most immediately relevant deadline for developers is
              August 2, 2026, when Article 50 transparency obligations become
              enforceable.
            </p>
            <p>
              This guide covers everything developers need to know: the
              regulatory timeline, risk classification system, specific
              obligations by risk tier, practical compliance steps, and what
              happens if you do not comply. Whether you are integrating OpenAI
              APIs, running fine-tuned models, or building AI features from
              scratch, this article will help you prepare.
            </p>

            {/* Timeline */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              The EU AI Act timeline: key dates for developers
            </h2>
            <p>
              The EU AI Act was published in the Official Journal of the
              European Union on July 12, 2024, and entered into force on
              August 1, 2024. But the obligations phase in gradually over
              three years:
            </p>
            <div className="space-y-4">
              {[
                {
                  date: "February 2, 2025",
                  event: "Prohibited AI practices",
                  detail:
                    "AI systems that pose unacceptable risks are banned. This includes social scoring systems, real-time biometric identification in public spaces (with exceptions), manipulation techniques that exploit vulnerabilities, and emotion recognition in workplaces and education.",
                },
                {
                  date: "August 2, 2025",
                  event: "Governance and general-purpose AI",
                  detail:
                    "National competent authorities must be designated. Rules for general-purpose AI (GPAI) models begin to apply, including transparency and copyright obligations for GPAI providers like OpenAI and Anthropic.",
                },
                {
                  date: "August 2, 2026",
                  event: "Transparency obligations (Article 50)",
                  detail:
                    "This is the critical deadline for most developers. All AI systems that interact with people, generate synthetic content, or make decisions affecting individuals must include transparency measures. If your SaaS uses AI, this applies to you.",
                },
                {
                  date: "August 2, 2027",
                  event: "High-risk AI system requirements",
                  detail:
                    "Full compliance requirements for high-risk AI systems, including conformity assessments, quality management systems, post-market monitoring, and registration in the EU database.",
                },
              ].map((milestone) => (
                <div
                  key={milestone.date}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">
                    {milestone.date} — {milestone.event}
                  </h3>
                  <p className="text-sm text-muted">{milestone.detail}</p>
                </div>
              ))}
            </div>

            {/* Risk classification */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Understanding the risk classification system
            </h2>
            <p>
              The EU AI Act takes a risk-based approach. Your obligations depend
              on which risk tier your AI system falls into. Understanding your
              classification is the first step toward compliance.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
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
              As a developer, verify that none of your AI features fall into
              this category. Most SaaS applications do not, but edge cases
              exist. For example, an AI-powered hiring tool that infers
              emotional states from video interviews could be classified as
              prohibited emotion recognition in the workplace.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
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

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Limited Risk (Transparency Obligations)
            </h3>
            <p>
              This is where most SaaS AI features land. Limited-risk systems
              are subject to Article 50 transparency obligations, effective
              August 2, 2026. These include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>AI-generated content labeling:</strong> Users must be
                informed when content (text, images, audio, video) is generated
                by AI. This applies to chatbots, AI writing assistants, image
                generators, and any feature that produces synthetic content.
              </li>
              <li>
                <strong>Chatbot disclosure:</strong> When a user interacts with
                an AI system, they must be informed they are interacting with
                AI, not a human. This includes customer support chatbots,
                virtual assistants, and AI agents.
              </li>
              <li>
                <strong>Deepfake labeling:</strong> AI-generated or manipulated
                images, audio, or video must be labeled as artificially
                generated. This includes AI avatars, voice synthesis, and image
                editing tools.
              </li>
              <li>
                <strong>Emotion recognition disclosure:</strong> If your system
                detects emotions or biometric categorization, users must be
                informed (though many emotion recognition uses are prohibited
                entirely).
              </li>
            </ul>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Minimal Risk
            </h3>
            <p>
              AI systems that pose minimal risk — spam filters, AI-powered
              search, recommendation engines, inventory management — have no
              mandatory obligations under the Act. However, the European
              Commission encourages voluntary codes of conduct for these
              systems, and best practice suggests documenting AI usage even
              when not legally required.
            </p>

            {/* What Article 50 means in practice */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              What Article 50 means in practice for your application
            </h2>
            <p>
              Article 50 is the section most relevant to SaaS developers in
              2026. Let us break down what it requires in concrete terms.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              1. Disclose AI-generated content
            </h3>
            <p>
              If your application generates text, images, audio, or video using
              AI, you must clearly inform users that the content is
              AI-generated. This applies whether you use OpenAI, Anthropic,
              Mistral, Llama, or any other AI provider.
            </p>
            <p>
              Practically, this means adding visible labels or disclosures
              near AI-generated content. A writing assistant should indicate
              which portions were AI-generated. An image generation tool must
              label outputs as AI-generated. A code assistant should
              distinguish AI suggestions from human-written code.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              2. Identify AI interactions
            </h3>
            <p>
              If your application includes a chatbot, virtual assistant, or any
              feature where AI communicates with users in natural language, you
              must inform users that they are interacting with an AI system.
              This must happen before or at the start of the interaction.
            </p>
            <p>
              A simple implementation is a banner or notice at the top of the
              chat interface stating &quot;You are interacting with an AI
              assistant.&quot; The disclosure must be clear, concise, and
              impossible to miss.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              3. Mark synthetic media
            </h3>
            <p>
              AI-generated or substantially modified images, audio, and video
              must be labeled as such. The Act requires both human-readable
              disclosures (visible labels) and machine-readable markings
              (metadata, watermarks). This means implementing both UI labeling
              and technical watermarking for any synthetic media your
              application produces.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              4. Document your AI systems
            </h3>
            <p>
              While not explicitly an Article 50 requirement, the broader AI
              Act expects organizations to maintain documentation of their AI
              systems. This includes what AI models you use, what data they
              process, what decisions they influence, and what safeguards you
              have in place. Maintaining this documentation from the start
              makes compliance with future obligations significantly easier.
            </p>

            {/* Extraterritorial scope */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
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
              <li>
                Deployers of AI systems located within the EU
              </li>
              <li>
                Providers and deployers located outside the EU, where the
                output produced by the AI system is used in the EU
              </li>
            </ul>
            <p>
              If your SaaS product is accessible to EU users and includes AI
              features, you are likely within scope. This mirrors how GDPR
              applies to any company processing data of EU residents, and
              companies that ignored GDPR&apos;s extraterritorial scope learned
              expensive lessons.
            </p>

            {/* Penalties */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
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
                  penalty: "Up to 35 million EUR or 7% of global annual turnover, whichever is higher",
                },
                {
                  violation: "High-risk system obligations",
                  penalty: "Up to 15 million EUR or 3% of global annual turnover",
                },
                {
                  violation: "Transparency obligations (Article 50)",
                  penalty: "Up to 15 million EUR or 3% of global annual turnover",
                },
                {
                  violation: "Incorrect information to authorities",
                  penalty: "Up to 7.5 million EUR or 1% of global annual turnover",
                },
              ].map((item) => (
                <div
                  key={item.violation}
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.violation}</h3>
                  <p className="text-sm text-muted">{item.penalty}</p>
                </div>
              ))}
            </div>
            <p className="pt-4">
              For SMEs and startups, fines are capped proportionally. But even
              proportional fines based on 3% of turnover can be significant.
              More practically, non-compliance creates business risk:
              enterprise customers increasingly require AI governance as part
              of vendor assessments.
            </p>

            {/* GPAI rules */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
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
              Practically, this means OpenAI and Anthropic will publish
              technical documentation, model cards, and usage policies that you
              should reference in your own compliance documentation.
            </p>
            <p>
              Importantly, using a GPAI API does not exempt you from deployer
              obligations. You remain responsible for how you use the AI
              output, what disclosures you provide to your users, and what
              risks your specific application introduces.
            </p>

            {/* Practical compliance steps */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Practical compliance steps for developers
            </h2>
            <p>
              With the August 2, 2026 deadline approaching, here is a
              practical checklist for engineering teams:
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Step 1: Inventory your AI usage
            </h3>
            <p>
              Catalog every AI integration in your application. This includes
              direct API calls to AI providers, embedded ML models,
              AI-powered features in third-party libraries, and any automated
              decision-making systems. Codepliant automates this step by
              scanning your codebase and generating a complete AI model
              inventory.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Step 2: Classify your risk level
            </h3>
            <p>
              For each AI system or feature, determine which risk tier applies.
              Most SaaS AI features (content generation, search, chatbots,
              recommendations) fall under limited risk with transparency
              obligations. If you are in hiring, credit, education, or
              healthcare, you may be high-risk.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Step 3: Implement transparency measures
            </h3>
            <p>
              For the August 2026 deadline, focus on Article 50 transparency:
              add AI-generated content labels, chatbot disclosures, synthetic
              media marking, and general AI usage notices. These are UI
              changes that your engineering team can implement directly.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Step 4: Generate compliance documentation
            </h3>
            <p>
              Document your AI systems, their purposes, risk assessments, and
              transparency measures. This documentation serves as evidence of
              compliance and is required for high-risk systems. Codepliant
              generates this documentation from your codebase, including AI
              disclosure statements, risk assessments, and model inventories.
            </p>

            <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
              Step 5: Establish ongoing governance
            </h3>
            <p>
              Compliance is not a one-time event. Establish processes for
              reviewing AI usage when adding new features, updating
              documentation when AI integrations change, monitoring AI system
              performance and risks, and responding to user complaints about
              AI decisions. Integrate Codepliant into your CI/CD pipeline to
              regenerate compliance documentation on every deployment.
            </p>

            {/* Comparison with GDPR */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              Lessons from GDPR: why early preparation matters
            </h2>
            <p>
              The EU AI Act follows the same enforcement playbook as GDPR.
              When GDPR took effect in May 2018, many companies assumed
              enforcement would be slow and limited. Eight years later, over
              2,000 fines totaling more than 4.5 billion EUR have been issued.
              Meta alone has been fined over 2.5 billion EUR for GDPR
              violations.
            </p>
            <p>
              The AI Act enforcement is expected to follow a similar pattern:
              initial guidance and warnings, followed by increasing enforcement
              activity. Companies that prepare now will avoid both financial
              penalties and the reputational damage of being an early
              enforcement target.
            </p>
            <p>
              GDPR also showed that compliance creates competitive advantage.
              Companies with strong data privacy practices win enterprise deals
              faster. The same dynamic is already emerging with AI governance —
              procurement teams at large organizations are adding AI
              compliance requirements to their vendor assessment questionnaires.
            </p>

            {/* Industry impact */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
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
                  className="bg-surface rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-1">{item.industry}</h3>
                  <p className="text-sm text-muted">{item.impact}</p>
                </div>
              ))}
            </div>

            {/* What to do right now */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4">
              What to do right now
            </h2>
            <p>
              You have less than five months until Article 50 obligations
              become enforceable. Here is what your engineering team should
              prioritize:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>Run an AI audit.</strong> Use Codepliant to scan your
                codebase and generate a complete AI inventory. Understand
                exactly what AI systems your application uses and how they
                process data.
              </li>
              <li>
                <strong>Add transparency disclosures.</strong> Implement
                AI-generated content labels, chatbot notices, and AI usage
                disclosures in your UI. These are the minimum requirements for
                August 2026.
              </li>
              <li>
                <strong>Generate compliance documentation.</strong> Use
                Codepliant to produce AI disclosure statements, risk
                assessments, and governance frameworks aligned with both the
                EU AI Act and the NIST AI RMF.
              </li>
              <li>
                <strong>Brief your legal team.</strong> Share this guide and
                your AI inventory with legal counsel. They can help determine
                your exact risk classification and identify any high-risk use
                cases that need additional preparation.
              </li>
              <li>
                <strong>Integrate into CI/CD.</strong> Add Codepliant to your
                deployment pipeline so compliance documentation updates
                automatically as your AI integrations evolve.
              </li>
            </ol>
          </div>

          {/* CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center mt-16 mb-16">
            <h2 className="text-xl font-bold mb-3">
              Prepare for the EU AI Act deadline
            </h2>
            <p className="text-muted text-sm mb-6">
              Scan your codebase to generate AI governance documentation. Free,
              open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
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
                  title: "AI Governance Framework Generator",
                  href: "/ai-governance",
                  desc: "Generate NIST AI RMF and EU AI Act aligned governance documentation.",
                },
                {
                  title: "AI Disclosure Generator",
                  href: "/ai-disclosure-generator",
                  desc: "Generate Article 50 compliant AI transparency disclosures.",
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
                  className="block bg-surface rounded-xl p-4 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <h3 className="font-semibold mb-1 text-sm">{link.title}</h3>
                  <p className="text-xs text-muted">{link.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
