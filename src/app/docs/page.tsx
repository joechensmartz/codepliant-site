import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — CLI and API Reference",
  description:
    "Codepliant docs: install, configure, and generate compliance documents from your codebase. CLI commands, MCP server setup, and output format reference.",
  alternates: {
    canonical: "https://www.codepliant.site/docs",
  },
  openGraph: {
    title: "Documentation | Codepliant",
    description:
      "Codepliant docs: install, configure, and generate compliance documents from your codebase. CLI commands, MCP server setup, and output format reference.",
    url: "https://www.codepliant.site/docs",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation | Codepliant",
    description:
      "Codepliant docs: install, configure, and generate compliance documents from your codebase. CLI commands, MCP server setup, and output format reference.",
    images: ["/opengraph-image"],
  },
};

function techArticleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Codepliant Documentation",
    description:
      "Install, configure, and generate compliance documents from your codebase. CLI commands, MCP server setup, and output format reference.",
    url: "https://www.codepliant.site/docs",
    author: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://www.codepliant.site",
    },
    publisher: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://www.codepliant.site",
    },
    mainEntityOfPage: "https://www.codepliant.site/docs",
    proficiencyLevel: "Beginner",
    dependencies: "Node.js 18+",
    about: {
      "@type": "SoftwareApplication",
      name: "Codepliant",
      version: "1.1.1",
      applicationCategory: "DeveloperApplication",
    },
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function howToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate Compliance Documents from Your Codebase",
    description:
      "Generate privacy policies, terms of service, and 138+ compliance documents from your code in under a minute.",
    totalTime: "PT1M",
    tool: {
      "@type": "HowToTool",
      name: "Node.js 18+",
    },
    step: [
      {
        "@type": "HowToStep",
        name: "Run the CLI",
        text: "Run npx codepliant go in your project directory. No account or API key needed.",
        url: "https://www.codepliant.site/docs#quick-start",
      },
      {
        "@type": "HowToStep",
        name: "Review generated documents",
        text: "Documents appear in categorized directories (legal/, security/, privacy/, ai/, etc.), including privacy policies, terms of service, and more.",
        url: "https://www.codepliant.site/docs#quick-start",
      },
      {
        "@type": "HowToStep",
        name: "Customize with a config file",
        text: "Run codepliant init to create a .codepliantrc.json with your company name, email, jurisdiction, and other settings.",
        url: "https://www.codepliant.site/docs#configuration",
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
        item: "https://www.codepliant.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Documentation",
        item: "https://www.codepliant.site/docs",
      },
    ],
  };
}

const tocItems = [
  { id: "quick-start", label: "Quick Start" },
  { id: "configuration", label: "Configuration" },
  { id: "cli-commands", label: "CLI Commands" },
  { id: "output-formats", label: "Output Formats" },
  { id: "mcp-server", label: "MCP Server" },
  { id: "faq", label: "FAQ" },
];

const scanningCommands = [
  {
    cmd: "scan",
    desc: "Scan your project and output detected services as JSON. Does not generate documents.",
  },
  {
    cmd: "check",
    desc: "Quick compliance pass/fail check. Returns exit code 0 (pass) or 1 (fail) for CI/CD pipelines.",
  },
  {
    cmd: "dashboard",
    desc: "Show an interactive compliance status dashboard with scores, coverage, and recommendations.",
  },
  {
    cmd: "diff",
    desc: "Show what changed in your compliance posture since the last generation.",
  },
  {
    cmd: "audit",
    desc: "Run a comprehensive self-audit and generate an AUDIT_REPORT.md with findings and recommendations.",
  },
  {
    cmd: "lint",
    desc: "Check existing generated documents for completeness and accuracy.",
  },
];

