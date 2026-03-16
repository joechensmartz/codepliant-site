import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a simplified one-page privacy notice in plain language.
 * Designed for display in app/website — not a full legal document.
 * Covers: what we collect, why, who we share with, in ~500 words.
 */
export function generatePrivacyNoticeShort(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[your-website.com]";
  const date = new Date().toISOString().split("T")[0];

  // Categorize services for plain-language descriptions
  const analytics = scan.services.filter((s) => s.category === "analytics");
  const auth = scan.services.filter((s) => s.category === "auth");
  const payment = scan.services.filter((s) => s.category === "payment");
  const ai = scan.services.filter((s) => s.category === "ai");
  const monitoring = scan.services.filter(
    (s) => s.category === "monitoring"
  );
  const storage = scan.services.filter(
    (s) => s.category === "storage" || s.category === "database"
  );
  const email_svc = scan.services.filter((s) => s.category === "email");
  const advertising = scan.services.filter((s) => s.category === "advertising");

  // Build "what we collect" bullet points
  const collectItems: string[] = [];
  if (auth.length > 0) {
    collectItems.push(
      `**Account information** — your email address, name, and login credentials when you sign up (via ${auth.map((s) => s.name).join(", ")})`
    );
  }
  if (payment.length > 0) {
    collectItems.push(
      `**Payment details** — billing information processed securely through ${payment.map((s) => s.name).join(", ")} (we do not store your full card number)`
    );
  }
  if (analytics.length > 0) {
    collectItems.push(
      `**Usage data** — how you interact with our service, pages visited, and feature usage (via ${analytics.map((s) => s.name).join(", ")})`
    );
  }
  if (monitoring.length > 0) {
    collectItems.push(
      `**Technical data** — error reports, device type, browser version, and IP address for troubleshooting (via ${monitoring.map((s) => s.name).join(", ")})`
    );
  }
  if (ai.length > 0) {
    collectItems.push(
      `**Content you provide** — text, files, or prompts you submit to AI-powered features (processed by ${ai.map((s) => s.name).join(", ")})`
    );
  }

  // Collect all data categories from scan
  const dataFields = scan.dataCategories
    .map((dc) => dc.category.toLowerCase())
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);
  if (dataFields.length > 0 && collectItems.length === 0) {
    collectItems.push(
      `**Personal data** — ${dataFields.join(", ")} as detected in our data models`
    );
  }

  // Build "why we collect" items
  const whyItems: string[] = [
    "To provide and maintain our service",
    "To process your transactions and manage your account",
  ];
  if (analytics.length > 0) {
    whyItems.push("To understand how our service is used and improve it");
  }
  if (monitoring.length > 0) {
    whyItems.push("To detect and fix bugs and performance issues");
  }
  if (ai.length > 0) {
    whyItems.push("To power AI features you choose to use");
  }
  if (email_svc.length > 0) {
    whyItems.push("To send you important updates about your account");
  }
  whyItems.push("To comply with legal obligations");

  // Build "who we share with" items
  const shareItems: string[] = [];
  const thirdParties = scan.services.filter((s) => s.isDataProcessor !== false);
  if (thirdParties.length > 0) {
    const names = thirdParties
      .map((s) => s.name)
      .slice(0, 8)
      .join(", ");
    const more = thirdParties.length > 8 ? ` and ${thirdParties.length - 8} others` : "";
    shareItems.push(
      `**Service providers** — ${names}${more} (they process data on our behalf under strict agreements)`
    );
  }
  if (payment.length > 0) {
    shareItems.push("**Payment processors** — to securely handle transactions");
  }
  if (advertising.length > 0) {
    shareItems.push(
      `**Advertising partners** — ${advertising.map((s) => s.name).join(", ")} for relevant ads`
    );
  }
  shareItems.push(
    "**Legal authorities** — only when required by law or to protect our rights"
  );

  let doc = `# Privacy Notice — ${company}

**Last updated:** ${date}

**This is a simplified summary. For the full legal privacy policy, see PRIVACY_POLICY.md.**

---

## What We Collect

When you use ${company}, we collect:

${collectItems.map((item) => `- ${item}`).join("\n")}

## Why We Collect It

We use your information:

${whyItems.map((item) => `- ${item}`).join("\n")}

## Who We Share It With

${shareItems.map((item) => `- ${item}`).join("\n")}

We **never sell** your personal data.

## Your Rights

You can:

- **Access** your data — request a copy of what we have
- **Delete** your data — ask us to erase your account and information
- **Export** your data — get a portable copy in a standard format
- **Opt out** of analytics and non-essential cookies
- **Update** your information in your account settings

## How We Protect Your Data

- All data is encrypted in transit (HTTPS/TLS)
- We use industry-standard security practices
- Access to personal data is restricted to authorized personnel
- We regularly review our security measures

## Contact Us

Questions about your privacy? Reach us at **${email}**.

---

*This notice applies to ${website}. For the full legal privacy policy with complete details on data processing, retention periods, and jurisdiction-specific rights, please see our [Privacy Policy](./PRIVACY_POLICY.md).*

---

> **Disclaimer:** This document was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on source code analysis. It should be reviewed by a qualified legal professional before use.
`;

  return doc;
}
