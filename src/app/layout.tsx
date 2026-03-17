import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
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
    "Scan your codebase and generate privacy policies, terms of service, AI disclosures, and 35+ compliance documents automatically. 97.8% precision. Open source.",
  metadataBase: new URL("https://codepliant.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codepliant.dev",
    siteName: "Codepliant",
    title: "Codepliant — Compliance Documents from Your Code",
    description:
      "Scan your codebase and generate privacy policies, terms of service, AI disclosures, and 35+ compliance documents automatically.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Codepliant — Compliance from Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codepliant — Compliance Documents from Your Code",
    description:
      "Scan your codebase and generate 35+ compliance documents. One command. 97.8% precision.",
    images: ["/og-image.png"],
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
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-surface-primary/90 border-b border-border-subtle">
      <nav className="max-w-[960px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] h-12 flex items-center justify-between overflow-x-hidden">
        <a
          href="/"
          className="font-display font-semibold text-[length:var(--text-base)] tracking-tight shrink-0"
        >
          Codepliant
        </a>
        <div className="flex items-center gap-[var(--space-3)] md:gap-[var(--space-6)] text-[length:var(--text-sm)] text-ink-secondary">
          <a
            href="/pricing"
            className="hover:text-ink transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Pricing
          </a>
          <a
            href="/docs"
            className="hover:text-ink transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Docs
          </a>
          <a
            href="/changelog"
            className="hidden sm:inline hover:text-ink transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Changelog
          </a>
          <a
            href="/blog"
            className="hidden sm:inline hover:text-ink transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Blog
          </a>
          <a
            href="/about"
            className="hidden sm:inline hover:text-ink transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            About
          </a>
          <a
            href="https://github.com/joechensmartz/codepliant"
            className="hover:text-ink transition-colors duration-150"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const linkClass = "hover:text-ink transition-colors duration-150";
  return (
    <footer className="border-t border-border-subtle mt-[var(--space-24)]">
      <div className="max-w-[960px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
        {/* Footer CTA */}
        <div className="mb-[var(--space-12)] text-center">
          <p className="font-display font-semibold text-[length:var(--text-base)] text-ink mb-[var(--space-3)]">
            Generate compliance docs in one command
          </p>
          <div className="inline-flex items-center bg-[var(--color-gray-900)] text-[var(--color-gray-100)] rounded-lg px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--text-sm)]">
            <span className="text-ink-tertiary mr-[var(--space-2)] select-none">$</span>
            <span>npx codepliant go</span>
          </div>
          <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-2)]">
            No account needed. No API key. Works offline.
          </p>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-8)] text-[length:var(--text-sm)]">
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
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/codepliant"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Legal
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li><a href="/privacy-policy-generator" className={linkClass}>Privacy Policy</a></li>
              <li><a href="/terms-of-service-generator" className={linkClass}>Terms of Service</a></li>
              <li><a href="/data-privacy" className={linkClass}>Data Privacy</a></li>
              <li><a href="/gdpr-compliance" className={linkClass}>GDPR</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Company
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li><a href="/about" className={linkClass}>About</a></li>
              <li>
                <a
                  href="https://github.com/joechensmartz/codepliant"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Source
                </a>
              </li>
            </ul>
          </div>
        </div>

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
    url: "https://codepliant.dev",
    logo: "https://codepliant.dev/og-image.png",
    sameAs: [
      "https://github.com/joechensmartz/codepliant",
      "https://www.npmjs.com/package/codepliant",
    ],
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