const generationCommands = [
  {
    cmd: "go",
    desc: "Scan your codebase and generate all applicable compliance documents in one step. This is the command most users start with.",
  },
  {
    cmd: "sbom",
    desc: "Generate a CycloneDX Software Bill of Materials (SBOM) from your dependency scan.",
  },
  {
    cmd: "update",
    desc: "Re-scan and regenerate documents, then show a diff of what changed.",
  },
  {
    cmd: "export",
    desc: "Export all compliance documents as a ZIP file for sharing or archival.",
  },
  {
    cmd: "report",
    desc: "Generate a comprehensive compliance report covering all detected services and documents.",
  },
];

const setupCommands = [
  {
    cmd: "init",
    desc: "Interactive setup wizard that creates a .codepliantrc.json config file. Use --from-env for CI/CD environments.",
  },
  {
    cmd: "wizard",
    desc: "Step-by-step compliance wizard that walks you through confirming detected services and configuring document generation.",
  },
  {
    cmd: "config show",
    desc: "Pretty-print your current configuration with validation status.",
  },
  {
    cmd: "hook install",
    desc: "Install a pre-commit Git hook that re-scans on every commit.",
  },
];

const configFields = [
  { field: "companyName", type: "string", desc: "Your company or project name, used in all generated documents." },
  { field: "contactEmail", type: "string", desc: "Contact email displayed in privacy policies and terms." },
  { field: "website", type: "string", desc: "Your website URL." },
  { field: "jurisdiction", type: "string", desc: "Primary regulation: \"GDPR\", \"CCPA\", or \"UK GDPR\"." },
  { field: "jurisdictions", type: "string[]", desc: "Array of all applicable jurisdictions if you serve multiple regions." },
  { field: "outputDir", type: "string", desc: "Where to write generated documents. Default: \"legal\"." },
  { field: "outputFormat", type: "string", desc: "Output format: markdown or json (free CLI). HTML, PDF, DOCX, Notion, Confluence, and Wiki require the paid cloud service." },
  { field: "dpoName", type: "string", desc: "Data Protection Officer name (required for GDPR)." },
  { field: "dpoEmail", type: "string", desc: "Data Protection Officer email." },
  { field: "euRepresentative", type: "string", desc: "EU representative name (required if company is outside the EU)." },
  { field: "dataRetentionDays", type: "number", desc: "Data retention period in days." },
  { field: "aiRiskLevel", type: "string", desc: "AI risk classification: \"minimal\", \"limited\", or \"high\"." },
  { field: "aiUsageDescription", type: "string", desc: "Description of how your application uses AI." },
  { field: "excludeServices", type: "string[]", desc: "Services to exclude from scan results (false positives)." },
  { field: "confirmedServices", type: "string[]", desc: "Services manually confirmed as in use." },
  { field: "plugins", type: "string[]", desc: "Custom generator plugins to load." },
  { field: "language", type: "string", desc: "Output language: en, de, fr, or es." },
];

const outputFormats = [
  { format: "Markdown", flag: "--format markdown", desc: "Default. Clean .md files ready for GitHub, docs sites, or static generators.", free: true },
  { format: "JSON", flag: "--format json", desc: "Structured JSON output for programmatic consumption.", free: true },
  { format: "HTML", flag: "--format html", desc: "Styled HTML documents ready to embed on your website. Cloud service only.", free: false },
  { format: "PDF", flag: "--format pdf", desc: "Publication-ready PDFs with professional formatting. Cloud service only.", free: false },
  { format: "DOCX", flag: "--format docx", desc: "Microsoft Word documents for legal review. Cloud service only.", free: false },
  { format: "Notion", flag: "--format notion", desc: "Notion-compatible markdown with block structure. Cloud service only.", free: false },
  { format: "Confluence", flag: "--format confluence", desc: "Confluence wiki markup. Cloud service only.", free: false },
];

