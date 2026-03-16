import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a SUPPLIER_CODE_OF_CONDUCT.md document covering data protection
 * requirements for suppliers, security expectations, audit rights, and
 * auto-populated sub-processor requirements based on detected services.
 *
 * Only generated when third-party data-processing services are detected.
 */

/** Minimum number of third-party services to trigger generation. */
const MIN_SERVICES = 2;

const SELF_HOSTED = new Set([
  "prisma",
  "drizzle",
  "mongoose",
  "ioredis",
  "redis",
  "nodemailer",
  "passport",
  "next-auth",
  "@auth/core",
  "better-auth",
  "web-push",
  "bullmq",
  "@simplewebauthn/server",
  "passport-google-oauth20",
  "passport-microsoft",
]);

function isThirdParty(s: DetectedService): boolean {
  return s.isDataProcessor !== false && !SELF_HOSTED.has(s.name);
}

export function generateSupplierCodeOfConduct(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const thirdPartyServices = scan.services.filter(isThirdParty);
  if (thirdPartyServices.length < MIN_SERVICES) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoEmail = ctx?.dpoEmail || ctx?.contactEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasAuth = scan.services.some((s) => s.category === "auth");

  const sections: string[] = [];

  // --- Header ---
  sections.push(`# Supplier Code of Conduct`);
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push(
    `This Supplier Code of Conduct ("Code") outlines the data protection, security, and compliance ` +
      `requirements that all suppliers, vendors, and third-party service providers ("Suppliers") must ` +
      `adhere to when processing data on behalf of ${company}.`
  );

  // --- Scope ---
  sections.push("");
  sections.push("## 1. Scope");
  sections.push("");
  sections.push(
    `This Code applies to all Suppliers that process, store, transmit, or have access to data ` +
      `managed by ${company}. Compliance with this Code is a contractual requirement for all Suppliers.`
  );

  // --- Data Protection Requirements ---
  sections.push("");
  sections.push("## 2. Data Protection Requirements");
  sections.push("");
  sections.push("### 2.1 Lawful Processing");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Process personal data only as instructed by " + company);
  sections.push("- Maintain a lawful basis for any data processing (GDPR Article 6)");
  sections.push("- Not process personal data for any purpose beyond the scope of the agreement");
  sections.push("- Implement appropriate data minimization practices");
  sections.push("- Maintain accurate records of processing activities (GDPR Article 30)");

  sections.push("");
  sections.push("### 2.2 Data Subject Rights");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Assist " + company + " in responding to Data Subject Access Requests (DSARs)");
  sections.push("- Support the right to rectification, erasure, and data portability");
  sections.push("- Notify " + company + " within 24 hours of receiving any data subject request directly");
  sections.push("- Not respond to data subject requests without prior authorization from " + company);

  sections.push("");
  sections.push("### 2.3 International Data Transfers");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Not transfer personal data outside the EEA without appropriate safeguards");
  sections.push("- Use Standard Contractual Clauses (SCCs) for transfers outside the EEA");
  sections.push("- Conduct Transfer Impact Assessments where required");
  sections.push("- Notify " + company + " of any change in data processing location");

  // --- Security Expectations ---
  sections.push("");
  sections.push("## 3. Security Expectations");
  sections.push("");
  sections.push("### 3.1 Technical Measures");
  sections.push("");
  sections.push("Suppliers must implement and maintain:");
  sections.push("");
  sections.push("- Encryption at rest (AES-256 or equivalent) for all personal data");
  sections.push("- Encryption in transit (TLS 1.2+ minimum)");
  sections.push("- Access controls based on the principle of least privilege");
  sections.push("- Multi-factor authentication for administrative access");
  sections.push("- Regular vulnerability scanning and penetration testing");
  sections.push("- Intrusion detection/prevention systems");
  sections.push("- Secure software development lifecycle (SSDLC) practices");

  if (hasPayment) {
    sections.push("");
    sections.push("### 3.2 Payment Data Security");
    sections.push("");
    sections.push("Suppliers handling payment data must additionally:");
    sections.push("");
    sections.push("- Maintain PCI DSS compliance (Level 1 or 2 as applicable)");
    sections.push("- Provide a current Attestation of Compliance (AoC)");
    sections.push("- Never store primary account numbers (PANs) in plaintext");
    sections.push("- Implement tokenization for card data where possible");
  }

  if (hasAuth) {
    sections.push("");
    sections.push(`### ${hasPayment ? "3.3" : "3.2"} Authentication & Identity Data`);
    sections.push("");
    sections.push("Suppliers processing authentication or identity data must:");
    sections.push("");
    sections.push("- Store passwords using industry-standard hashing (bcrypt, Argon2, scrypt)");
    sections.push("- Support secure session management and token rotation");
    sections.push("- Implement account lockout and brute-force protection");
    sections.push("- Notify " + company + " of any credential compromise within 4 hours");
  }

  if (hasAI) {
    sections.push("");
    sections.push("### AI & Machine Learning Data");
    sections.push("");
    sections.push("Suppliers providing AI or machine learning services must:");
    sections.push("");
    sections.push("- Not use " + company + "'s data to train models without explicit written consent");
    sections.push("- Provide transparency regarding AI model training data sources");
    sections.push("- Implement bias monitoring and fairness assessments");
    sections.push("- Comply with the EU AI Act classification requirements");
    sections.push("- Provide clear documentation of automated decision-making processes");
  }

  sections.push("");
  sections.push("### Organizational Measures");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Conduct annual security awareness training for all staff with data access");
  sections.push("- Maintain a documented information security policy (ISO 27001 aligned)");
  sections.push("- Perform background checks on personnel with access to personal data");
  sections.push("- Maintain a documented incident response plan");
  sections.push("- Carry adequate cyber insurance coverage");

  // --- Incident Response ---
  sections.push("");
  sections.push("## 4. Incident Response & Breach Notification");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Notify " + company + " of any security incident within **72 hours** of discovery");
  sections.push("- Notify " + company + " of any confirmed personal data breach within **24 hours**");
  sections.push("- Provide a detailed incident report including:");
  sections.push("  - Nature and scope of the incident");
  sections.push("  - Categories and approximate number of affected data subjects");
  sections.push("  - Categories and approximate number of affected records");
  sections.push("  - Measures taken or proposed to mitigate the incident");
  sections.push("  - Root cause analysis and remediation timeline");
  sections.push("- Cooperate fully with " + company + "'s incident investigation");
  sections.push("- Preserve all relevant logs and evidence for at least 12 months");
  sections.push("");
  sections.push(`Incident notifications should be sent to: **${dpoEmail}**`);

  // --- Audit Rights ---
  sections.push("");
  sections.push("## 5. Audit Rights");
  sections.push("");
  sections.push(`${company} reserves the right to:`);
  sections.push("");
  sections.push("- Conduct audits of Supplier's data processing activities with 30 days' written notice");
  sections.push("- Request and review Supplier's security certifications (SOC 2, ISO 27001, etc.)");
  sections.push("- Require Supplier to complete annual security questionnaires");
  sections.push("- Engage independent third-party auditors at " + company + "'s expense");
  sections.push("- Access relevant logs and records pertaining to data processing activities");
  sections.push("- Conduct unannounced audits in the event of a suspected breach or non-compliance");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Cooperate fully with any audit requests");
  sections.push("- Maintain comprehensive audit logs for a minimum of 12 months");
  sections.push("- Provide copies of relevant certifications upon request");
  sections.push("- Remediate any audit findings within the agreed timeline");
  sections.push("- Notify " + company + " if any certification lapses or is revoked");

  // --- Sub-Processor Requirements ---
  sections.push("");
  sections.push("## 6. Sub-Processor Requirements");
  sections.push("");
  sections.push(
    `Suppliers must not engage sub-processors without prior written authorization from ${company}. ` +
      `The following requirements apply to all sub-processor engagements:`
  );
  sections.push("");
  sections.push("- Obtain prior written approval before engaging any new sub-processor");
  sections.push("- Notify " + company + " at least 30 days before adding or replacing a sub-processor");
  sections.push("- Impose contractual obligations on sub-processors that are no less protective than this Code");
  sections.push("- Remain fully liable for the acts and omissions of sub-processors");
  sections.push("- Maintain a current register of all sub-processors");

  // Auto-populated sub-processor listing from scan results
  if (thirdPartyServices.length > 0) {
    sections.push("");
    sections.push("### 6.1 Currently Detected Sub-Processors");
    sections.push("");
    sections.push(
      "The following third-party services have been identified in the codebase and may function as sub-processors:"
    );
    sections.push("");
    sections.push("| Sub-Processor | Category | Data Processed |");
    sections.push("| --- | --- | --- |");
    for (const svc of thirdPartyServices) {
      const data = svc.dataCollected.length > 0 ? svc.dataCollected.join(", ") : "See agreement";
      sections.push(`| ${svc.name} | ${svc.category} | ${data} |`);
    }
    sections.push("");
    sections.push(
      "Each sub-processor listed above must have a valid Data Processing Agreement (DPA) " +
        "in place before processing begins."
    );
  }

  // --- Business Continuity ---
  sections.push("");
  sections.push("## 7. Business Continuity & Data Return");
  sections.push("");
  sections.push("Suppliers must:");
  sections.push("");
  sections.push("- Maintain documented business continuity and disaster recovery plans");
  sections.push("- Test disaster recovery procedures at least annually");
  sections.push("- Upon termination of the agreement, return or securely delete all " + company + " data within 30 days");
  sections.push("- Provide written certification of data deletion upon request");
  sections.push("- Support data migration to alternative providers if requested");

  // --- Compliance Monitoring ---
  sections.push("");
  sections.push("## 8. Compliance Monitoring & Enforcement");
  sections.push("");
  sections.push(
    `${company} will monitor Supplier compliance through:`
  );
  sections.push("");
  sections.push("- Annual security questionnaires");
  sections.push("- Periodic audit exercises");
  sections.push("- Review of certifications and attestations");
  sections.push("- Continuous monitoring of incident reports");
  sections.push("");
  sections.push(
    "Non-compliance with this Code may result in:"
  );
  sections.push("");
  sections.push("- Requirement for immediate remediation");
  sections.push("- Suspension of data processing activities");
  sections.push("- Termination of the supplier agreement");
  sections.push("- Reporting to relevant supervisory authorities where required by law");

  // --- Contact ---
  sections.push("");
  sections.push("## 9. Contact");
  sections.push("");
  sections.push(`For questions regarding this Code, contact:`);
  sections.push("");
  sections.push(`- **Data Protection:** ${dpoEmail}`);
  sections.push(`- **General Inquiries:** ${contactEmail}`);

  // --- Disclaimer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    "*This document was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) " +
      "based on detected third-party services. It should be reviewed by legal counsel before use. " +
      "This document does not constitute legal advice.*"
  );

  return sections.join("\n");
}
