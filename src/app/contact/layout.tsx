import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Compliance Help",
  description:
    "Book a compliance consultation or request a custom compliance package. Get expert help with GDPR, SOC 2, HIPAA, AI governance, and more.",
  alternates: {
    canonical: "https://www.codepliant.site/contact",
  },
  openGraph: {
    title: "Get Compliance Help | Codepliant",
    description:
      "Book a compliance consultation or request a custom compliance package for your project.",
    url: "https://www.codepliant.site/contact",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Codepliant — Get Compliance Help",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Compliance Help | Codepliant",
    description:
      "Expert compliance help — reviews, custom packages, and enterprise consultations.",
    images: ["/opengraph-image"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
