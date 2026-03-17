import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codepliant vs Termly vs Iubenda — Compliance Tool Comparison",
  description:
    "Compare Codepliant, Termly, and Iubenda for compliance documentation. See how code-based scanning compares to form builders and cookie consent platforms for privacy policies, GDPR, and AI compliance.",
  alternates: {
    canonical: "https://codepliant.dev/compare",
  },
  openGraph: {
    title: "Codepliant vs Termly vs Iubenda — Compliance Tool Comparison",
    description:
      "Side-by-side comparison of Codepliant, Termly, and Iubenda. Code scanning vs form builders for compliance documentation.",
    url: "https://codepliant.dev/compare",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codepliant vs Termly vs Iubenda",
    description:
      "Compare compliance tools: code scanning vs form builders vs cookie consent platforms.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "Can I use Codepliant with Termly or Iubenda?",
    answer:
      "Yes. Codepliant generates compliance documents from your code, while Termly and Iubenda provide consent management and cookie banners. Many teams use Codepliant for document generation and a consent platform for cookie banners. Codepliant even detects Termly and Iubenda integrations in your codebase.",
  },
  {
    question: "Is Codepliant really free?",
    answer:
      "The core CLI is free and open source under the MIT license. You get all 35+ document types, all ecosystems, and Markdown output at no cost. Pro ($29/mo) adds HTML/PDF output, custom branding, and CI/CD integration. Team ($79/mo) adds monorepo support and a compliance API.",
  },
  {
    question: "Why is code scanning better than form builders?",
    answer:
      "Form builders rely on you knowing and accurately describing what your application does. Code scanning analyzes your actual implementation — database schemas, API integrations, analytics SDKs, authentication flows — so documents reflect reality rather than assumptions. When your code changes, a re-scan updates your documents automatically.",
  },
  {
    question:
      "Do Termly and Iubenda support SOC 2, HIPAA, or AI Act compliance?",
    answer:
      "No. Termly and Iubenda focus on privacy policies, cookie consent, and GDPR documentation. They do not generate SOC 2 readiness checklists, HIPAA risk assessments, or EU AI Act disclosures. Codepliant covers all of these frameworks from a single codebase scan.",
  },
];

type FeatureRow = {
  feature: string;
  codepliant: string;
  termly: string;
  iubenda: string;
};

const features: FeatureRow[] = [
  {
    feature: "Approach",
    codepliant: "Code scanning (static analysis)",
    termly: "Form builder / questionnaire",
    iubenda: "Form builder / questionnaire",
  },
  {
    feature: "Privacy Policy",
    codepliant: "Yes — generated from code",
    termly: "Yes — generated from form",
    iubenda: "Yes — generated from form",
  },
  {
    feature: "Terms of Service",
    codepliant: "Yes — generated from code",
    termly: "Yes — generated from form",
    iubenda: "Yes — generated from form",
  },
  {
    feature: "Cookie Policy",
    codepliant: "Yes — detects trackers in code",
    termly: "Yes — with cookie scanner",
    iubenda: "Yes — with cookie scanner",
  },
  {
    feature: "Cookie Consent Banner",
    codepliant: "No (use with Termly/Iubenda)",
    termly: "Yes",
    iubenda: "Yes",
  },
  {
    feature: "GDPR Compliance Docs",
    codepliant: "10+ documents (DPA, DSAR, DPIA, etc.)",
    termly: "Privacy policy + consent",
    iubenda: "Privacy policy + consent",
  },
  {
    feature: "SOC 2 Documentation",
    codepliant: "Yes — readiness checklist, control mapping",
    termly: "No",
    iubenda: "No",
  },
  {
    feature: "HIPAA Documentation",
    codepliant: "Yes — risk assessment, BAA, PHI detection",
    termly: "No",
    iubenda: "No",
  },
  {
    feature: "EU AI Act Disclosure",
    codepliant: "Yes — Article 50 transparency docs",
    termly: "No",
    iubenda: "No",
  },
  {
    feature: "AI Governance (NIST AI RMF)",
    codepliant: "Yes — model inventory, risk assessment",
    termly: "No",
    iubenda: "No",
  },
  {
    feature: "Total Document Types",
    codepliant: "35+",
    termly: "~5",
    iubenda: "~5",
  },
  {
    feature: "Accuracy Method",
    codepliant: "Scans actual code implementation",
    termly: "Relies on user-provided answers",
    iubenda: "Relies on user-provided answers",
  },
  {
    feature: "Stays Up to Date",
    codepliant: "Re-scan on every deploy via CI/CD",
    termly: "Manual updates required",
    iubenda: "Manual updates required",
  },
  {
    feature: "Open Source",
    codepliant: "Yes (MIT License)",
    termly: "No",
    iubenda: "No",
  },
  {
    feature: "Free Tier",
    codepliant: "All features, unlimited scans",
    termly: "Limited (1 policy, Termly branding)",
    iubenda: "Limited (basic policy only)",
  },
  {
    feature: "Paid Plans",
    codepliant: "From $29/mo",
    termly: "From $10/mo",
    iubenda: "From $29/yr",
  },
  {
    feature: "Self-Hosted Option",
    codepliant: "Yes — runs entirely on your machine",
    termly: "No — cloud only",
    iubenda: "No — cloud only",
  },
  {
    feature: "CI/CD Integration",
    codepliant: "Yes (Pro plan)",
    termly: "No",
    iubenda: "No",
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
    name: "Codepliant",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Open source compliance tool that scans your codebase and generates 35+ compliance documents including privacy policies, SOC 2 checklists, HIPAA risk assessments, and AI disclosures.",
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
        name: "Compare",
        item: "https://codepliant.dev/compare",
      },
    ],
  };
}

