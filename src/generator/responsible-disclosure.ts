import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a RESPONSIBLE_DISCLOSURE_POLICY.md — bug bounty scope, reporting process,
 * safe harbor, and response timeline. Generated when security-related services are detected.
 */
export function generateResponsibleDisclosurePolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  // Generate when any services are detected (any app handling data needs a disclosure policy)
  const hasSecurityRelevant = scan.services.some(
    (s) =>
      s.category === "auth" ||
      s.category === "payment" ||
      s.category === "database" ||
      s.category === "monitoring" ||
      s.category === "storage",
  );

  if (!hasSecurityRelevant && scan.services.length < 2) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || `security@${contactEmail.split("@")[1] || "example.com"}`;
  const website = ctx?.website || "[https://yoursite.com]";
  const bugBountyUrl = ctx?.bugBountyUrl || null;
  const date = new Date().toISOString().split("T")[0];

  const authServices = scan.services.filter((s) => s.category === "auth");
  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const storageServices = scan.services.filter((s) => s.category === "storage" || s.category === "database");
  const monitoringServices = scan.services.filter((s) => s.category === "monitoring");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  const sections: string[] = [];

  sections.push(`# Responsible Disclosure Policy`);
  sections.push(``);
  sections.push(`**Effective Date:** ${date}`);
  sections.push(`**Last Updated:** ${date}`);
  sections.push(``);
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(``);
  sections.push(`---`);
  sections.push(``);

  // 1. Introduction
  sections.push(`## ${nextSection()}. Introduction`);
  sections.push(``);
  sections.push(
    `${company} takes the security of our systems and user data seriously. ` +
    `We value the security research community and encourage responsible disclosure ` +
    `of any vulnerabilities found in our products and services.`,
  );
  sections.push(``);
  sections.push(
    `This policy describes how to report security vulnerabilities to us, what ` +
    `you can expect from us, and what we expect from you.`,
  );
  sections.push(``);

  // 2. Scope
  sections.push(`## ${nextSection()}. Scope`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 In Scope`);
  sections.push(``);
  sections.push(`The following assets and services are within the scope of this program:`);
  sections.push(``);
  sections.push(`| Asset | Type | Priority |`);
  sections.push(`|-------|------|----------|`);
  sections.push(`| ${website} | Web Application | Critical |`);
  sections.push(`| ${website}/api/* | API Endpoints | Critical |`);

  if (authServices.length > 0) {
    sections.push(`| Authentication system (${authServices.map((s) => s.name).join(", ")}) | Auth Infrastructure | Critical |`);
  }
  if (paymentServices.length > 0) {
    sections.push(`| Payment processing (${paymentServices.map((s) => s.name).join(", ")}) | Payment Infrastructure | Critical |`);
  }
  if (storageServices.length > 0) {
    sections.push(`| Data storage (${storageServices.map((s) => s.name).join(", ")}) | Data Infrastructure | High |`);
  }

  sections.push(``);

  sections.push(`### ${sectionNum}.2 Out of Scope`);
  sections.push(``);
  sections.push(`The following are **not** in scope:`);
  sections.push(``);
  sections.push(`- Third-party services not operated by ${company}`);
  sections.push(`- Social engineering attacks (phishing, vishing, etc.)`);
  sections.push(`- Physical security attacks`);
  sections.push(`- Denial of service (DoS/DDoS) attacks`);
  sections.push(`- Automated vulnerability scanning that generates excessive traffic`);
  sections.push(`- Issues in third-party dependencies with no demonstrated exploit path`);
  sections.push(`- Clickjacking on pages with no sensitive actions`);
  sections.push(`- Missing security headers without demonstrated impact`);
  sections.push(``);

  // 3. Reporting Process
  sections.push(`## ${nextSection()}. How to Report`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 Reporting Channel`);
  sections.push(``);
  sections.push(`Send vulnerability reports to: **${securityEmail}**`);
  sections.push(``);

  if (bugBountyUrl) {
    sections.push(`You may also submit reports through our bug bounty program: ${bugBountyUrl}`);
    sections.push(``);
  }

  sections.push(`### ${sectionNum}.2 Required Information`);
  sections.push(``);
  sections.push(`Please include the following in your report:`);
  sections.push(``);
  sections.push(`1. **Description** — Clear description of the vulnerability`);
  sections.push(`2. **Steps to reproduce** — Detailed steps to reproduce the issue`);
  sections.push(`3. **Impact assessment** — Your assessment of the potential impact`);
  sections.push(`4. **Affected component** — URL, API endpoint, or system affected`);
  sections.push(`5. **Proof of concept** — Screenshots, logs, or code demonstrating the issue`);
  sections.push(`6. **Your contact information** — Email or secure communication channel`);
  sections.push(``);

  sections.push(`### ${sectionNum}.3 Encryption`);
  sections.push(``);
  sections.push(
    `For sensitive reports, we encourage encrypting your communication. ` +
    `Please request our PGP public key by emailing ${securityEmail} with the subject line "PGP Key Request".`,
  );
  sections.push(``);

  // 4. Vulnerability Categories
  sections.push(`## ${nextSection()}. Vulnerability Categories`);
  sections.push(``);
  sections.push(`We classify vulnerabilities by severity using the CVSS v3.1 framework:`);
  sections.push(``);
  sections.push(`| Severity | CVSS Score | Examples |`);
  sections.push(`|----------|-----------|----------|`);
  sections.push(`| **Critical** | 9.0 - 10.0 | Remote code execution, authentication bypass, SQL injection with data exfiltration |`);
  sections.push(`| **High** | 7.0 - 8.9 | Privilege escalation, stored XSS with session hijacking, IDOR exposing PII |`);
  sections.push(`| **Medium** | 4.0 - 6.9 | CSRF on sensitive actions, reflected XSS, information disclosure |`);
  sections.push(`| **Low** | 0.1 - 3.9 | Verbose error messages, missing rate limiting on non-critical endpoints |`);
  sections.push(``);

  // Contextual vulnerability areas based on detected services
  const vulnAreas: string[] = [];
  if (authServices.length > 0) {
    vulnAreas.push(`- **Authentication & Authorization** — bypass, privilege escalation, session management flaws (${authServices.map((s) => s.name).join(", ")})`);
  }
  if (paymentServices.length > 0) {
    vulnAreas.push(`- **Payment Security** — transaction manipulation, price tampering, payment data exposure (${paymentServices.map((s) => s.name).join(", ")})`);
  }
  if (storageServices.length > 0) {
    vulnAreas.push(`- **Data Storage** — injection, unauthorized data access, data leakage (${storageServices.map((s) => s.name).join(", ")})`);
  }

  if (vulnAreas.length > 0) {
    sections.push(`### ${sectionNum}.1 Priority Areas`);
    sections.push(``);
    sections.push(`Based on our technology stack, we are particularly interested in:`);
    sections.push(``);
    for (const area of vulnAreas) {
      sections.push(area);
    }
    sections.push(``);
  }

  // 5. Safe Harbor
  sections.push(`## ${nextSection()}. Safe Harbor`);
  sections.push(``);
  sections.push(
    `${company} supports responsible security research. If you conduct ` +
    `security research in compliance with this policy, we will:`
  );
  sections.push(``);
  sections.push(`- **Not pursue legal action** against you for your research activities`);
  sections.push(`- **Not report** your activities to law enforcement, provided you act in good faith`);
  sections.push(`- **Work with you** to understand and resolve the issue quickly`);
  sections.push(`- **Recognize your contribution** (with your permission) in our security acknowledgments`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 Researcher Obligations`);
  sections.push(``);
  sections.push(`To qualify for safe harbor, you must:`);
  sections.push(``);
  sections.push(`- Act in good faith and avoid privacy violations, data destruction, or service disruption`);
  sections.push(`- Only interact with accounts you own or have explicit permission to test`);
  sections.push(`- Not access, modify, or delete data belonging to other users`);
  sections.push(`- Stop testing and report immediately if you encounter user data`);
  sections.push(`- Not publicly disclose the vulnerability before we have addressed it`);
  sections.push(`- Provide us a reasonable time to fix the issue before any disclosure`);
  sections.push(``);

  // 6. Response Timeline
  sections.push(`## ${nextSection()}. Response Timeline`);
  sections.push(``);
  sections.push(`We commit to the following response timeline:`);
  sections.push(``);
  sections.push(`| Stage | Timeline |`);
  sections.push(`|-------|----------|`);
  sections.push(`| **Acknowledgment** | Within 24 hours of report receipt |`);
  sections.push(`| **Initial Assessment** | Within 3 business days |`);
  sections.push(`| **Status Update** | Every 5 business days during investigation |`);
  sections.push(`| **Resolution Target** | Critical: 7 days, High: 14 days, Medium: 30 days, Low: 90 days |`);
  sections.push(`| **Disclosure** | Coordinated disclosure after fix is deployed |`);
  sections.push(``);
  sections.push(
    `If we need more time to address an issue, we will notify you and provide ` +
    `an updated timeline.`,
  );
  sections.push(``);

  // 7. Bug Bounty (if configured)
  if (bugBountyUrl) {
    sections.push(`## ${nextSection()}. Bug Bounty Program`);
    sections.push(``);
    sections.push(`We maintain a bug bounty program to reward security researchers for their contributions.`);
    sections.push(``);
    sections.push(`| Severity | Reward Range |`);
    sections.push(`|----------|-------------|`);
    sections.push(`| Critical | $500 - $5,000 |`);
    sections.push(`| High | $200 - $1,000 |`);
    sections.push(`| Medium | $50 - $200 |`);
    sections.push(`| Low | Recognition |`);
    sections.push(``);
    sections.push(`Full program details: ${bugBountyUrl}`);
    sections.push(``);
    sections.push(`Reward amounts are determined at our discretion based on the severity, ` +
      `impact, and quality of the report.`);
    sections.push(``);
  }

  // 8. Recognition
  sections.push(`## ${nextSection()}. Recognition & Hall of Fame`);
  sections.push(``);
  sections.push(
    `With your permission, we will publicly acknowledge your contribution ` +
    `in our security Hall of Fame. Please indicate in your report whether you ` +
    `would like to be credited (and how you'd like to be identified).`
  );
  sections.push(``);

  // 9. Contact
  sections.push(`## ${nextSection()}. Contact`);
  sections.push(``);
  sections.push(`- **Security reports:** ${securityEmail}`);
  sections.push(`- **General inquiries:** ${contactEmail}`);

  if (bugBountyUrl) {
    sections.push(`- **Bug bounty program:** ${bugBountyUrl}`);
  }

  sections.push(``);

  // Footer
  sections.push(`---`);
  sections.push(``);
  sections.push(
    `*This policy is based on the [disclose.io](https://disclose.io) framework. ` +
    `Generated by Codepliant from project analysis. Review with your security team before publishing.*`,
  );
  sections.push(``);

  return sections.join("\n");
}
