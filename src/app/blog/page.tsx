import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Developer Compliance Guides",
  description:
    "Developer-focused guides on GDPR, EU AI Act, privacy policies, and compliance automation. Practical articles for engineering teams building compliant software.",
  alternates: {
    canonical: "https://codepliant.dev/blog",
  },
  openGraph: {
    title: "Blog — Developer Compliance Guides | Codepliant",
    description:
      "Developer-focused guides on GDPR, EU AI Act, privacy policies, and compliance automation.",
    url: "https://codepliant.dev/blog",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Codepliant — Compliance Documents from Your Code" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Developer Compliance Guides | Codepliant",
    description:
      "Practical compliance guides for engineering teams. GDPR, EU AI Act, privacy policies, and more.",
    images: ["/opengraph-image"],
  },
};

const posts = [
  {
    slug: "hipaa-for-developers",
    title: "HIPAA for SaaS Developers: What You Actually Need to Know",
    description:
      "Who needs HIPAA compliance (not just healthcare), the 18 PHI identifiers, technical safeguards for encryption, audit logs, and access controls, plus BAAs and how to automate compliance from code.",
    date: "March 17, 2026",
    readTime: "11 min read",
    tag: "HIPAA",
    tagColor: "text-brand",
  },
  {
    slug: "soc2-for-startups",
    title: "SOC 2 for Startups: A Developer's Survival Guide",
    description:
      "What SOC 2 is, why enterprise buyers require it, the 5 Trust Service Criteria explained simply, common mistakes to avoid, and how to go from zero to audit-ready in 30 days.",
    date: "March 17, 2026",
    readTime: "12 min read",
    tag: "SOC 2",
    tagColor: "text-brand",
  },
  {
    slug: "generate-privacy-policy-from-code",
    title: "How to Generate a Privacy Policy from Your Code in 30 Seconds",
    description:
      "Step-by-step tutorial: one command scans your codebase, detects services and data flows, and generates an accurate privacy policy. No templates, no guesswork.",
    date: "March 17, 2026",
    readTime: "10 min read",
    tag: "Tutorial",
    tagColor: "text-brand",
  },
  {
    slug: "eu-ai-act-deadline",
    title: "EU AI Act: What Developers Need to Know Before August 2, 2026",
    description:
      "Comprehensive developer guide to the EU AI Act. Risk classifications, transparency obligations, code examples for AI detection, and practical compliance steps.",
    date: "March 15, 2026",
    readTime: "14 min read",
    tag: "EU AI Act",
    tagColor: "text-urgency",
  },
  {
    slug: "gdpr-for-developers",
    title: "GDPR Compliance for Developers: A Practical Guide",
    description:
      "Everything developers need to know about GDPR. Data processing, consent, user rights, sub-processors, DPAs, and actionable steps for SaaS teams.",
    date: "March 15, 2026",
    readTime: "10 min read",
    tag: "GDPR",
    tagColor: "text-brand",
  },
  {
    slug: "privacy-policy-for-saas",
    title: "How to Generate a Privacy Policy from Your Codebase",
    description:
      "Stop guessing what your privacy policy should say. Scan your code to detect services, data flows, and third-party integrations, then generate accurate documents.",
    date: "March 15, 2026",
    readTime: "8 min read",
    tag: "Privacy",
    tagColor: "text-brand",
  },
  {
    slug: "colorado-ai-act",
    title: "Colorado AI Act: What SaaS Developers Need to Know",
    description:
      "Colorado's AI Act introduces new obligations for developers using AI in consequential decisions. Understand the requirements and how to prepare.",
    date: "March 15, 2026",
    readTime: "8 min read",
    tag: "AI Regulation",
    tagColor: "text-urgency",
  },
];

function blogListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Codepliant Blog",
    description:
      "Developer-focused guides on compliance, privacy, and AI regulation.",
    url: "https://codepliant.dev/blog",
    publisher: {
      "@type": "Organization",
      name: "Codepliant",
      url: "https://codepliant.dev",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://codepliant.dev/blog/${post.slug}`,
      datePublished: "2026-03-15",
      author: {
        "@type": "Organization",
        name: "Codepliant",
      },
    })),
  };
}

export default function BlogIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd()) }}
      />

      <section className="py-[var(--space-16)] px-[var(--space-6)]">
        <div className="max-w-[680px] mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-ink-secondary text-[length:var(--text-lg)] mb-12">
            Developer-focused guides on compliance, privacy regulations, and AI
            governance. Practical advice for engineering teams.
          </p>

          <div className="space-y-8">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-surface-secondary rounded-2xl p-6 hover:ring-1 hover:ring-border-strong transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${post.tagColor}`}
                  >
                    {post.tag}
                  </span>
                  <span className="text-xs text-ink-tertiary">
                    {post.date} &middot; {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {post.description}
                </p>
              </a>
            ))}
          </div>

          {/* CTA */}
          <section className="bg-surface-secondary rounded-2xl p-8 text-center mt-16">
            <h2 className="text-xl font-bold mb-3">
              Check your compliance in one command
            </h2>
            <p className="text-ink-secondary text-sm mb-6">
              Scan your codebase to detect services, data flows, and AI
              integrations. Generate 123+ compliance documents automatically.
            </p>
            <div className="bg-code-bg text-code-fg px-6 py-3 rounded-xl font-mono text-sm inline-block">
              npx codepliant go
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
