import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Codepliant. An open source project on a mission to make software compliance accessible to every developer.",
  alternates: {
    canonical: "https://codepliant.dev/about",
  },
  openGraph: {
    title: "About | Codepliant",
    description:
      "Open source compliance tooling. Our mission, values, and the team behind Codepliant.",
    url: "https://codepliant.dev/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Codepliant",
    description:
      "Open source compliance for every developer. Meet the team behind Codepliant.",
    images: ["/og-image.png"],
  },
};

const values = [
  {
    title: "Code-first",
    description:
      "Compliance documents should be derived from what your software actually does, not from questionnaires or templates.",
  },
  {
    title: "Open source",
    description:
      "The core CLI is MIT-licensed and always will be. Transparency in tooling matters, especially for compliance.",
  },
  {
    title: "Zero trust required",
    description:
      "Codepliant runs entirely on your machine. No code leaves your environment, no network calls, no telemetry.",
  },
  {
    title: "Developer experience",
    description:
      "One command, zero configuration. Compliance should fit into your workflow, not the other way around.",
  },
];

const team = [
  {
    name: "Open for contributors",
    role: "Maintainers",
    bio: "Codepliant is maintained by a growing community of developers who believe compliance should be automated, not outsourced.",
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
        name: "About",
        item: "https://codepliant.dev/about",
      },
    ],
  };
}

export default function About() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            About Codepliant
          </h1>
          <p className="text-lg text-muted mb-16">
            An open source project on a mission to make software compliance
            accessible to every developer.
          </p>

          {/* Mission */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Our mission
            </h2>
            <div className="space-y-4 text-base text-muted leading-relaxed">
              <p>
                Every application that collects user data needs legal documents
                — privacy policies, terms of service, cookie disclosures, AI
                transparency notices. Traditionally, developers either copy
                generic templates, pay thousands for legal counsel, or skip
                compliance entirely.
              </p>
              <p>
                Codepliant takes a different approach. It reads your code,
                detects what your application actually does — which services it
                calls, what data it collects, which AI models it uses — and
                generates accurate, jurisdiction-aware compliance documents
                automatically.
              </p>
              <p>
                No questionnaires. No forms. No network calls. Just one
                command in your terminal.
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              What we believe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-surface rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Team</h2>
            {team.map((member) => (
              <div key={member.name} className="bg-surface rounded-xl p-5">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-brand mb-2">{member.role}</p>
                <p className="text-sm text-muted leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </section>

          {/* Contribute */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Contribute
            </h2>
            <p className="text-base text-muted leading-relaxed mb-6">
              Codepliant is open source under the MIT license. We welcome
              contributions of all kinds — new scanner signatures, document
              generators, ecosystem support, documentation, and bug reports.
            </p>
            <a
              href="https://github.com/codepliant/codepliant"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-150"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8.5h8.5M8 5l3.5 3.5L8 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </section>
        </div>
      </article>
    </>
  );
}
