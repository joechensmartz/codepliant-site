import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a PRIVACY_BY_DESIGN_CHECKLIST.md covering GDPR Article 25
 * (Data Protection by Design and by Default), data minimization,
 * and privacy-enhancing technology recommendations.
 *
 * Content is auto-generated based on scan results.
 */
export function generatePrivacyByDesignChecklist(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  // Only generate when services are detected (there's data processing to assess)
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasAdvertising = scan.services.some((s) => s.category === "advertising");
  const hasDatabase = scan.services.some((s) => s.category === "database");

  const sections: string[] = [];

  // --- Header ---
  sections.push(`# Privacy by Design Checklist`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Legal basis:** GDPR Article 25 — Data Protection by Design and by Default`);
  sections.push("");
  sections.push(
    `This checklist implements the requirements of GDPR Article 25, which mandates that data ` +
      `protection is integrated into processing activities and business practices from the design ` +
      `stage through the lifecycle. Each item has been tailored to the services detected in the ` +
      `${company} codebase.`
  );

  // --- 1. Data Minimization ---
  sections.push("");
  sections.push("## 1. Data Minimization (Article 5(1)(c))");
  sections.push("");
  sections.push(
    "Ensure that only data which is necessary for each specific purpose is collected and processed."
  );
  sections.push("");

  const minimizationItems: string[] = [];
  minimizationItems.push("- [ ] Review each data collection point to verify necessity");
  minimizationItems.push("- [ ] Document the purpose for each category of personal data collected");
  minimizationItems.push("- [ ] Remove any data fields that are not strictly necessary");
  minimizationItems.push("- [ ] Implement default settings that collect the minimum data required");

  if (hasAuth) {
    minimizationItems.push("- [ ] Only collect profile data essential for authentication (avoid optional fields by default)");
    minimizationItems.push("- [ ] Limit OAuth scopes to the minimum required");
  }

  if (hasAnalytics) {
    minimizationItems.push("- [ ] Configure analytics to anonymize IP addresses");
    minimizationItems.push("- [ ] Disable user-level tracking where aggregate data suffices");
    minimizationItems.push("- [ ] Set analytics data retention to the shortest period needed");
  }

  if (hasAdvertising) {
    minimizationItems.push("- [ ] Limit advertising pixel data collection to conversion events only");
    minimizationItems.push("- [ ] Disable enhanced matching unless explicitly required and consented to");
  }

  if (hasEmail) {
    minimizationItems.push("- [ ] Only store email addresses necessary for transactional communications");
    minimizationItems.push("- [ ] Implement unsubscribe mechanisms for all marketing communications");
  }

  if (hasMonitoring) {
    minimizationItems.push("- [ ] Strip PII from error reports before sending to monitoring services");
    minimizationItems.push("- [ ] Configure user context in error tracking to use anonymized identifiers");
  }

  sections.push(minimizationItems.join("\n"));

  // --- 2. Purpose Limitation ---
  sections.push("");
  sections.push("## 2. Purpose Limitation (Article 5(1)(b))");
  sections.push("");
  sections.push("Data must be collected for specified, explicit, and legitimate purposes.");
  sections.push("");

  const purposeItems: string[] = [];
  purposeItems.push("- [ ] Document the lawful basis for each processing activity");
  purposeItems.push("- [ ] Ensure data is not repurposed without additional consent");
  purposeItems.push("- [ ] Maintain a Record of Processing Activities (ROPA)");

  if (hasAI) {
    purposeItems.push("- [ ] Document the specific purpose for AI data processing");
    purposeItems.push("- [ ] Ensure AI training data usage is explicitly authorized");
    purposeItems.push("- [ ] Obtain explicit consent before using personal data for model training");
  }

  if (hasPayment) {
    purposeItems.push("- [ ] Limit payment data usage to transaction processing and fraud prevention");
    purposeItems.push("- [ ] Do not use payment data for marketing or profiling");
  }

  sections.push(purposeItems.join("\n"));

  // --- 3. Storage Limitation ---
  sections.push("");
  sections.push("## 3. Storage Limitation (Article 5(1)(e))");
  sections.push("");
  sections.push("Personal data should be kept only as long as necessary for its purpose.");
  sections.push("");

  const storageItems: string[] = [];
  storageItems.push("- [ ] Define retention periods for each category of personal data");
  storageItems.push("- [ ] Implement automated data deletion/anonymization after retention period");
  storageItems.push("- [ ] Document retention justification for any data kept beyond 3 years");

  if (hasDatabase) {
    storageItems.push("- [ ] Implement soft-delete with scheduled hard-delete for database records");
    storageItems.push("- [ ] Set up automated database cleanup jobs for expired data");
  }

  if (hasStorage) {
    storageItems.push("- [ ] Configure object lifecycle policies for cloud storage buckets");
    storageItems.push("- [ ] Implement automated expiration for user-uploaded content");
  }

  sections.push(storageItems.join("\n"));

  // --- 4. Integrity & Confidentiality ---
  sections.push("");
  sections.push("## 4. Integrity & Confidentiality (Article 5(1)(f))");
  sections.push("");
  sections.push("Personal data must be processed with appropriate security measures.");
  sections.push("");

  const integrityItems: string[] = [];
  integrityItems.push("- [ ] Encrypt personal data at rest (AES-256 or equivalent)");
  integrityItems.push("- [ ] Encrypt personal data in transit (TLS 1.2+)");
  integrityItems.push("- [ ] Implement role-based access controls (RBAC)");
  integrityItems.push("- [ ] Maintain audit logs for personal data access");
  integrityItems.push("- [ ] Conduct regular security assessments and penetration tests");

  if (hasAuth) {
    integrityItems.push("- [ ] Use strong password hashing (bcrypt, Argon2, or scrypt)");
    integrityItems.push("- [ ] Implement session timeout and automatic logout");
    integrityItems.push("- [ ] Enable multi-factor authentication where available");
  }

  if (hasPayment) {
    integrityItems.push("- [ ] Maintain PCI DSS compliance for payment data handling");
    integrityItems.push("- [ ] Use tokenization for stored payment methods");
  }

  sections.push(integrityItems.join("\n"));

  // --- 5. Transparency ---
  sections.push("");
  sections.push("## 5. Transparency (Articles 12-14)");
  sections.push("");
  sections.push("Data subjects must be informed about data processing in a clear and accessible manner.");
  sections.push("");

  const transparencyItems: string[] = [];
  transparencyItems.push("- [ ] Publish a clear and accessible Privacy Policy");
  transparencyItems.push("- [ ] Provide layered privacy notices (short + detailed)");
  transparencyItems.push("- [ ] Inform users about their rights at the point of data collection");
  transparencyItems.push("- [ ] Maintain an up-to-date list of sub-processors");

  if (hasAI) {
    transparencyItems.push("- [ ] Disclose use of AI/automated decision-making (Article 22)");
    transparencyItems.push("- [ ] Provide meaningful information about the logic of automated decisions");
  }

  if (hasAnalytics || hasAdvertising) {
    transparencyItems.push("- [ ] Implement a cookie consent banner with granular controls");
    transparencyItems.push("- [ ] Provide a clear Cookie Policy listing all tracking technologies");
  }

  sections.push(transparencyItems.join("\n"));

  // --- 6. Data Subject Rights ---
  sections.push("");
  sections.push("## 6. Data Subject Rights (Articles 15-22)");
  sections.push("");
  sections.push("Systems must be designed to facilitate the exercise of data subject rights.");
  sections.push("");

  const rightsItems: string[] = [];
  rightsItems.push("- [ ] Implement mechanisms for data access requests (Article 15)");
  rightsItems.push("- [ ] Support data rectification (Article 16)");
  rightsItems.push("- [ ] Support data erasure / right to be forgotten (Article 17)");
  rightsItems.push("- [ ] Support data portability in machine-readable format (Article 20)");
  rightsItems.push("- [ ] Implement right to restriction of processing (Article 18)");
  rightsItems.push("- [ ] Enable right to object to processing (Article 21)");
  rightsItems.push("- [ ] Respond to all DSARs within 30 days");

  if (hasAI) {
    rightsItems.push("- [ ] Implement right not to be subject to automated decision-making (Article 22)");
    rightsItems.push("- [ ] Provide human review option for AI-driven decisions with legal effects");
  }

  sections.push(rightsItems.join("\n"));

  // --- 7. Privacy-Enhancing Technologies ---
  sections.push("");
  sections.push("## 7. Privacy-Enhancing Technologies (PETs) Recommendations");
  sections.push("");
  sections.push(
    "Based on the detected services and data processing activities, the following privacy-enhancing " +
      "technologies are recommended:"
  );
  sections.push("");

  const petItems: string[] = [];

  // General recommendations
  petItems.push("### General");
  petItems.push("");
  petItems.push("- [ ] **Pseudonymization**: Replace direct identifiers with pseudonyms in processing pipelines");
  petItems.push("- [ ] **Data masking**: Mask PII in non-production environments");
  petItems.push("- [ ] **Access logging**: Implement comprehensive audit trails for data access");

  if (hasAnalytics || hasAdvertising) {
    petItems.push("");
    petItems.push("### Analytics & Tracking");
    petItems.push("");
    petItems.push("- [ ] **Differential privacy**: Add noise to analytics datasets to prevent re-identification");
    petItems.push("- [ ] **K-anonymity**: Ensure analytics cohorts contain at least k individuals");
    petItems.push("- [ ] **Server-side analytics**: Process analytics events server-side to reduce client data exposure");
    petItems.push("- [ ] **IP anonymization**: Truncate IP addresses before storage");
  }

  if (hasAuth) {
    petItems.push("");
    petItems.push("### Authentication & Identity");
    petItems.push("");
    petItems.push("- [ ] **Zero-knowledge proofs**: Consider ZKP for age/credential verification without revealing details");
    petItems.push("- [ ] **Secure enclaves**: Process sensitive auth data in trusted execution environments");
    petItems.push("- [ ] **Token-based sessions**: Use short-lived, rotating tokens instead of persistent sessions");
  }

  if (hasAI) {
    petItems.push("");
    petItems.push("### AI & Machine Learning");
    petItems.push("");
    petItems.push("- [ ] **Federated learning**: Train models without centralizing personal data");
    petItems.push("- [ ] **On-device processing**: Process sensitive data locally where possible");
    petItems.push("- [ ] **Synthetic data**: Use synthetic datasets for model development and testing");
    petItems.push("- [ ] **Model explainability**: Implement interpretability tools for automated decisions");
  }

  if (hasPayment) {
    petItems.push("");
    petItems.push("### Payment Processing");
    petItems.push("");
    petItems.push("- [ ] **Tokenization**: Replace card data with non-reversible tokens");
    petItems.push("- [ ] **Point-to-point encryption (P2PE)**: Encrypt card data from capture to processing");
  }

  if (hasDatabase || hasStorage) {
    petItems.push("");
    petItems.push("### Data Storage");
    petItems.push("");
    petItems.push("- [ ] **Encryption at rest**: Use envelope encryption with key rotation");
    petItems.push("- [ ] **Field-level encryption**: Encrypt individual PII fields in the database");
    petItems.push("- [ ] **Secure deletion**: Use cryptographic erasure for data deletion guarantees");
  }

  sections.push(petItems.join("\n"));

  // --- 8. Detected Services Assessment ---
  sections.push("");
  sections.push("## 8. Detected Services — Privacy Assessment");
  sections.push("");
  sections.push(
    "The following services were detected in the codebase. Each requires a privacy impact evaluation:"
  );
  sections.push("");
  sections.push("| Service | Category | Data Processed | Privacy Action Required |");
  sections.push("| --- | --- | --- | --- |");

  for (const svc of scan.services) {
    if (svc.isDataProcessor === false) continue;
    const data = svc.dataCollected.join(", ");
    const action = getPrivacyAction(svc.category);
    sections.push(`| ${svc.name} | ${svc.category} | ${data} | ${action} |`);
  }

  // --- Review Schedule ---
  sections.push("");
  sections.push("## 9. Review Schedule");
  sections.push("");
  sections.push("| Activity | Frequency | Responsible |");
  sections.push("| --- | --- | --- |");
  sections.push("| Privacy by Design checklist review | Quarterly | DPO / Privacy Team |");
  sections.push("| Data minimization audit | Semi-annually | Engineering Lead |");
  sections.push("| PET effectiveness assessment | Annually | Security Team |");
  sections.push("| DPIA update for new processing | Before launch | DPO / Privacy Team |");
  sections.push("| Sub-processor review | Annually | Legal / Procurement |");

  // --- Disclaimer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    "*This checklist was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) " +
      "based on detected services and data processing activities. It should be reviewed and adapted by " +
      "your Data Protection Officer or legal counsel. This document does not constitute legal advice.*"
  );

  return sections.join("\n");
}

function getPrivacyAction(category: string): string {
  switch (category) {
    case "ai":
      return "DPIA required; document AI decision logic; assess bias risks";
    case "payment":
      return "PCI DSS compliance; DPA with processor; tokenization review";
    case "analytics":
      return "Consent mechanism; IP anonymization; retention review";
    case "auth":
      return "Minimize data collected; secure credential storage; session management";
    case "email":
      return "Consent/opt-out mechanism; DPA with provider; retention policy";
    case "storage":
      return "Encryption review; lifecycle policies; access controls";
    case "monitoring":
      return "PII scrubbing in error reports; retention limits; access controls";
    case "advertising":
      return "Explicit consent required; cookie policy; data sharing transparency";
    case "database":
      return "Encryption at rest; access controls; backup encryption";
    default:
      return "Review data processing scope; assess DPA requirements";
  }
}
