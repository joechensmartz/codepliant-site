import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Codepliant vs Termly vs Iubenda vs Vanta",
  description:
    "Compare Codepliant vs Termly, Iubenda, and Vanta. See how code-based scanning beats form builders for privacy policies, GDPR, SOC 2, and AI compliance.",
  keywords:
    "codepliant vs termly, codepliant vs iubenda, codepliant vs vanta, compliance tool comparison, privacy policy generator, GDPR compliance tool, SOC 2 compliance tool, code scanning compliance, developer compliance tool",
  alternates: {
    canonical: "https://codepliant.site/compare",
  },
  openGraph: {
    title: "Codepliant vs Termly vs Iubenda vs Vanta — Compliance Tool Comparison",
    description:
      "Compare Codepliant vs Termly, Iubenda, and Vanta. See how code-based scanning beats form builders for privacy policies, GDPR, SOC 2, and AI compliance.",
    url: "https://codepliant.site/compare",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codepliant vs Termly vs Iubenda vs Vanta",
    description:
      "Compare compliance tools: code scanning vs form builders vs cookie consent vs enterprise GRC platforms.",
    images: ["/opengraph-image"],
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
      "Yes. Codepliant is completely free and open source under the MIT license. You get all 123+ document types, all ecosystems, and all features at no cost. There are no paid tiers or feature restrictions.",
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
  {
    question: "How does Codepliant compare to Vanta?",
    answer:
      "Vanta is an enterprise GRC platform starting at $10,000/year that automates audit evidence collection across 30+ frameworks. Codepliant is a developer tool that scans your source code to generate compliance documents. Vanta is designed for Series A+ companies preparing for formal audits. Codepliant is designed for developers and small teams who need accurate compliance documentation without enterprise pricing.",
  },
  {
    question: "Does Codepliant replace Vanta or Drata?",
    answer:
      "Not directly. Vanta and Drata are audit-readiness platforms that integrate with cloud infrastructure, HR tools, and identity providers to collect evidence for SOC 2 and ISO 27001 audits. Codepliant generates compliance documents from your source code. For startups not yet ready for a $10K+/year GRC platform, Codepliant provides SOC 2, HIPAA, and GDPR documentation at a fraction of the cost.",
  },
];

type FeatureRow = {
  feature: string;
  codepliant: string;
  termly: string;
  iubenda: string;
  vanta: string;
  highlight?: boolean;
};

