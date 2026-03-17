import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Codepliant changelog and version history. Track new compliance document types, ecosystem scanners, CLI features, and fixes across every release.",
  alternates: {
    canonical: "https://codepliant.dev/changelog",
  },
  openGraph: {
    title: "Changelog | Codepliant",
    description:
      "Codepliant changelog and version history. Track new compliance document types, ecosystem scanners, CLI features, and fixes across every release.",
    url: "https://codepliant.dev/changelog",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog | Codepliant",
    description: "What's new in Codepliant. Full version history.",
    images: ["/opengraph-image"],
  },
};

type ChangeCategory = "new" | "improved" | "tests" | "fix";

interface CategorizedChange {
  category: ChangeCategory;
  text: string;
}

interface Release {
  version: string;
  date: string;
  tag?: "Latest" | "Upcoming";
  summary?: string;
  changes: CategorizedChange[];
}

const categoryConfig: Record<
  ChangeCategory,
  { label: string; color: string; bgColor: string }
> = {
  new: {
    label: "New",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  improved: {
    label: "Improved",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  tests: {
    label: "Tests",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  fix: {
    label: "Fix",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
};

const releases: Release[] = [
  {
    version: "1.1.0",
    date: "Coming soon",
    tag: "Upcoming",
    summary:
      "21 new generators, 5 new scanners, shell completions, fuzzy command matching, tree-view output, --dry-run preview, and 3,177 tests across 13 ecosystems.",
    changes: [
      {
        category: "new",
        text: "codepliant wizard — interactive setup that walks you through configuration",
      },
      {
        category: "new",
        text: "codepliant sbom — CycloneDX SBOM (Software Bill of Materials) generation",
      },
      {
        category: "new",
        text: "codepliant completions — shell completions for bash, zsh, and fish with auto-detection",
      },
      {
        category: "new",
        text: "Disclaimer generator — general, professional advice, external links, fair use, and conditional AI/payment sections",
      },
      {
        category: "new",
        text: "EULA generator with conditional AI disclaimer and payment terms sections",
      },
      {
        category: "new",
        text: "Impressum generator for German legal compliance (Section 5 DDG)",
      },
      {
        category: "new",
        text: "18 additional generators including DPO Handbook, Penetration Test Scope, Data Deletion Procedures, Training Record, Privacy Risk Matrix, Data Mapping Register, Compliance Calendar, and more",
      },
      {
        category: "new",
        text: "Terraform/IaC scanner with support for AWS, GCP, and Azure providers (12 tests)",
      },
      {
        category: "new",
        text: "Django settings.py scanner — detects INSTALLED_APPS, MIDDLEWARE, and DATABASES",
      },
      {
        category: "new",
        text: "Flutter/Dart ecosystem support — pubspec.yaml analysis and Dart import scanning (19 tests)",
      },
      {
        category: "new",
        text: "Swift/iOS ecosystem support — Package.swift, Podfile, and Swift import scanning (23 tests)",
      },
      {
        category: "new",
        text: "Kotlin/Android ecosystem support — build.gradle, build.gradle.kts, and Version Catalog scanning (26 tests)",
      },
      {
        category: "new",
        text: "codepliant go --dry-run — preview generated documents without writing files to disk",
      },
      {
        category: "improved",
        text: "Fuzzy command matching — Levenshtein-based \"Did you mean?\" suggestions for mistyped commands",
      },
      {
        category: "improved",
        text: "Tree-view output — codepliant go now groups generated documents by category with box-drawing characters",
      },
      {
        category: "improved",
        text: "Diff-in-go display — codepliant go now shows a \"Changes Since Last Generation\" summary with new, updated, removed, and unchanged counts",
      },
      {
        category: "improved",
        text: "Health command enhanced — full project health check with service detection, doc diffing, and --json flag for CI pipelines",
      },
      {
        category: "improved",
        text: "npm package size reduced by 8% through build optimization",
      },
      {
        category: "tests",
        text: "Test suite expanded from 763 to 3,177 tests (316% increase) with 100% scanner coverage and 54 generator test suites",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03-16",
    tag: "Latest",
    summary:
      "The stable release. 123+ document types, 13 ecosystems, 200+ service signatures.",
    changes: [
      {
        category: "new",
        text: "Stable release with 123+ compliance document types",
      },
      {
        category: "new",
        text: "13 ecosystem scanners: TypeScript, Python, Go, Ruby, Rust, Java, PHP, Swift, Kotlin, C#, Elixir, Terraform, Flutter/Dart",
      },
      {
        category: "new",
        text: "200+ service signatures for accurate detection of third-party integrations",
      },
      {
        category: "new",
        text: "MCP server with 7 compliance tools for AI-assisted workflows",
      },
      {
        category: "new",
        text: "Plugin system for custom document types and scanner extensions",
      },
      {
        category: "new",
        text: "Monorepo support — scan multiple packages in a single run",
      },
      {
        category: "improved",
        text: "Detection precision at 97.8% across 1,200+ repos tested",
      },
      {
        category: "tests",
        text: "763 tests passing with full coverage of scanner logic",
      },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-03-10",
    changes: [
      {
        category: "new",
        text: "Added MCP server with 7 compliance tools for AI-assisted workflows",
      },
      {
        category: "new",
        text: "Plugin system for custom document types and scanner extensions",
      },
      {
        category: "new",
        text: "Monorepo support — scan multiple packages in a single run",
      },
      { category: "new", text: "Added Rust ecosystem scanner" },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-02-18",
    changes: [
      {
        category: "new",
        text: "EU AI Act Article 50 disclosure generator",
      },
      {
        category: "new",
        text: "Colorado AI Act compliance document support",
      },
      {
        category: "improved",
        text: "AI/ML library detection across Python and Node.js",
      },
      {
        category: "new",
        text: "Added --json flag to scan command for CI/CD pipelines",
      },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-01-22",
    changes: [
      {
        category: "new",
        text: "SOC 2 compliance readiness report generator",
      },
      { category: "new", text: "HIPAA compliance checklist generator" },
      {
        category: "new",
        text: "8 ORM scanners: Prisma, Drizzle, TypeORM, Sequelize, Django ORM, SQLAlchemy, ActiveRecord, GORM",
      },
      {
        category: "improved",
        text: "Detection precision improved to 97.8% across 100 repos",
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2025-12-15",
    changes: [
      { category: "new", text: "GDPR compliance document generator" },
      {
        category: "new",
        text: "Cookie policy generator with automatic cookie detection",
      },
      { category: "new", text: "Data privacy assessment report" },
      {
        category: "new",
        text: "Multi-language support: English, German, French, Spanish",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2025-11-01",
    changes: [
      {
        category: "new",
        text: "AI governance framework document generator",
      },
      {
        category: "new",
        text: "Compare page showing Codepliant vs. alternatives",
      },
      {
        category: "improved",
        text: "Environment variable detection for secrets and API keys",
      },
      {
        category: "new",
        text: "Added Go and Java/Spring ecosystem scanners",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2025-09-20",
    changes: [
      { category: "new", text: "Terms of service generator" },
      {
        category: "new",
        text: "AI disclosure generator for applications using ML models",
      },
      {
        category: "new",
        text: "PHP/Laravel and .NET/C# ecosystem support",
      },
      {
        category: "tests",
        text: "626 tests passing with full coverage of scanner logic",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2025-08-05",
    changes: [
      {
        category: "new",
        text: "Privacy policy generator based on actual code analysis",
      },
      {
        category: "new",
        text: "Python/Django and Ruby on Rails ecosystem scanners",
      },
      {
        category: "new",
        text: "Import pattern matching for 200+ common services",
      },
      { category: "new", text: "Markdown output format" },
    ],
  },
  {
    version: "0.1.0",
    date: "2025-07-01",
    changes: [
      { category: "new", text: "Initial release" },
      { category: "new", text: "Node.js/TypeScript ecosystem scanner" },
      { category: "new", text: "package.json dependency analysis" },
      { category: "new", text: ".env file detection" },
      { category: "new", text: "Basic privacy policy generation" },
    ],
  },
];

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
        name: "Changelog",
        item: "https://codepliant.dev/changelog",
      },
    ],
  };
}

function CategoryBadge({ category }: { category: ChangeCategory }) {
  const config = categoryConfig[category];
  return (
    <span
      className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${config.bgColor} ${config.color} shrink-0`}
    >
      {config.label}
    </span>
  );
}

function VersionBadge({ tag }: { tag: "Latest" | "Upcoming" }) {
  if (tag === "Upcoming") {
    return (
      <span className="text-xs font-semibold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded">
        Upcoming
      </span>
    );
  }
  return (
    <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-wider bg-brand text-surface-primary px-[var(--space-2)] py-0.5 rounded">
      {tag}
    </span>
  );
}

export default function Changelog() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[720px] mx-auto">
          {/* Header */}
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">Changelog</h1>
          <p className="text-[length:var(--text-lg)] text-ink-secondary mb-[var(--space-4)]">
            Every release of Codepliant, from day one to now.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-[var(--space-3)] mb-[var(--space-12)] text-[length:var(--text-sm)]">
            {(Object.keys(categoryConfig) as ChangeCategory[]).map((cat) => (
              <div key={cat} className="flex items-center gap-1.5">
                <CategoryBadge category={cat} />
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-14">
            {releases.map((release) => (
              <section
                key={release.version}
                id={`v${release.version}`}
                className="relative pl-6 border-l-2 border-border-subtle scroll-mt-24"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full ${
                    release.tag === "Upcoming"
                      ? "bg-purple-500 ring-4 ring-purple-100"
                      : release.tag === "Latest"
                        ? "bg-brand ring-4 ring-brand/20"
                        : "bg-brand"
                  }`}
                />

                {/* Version header */}
                <div className="flex items-baseline flex-wrap gap-3 mb-2">
                  <h2 className="text-xl font-bold font-display tracking-tight">
                    v{release.version}
                  </h2>
                  <time className="text-sm text-ink-secondary tabular-nums">
                    {release.date}
                  </time>
                  {release.tag && <VersionBadge tag={release.tag} />}
                </div>

                {/* Summary */}
                {release.summary && (
                  <p className="text-sm text-ink-secondary mb-4 leading-relaxed">
                    {release.summary}
                  </p>
                )}

                {/* Categorized changes */}
                <ul className="space-y-2.5 text-sm leading-relaxed">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CategoryBadge category={change.category} />
                      <span className="text-ink-secondary">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="mt-[var(--space-16)] border border-border-subtle rounded-lg p-[var(--space-6)] text-center bg-surface-secondary">
            <p className="text-[length:var(--text-sm)] font-semibold mb-[var(--space-1)]">Stay up to date</p>
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
              Star the repo on GitHub to get notified of new releases.
            </p>
            <a
              href="https://github.com/joechensmartz/codepliant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary px-[var(--space-4)] py-[var(--space-2)] rounded-lg hover:bg-brand-hover transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 8 .2Z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
