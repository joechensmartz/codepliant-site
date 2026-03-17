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
  return (
    <footer className="border-t border-border-subtle mt-[var(--space-24)]">
      <div className="max-w-[960px] mx-auto px-[var(--space-6)] py-[var(--space-12)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-8)] text-[length:var(--text-sm)]">
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Product
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li>
                <a href="/pricing" className="hover:text-ink transition-colors duration-150">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/docs" className="hover:text-ink transition-colors duration-150">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/changelog" className="hover:text-ink transition-colors duration-150">
                  Changelog
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-ink transition-colors duration-150">
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/joechensmartz/codepliant"
                  className="hover:text-ink transition-colors duration-150"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Generators
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li>
                <a href="/privacy-policy-generator" className="hover:text-ink transition-colors duration-150">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service-generator" className="hover:text-ink transition-colors duration-150">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookie-policy-generator" className="hover:text-ink transition-colors duration-150">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Compliance
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li>
                <a href="/data-privacy" className="hover:text-ink transition-colors duration-150">
                  Data Privacy
                </a>
              </li>
              <li>
                <a href="/gdpr-compliance" className="hover:text-ink transition-colors duration-150">
                  GDPR
                </a>
              </li>
              <li>
                <a href="/soc2-compliance" className="hover:text-ink transition-colors duration-150">
                  SOC 2
                </a>
              </li>
              <li>
                <a href="/hipaa-compliance" className="hover:text-ink transition-colors duration-150">
                  HIPAA
                </a>
              </li>
              <li>
                <a href="/ai-governance" className="hover:text-ink transition-colors duration-150">
                  AI Governance
                </a>
              </li>
              <li>
                <a href="/ai-disclosure-generator" className="hover:text-ink transition-colors duration-150">
                  EU AI Act
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-[var(--space-3)] text-ink">
              Legal
            </h3>
            <ul className="space-y-[var(--space-2)] text-ink-secondary">
              <li>
                <a href="/privacy-policy-generator" className="hover:text-ink transition-colors duration-150">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms-of-service-generator" className="hover:text-ink transition-colors duration-150">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-[var(--space-12)] pt-[var(--space-8)] border-t border-border-subtle text-[length:var(--text-xs)] text-ink-tertiary">
          <p>&copy; {new Date().getFullYear()} Codepliant. Open source under MIT License.</p>
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