const faqs = [
  {
    q: "Does Codepliant send my code to any server?",
    a: "No. Codepliant makes zero network calls. Everything runs locally on your machine. Your source code never leaves your computer.",
  },
  {
    q: "Do I need an API key or account?",
    a: "No. The free tier works with no account, no API key, and no internet connection. Just run npx codepliant go.",
  },
  {
    q: "Can I use the generated documents in production?",
    a: "Yes, but we recommend having a lawyer review them. Codepliant generates documents based on what your code actually does, achieving 97.8% detection precision across 1,200+ tested repos. The documents include a disclaimer recommending legal review.",
  },
  {
    q: "What languages and frameworks are supported?",
    a: "Codepliant supports 13 ecosystems: TypeScript/Node.js, Python/Django, Ruby on Rails, Go, Java/Spring, PHP/Laravel, Rust, .NET/C#, Swift/iOS, Kotlin, Elixir, Terraform/IaC, and Flutter/Dart. It scans package manifests, source code imports, environment variables, and configuration files.",
  },
  {
    q: "How does Codepliant detect services?",
    a: "Codepliant uses deterministic pattern matching (no AI/LLM) to scan dependency files (package.json, requirements.txt, etc.), source code imports, .env files, and config files. Every detection is reproducible and auditable.",
  },
  {
    q: "What documents can Codepliant generate?",
    a: "Over 138 document types including Privacy Policy, Terms of Service, Cookie Policy, AI Disclosure, EU AI Act Checklist, Data Processing Agreement, SBOM, Security Policy, Data Flow Map, Data Classification, DSAR procedures, and many more.",
  },
  {
    q: "How do I keep documents up to date?",
    a: "Run codepliant update to re-scan and regenerate documents with a diff showing what changed. You can also install a Git pre-commit hook with codepliant hook install to re-scan on every commit, or set up a CI/CD pipeline with codepliant ci.",
  },
  {
    q: "Can I customize the generated documents?",
    a: "Yes. Use the sectionOverrides field in .codepliantrc.json to replace specific sections with your own text. You can also use the template system (codepliant template init) for full control over document structure.",
  },
];

