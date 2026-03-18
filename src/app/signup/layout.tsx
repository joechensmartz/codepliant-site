import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a Codepliant account to track orders and re-download your compliance documents.",
  alternates: { canonical: "https://www.codepliant.site/signup" },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