export default function Compare() {
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
            Comparison
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Codepliant vs Termly vs Iubenda
          </h1>
          <p className="text-lg text-muted mb-12">
            Termly and Iubenda are popular tools for generating privacy policies
            and managing cookie consent. Codepliant takes a fundamentally
            different approach: it scans your codebase to generate compliance
            documents from your actual implementation. Here is how they compare.
          </p>

          {/* Key difference */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              The fundamental difference: code scanning vs form builders
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <p>
                Termly and Iubenda use a questionnaire approach. You answer
                questions about what data your application collects, which
                third-party services you use, and how you process information.
                The tool generates a privacy policy based on your answers.
              </p>
              <p>
                The problem: developers often do not know every data practice in
                their application. An analytics SDK added six months ago, a
                third-party API that collects IP addresses, a database field that
                stores user agents — these details get missed in questionnaires.
                When your privacy policy does not match your actual data
                practices, you have a compliance gap.
              </p>
              <p>
                Codepliant eliminates this gap by scanning your code directly. It
                analyzes your ORM schemas, package dependencies, API
                integrations, environment variables, authentication flows, and AI
                usage. The resulting documents reflect what your application
                actually does — not what someone remembers it doing.
              </p>
            </div>
          </section>

          {/* Feature comparison table */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Feature-by-feature comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-[520px] w-full text-sm border border-border-subtle rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface text-left">
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Feature
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Codepliant
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Termly
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Iubenda
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={
                        i % 2 === 0 ? "bg-surface-secondary" : "bg-surface"
                      }
                    >
                      <td className="px-4 py-3 font-medium border-b border-border-subtle">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 text-muted border-b border-border-subtle">
                        {row.codepliant}
                      </td>
                      <td className="px-4 py-3 text-muted border-b border-border-subtle">
                        {row.termly}
                      </td>
                      <td className="px-4 py-3 text-muted border-b border-border-subtle">
                        {row.iubenda}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* When to use each */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              When to use each tool
            </h2>
            <div className="space-y-4">
              <div className="bg-surface rounded-xl p-5">
                <h3 className="font-semibold mb-2">
                  Use Codepliant when you need
                </h3>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                  <li>
                    Compliance documents generated from your actual code
                    implementation
                  </li>
                  <li>
                    Multi-framework coverage: GDPR, SOC 2, HIPAA, EU AI Act in
                    one tool
                  </li>
                  <li>
                    Documents that automatically stay in sync with your codebase
                  </li>
                  <li>CI/CD integration for continuous compliance</li>
                  <li>
                    Self-hosted, open source tooling with no vendor lock-in
                  </li>
                  <li>
                    Developer-first workflow that fits into your existing
                    toolchain
                  </li>
                </ul>
              </div>
              <div className="bg-surface rounded-xl p-5">
                <h3 className="font-semibold mb-2">
                  Use Termly when you need
                </h3>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                  <li>
                    A managed cookie consent banner with automatic cookie
                    scanning
                  </li>
                  <li>
                    A simple privacy policy for a non-technical team to manage
                  </li>
                  <li>
                    Consent management platform with preference center
                  </li>
                </ul>
              </div>
              <div className="bg-surface rounded-xl p-5">
                <h3 className="font-semibold mb-2">
                  Use Iubenda when you need
                </h3>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                  <li>
                    Hosted privacy and cookie policies with automatic legal
                    updates
                  </li>
                  <li>
                    A consent solution focused on European cookie law compliance
                  </li>
                  <li>Internal privacy management for non-technical teams</li>
                </ul>
              </div>
              <div className="bg-surface rounded-xl p-5">
                <h3 className="font-semibold mb-2">
                  Use Codepliant + Termly or Iubenda together when you need
                </h3>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                  <li>
                    Code-based compliance documentation plus a managed cookie
                    consent banner
                  </li>
                  <li>
                    Full-stack compliance: documents from Codepliant, consent UX
                    from a consent platform
                  </li>
                  <li>
                    Multi-framework compliance (SOC 2, HIPAA, AI Act) alongside
                    cookie consent management
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Codepliant advantages deep dive */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Why developers choose Codepliant
            </h2>
            <div className="space-y-6 text-base text-muted leading-relaxed">
              <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
                Accuracy from code, not memory
              </h3>
              <p>
                When you fill out a form builder, you are working from memory.
                Do you remember every analytics SDK in your package.json? Every
                environment variable that connects to a third-party service?
                Every database field that stores personal data? Codepliant scans
                all of this automatically. In benchmark testing across 100 open
                source repositories, Codepliant achieved 97.8% detection
                precision for data practices.
              </p>

              <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
                35+ document types vs 5
              </h3>
              <p>
                Termly and Iubenda generate privacy policies, terms of service,
                cookie policies, and consent banners — approximately five
                document types. Codepliant generates 35+ document types covering
                GDPR (privacy policy, DPA, DSAR guide, DPIA, data flow map),
                SOC 2 (readiness checklist, control mapping, gap analysis),
                HIPAA (risk assessment, BAA, PHI detection report), and the EU
                AI Act (AI disclosure, model inventory, risk assessment).
              </p>

              <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
                Continuous compliance via CI/CD
              </h3>
              <p>
                Termly and Iubenda documents are static — they reflect what you
                entered in the form at a point in time. As your application
                evolves, your compliance documents drift from reality.
                Codepliant integrates into your CI/CD pipeline so documents
                regenerate on every deployment. New analytics SDK? It appears in
                your next privacy policy. New AI integration? Your AI disclosure
                updates automatically.
              </p>

              <h3 className="text-xl font-bold tracking-tight text-foreground pt-2">
                Open source and self-hosted
              </h3>
              <p>
                Codepliant runs entirely on your machine. Your code never leaves
                your environment. For companies with strict data security
                requirements — which is most companies that need SOC 2 or HIPAA
                compliance — this is a significant advantage over cloud-based
                tools that require you to describe your application to a
                third-party service.
              </p>
            </div>
          </section>

          {/* Pricing comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Pricing comparison
            </h2>
            <div className="space-y-4">
              {[
                {
                  tool: "Codepliant",
                  free: "All 35+ document types, all ecosystems, Markdown output, unlimited scans",
                  paid: "Pro at $29/mo (HTML/PDF, branding, CI/CD). Team at $79/mo (monorepo, API, dashboard).",
                },
                {
                  tool: "Termly",
                  free: "1 policy with Termly branding, basic cookie consent banner",
                  paid: "From $10/mo for multiple policies, custom branding, and advanced consent features.",
                },
                {
                  tool: "Iubenda",
                  free: "Basic privacy policy with limited clauses",
                  paid: "From $29/yr for full privacy policy, cookie solution, and consent management.",
                },
              ].map((item) => (
                <div key={item.tool} className="bg-surface rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{item.tool}</h3>
                  <p className="text-sm text-muted mb-1">
                    <span className="font-medium text-foreground">Free: </span>
                    {item.free}
                  </p>
                  <p className="text-sm text-muted">
                    <span className="font-medium text-foreground">Paid: </span>
                    {item.paid}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Try Codepliant on your codebase
            </h2>
            <p className="text-muted text-sm mb-6">
              Free, open source, no account required. See what Codepliant
              detects in your code.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
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

          {/* Related pages */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Explore compliance frameworks
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "Data Privacy Compliance Hub",
                  href: "/data-privacy",
                  desc: "Overview of all compliance frameworks Codepliant supports.",
                },
                {
                  title: "GDPR Compliance Tool",
                  href: "/gdpr-compliance",
                  desc: "Generate 10+ GDPR documents from your codebase.",
                },
                {
                  title: "SOC 2 Compliance Tool",
                  href: "/soc2-compliance",
                  desc: "SOC 2 readiness checklists and control mappings for startups.",
                },
                {
                  title: "HIPAA Compliance Tool",
                  href: "/hipaa-compliance",
                  desc: "Detect PHI in your code and generate HIPAA documentation.",
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
        </div>
      </article>
    </>
  );
}
