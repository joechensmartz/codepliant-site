import type { ScanResult, DataCategory, DetectedService } from "./types.js";
import type { GeneratorContext } from "../generator/index.js";

// ── Sensitivity Levels ────────────────────────────────────────────────

export type SensitivityLevel = "special-category" | "high" | "medium" | "low";

export interface ClassifiedField {
  field: string;
  source: string;
  sensitivity: SensitivityLevel;
  gdprCategory: string;
  retention: string;
}

export interface ClassificationSummary {
  fields: ClassifiedField[];
  specialCategoryCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

// ── GDPR Classification Rules ─────────────────────────────────────────

/**
 * Maps field name patterns to GDPR sensitivity classifications.
 * Order matters: first match wins, so more specific patterns come first.
 */
const FIELD_CLASSIFICATION_RULES: Array<{
  pattern: RegExp;
  sensitivity: SensitivityLevel;
  gdprCategory: string;
  retention: string;
}> = [
  // Special Category (Art. 9)
  { pattern: /health|medical|diagnosis|prescription|treatment|allergy/i, sensitivity: "special-category", gdprCategory: "Health data (Art. 9)", retention: "Delete when no longer necessary; max 3 years" },
  { pattern: /biometric|fingerprint|faceId|retina|voiceprint/i, sensitivity: "special-category", gdprCategory: "Biometric data (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },
  { pattern: /genetic|dna|genome/i, sensitivity: "special-category", gdprCategory: "Genetic data (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },
  { pattern: /race|racial|ethnic|ethnicity/i, sensitivity: "special-category", gdprCategory: "Racial/ethnic origin (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },
  { pattern: /politic|party.*affiliation|voting/i, sensitivity: "special-category", gdprCategory: "Political opinions (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },
  { pattern: /religi|faith|church|mosque|synagogue|temple/i, sensitivity: "special-category", gdprCategory: "Religious beliefs (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },
  { pattern: /sexual|orientation|gender.*identity/i, sensitivity: "special-category", gdprCategory: "Sexual orientation (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },
  { pattern: /trade.*union|union.*member/i, sensitivity: "special-category", gdprCategory: "Trade union membership (Art. 9)", retention: "Delete when no longer necessary; max 1 year" },

  // High Sensitivity — Financial (PCI)
  { pattern: /credit.*card|cardNumber|card.*number|pan(?:$|[^a-z])/i, sensitivity: "high", gdprCategory: "Financial — PCI data", retention: "Do not store post-authorization; tokenize" },
  { pattern: /bank.*account|iban|routing.*number|sort.*code/i, sensitivity: "high", gdprCategory: "Financial — bank data", retention: "7 years (tax/legal compliance)" },
  { pattern: /payment.*info|billing|transaction/i, sensitivity: "high", gdprCategory: "Financial — payment data", retention: "7 years (tax/legal compliance)" },

  // High Sensitivity — Government ID
  { pattern: /\bssn\b|social.*security|national.*id|passport.*number|driver.*license/i, sensitivity: "high", gdprCategory: "Government identifier", retention: "Delete after identity verification; max 90 days" },
  { pattern: /tax.*id|tin\b|ein\b/i, sensitivity: "high", gdprCategory: "Government identifier — tax", retention: "7 years (tax compliance)" },

  // High Sensitivity — Authentication
  { pattern: /\bpassword\b|password.*hash|secret|credential|auth.*token/i, sensitivity: "high", gdprCategory: "Authentication credential", retention: "Until account deletion; rotate regularly" },
  { pattern: /two.*factor|totp|mfa|otp/i, sensitivity: "high", gdprCategory: "Authentication — MFA", retention: "Until account deletion" },
  { pattern: /oauth.*token|refresh.*token|session.*token/i, sensitivity: "high", gdprCategory: "Authentication — token", retention: "Until session expiry or account deletion" },

  // Low Sensitivity — Technical (must precede medium "address" to catch "IP address" first)
  { pattern: /\bip\b|ip[\s._-]*address|user[\s._-]*agent|device[\s._-]*id|device[\s._-]*info|browser/i, sensitivity: "low", gdprCategory: "Technical — device/network", retention: "90 days" },
  { pattern: /error|stack.*trace|crash|log\b|performance|latency/i, sensitivity: "low", gdprCategory: "Technical — diagnostics", retention: "90 days" },
  { pattern: /cookie|fingerprint|beacon/i, sensitivity: "low", gdprCategory: "Technical — tracking", retention: "Per cookie policy; max 13 months" },

  // Low Sensitivity — Behavioral (must precede medium "age" to catch "page views" first)
  { pattern: /page.*view|click\b|event\b|session\b|behavior|analytics|heatmap|scroll/i, sensitivity: "low", gdprCategory: "Behavioral — analytics", retention: "26 months" },
  { pattern: /conversion|campaign|referr|attribution/i, sensitivity: "low", gdprCategory: "Behavioral — marketing", retention: "26 months" },
  { pattern: /preference|setting\b|locale\b|timezone|language/i, sensitivity: "low", gdprCategory: "Behavioral — preferences", retention: "Until account deletion" },

  // Medium Sensitivity — Contact
  { pattern: /\bemail\b|e-mail/i, sensitivity: "medium", gdprCategory: "Contact — email", retention: "Until account deletion or consent withdrawal" },
  { pattern: /\bphone\b|mobile|telephone|sms/i, sensitivity: "medium", gdprCategory: "Contact — phone", retention: "Until account deletion or consent withdrawal" },
  { pattern: /\baddress\b|street|postal|zip.*code/i, sensitivity: "medium", gdprCategory: "Contact — postal address", retention: "Until account deletion" },

  // Medium Sensitivity — Identity
  { pattern: /\bname\b|first.*name|last.*name|full.*name|display.*name/i, sensitivity: "medium", gdprCategory: "Personal identity — name", retention: "Until account deletion" },
  { pattern: /\bdob\b|date.*of.*birth|birth.*date|\bage\b/i, sensitivity: "medium", gdprCategory: "Personal identity — date of birth", retention: "Until account deletion" },
  { pattern: /\bavatar\b|profile.*image|profile.*picture|photo/i, sensitivity: "medium", gdprCategory: "Personal identity — image", retention: "Until account deletion" },
  { pattern: /\busername\b|user.*name|display.*name/i, sensitivity: "medium", gdprCategory: "Personal identity — username", retention: "Until account deletion" },
  { pattern: /\bgender\b|sex\b/i, sensitivity: "medium", gdprCategory: "Personal identity — gender", retention: "Until account deletion" },
  { pattern: /\bbio\b|biography|about.*me/i, sensitivity: "medium", gdprCategory: "Personal identity — biography", retention: "Until account deletion" },
  { pattern: /\blocation\b|city|country|region|latitude|longitude|geo/i, sensitivity: "medium", gdprCategory: "Location data", retention: "26 months max" },
];

// ── Service Category to Sensitivity Mapping ───────────────────────────

const SERVICE_CATEGORY_SENSITIVITY: Record<string, { sensitivity: SensitivityLevel; gdprCategory: string; retention: string }> = {
  auth: { sensitivity: "medium", gdprCategory: "Personal identity — account data", retention: "Until account deletion" },
  payment: { sensitivity: "high", gdprCategory: "Financial — payment data", retention: "7 years (tax/legal compliance)" },
  analytics: { sensitivity: "low", gdprCategory: "Behavioral — analytics", retention: "26 months" },
  ai: { sensitivity: "medium", gdprCategory: "AI interaction data", retention: "90 days" },
  email: { sensitivity: "medium", gdprCategory: "Contact — email communications", retention: "3 years" },
  monitoring: { sensitivity: "low", gdprCategory: "Technical — diagnostics", retention: "90 days" },
  storage: { sensitivity: "medium", gdprCategory: "User-uploaded content", retention: "Until deletion by user" },
  advertising: { sensitivity: "low", gdprCategory: "Behavioral — advertising", retention: "26 months" },
  social: { sensitivity: "low", gdprCategory: "Behavioral — social interactions", retention: "26 months" },
  database: { sensitivity: "medium", gdprCategory: "Stored user data", retention: "Until account deletion" },
  other: { sensitivity: "low", gdprCategory: "Other operational data", retention: "As long as necessary" },
};

// ── Classification Logic ──────────────────────────────────────────────

/**
 * Classify a single field/data-item string by matching against GDPR rules.
 */
export function classifyField(field: string, source: string): ClassifiedField {
  for (const rule of FIELD_CLASSIFICATION_RULES) {
    if (rule.pattern.test(field)) {
      return {
        field,
        source,
        sensitivity: rule.sensitivity,
        gdprCategory: rule.gdprCategory,
        retention: rule.retention,
      };
    }
  }

  // Fallback: low sensitivity
  return {
    field,
    source,
    sensitivity: "low",
    gdprCategory: "Unclassified data",
    retention: "Review and define retention policy",
  };
}

/**
 * Build a full classification from scan results:
 * 1. Classify each dataCollected item from each detected service
 * 2. Classify each field from dataCategories (schema fields, API fields)
 * 3. Deduplicate by field+source
 */
export function classifyAllData(scan: ScanResult): ClassificationSummary {
  const seen = new Set<string>();
  const fields: ClassifiedField[] = [];

  function addField(cf: ClassifiedField): void {
    const key = `${cf.field}||${cf.source}`;
    if (seen.has(key)) return;
    seen.add(key);
    fields.push(cf);
  }

  // 1. Service dataCollected items
  for (const service of scan.services) {
    if (service.isDataProcessor === false) continue;
    for (const item of service.dataCollected) {
      const cf = classifyField(item, service.name);
      addField(cf);
    }
  }

  // 2. DataCategory sources (schema fields, API fields, etc.)
  for (const cat of scan.dataCategories) {
    for (const source of cat.sources) {
      const cf = classifyField(cat.category, source);
      // Also try classifying by the description for richer matching
      const cfDesc = classifyField(cat.description, source);

      // Use whichever yields a higher sensitivity
      const best = compareSensitivity(cf.sensitivity, cfDesc.sensitivity) >= 0 ? cf : cfDesc;
      addField(best);
    }
  }

  // 3. Also classify individual items from dataCategories descriptions
  for (const cat of scan.dataCategories) {
    // Extract field-like terms from description
    const cf = classifyField(cat.category, `category:${cat.category}`);
    addField(cf);
  }

  // Sort: special-category first, then high, medium, low
  fields.sort((a, b) => sensitivityOrder(a.sensitivity) - sensitivityOrder(b.sensitivity));

  return {
    fields,
    specialCategoryCount: fields.filter((f) => f.sensitivity === "special-category").length,
    highCount: fields.filter((f) => f.sensitivity === "high").length,
    mediumCount: fields.filter((f) => f.sensitivity === "medium").length,
    lowCount: fields.filter((f) => f.sensitivity === "low").length,
  };
}

function sensitivityOrder(s: SensitivityLevel): number {
  switch (s) {
    case "special-category": return 0;
    case "high": return 1;
    case "medium": return 2;
    case "low": return 3;
  }
}

function compareSensitivity(a: SensitivityLevel, b: SensitivityLevel): number {
  return sensitivityOrder(b) - sensitivityOrder(a);
}

// ── Sensitivity Label Helpers ─────────────────────────────────────────

export function sensitivityLabel(s: SensitivityLevel): string {
  switch (s) {
    case "special-category": return "Special Category (Art. 9)";
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
  }
}

function sensitivityEmoji(s: SensitivityLevel): string {
  switch (s) {
    case "special-category": return "!!";
    case "high": return "!";
    case "medium": return "-";
    case "low": return " ";
  }
}

// ── Document Generation ───────────────────────────────────────────────

/**
 * Generate DATA_CLASSIFICATION.md content from scan results.
 */
export function generateDataClassification(scan: ScanResult, ctx?: { companyName?: string }): string | null {
  if (scan.services.length === 0 && scan.dataCategories.length === 0) {
    return null;
  }

  const summary = classifyAllData(scan);
  if (summary.fields.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────

  sections.push(`# Data Classification Report

**Project:** ${scan.projectName}
**Company:** ${company}
**Generated:** ${date}
**Classification Standard:** GDPR (General Data Protection Regulation)

---

## Summary

| Sensitivity Level | Count | Description |
|-------------------|-------|-------------|
| Special Category (Art. 9) | ${summary.specialCategoryCount} | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | ${summary.highCount} | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | ${summary.mediumCount} | Contact info (email, phone), identity (name, DOB), location |
| Low | ${summary.lowCount} | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** ${summary.fields.length}`);

  // ── Classification Table ────────────────────────────────────────────

  let tableSection = `\n---\n\n## Detailed Classification\n\n`;
  tableSection += `| Field | Source | Sensitivity | GDPR Category | Retention |\n`;
  tableSection += `|-------|--------|-------------|---------------|----------|\n`;

  for (const f of summary.fields) {
    tableSection += `| ${f.field} | ${f.source} | ${sensitivityLabel(f.sensitivity)} | ${f.gdprCategory} | ${f.retention} |\n`;
  }

  sections.push(tableSection);

  // ── Recommendations ─────────────────────────────────────────────────

  let recSection = `\n---\n\n## Recommendations\n`;

  if (summary.specialCategoryCount > 0) {
    recSection += `\n### Special Category Data (Art. 9) — ${summary.specialCategoryCount} field(s)\n\n`;
    recSection += `- **Explicit consent required** (Art. 9(2)(a)): Standard consent is not sufficient; obtain explicit, informed consent for each specific purpose\n`;
    recSection += `- **Data Protection Impact Assessment (DPIA)** required under Art. 35 before processing\n`;
    recSection += `- **Appoint a Data Protection Officer (DPO)** if processing special categories at scale\n`;
    recSection += `- **Encryption at rest and in transit** is mandatory; consider additional access controls\n`;
    recSection += `- **Minimize collection**: Only collect what is strictly necessary for the stated purpose\n`;
    recSection += `- **Audit logging**: Maintain detailed access logs for all special category data\n`;
  }

  if (summary.highCount > 0) {
    recSection += `\n### High Sensitivity Data — ${summary.highCount} field(s)\n\n`;
    recSection += `- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)\n`;
    recSection += `- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)\n`;
    recSection += `- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords\n`;
    recSection += `- **Limit access** to personnel with a business need; implement role-based access control\n`;
    recSection += `- **Retain per regulatory requirements** (e.g., 7 years for financial records)\n`;
    recSection += `- **Regular security audits** and penetration testing recommended\n`;
  }

  if (summary.mediumCount > 0) {
    recSection += `\n### Medium Sensitivity Data — ${summary.mediumCount} field(s)\n\n`;
    recSection += `- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible\n`;
    recSection += `- **Obtain clear consent** before collection; provide opt-out mechanisms\n`;
    recSection += `- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)\n`;
    recSection += `- **Pseudonymize** where possible to reduce risk\n`;
    recSection += `- **Define clear retention periods** and automate data deletion\n`;
  }

  if (summary.lowCount > 0) {
    recSection += `\n### Low Sensitivity Data — ${summary.lowCount} field(s)\n\n`;
    recSection += `- **Encrypt in transit** (TLS 1.2+)\n`;
    recSection += `- **Anonymize or aggregate** analytics data where possible\n`;
    recSection += `- **Honor Do Not Track / Global Privacy Control** signals\n`;
    recSection += `- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)\n`;
    recSection += `- **Disclose in privacy policy** even for low-sensitivity data\n`;
  }

  recSection += `\n---\n\n*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*\n`;

  sections.push(recSection);

  return sections.join("\n");
}

/**
 * Generate a summary section for inclusion in the Privacy Policy.
 * Returns a markdown subsection describing data sensitivity breakdown.
 */
export function generateClassificationSummaryForPrivacyPolicy(scan: ScanResult): string | null {
  if (scan.services.length === 0 && scan.dataCategories.length === 0) {
    return null;
  }

  const summary = classifyAllData(scan);
  if (summary.fields.length === 0) {
    return null;
  }

  let section = `\n### Data Sensitivity Classification\n\n`;
  section += `We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:\n\n`;
  section += `| Sensitivity Level | Fields Detected | Protection Standard |\n`;
  section += `|-------------------|-----------------|--------------------|\n`;

  if (summary.specialCategoryCount > 0) {
    section += `| Special Category (Art. 9) | ${summary.specialCategoryCount} | Explicit consent, DPIA, encryption, DPO oversight |\n`;
  }
  if (summary.highCount > 0) {
    section += `| High | ${summary.highCount} | Encryption, tokenization, access control, audit logging |\n`;
  }
  if (summary.mediumCount > 0) {
    section += `| Medium | ${summary.mediumCount} | Encryption in transit, consent, user access rights |\n`;
  }
  if (summary.lowCount > 0) {
    section += `| Low | ${summary.lowCount} | Encryption in transit, anonymization where possible |\n`;
  }

  section += `\nFor a detailed breakdown of each data field and its classification, see our Data Classification Report.\n`;

  return section;
}
