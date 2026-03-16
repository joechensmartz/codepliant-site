import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Codepliant changelog. See what's new in each release — features, fixes, and improvements.",
  alternates: {
    canonical: "https://codepliant.dev/changelog",
  },
  openGraph: {
    title: "Changelog | Codepliant",
    description:
      "Version history for Codepliant. New features, bug fixes, and improvements.",
    url: "https://codepliant.dev/changelog",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog | Codepliant",
    description: "What's new in Codepliant. Full version history.",
    images: ["/og-image.png"],
  },
};

const releases = [
  {
    version: "0.8.0",
    date: "2026-03-10",
    tag: "Latest",
    changes: [
      "Added MCP server with 7 compliance tools for AI-assisted workflows",
      "Plugin system for custom document types and scanner extensions",
      "Monorepo support — scan multiple packages in a single run",
      "Added Rust ecosystem scanner",
    ],
  },
  {
    version: "0.7.0",
    date: "2026-02-18",
    changes: [
      "EU AI Act Article 50 disclosure generator",
      "Colorado AI Act compliance document support",
      "Improved AI/ML library detection across Python and Node.js",
      "Added --json flag to scan command for CI/CD pipelines",
    ],
  },
  {
    version: "0.6.0",
    date: "2026-01-22",
    changes: [
      "SOC 2 compliance readiness report generator",
      "HIPAA compliance checklist generator",
      "8 ORM scanners: Prisma, Drizzle, TypeORM, Sequelize, Django ORM, SQLAlchemy, ActiveRecord, GORM",
      "Detection precision improved to 97.8% across 100 repos",
    ],
  },
  {
    version: "0.5.0",
    date: "2025-12-15",
    changes: [
      "GDPR compliance document generator",
      "Cookie policy generator with automatic cookie detection",
      "Data privacy assessment report",
      "Multi-language support: English, German, French, Spanish",
    ],
  },
  {
    version: "0.4.0",
    date: "2025-11-01",
    changes: [
      "AI governance framework document generator",
      "Compare page showing Codepliant vs. alternatives",
      "Improved environment variable detection for secrets and API keys",
      "Added Go and Java/Spring ecosystem scanners",
    ],
  },
  {
    version: "0.3.0",
    date: "2025-09-20",
    changes: [
      "Terms of service generator",
      "AI disclosure generator for applications using ML models",
      "PHP/Laravel and .NET/C# ecosystem support",
      "626 tests passing with full coverage of scanner logic",
    ],
  },
  {
    version: "0.2.0",
    date: "2025-08-05",
    changes: [
      "Privacy policy generator based on actual code analysis",
      "Python/Django and Ruby on Rails ecosystem scanners",
      "Import pattern matching for 200+ common services",
      "Markdown output format",
    ],
  },
  {
    version: "0.1.0",
    date: "2025-07-01",
    changes: [
      "Initial release",
      "Node.js/TypeScript ecosystem scanner",
      "package.json dependency analysis",
      ".env file detection",
      "Basic privacy policy generation",
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

export default function Changelog() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd()),
        }}
      />

      <article className="py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Changelog</h1>
          <p className="text-lg text-muted mb-12">
            Every release of Codepliant, from day one to now.
          </p>

          <div className="space-y-12">
            {releases.map((release) => (
              <section
                key={release.version}
                className="relative pl-6 border-l-2 border-border-subtle"
              >
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-brand" />
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="text-xl font-bold font-display tracking-tight">
                    v{release.version}
                  </h2>
                  <time className="text-sm text-muted tabular-nums">
                    {release.date}
                  </time>
                  {release.tag && (
                    <span className="text-xs font-semibold uppercase tracking-wider bg-brand text-white px-2 py-0.5 rounded">
                      {release.tag}
                    </span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-muted leading-relaxed">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand mt-0.5 shrink-0">
                        &#10003;
                      </span>
                      {change}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
