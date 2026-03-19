import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Compliance Documents",
  description:
    "Scan your GitHub repo and get publication-ready compliance documents. Privacy Policy, Terms of Service, AI Disclosure and 138+ more. From $10/mo.",
  alternates: { canonical: "https://www.codepliant.site/generate" },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
