import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOC 2 Compliance Tool for Startups",
  description:
    "Automate SOC 2 readiness with Codepliant. Scan your codebase to generate SOC 2 checklists, control mappings, and evidence documentation. Built for startups and growing teams.",
  alternates: {
    canonical: "https://codepliant.dev/soc2-compliance",
  },
  openGraph: {
    title: "SOC 2 Compliance Tool for Startups",
    description:
      "Automate SOC 2 readiness checklists and control mappings from your codebase. SOC 2 compliance automation for startups.",
    url: "https://codepliant.dev/soc2-compliance",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOC 2 Compliance Tool for Startups",
    description:
      "Automate SOC 2 readiness from your code. Checklists, control mappings, and evidence docs.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What SOC 2 trust service criteria does Codepliant cover?",
    answer:
      "Codepliant maps your codebase against all five SOC 2 Trust Service Criteria: Security (CC), Availability (A), Processing Integrity (PI), Confidentiality (C), and Privacy (P). Most startups begin with Security, which is the only required category.",
  },
  {
    question: "Can Codepliant replace a SOC 2 audit?",
    answer:
      "No. SOC 2 requires an independent auditor. Codepliant accelerates your preparation by generating evidence documentation, identifying control gaps, and producing a readiness checklist so you go into the audit well-prepared.",
  },
  {
    question: "How long does SOC 2 preparation usually take?",
    answer:
      "Without tooling, SOC 2 Type I preparation typically takes 3-6 months and costs $50,000-$100,000. Codepliant reduces the documentation burden from weeks to minutes by generating control mappings and evidence from your actual code.",
  },
  {
    question: "Does Codepliant work with my existing security tools?",
    answer:
      "Codepliant complements your security stack. It scans your code to detect what controls you already have (encryption, access controls, logging, monitoring) and documents them in a format auditors expect.",
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
    name: "Codepliant SOC 2 Compliance Tool",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "SOC 2 compliance tool that scans your codebase and generates readiness checklists, control mappings, and evidence documentation.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export default function Soc2Compliance() {
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
            SOC 2 Compliance
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            SOC 2 Compliance Tool for Startups
          </h1>
          <p className="text-lg text-muted mb-12">
            SOC 2 compliance is the gold standard for SaaS security, and
            enterprise buyers expect it. Codepliant scans your codebase to
            generate a SOC 2 readiness checklist, map your existing controls to
            Trust Service Criteria, and produce evidence documentation — cutting
            months off your audit preparation.
          </p>

          {/* What SOC 2 requires */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              What SOC 2 requires from your engineering team
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "CC6 — Logical and physical access controls",
                  desc: "Demonstrate how your application controls access to systems and data. Codepliant detects authentication mechanisms, RBAC implementations, and session management in your code.",
                },
                {
                  title: "CC7 — System operations monitoring",
                  desc: "Show that you monitor your systems for anomalies. Codepliant identifies logging frameworks, monitoring SDKs, and alerting integrations across your codebase.",
                },
                {
                  title: "CC8 — Change management",
                  desc: "Document your change management process. Codepliant analyzes your CI/CD configuration, code review requirements, and deployment pipelines.",
                },
                {
                  title: "CC9 — Risk mitigation",
                  desc: "Prove you identify and mitigate risks. Codepliant generates a risk assessment based on third-party dependencies, data handling patterns, and infrastructure configuration.",
                },
              ].map((req) => (
                <div key={req.title} className="bg-surface rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{req.title}</h3>
                  <p className="text-sm text-muted">{req.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What Codepliant generates */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              SOC 2 documentation Codepliant generates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "SOC 2 Readiness Checklist",
                "Control-to-Criteria Mapping",
                "Access Control Evidence",
                "Encryption Inventory",
                "Third-Party Vendor List",
                "Change Management Summary",
                "Logging & Monitoring Report",
                "Data Flow Diagram",
                "Risk Assessment",
                "Compliance Gap Analysis",
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

          {/* How it works */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              How Codepliant automates SOC 2 preparation
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                SOC 2 automation starts with understanding what your application
                actually does. Codepliant performs static analysis across your
                entire codebase to identify security controls, data handling
                patterns, and infrastructure configuration. It detects
                encryption at rest and in transit, authentication mechanisms
                (OAuth, JWT, session-based), role-based access controls, input
                validation, and logging frameworks.
              </p>
              <p>
                From this analysis, Codepliant maps your existing controls to
                SOC 2 Trust Service Criteria. The readiness checklist shows
                which controls you already satisfy and which gaps remain. The
                control mapping document provides the evidence narrative your
                auditor needs — with references to specific files and
                configurations in your codebase.
              </p>
              <p>
                For startups pursuing their first SOC 2 Type I report,
                Codepliant reduces preparation time from months to days. Instead
                of manually documenting every control, your engineering team
                runs a single command and gets audit-ready documentation that
                reflects your actual implementation.
              </p>
            </div>
          </section>

          {/* Why startups need SOC 2 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Why startups need SOC 2 compliance
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                Enterprise sales cycles stall without SOC 2. According to
                Vanta&apos;s 2025 Trust Report, 76% of enterprise procurement
                teams require SOC 2 Type II before signing a contract. For
                startups selling to mid-market and enterprise customers, SOC 2
                is not optional — it is a revenue gate.
              </p>
              <p>
                The traditional path to SOC 2 involves hiring a compliance
                consultant ($20,000-$50,000), purchasing a GRC platform
                ($10,000-$30,000/year), and dedicating engineering time for 3-6
                months. Codepliant eliminates the documentation bottleneck,
                which is typically the most time-consuming part for engineering
                teams.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Start your SOC 2 readiness assessment
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
