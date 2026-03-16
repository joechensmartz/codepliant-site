import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Compliance Tool for Developers",
  description:
    "Automate GDPR compliance documentation by scanning your codebase. Generate privacy policies, DPAs, DSAR guides, consent management docs, and data flow maps from your actual code.",
  alternates: {
    canonical: "https://codepliant.dev/gdpr-compliance",
  },
  openGraph: {
    title: "GDPR Compliance Tool for Developers",
    description:
      "Automate GDPR compliance docs from your codebase. Privacy policies, DPAs, DSAR guides, and more.",
    url: "https://codepliant.dev/gdpr-compliance",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDPR Compliance Tool for Developers",
    description: "Automate GDPR compliance documentation from your code.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What GDPR documents does Codepliant generate?",
    answer:
      "Codepliant generates Privacy Policies, Data Processing Agreements (DPA), Data Subject Access Request (DSAR) Guides, Consent Guides, Data Flow Maps, Data Retention Policies, Privacy Impact Assessments (PIA/DPIA), Sub-Processor Lists, and Compliance Reports — all from scanning your code.",
  },
  {
    question: "Does Codepliant replace a Data Protection Officer?",
    answer:
      "No. Codepliant is a developer tool that automates the documentation aspect of GDPR compliance. You should still consult with legal professionals and, if required, appoint a DPO. Codepliant helps you create accurate documentation faster.",
  },
  {
    question: "How does code scanning help with GDPR?",
    answer:
      "GDPR requires you to document what personal data you collect, how you process it, where you store it, and who you share it with. Codepliant scans your ORM schemas, API integrations, analytics SDKs, and auth flows to answer these questions from evidence rather than memory.",
  },
  {
    question: "Does Codepliant detect data transfers outside the EU?",
    answer:
      "Yes. Codepliant identifies third-party services in your code (AWS, Google Cloud, Stripe, analytics providers) and flags potential international data transfers that require GDPR safeguards like Standard Contractual Clauses.",
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
    name: "Codepliant GDPR Compliance Tool",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "GDPR compliance tool that scans your codebase and generates required documentation automatically.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export default function GdprCompliance() {
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
            GDPR Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            GDPR Compliance Tool for Developers
          </h1>
          <p className="text-lg text-muted mb-12">
            GDPR requires detailed documentation of how your application
            collects, processes, and stores personal data. Codepliant scans your
            codebase to generate accurate compliance documents — from privacy
            policies to data flow maps — in one command.
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              GDPR documentation requirements
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Article 13 & 14 — Information to data subjects",
                  desc: "You must inform users about what data you collect, why, and how long you keep it. Codepliant generates this from your database schemas and API integrations.",
                },
                {
                  title: "Article 28 — Data Processing Agreements",
                  desc: "If you use third-party processors (cloud providers, analytics, payments), you need DPAs. Codepliant identifies your processors from your code.",
                },
                {
                  title: "Article 30 — Records of processing activities",
                  desc: "You must maintain records of all processing activities. Codepliant generates data flow maps and processing records from your codebase.",
                },
                {
                  title: "Article 35 — Data Protection Impact Assessment",
                  desc: "High-risk processing requires a DPIA. Codepliant generates PIA/DPIA documents based on the data practices detected in your code.",
                },
              ].map((req) => (
                <div key={req.title} className="bg-surface rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{req.title}</h3>
                  <p className="text-sm text-muted">{req.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              GDPR documents Codepliant generates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Privacy Policy",
                "Data Processing Agreement",
                "DSAR Guide",
                "Consent Guide",
                "Data Flow Map",
                "Data Retention Policy",
                "PIA / DPIA",
                "Sub-Processor List",
                "Cookie Policy",
                "Compliance Report",
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

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              How Codepliant automates GDPR compliance
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                Codepliant performs static analysis on your codebase to identify
                data practices. It scans ORM schemas (Prisma, Drizzle, Mongoose,
                TypeORM, Sequelize, Django, SQLAlchemy) to understand what
                personal data you store. It detects authentication flows,
                analytics SDKs, payment processors, and third-party API
                integrations.
              </p>
              <p>
                From this analysis, it generates a complete set of GDPR
                documentation. The privacy policy includes specific data
                categories, legal bases, and retention periods. The data flow map
                shows how data moves through your application and to third
                parties. The DPA template lists your actual sub-processors.
              </p>
              <p>
                Because the documents are generated from code, they stay accurate
                as your application evolves. Run Codepliant in your CI/CD
                pipeline to regenerate documents on every deploy.
              </p>
            </div>
          </section>

          <section className="bg-surface rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Automate your GDPR documentation
            </h2>
            <p className="text-muted text-sm mb-6">
              Free, open source, no account required.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related resources
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "Data Privacy Compliance Hub",
                  href: "/data-privacy",
                  desc: "Overview of all compliance frameworks Codepliant supports.",
                },
                {
                  title: "Codepliant vs Termly vs Iubenda",
                  href: "/compare",
                  desc: "See how code-based scanning compares to form builders for GDPR compliance.",
                },
                {
                  title: "EU AI Act Developer Guide",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Everything developers need to know about the August 2026 deadline.",
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
