import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AuthNav from "../components/AuthNav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Codepliant — Compliance Documents from Your Code",
    template: "%s | Codepliant",
  },
  description:
    "Scan your codebase and generate privacy policies, terms of service, AI disclosures, and 123+ compliance documents automatically. 97.8% precision. Open source.",
  metadataBase: new URL("https://www.codepliant.site"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.codepliant.site",
    siteName: "Codepliant",
    title: "Codepliant — Compliance Documents from Your Code",
    description:
      "Scan your codebase and generate privacy policies, terms of service, AI disclosures, and 123+ compliance documents automatically.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codepliant — Compliance Documents from Your Code",
    description:
      "Scan your codebase and generate 123+ compliance documents. One command. 97.8% precision.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function Header() {
  const linkStyle = { transitionTimingFunction: "var(--ease-out-quart)" } as const;
  const linkClass = "hover:text-ink transition-colors duration-150";
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-surface-primary/90 border-b border-border-subtle">
      <nav aria-label="Main navigation" className="max-w-[960px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] h-12 flex items-center justify-between overflow-x-hidden">
        <a
          href="/"
          className="font-display font-semibold text-[length:var(--text-base)] tracking-tight shrink-0"
        >
          Codepliant
        </a>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-[var(--space-6)] text-[length:var(--text-sm)] text-ink-secondary">
          <a href="/pricing" className={linkClass} style={linkStyle}>Pricing</a>
          <a href="/docs" className={linkClass} style={linkStyle}>Docs</a>
          <a href="/changelog" className={linkClass} style={linkStyle}>Changelog</a>
          <a href="/blog" className={linkClass} style={linkStyle}>Blog</a>
          <a href="/about" className={linkClass} style={linkStyle}>About</a>
          <a href="/generate" className="inline-flex items-center px-[var(--space-3)] py-1 rounded-md text-[length:var(--text-sm)] font-medium transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover" style={linkStyle}>Generate Docs</a>
          <a
            href="https://github.com/joechensmartz/codepliant"
            className={linkClass}
            style={linkStyle}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub<span className="sr-only"> (opens in new tab)</span>
          </a>
          <AuthNav />
        </div>

        {/* Mobile nav — always-visible compact links + hamburger for secondary */}
        <div className="flex sm:hidden items-center gap-[var(--space-3)] text-[length:var(--text-sm)] text-ink-secondary">
          <a href="/docs" className={linkClass} style={linkStyle}>Docs</a>
          <a href="/pricing" className={linkClass} style={linkStyle}>Pricing</a>
          {/* Hamburger menu using <details> for remaining links */}
          <details className="relative">
            <summary className="list-none cursor-pointer p-3 -m-2 hover:text-ink transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Open navigation menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-primary border border-border-subtle rounded-lg shadow-lg py-[var(--space-2)] z-50" role="menu">
              <a href="/blog" role="menuitem" className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors">Blog</a>
              <a href="/changelog" role="menuitem" className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors">Changelog</a>
              <a href="/about" role="menuitem" className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors">About</a>
              <a href="/generate" role="menuitem" className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors font-medium text-brand">Generate Docs</a>
              <a href="/contact" role="menuitem" className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors">Get Help</a>
              <a
                href="https://github.com/joechensmartz/codepliant"
                role="menuitem"
                className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub<span className="sr-only"> (opens in new tab)</span>
              </a>
              <div role="menuitem" className="block px-[var(--space-4)] py-[var(--space-3)] min-h-[44px] flex items-center hover:bg-surface-secondary transition-colors">
                <AuthNav />
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const linkClass = "hover:text-ink transition-colors duration-150";
  return (
    <footer aria-label="Site footer" className="border-t border-border-subtle mt-[var(--space-24)]">
      <div className="max-w-[960px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
        {/* Footer CTA */}
        <div className="mb-[var(--space-12)] text-center">
          <p className="font-display font-semibold text-[length:var(--text-base)] text-ink mb-[var(--space-3)]">
            Generate compliance docs in one command
          </p>
          <div className="inline-flex items-center bg-code-bg text-code-fg rounded-lg px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--text-sm)]">
            <span className="text-ink-tertiary mr-[var(--space-2)] select-none">$</span>
            <span>npx codepliant go</span>
          </div>
          <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-2)]">
            No account needed. No API key. Works offline.
          </p>
        </div>

        {/* Footer columns */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-8)] text-[length:var(--text-sm)]">
          {/* Product */}
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Product
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li><a href="/docs" className={linkClass}>Documentation</a></li>
              <li><a href="/pricing" className={linkClass}>Pricing</a></li>
              <li><a href="/compare" className={linkClass}>Compare</a></li>
              <li><a href="/docs" className={linkClass}>Get Started</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Resources
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li><a href="/blog" className={linkClass}>Blog</a></li>
              <li><a href="/changelog" className={linkClass}>Changelog</a></li>
              <li>
                <a
                  href="https://github.com/joechensmartz/codepliant"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub<span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/codepliant"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm<span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Compliance
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li><a href="/privacy-policy-generator" className={linkClass}>Privacy Policy</a></li>
              <li><a href="/terms-of-service-generator" className={linkClass}>Terms of Service</a></li>
              <li><a href="/cookie-policy-generator" className={linkClass}>Cookie Policy</a></li>
              <li><a href="/ai-disclosure-generator" className={linkClass}>AI Disclosure</a></li>
              <li><a href="/gdpr-compliance" className={linkClass}>GDPR</a></li>
              <li><a href="/soc2-compliance" className={linkClass}>SOC 2</a></li>
              <li><a href="/hipaa-compliance" className={linkClass}>HIPAA</a></li>
              <li><a href="/ai-governance" className={linkClass}>AI Governance</a></li>
              <li><a href="/data-privacy" className={linkClass}>Data Privacy</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Company
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li><a href="/about" className={linkClass}>About</a></li>
              <li><a href="/contact" className={linkClass}>Get Compliance Help</a></li>
              <li>
                <a
                  href="https://github.com/joechensmartz/codepliant"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Source<span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Badges + copyright */}
        <div className="mt-[var(--space-12)] pt-[var(--space-8)] border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-[var(--space-4)]">
          <div className="flex items-center gap-[var(--space-3)]">
            <span className="inline-flex items-center gap-[var(--space-1)] rounded-full border border-border-subtle px-[var(--space-3)] py-1 text-[length:var(--text-xs)] text-ink-secondary">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-green-600" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" fill="currentColor"/></svg>
              MIT Licensed
            </span>
            <span className="inline-flex items-center gap-[var(--space-1)] rounded-full border border-border-subtle px-[var(--space-3)] py-1 text-[length:var(--text-xs)] text-ink-secondary">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-green-600" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" fill="currentColor"/></svg>
              Zero network calls
            </span>
          </div>
          <p className="text-[length:var(--text-xs)] text-ink-tertiary">
            &copy; {new Date().getFullYear()} Codepliant. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Codepliant",
    description: "Open-source CLI that scans codebases and generates compliance documents — privacy policies, terms of service, AI disclosures, and 123+ document types.",
    url: "https://www.codepliant.site",
    logo: "https://www.codepliant.site/opengraph-image",
    sameAs: [
      "https://github.com/joechensmartz/codepliant",
      "https://www.npmjs.com/package/codepliant",
    ],
  };
}

function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Codepliant",
    url: "https://www.codepliant.site",
    description:
      "Open-source CLI that scans codebases and generates 123+ compliance documents automatically.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.codepliant.site/docs?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${sourceSans.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd()) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand focus:text-surface-primary focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