const features: FeatureRow[] = [
  {
    feature: "Approach",
    codepliant: "Code scanning (static analysis)",
    termly: "Form builder / questionnaire",
    iubenda: "Form builder / questionnaire",
    vanta: "GRC platform / integrations",
    highlight: true,
  },
  {
    feature: "Privacy Policy",
    codepliant: "Yes — generated from code",
    termly: "Yes — generated from form",
    iubenda: "Yes — generated from form",
    vanta: "No — not a document generator",
  },
  {
    feature: "Terms of Service",
    codepliant: "Yes — generated from code",
    termly: "Yes — generated from form",
    iubenda: "Yes — generated from form",
    vanta: "No",
  },
  {
    feature: "Cookie Policy",
    codepliant: "Yes — detects trackers in code",
    termly: "Yes — with cookie scanner",
    iubenda: "Yes — with cookie scanner",
    vanta: "No",
  },
  {
    feature: "Cookie Consent Banner",
    codepliant: "No (use with Termly/Iubenda)",
    termly: "Yes",
    iubenda: "Yes",
    vanta: "No",
  },
  {
    feature: "GDPR Compliance Docs",
    codepliant: "10+ documents (DPA, DSAR, DPIA, etc.)",
    termly: "Privacy policy + consent",
    iubenda: "Privacy policy + consent",
    vanta: "GDPR evidence collection",
  },
  {
    feature: "SOC 2 Documentation",
    codepliant: "Yes — readiness checklist, control mapping",
    termly: "No",
    iubenda: "No",
    vanta: "Yes — audit automation, evidence collection",
    highlight: true,
  },
  {
    feature: "HIPAA Documentation",
    codepliant: "Yes — risk assessment, BAA, PHI detection",
    termly: "No",
    iubenda: "No",
    vanta: "Yes — evidence collection",
  },
  {
    feature: "EU AI Act Disclosure",
    codepliant: "Yes — Article 50 transparency docs",
    termly: "No",
    iubenda: "No",
    vanta: "No",
    highlight: true,
  },
  {
    feature: "AI Governance (NIST AI RMF)",
    codepliant: "Yes — model inventory, risk assessment",
    termly: "No",
    iubenda: "No",
    vanta: "ISO/IEC 42001 support",
  },
  {
    feature: "Total Document Types",
    codepliant: "123+",
    termly: "~10",
    iubenda: "~10",
    vanta: "N/A (audit evidence, not docs)",
    highlight: true,
  },
  {
    feature: "Compliance Frameworks",
    codepliant: "GDPR, SOC 2, HIPAA, EU AI Act, NIST AI RMF, CCPA, and more",
    termly: "GDPR, CCPA, 28 privacy laws",
    iubenda: "GDPR, CCPA, ePrivacy",
    vanta: "30+ (SOC 2, ISO 27001, HIPAA, PCI DSS, etc.)",
  },
  {
    feature: "Accuracy Method",
    codepliant: "Scans actual code implementation",
    termly: "Relies on user-provided answers",
    iubenda: "Relies on user-provided answers",
    vanta: "Integrations with cloud/SaaS tools",
    highlight: true,
  },
  {
    feature: "Stays Up to Date",
    codepliant: "Re-scan on every deploy via CI/CD",
    termly: "Manual updates required",
    iubenda: "Auto-updates legal clauses",
    vanta: "Continuous monitoring via integrations",
  },
  {
    feature: "Open Source",
    codepliant: "Yes (MIT License)",
    termly: "No",
    iubenda: "No",
    vanta: "No",
    highlight: true,
  },
  {
    feature: "Self-Hosted / Offline",
    codepliant: "Yes — runs entirely on your machine",
    termly: "No — cloud only",
    iubenda: "No — cloud only",
    vanta: "No — cloud only",
    highlight: true,
  },
  {
    feature: "Free Tier",
    codepliant: "All features, unlimited scans",
    termly: "Limited (1 policy, Termly branding)",
    iubenda: "Limited (basic policy only)",
    vanta: "No free tier",
  },
  {
    feature: "Pricing",
    codepliant: "Free (MIT License)",
    termly: "$14-20/mo",
    iubenda: "From $29/yr",
    vanta: "$10,000+/yr",
    highlight: true,
  },
  {
    feature: "CI/CD Integration",
    codepliant: "Yes",
    termly: "No",
    iubenda: "No",
    vanta: "Yes (via integrations)",
  },
  {
    feature: "Target User",
    codepliant: "Developers and small teams",
    termly: "Small businesses, marketers",
    iubenda: "Small businesses, marketers",
    vanta: "Series A+ startups, enterprises",
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
    version: "1.1.0",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    description:
      "Open source compliance tool that scans your codebase and generates 123+ compliance documents including privacy policies, SOC 2 checklists, HIPAA risk assessments, and AI disclosures.",
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
        item: "https://codepliant.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compare",
        item: "https://codepliant.site/compare",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[900px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-ink-secondary">
              <li>
                <Link
                  href="/"
                  className="hover:text-ink transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-ink">Compare</span>
              </li>
            </ol>
          </nav>

          <p className="text-sm font-medium text-brand mb-4 tracking-wide uppercase">
            Comparison
          </p>
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-6)]">
            Codepliant vs Termly vs Iubenda vs Vanta
          </h1>
          <p className="text-lg text-ink-secondary mb-12">
            Termly and Iubenda generate privacy policies from questionnaires.
            Vanta automates audit evidence collection for enterprises.
            Codepliant takes a fundamentally different approach: it scans your
            codebase to generate compliance documents from your actual
            implementation. Here is how they compare.
          </p>

          {/* Quick summary boxes */}
          <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-brand-muted border border-brand/20 rounded-lg p-5">
                <p className="font-semibold mb-2 text-brand">Codepliant</p>
                <p className="text-sm text-ink-secondary">
                  Open source CLI. Scans your code, generates 123+ compliance
                  documents. Free tier with all features. No questionnaires, no
                  cloud dependency, no vendor lock-in.
                </p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-5">
                <p className="font-semibold mb-2">Termly</p>
                <p className="text-sm text-ink-secondary">
                  Web-based form wizard for privacy policies and cookie consent.
                  ~10 document types. Covers 28 privacy laws. $14-20/mo for paid
                  plans.
                </p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-5">
                <p className="font-semibold mb-2">Iubenda</p>
                <p className="text-sm text-ink-secondary">
                  Integrated compliance suite: cookie banners, privacy policies,
                  consent records. Auto-scans websites for cookies. 150,000+
                  clients. From $29/yr.
                </p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-5">
                <p className="font-semibold mb-2">Vanta</p>
                <p className="text-sm text-ink-secondary">
                  Enterprise GRC platform. 30+ compliance frameworks. 300+
                  integrations for audit evidence collection. Starts at
                  $10,000+/yr. Requires sales call.
                </p>
              </div>
            </div>
          </section>

          {/* Key difference */}
          <section className="mb-16">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              The fundamental difference: code scanning vs form builders vs GRC
              platforms
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <p>
                <strong className="text-ink">Termly and Iubenda</strong> use a
                questionnaire approach. You answer questions about what data your
                application collects, which third-party services you use, and how
                you process information. The tool generates a privacy policy
                based on your answers. Iubenda adds website auto-scanning for
                cookies and trackers, and both provide managed consent banners.
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
                <strong className="text-ink">Vanta</strong> takes an
                infrastructure-first approach. It connects to your cloud
                providers, SaaS tools, and HR systems via 300+ integrations to
                continuously collect audit evidence. It supports 30+ frameworks
                including SOC 2, ISO 27001, HIPAA, and PCI DSS. But it starts at
                $10,000+/year, requires a sales call, and is designed for Series
                A+ companies preparing for formal audits — not individual
                developers or small teams generating compliance documents.
              </p>
              <p>
                <strong className="text-ink">Codepliant</strong> eliminates the
                questionnaire gap by scanning your code directly. It analyzes
                your ORM schemas, package dependencies, API integrations,
                environment variables, authentication flows, and AI usage. The
                resulting documents reflect what your application actually does —
                not what someone remembers it doing. And it runs entirely on your
                machine, so your code never leaves your environment.
              </p>
            </div>
          </section>

          {/* The gap Codepliant fills */}
          <section className="mb-16 bg-surface-secondary rounded-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              The pricing gap Codepliant fills
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed mb-4">
              There is a clear gap in the compliance tool market:
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <div className="bg-surface-primary rounded-lg p-4 flex-1 text-center">
                <p className="font-semibold mb-1">Form Wizards</p>
                <p className="text-ink-secondary">
                  Termly at $14-20/mo
                </p>
                <p className="text-ink-tertiary text-xs mt-1">
                  Do not understand your code
                </p>
              </div>
              <div className="text-brand font-bold text-lg hidden sm:block">
                &larr;
              </div>
              <div className="bg-brand-muted border border-brand/20 rounded-lg p-4 flex-1 text-center">
                <p className="font-semibold text-brand mb-1">Codepliant</p>
                <p className="text-ink-secondary">
                  Free (MIT License)
                </p>
                <p className="text-ink-tertiary text-xs mt-1">
                  Scans your actual code
                </p>
              </div>
              <div className="text-brand font-bold text-lg hidden sm:block">
                &rarr;
              </div>
              <div className="bg-surface-primary rounded-lg p-4 flex-1 text-center">
                <p className="font-semibold mb-1">Enterprise GRC</p>
                <p className="text-ink-secondary">
                  Vanta at $10,000+/yr
                </p>
                <p className="text-ink-tertiary text-xs mt-1">
                  Overkill for small teams
                </p>
              </div>
            </div>
          </section>

          {/* Feature comparison table */}
          <section className="mb-16">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Feature-by-feature comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full text-sm border border-border-subtle rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface-secondary text-left">
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Feature
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle text-brand">
                      Codepliant
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Termly
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Iubenda
                    </th>
                    <th className="font-semibold px-4 py-3 border-b border-border-subtle">
                      Vanta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={
                        row.highlight
                          ? "bg-brand-muted/50"
                          : i % 2 === 0
                            ? "bg-surface-secondary"
                            : "bg-surface-primary"
                      }
                    >
                      <td className="px-4 py-3 font-medium border-b border-border-subtle">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 text-ink-secondary border-b border-border-subtle">
                        {row.codepliant}
                      </td>
                      <td className="px-4 py-3 text-ink-secondary border-b border-border-subtle">
                        {row.termly}
                      </td>
                      <td className="px-4 py-3 text-ink-secondary border-b border-border-subtle">
                        {row.iubenda}
                      </td>
                      <td className="px-4 py-3 text-ink-secondary border-b border-border-subtle">
                        {row.vanta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* When to use each */}
          <section className="mb-16">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              When to use each tool
            </h2>
            <div className="space-y-4">
              <div className="bg-brand-muted border border-brand/20 rounded-lg p-5">
                <p className="font-semibold mb-2 text-brand">
                  Use Codepliant when you need
                </p>
                <ul className="text-sm text-ink-secondary space-y-1 list-disc list-inside">
                  <li>
                    Compliance documents generated from your actual code
                    implementation
                  </li>
                  <li>
                    Multi-framework coverage: GDPR, SOC 2, HIPAA, EU AI Act,
                    CCPA in one tool
                  </li>
                  <li>
                    Documents that automatically stay in sync with your codebase
                  </li>
                  <li>CI/CD integration for continuous compliance</li>
                  <li>
                    Self-hosted, open source tooling with no vendor lock-in
                  </li>
                  <li>
                    Compliance documentation without $10K+/year enterprise
                    pricing
                  </li>
                </ul>
              </div>
              <div className="bg-surface-secondary rounded-lg p-5">
                <p className="font-semibold mb-2">
                  Use Termly when you need
                </p>
                <ul className="text-sm text-ink-secondary space-y-1 list-disc list-inside">
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
                  <li>
                    Coverage for 28 global privacy laws with attorney-drafted
                    clauses
                  </li>
                </ul>
              </div>
              <div className="bg-surface-secondary rounded-lg p-5">
                <p className="font-semibold mb-2">
                  Use Iubenda when you need
                </p>
                <ul className="text-sm text-ink-secondary space-y-1 list-disc list-inside">
                  <li>
                    Hosted privacy and cookie policies with automatic legal
                    updates
                  </li>
                  <li>
                    A consent solution focused on European cookie law compliance
                  </li>
                  <li>
                    Plug-and-go integrations for WordPress, Shopify, or GTM
                  </li>
                  <li>Internal privacy management for non-technical teams</li>
                </ul>
              </div>
              <div className="bg-surface-secondary rounded-lg p-5">
                <p className="font-semibold mb-2">
                  Use Vanta when you need
                </p>
                <ul className="text-sm text-ink-secondary space-y-1 list-disc list-inside">
                  <li>
                    Enterprise audit automation for SOC 2, ISO 27001, or PCI DSS
                    certifications
                  </li>
                  <li>
                    Continuous evidence collection from 300+ cloud and SaaS
                    integrations
                  </li>
                  <li>
                    Trust center, vendor risk management, and compliance
                    dashboards
                  </li>
                  <li>
                    Budget for $10,000-$80,000+/year and a dedicated compliance
                    team
                  </li>
                </ul>
              </div>
              <div className="bg-surface-tertiary rounded-lg p-5">
                <p className="font-semibold mb-2">
                  Use Codepliant + Termly/Iubenda together when you need
                </p>
                <ul className="text-sm text-ink-secondary space-y-1 list-disc list-inside">
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
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Why developers choose Codepliant
            </h2>
            <div className="space-y-6 text-base text-ink-secondary leading-relaxed">
              <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
                Accuracy from code, not memory
              </h3>
              <p>
                When you fill out a form builder, you are working from memory.
                Do you remember every analytics SDK in your package.json? Every
                environment variable that connects to a third-party service?
                Every database field that stores personal data? Codepliant scans
                all of this automatically. In benchmark testing across 1,200+
                open source repositories, Codepliant detected data practices
                that questionnaire-based tools consistently miss.
              </p>

              <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
                123+ document types vs 10
              </h3>
              <p>
                Termly generates approximately 10 document types: privacy
                policy, terms and conditions, cookie policy, EULA, disclaimer,
                return policy, shipping policy, acceptable use policy, and
                impressum. Iubenda covers a similar range. Codepliant generates
                123+ document types covering GDPR (privacy policy, DPA, DSAR
                guide, DPIA, data flow map), SOC 2 (readiness checklist, control
                mapping, gap analysis), HIPAA (risk assessment, BAA, PHI
                detection report), the EU AI Act (AI disclosure, model
                inventory, risk assessment), and many more.
              </p>

              <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
                $0 vs $10,000+/year
              </h3>
              <p>
                Vanta starts at $10,000/year for a single framework. Add-ons
                like Trust Center ($6,000/year) and Vendor Risk Management
                ($11,200/year) push costs higher. For a 5-person startup that
                needs SOC 2 documentation, that is a significant expense.
                Codepliant generates SOC 2 readiness checklists, control
                mappings, and gap analyses from your codebase for free. When you
                are ready for a formal audit, Vanta makes sense. Until then,
                Codepliant gives you the documentation you need.
              </p>

              <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
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

              <h3 className="text-xl font-bold tracking-tight text-ink pt-2">
                Open source and self-hosted
              </h3>
              <p>
                Codepliant runs entirely on your machine. Your code never leaves
                your environment. For companies with strict data security
                requirements — which is most companies that need SOC 2 or HIPAA
                compliance — this is a significant advantage over cloud-based
                tools that require you to describe your application to a
                third-party service. The MIT license means no vendor lock-in.
              </p>
            </div>
          </section>

          {/* Pricing comparison */}
          <section className="mb-16">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Pricing comparison
            </h2>
            <div className="space-y-4">
              {[
                {
                  tool: "Codepliant",
                  free: "All 123+ document types, all ecosystems, all features, unlimited scans",
                  paid: "No paid tiers. Everything is free and open source under the MIT license.",
                  highlight: true,
                },
                {
                  tool: "Termly",
                  free: "1 policy with Termly branding, basic cookie consent banner",
                  paid: "Starter at $14/mo ($10/mo annual) for 2 policies + CMP. Pro+ at $20/mo ($15/mo annual) for all generators + unlimited CMP.",
                  highlight: false,
                },
                {
                  tool: "Iubenda",
                  free: "Basic privacy policy with limited clauses",
                  paid: "From $29/yr for full privacy policy, cookie solution, and consent management.",
                  highlight: false,
                },
                {
                  tool: "Vanta",
                  free: "No free tier",
                  paid: "Core plan from $10,000/yr (single framework). Plus $15,000-$30,000/yr. Growth $30,000+. Scale up to $80,000/yr. Requires sales call.",
                  highlight: false,
                },
              ].map((item) => (
                <div
                  key={item.tool}
                  className={
                    item.highlight
                      ? "bg-brand-muted border border-brand/20 rounded-lg p-5"
                      : "bg-surface-secondary rounded-lg p-5"
                  }
                >
                  <p className="font-semibold mb-2">{item.tool}</p>
                  <p className="text-sm text-ink-secondary mb-1">
                    <span className="font-medium text-ink">Free: </span>
                    {item.free}
                  </p>
                  <p className="text-sm text-ink-secondary">
                    <span className="font-medium text-ink">Paid: </span>
                    {item.paid}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-brand-muted border border-brand/20 rounded-lg p-8 text-center mb-16">
            <h2 className="text-xl font-bold mb-3">
              Try Codepliant on your codebase
            </h2>
            <p className="text-ink-secondary text-sm mb-6 max-w-md mx-auto">
              Free, open source, no account required. One command to scan your
              code and generate compliance documents. See what Codepliant
              detects that questionnaires miss.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-lg font-mono text-sm inline-block mb-6">
              npx codepliant go
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/docs"
                className="text-brand font-medium hover:underline"
              >
                Read the docs
              </Link>
              <span className="text-ink-tertiary hidden sm:inline">|</span>
              <a
                href="https://github.com/joechensmartz/codepliant"
                className="text-brand font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              <span className="text-ink-tertiary hidden sm:inline">|</span>
              <a
                href="https://www.npmjs.com/package/codepliant"
                className="text-brand font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm package
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-8)]">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <p className="font-semibold mb-2">{faq.question}</p>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
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
                  title: "AI Governance Hub",
                  href: "/ai-governance",
                  desc: "EU AI Act, NIST AI RMF, and Colorado AI Act compliance.",
                },
                {
                  title: "EU AI Act Developer Guide",
                  href: "/blog/eu-ai-act-deadline",
                  desc: "Everything developers need to know about the August 2026 deadline.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block bg-surface-secondary rounded-lg p-4 hover:ring-1 hover:ring-border-strong transition-shadow"
                >
                  <p className="font-semibold mb-1 text-sm">{link.title}</p>
                  <p className="text-xs text-ink-secondary">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