export default function Docs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }}
      />
      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[720px] mx-auto">
          {/* Page header */}
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-3)]">
            Documentation
          </h1>
          <p className="text-[length:var(--text-lg)] text-ink-secondary mb-[var(--space-12)]">
            Everything you need to scan your codebase and generate compliance
            documents.
          </p>

          {/* Table of contents */}
          <nav
            aria-label="Table of contents"
            className="mb-[var(--space-16)] border border-border-subtle rounded-lg p-[var(--space-6)] bg-surface-secondary"
          >
            <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-3)]">
              On this page
            </p>
            <ol className="space-y-[var(--space-2)]">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[length:var(--text-sm)] text-ink-secondary hover:text-brand transition-colors duration-150"
                    style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                  >
                    <span className="text-ink-tertiary mr-[var(--space-2)]">
                      {i + 1}.
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ───────── Quick Start ───────── */}
          <section id="quick-start" className="mb-[var(--space-24)] scroll-mt-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Quick Start
            </h2>
            <p className="text-[length:var(--text-base)] text-ink-secondary mb-[var(--space-6)]" style={{ lineHeight: 1.6 }}>
              Generate compliance documents from your codebase in under a
              minute. No account, no API key, no network calls.
            </p>

            {/* Step 1: Install */}
            <div className="mb-[var(--space-6)]">
              <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-2)]">
                <span className="text-brand mr-[var(--space-2)]">1.</span>
                Run a single command
              </p>
              <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-sm)]">
                <p>
                  <span className="text-ink-tertiary select-none">$ </span>
                  <span className="select-all">npx codepliant go</span>
                </p>
              </div>
              <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-2)]">
                Requires Node.js 18+. Or install globally:{" "}
                <code className="font-mono">npm install -g codepliant</code>
              </p>
            </div>

            {/* Step 2: Output */}
            <div className="mb-[var(--space-6)]">
              <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-2)]">
                <span className="text-brand mr-[var(--space-2)]">2.</span>
                Documents appear in your project
              </p>
              <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-xs)] leading-relaxed">
                <pre className="whitespace-pre" role="region" aria-label="Generated document file tree" tabIndex={0}>{`legal/
├── PRIVACY_POLICY.md
├── TERMS_OF_SERVICE.md
├── COOKIE_POLICY.md
├── AI_DISCLOSURE.md
├── SECURITY.md
├── DATA_FLOW_MAP.md
├── DATA_CLASSIFICATION.md
└── ... (138+ document types)

Generated in ~1.2s`}</pre>
              </div>
            </div>

            {/* Step 3: Customize */}
            <div>
              <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-2)]">
                <span className="text-brand mr-[var(--space-2)]">3.</span>
                Customize with a config file (optional)
              </p>
              <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-sm)]">
                <p>
                  <span className="text-ink-tertiary select-none">$ </span>
                  codepliant init
                </p>
              </div>
              <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-2)]">
                Creates a{" "}
                <code className="font-mono">.codepliantrc.json</code> with your
                company name, email, jurisdiction, and other settings.
              </p>
            </div>
          </section>

          {/* ───────── Configuration ───────── */}
          <section id="configuration" className="mb-[var(--space-24)] scroll-mt-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Configuration
            </h2>
            <p className="text-[length:var(--text-base)] text-ink-secondary mb-[var(--space-6)]" style={{ lineHeight: 1.6 }}>
              Create a{" "}
              <code className="font-mono text-brand">.codepliantrc.json</code>{" "}
              file in your project root to customize document generation. Run{" "}
              <code className="font-mono text-brand">codepliant init</code> to
              generate one interactively.
            </p>

            {/* Example config */}
            <div className="mb-[var(--space-8)]">
              <div className="bg-surface-secondary px-[var(--space-4)] py-[var(--space-3)] border border-border-subtle border-b-0 rounded-t-lg flex items-center gap-[var(--space-2)]">
                <span className="text-[length:var(--text-xs)] font-mono text-ink-tertiary">
                  .codepliantrc.json
                </span>
              </div>
              <div className="bg-code-bg text-code-fg rounded-b-lg border border-border-subtle border-t-0 px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-xs)] leading-relaxed overflow-x-auto">
                <pre className="whitespace-pre" role="region" aria-label="Example codepliantrc.json configuration" tabIndex={0}>{`{
  "companyName": "Acme Inc.",
  "contactEmail": "privacy@acme.com",
  "website": "https://acme.com",
  "jurisdiction": "GDPR",
  "jurisdictions": ["GDPR", "CCPA"],
  "outputDir": "legal",
  "outputFormat": "markdown",
  "dpoName": "Jane Smith",
  "dpoEmail": "dpo@acme.com",
  "dataRetentionDays": 365,
  "aiRiskLevel": "limited",
  "language": "en"
}`}</pre>
              </div>
            </div>

            {/* Config fields table */}
            <div className="border border-border-subtle rounded-lg overflow-hidden">
              <table className="w-full text-[length:var(--text-sm)]">
                <thead>
                  <tr className="bg-surface-secondary text-left">
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                      Field
                    </th>
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)] hidden md:table-cell">
                      Type
                    </th>
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {configFields.map((f) => (
                    <tr
                      key={f.field}
                      className="border-t border-border-subtle"
                    >
                      <td className="px-[var(--space-4)] py-[var(--space-3)] font-mono text-brand text-[length:var(--text-xs)] whitespace-nowrap align-top">
                        {f.field}
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-ink-tertiary text-[length:var(--text-xs)] hidden md:table-cell whitespace-nowrap align-top">
                        {f.type}
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-ink-secondary text-[length:var(--text-xs)]">
                        {f.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ───────── CLI Commands ───────── */}
          <section id="cli-commands" className="mb-[var(--space-24)] scroll-mt-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              CLI Commands
            </h2>
            <p className="text-[length:var(--text-base)] text-ink-secondary mb-[var(--space-8)]" style={{ lineHeight: 1.6 }}>
              Codepliant provides commands for scanning, generating, and
              managing compliance documents. Every command works offline.
            </p>

            {/* Generation commands */}
            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-4)]">
              Generation
            </h3>
            <div className="space-y-[var(--space-3)] mb-[var(--space-8)]">
              {generationCommands.map((c) => (
                <div
                  key={c.cmd}
                  className="border border-border-subtle rounded-lg p-[var(--space-4)]"
                >
                  <code className="font-mono text-brand text-[length:var(--text-sm)]">
                    codepliant {c.cmd}
                  </code>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-1)]" style={{ lineHeight: 1.5 }}>
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Scanning commands */}
            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-4)]">
              Scanning and Analysis
            </h3>
            <div className="space-y-[var(--space-3)] mb-[var(--space-8)]">
              {scanningCommands.map((c) => (
                <div
                  key={c.cmd}
                  className="border border-border-subtle rounded-lg p-[var(--space-4)]"
                >
                  <code className="font-mono text-brand text-[length:var(--text-sm)]">
                    codepliant {c.cmd}
                  </code>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-1)]" style={{ lineHeight: 1.5 }}>
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Setup commands */}
            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-4)]">
              Setup
            </h3>
            <div className="space-y-[var(--space-3)] mb-[var(--space-8)]">
              {setupCommands.map((c) => (
                <div
                  key={c.cmd}
                  className="border border-border-subtle rounded-lg p-[var(--space-4)]"
                >
                  <code className="font-mono text-brand text-[length:var(--text-sm)]">
                    codepliant {c.cmd}
                  </code>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-1)]" style={{ lineHeight: 1.5 }}>
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Common flags */}
            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-4)]">
              Common Flags
            </h3>
            <div className="border border-border-subtle rounded-lg overflow-hidden">
              <table className="w-full text-[length:var(--text-sm)]">
                <thead>
                  <tr className="bg-surface-secondary text-left">
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                      Flag
                    </th>
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { flag: "--output, -o <dir>", desc: "Output directory (default: ./legal)" },
                    { flag: "--format <fmt>", desc: "Output format: markdown, json (free CLI). html, pdf, docx, notion, confluence, wiki require paid cloud service." },
                    { flag: "--json", desc: "Output scan results as JSON (for scan command)" },
                    { flag: "--quiet, -q", desc: "Suppress banner and non-essential output" },
                    { flag: "--dry-run", desc: "Preview what would be generated without writing files to disk" },
                    { flag: "--ci", desc: "CI mode: non-interactive, deterministic output" },
                    { flag: "--company-name <name>", desc: "Inject company name into all generated documents" },
                    { flag: "--contact-email <email>", desc: "Inject contact email into privacy policies and legal documents" },
                  ].map((f) => (
                    <tr key={f.flag} className="border-t border-border-subtle">
                      <td className="px-[var(--space-4)] py-[var(--space-3)] font-mono text-brand text-[length:var(--text-xs)] whitespace-nowrap align-top">
                        {f.flag}
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-ink-secondary text-[length:var(--text-xs)]">
                        {f.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ───────── Output Formats ───────── */}
          <section id="output-formats" className="mb-[var(--space-24)] scroll-mt-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Output Formats
            </h2>
            <p className="text-[length:var(--text-base)] text-ink-secondary mb-[var(--space-6)]" style={{ lineHeight: 1.6 }}>
              The free CLI generates Markdown and JSON locally — unlimited, no account needed.
              HTML, DOCX, PDF, and other rich formats are available through our{" "}
              <a href="/generate" className="text-brand hover:text-brand-hover transition-colors duration-150">paid cloud service</a>{" "}
              (from $10/mo), which also adds per-document format folders, company name/email injection, and priority support.
            </p>

            <div className="border border-border-subtle rounded-lg overflow-hidden">
              <table className="w-full text-[length:var(--text-sm)]">
                <thead>
                  <tr className="bg-surface-secondary text-left">
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                      Format
                    </th>
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)] hidden sm:table-cell">
                      Flag
                    </th>
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)]">
                      Description
                    </th>
                    <th className="font-medium text-ink-tertiary px-[var(--space-4)] py-[var(--space-3)] text-center">
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {outputFormats.map((f) => (
                    <tr
                      key={f.format}
                      className="border-t border-border-subtle"
                    >
                      <td className="px-[var(--space-4)] py-[var(--space-3)] font-medium whitespace-nowrap align-top">
                        {f.format}
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] font-mono text-brand text-[length:var(--text-xs)] hidden sm:table-cell whitespace-nowrap align-top">
                        {f.flag}
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-ink-secondary text-[length:var(--text-xs)]">
                        {f.desc}
                      </td>
                      <td className="px-[var(--space-4)] py-[var(--space-3)] text-center align-top">
                        {f.free ? (
                          <span className="inline-flex items-center gap-1 text-[length:var(--text-xs)] font-medium text-green-600">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="inline-block"
                              aria-hidden="true"
                            >
                              <path
                                d="M3.5 8.5L6.5 11.5L12.5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Free
                          </span>
                        ) : (
                          <span className="text-[length:var(--text-xs)] font-medium text-brand">
                            Cloud
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-[var(--space-6)] bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-sm)]">
              <p className="text-ink-tertiary text-[length:var(--text-xs)] mb-[var(--space-2)] select-none">
                Generate Markdown (free CLI):
              </p>
              <p>
                <span className="text-ink-tertiary select-none">$ </span>
                codepliant go --company-name &quot;Acme Inc&quot;
              </p>
            </div>

            <div className="mt-[var(--space-4)]">
              <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-2)]">
                Multi-format output structure (Cloud service)
              </p>
              <p className="text-[length:var(--text-xs)] text-ink-secondary mb-[var(--space-3)]">
                The paid cloud service generates each document in all 4 formats (MD, HTML, DOCX, PDF) within per-document folders:
              </p>
              <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-xs)] leading-relaxed overflow-x-auto">
                <pre className="whitespace-pre" role="region" aria-label="Multi-format output file tree" tabIndex={0}>{`legal/
├── PRIVACY_POLICY.md
├── PRIVACY_POLICY.html
├── PRIVACY_POLICY.docx
├── PRIVACY_POLICY.pdf
security/
├── SECURITY.md
├── SECURITY.html
├── SECURITY.docx
├── SECURITY.pdf
...`}</pre>
              </div>
            </div>
          </section>

          {/* ───────── MCP Server ───────── */}
          <section id="mcp-server" className="mb-[var(--space-24)] scroll-mt-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              MCP Server
            </h2>
            <p className="text-[length:var(--text-base)] text-ink-secondary mb-[var(--space-6)]" style={{ lineHeight: 1.6 }}>
              Codepliant includes a built-in{" "}
              <a
                href="https://modelcontextprotocol.io"
                className="text-brand hover:text-brand-hover transition-colors duration-150"
                target="_blank"
                rel="noopener noreferrer"
              >
                Model Context Protocol (MCP)
              </a>{" "}
              server, enabling AI coding assistants like Claude Code and Cursor
              to scan projects and generate compliance documents directly.
            </p>

            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-3)]">
              Setup with Claude Code
            </h3>
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]" style={{ lineHeight: 1.5 }}>
              Add the following to your{" "}
              <code className="font-mono text-brand">
                .claude/mcp_servers.json
              </code>{" "}
              file:
            </p>
            <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-xs)] leading-relaxed mb-[var(--space-6)] overflow-x-auto">
              <pre className="whitespace-pre" role="region" aria-label="Claude Code MCP server configuration" tabIndex={0}>{`{
  "codepliant": {
    "command": "npx",
    "args": ["-y", "codepliant", "serve", "--mcp"]
  }
}`}</pre>
            </div>

            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-3)]">
              Setup with Cursor
            </h3>
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]" style={{ lineHeight: 1.5 }}>
              Add to your{" "}
              <code className="font-mono text-brand">
                .cursor/mcp.json
              </code>{" "}
              file:
            </p>
            <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-4)] font-mono text-[length:var(--text-xs)] leading-relaxed mb-[var(--space-6)] overflow-x-auto">
              <pre className="whitespace-pre" role="region" aria-label="Cursor MCP server configuration" tabIndex={0}>{`{
  "mcpServers": {
    "codepliant": {
      "command": "npx",
      "args": ["-y", "codepliant", "serve", "--mcp"]
    }
  }
}`}</pre>
            </div>

            <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-3)]">
              Available MCP Tools
            </h3>
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]" style={{ lineHeight: 1.5 }}>
              Once connected, your AI assistant can use these tools:
            </p>
            <div className="space-y-[var(--space-3)]">
              {[
                {
                  tool: "codepliant_scan",
                  desc: "Scan a project directory and return detected services, data practices, and recommendations.",
                },
                {
                  tool: "codepliant_go",
                  desc: "Scan and generate all applicable compliance documents in one step.",
                },
                {
                  tool: "codepliant_get_config",
                  desc: "Read the current .codepliantrc.json configuration for a project.",
                },
                {
                  tool: "codepliant_set_config",
                  desc: "Update configuration values. Merges with existing config.",
                },
              ].map((t) => (
                <div
                  key={t.tool}
                  className="border border-border-subtle rounded-lg p-[var(--space-4)]"
                >
                  <code className="font-mono text-brand text-[length:var(--text-sm)]">
                    {t.tool}
                  </code>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary mt-[var(--space-1)]">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-4)]">
              The MCP server uses stdio transport. No HTTP server is started and
              no ports are opened.
            </p>
          </section>

          {/* ───────── FAQ ───────── */}
          <section id="faq" className="mb-[var(--space-16)] scroll-mt-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-6)]">
              Frequently Asked Questions
            </h2>

            <div className="space-y-[var(--space-6)]">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="border-b border-border-subtle pb-[var(--space-6)]"
                >
                  <h3 className="text-[length:var(--text-base)] font-semibold mb-[var(--space-2)]">
                    {faq.q}
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-ink-secondary" style={{ lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance frameworks */}
          <section className="mb-[var(--space-16)]">
            <h2 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-3)]">
              Compliance Frameworks
            </h2>
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-6)]" style={{ lineHeight: 1.6 }}>
              Codepliant generates documentation for multiple compliance frameworks. Each page explains the framework requirements and how Codepliant automates documentation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-3)]">
              {[
                {
                  title: "GDPR Compliance",
                  href: "/gdpr-compliance",
                  desc: "Privacy policies, DPAs, data flow maps, and 12+ GDPR documents from your code.",
                },
                {
                  title: "SOC 2 Compliance",
                  href: "/soc2-compliance",
                  desc: "Readiness checklists, control mappings, and evidence docs for all 5 Trust Service Criteria.",
                },
                {
                  title: "AI Governance",
                  href: "/ai-governance",
                  desc: "EU AI Act and NIST AI RMF aligned governance documentation for AI-powered applications.",
                },
              ].map((page) => (
                <a
                  key={page.href}
                  href={page.href}
                  className="block border border-border-subtle rounded-lg p-[var(--space-4)] hover:border-brand transition-colors duration-150"
                  style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                >
                  <h3 className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-1)]">
                    {page.title}
                  </h3>
                  <p className="text-[length:var(--text-xs)] text-ink-secondary">
                    {page.desc}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="border border-border-subtle rounded-lg p-[var(--space-8)] text-center bg-surface-secondary">
            <p className="font-display font-semibold text-[length:var(--text-base)] mb-[var(--space-3)]">
              Ready to get started?
            </p>
            <div className="bg-code-bg text-code-fg rounded-lg px-[var(--space-6)] py-[var(--space-3)] font-mono text-[length:var(--text-sm)] inline-block mb-[var(--space-4)]">
              <span className="text-ink-tertiary select-none">$ </span>
              <span className="select-all">npx codepliant go</span>
            </div>
            <p className="text-[length:var(--text-xs)] text-ink-tertiary">
              No account needed. No API key. Works offline.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
